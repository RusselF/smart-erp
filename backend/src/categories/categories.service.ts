import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: { name: string }) {
    const exists = await this.prisma.category.findUnique({ where: { name: createCategoryDto.name } });
    if (exists) throw new ConflictException('Category already exists');
    return this.prisma.category.create({ data: createCategoryDto });
  }

  findAll() {
    return this.prisma.category.findMany({ orderBy: { name: 'asc' } });
  }

  remove(id: string) {
    return this.prisma.category.delete({ where: { id } });
  }
}
