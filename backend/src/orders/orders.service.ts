import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto, userId?: string) {
    const { customerName, paymentMethod, items } = createOrderDto;

    if (!items || items.length === 0) {
      throw new BadRequestException('Order items cannot be empty');
    }

    // Use Prisma transaction to ensure atomicity
    return this.prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      const orderItemsData = [];

      // Loop through items, validate stock, and calculate subtotal
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId }
        });

        if (!product) {
          throw new BadRequestException(`Product with ID ${item.productId} not found`);
        }

        if (product.stock < item.quantity) {
          throw new BadRequestException(`Insufficient stock for product ${product.name}`);
        }

        // Deduct stock
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: product.stock - item.quantity }
        });

        const subtotal = product.price * item.quantity;
        totalAmount += subtotal;

        orderItemsData.push({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: product.price,
          subtotal: subtotal
        });
      }

      // Create Order and OrderItems
      const orderNumber = `ORD-${Date.now()}-${randomBytes(2).toString('hex').toUpperCase()}`;

      const order = await tx.order.create({
        data: {
          orderNumber,
          customerName,
          paymentMethod: paymentMethod || 'CASH',
          totalAmount,
          userId,
          orderItems: {
            create: orderItemsData
          }
        },
        include: {
          orderItems: {
            include: {
              product: true
            }
          }
        }
      });

      return order;
    });
  }

  async findAll(page = 1, limit = 10, search?: string) {
    const skip = (page - 1) * limit;

    const where = search ? {
      OR: [
        { orderNumber: { contains: search, mode: 'insensitive' as any } },
        { customerName: { contains: search, mode: 'insensitive' as any } }
      ]
    } : {};

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            product: true
          }
        },
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }
}
