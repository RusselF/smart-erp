import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';

@Injectable()
export class SuppliersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.supplier.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { purchaseOrders: true } } },
    });
  }

  async create(data: CreateSupplierDto) {
    return this.prisma.supplier.create({ data });
  }

  async update(id: string, data: Partial<CreateSupplierDto>) {
    const supplier = await this.prisma.supplier.findUnique({ where: { id } });
    if (!supplier) throw new NotFoundException('Supplier not found');
    return this.prisma.supplier.update({ where: { id }, data });
  }

  async remove(id: string) {
    const supplier = await this.prisma.supplier.findUnique({ where: { id } });
    if (!supplier) throw new NotFoundException('Supplier not found');
    await this.prisma.supplier.delete({ where: { id } });
    return { success: true };
  }
}
