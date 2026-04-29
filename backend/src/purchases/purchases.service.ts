import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';

@Injectable()
export class PurchasesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Generate PO number: PO-YYYYMMDD-XXXX
   */
  private async generatePoNumber(): Promise<string> {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const count = await this.prisma.purchaseOrder.count({
      where: {
        createdAt: {
          gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
        },
      },
    });
    return `PO-${dateStr}-${String(count + 1).padStart(4, '0')}`;
  }

  /**
   * Create a Purchase Order as DRAFT (stock NOT added yet).
   */
  async create(data: CreatePurchaseDto, userId: string) {
    const poNumber = await this.generatePoNumber();

    // Validate products exist
    const productIds = data.items.map(i => i.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });
    if (products.length !== productIds.length) {
      throw new BadRequestException('One or more products not found');
    }

    // Calculate totals
    const itemsWithSubtotal = data.items.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      unitCost: item.unitCost,
      subtotal: item.quantity * item.unitCost,
    }));
    const totalAmount = itemsWithSubtotal.reduce((sum, i) => sum + i.subtotal, 0);

    return this.prisma.purchaseOrder.create({
      data: {
        poNumber,
        supplierId: data.supplierId,
        totalAmount,
        status: 'DRAFT',
        notes: data.notes,
        userId,
        items: {
          create: itemsWithSubtotal,
        },
      },
      include: {
        items: { include: { product: true } },
        supplier: true,
      },
    });
  }

  /**
   * List all POs with pagination.
   */
  async findAll(params?: { page?: number; limit?: number }) {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.purchaseOrder.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          supplier: true,
          user: { select: { name: true } },
          _count: { select: { items: true } },
        },
      }),
      this.prisma.purchaseOrder.count(),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get single PO detail.
   */
  async findOne(id: string) {
    const po = await this.prisma.purchaseOrder.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        supplier: true,
        user: { select: { name: true } },
      },
    });
    if (!po) throw new NotFoundException('Purchase Order not found');
    return po;
  }

  /**
   * Mark PO as RECEIVED → atomically add stock for each item.
   */
  async receive(id: string) {
    const po = await this.prisma.purchaseOrder.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!po) throw new NotFoundException('Purchase Order not found');
    if (po.status === 'RECEIVED') throw new BadRequestException('PO already received');
    if (po.status === 'CANCELLED') throw new BadRequestException('Cannot receive a cancelled PO');

    // Atomic transaction: update status + increase stock
    return this.prisma.$transaction(async (tx) => {
      // 1. Update PO status
      const updatedPO = await tx.purchaseOrder.update({
        where: { id },
        data: { status: 'RECEIVED' },
        include: {
          items: { include: { product: true } },
          supplier: true,
        },
      });

      // 2. Increase stock for each item
      for (const item of po.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }

      return updatedPO;
    });
  }

  /**
   * Cancel a DRAFT PO.
   */
  async cancel(id: string) {
    const po = await this.prisma.purchaseOrder.findUnique({ where: { id } });
    if (!po) throw new NotFoundException('Purchase Order not found');
    if (po.status !== 'DRAFT') throw new BadRequestException('Only DRAFT POs can be cancelled');

    return this.prisma.purchaseOrder.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }
}
