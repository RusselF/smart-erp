import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto, CreateExpenseCategoryDto } from './dto/create-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  // ================= CATEGORIES =================
  
  async getCategories() {
    return this.prisma.expenseCategory.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async createCategory(data: CreateExpenseCategoryDto) {
    const existing = await this.prisma.expenseCategory.findUnique({
      where: { name: data.name },
    });
    if (existing) {
      throw new BadRequestException('Category already exists');
    }
    return this.prisma.expenseCategory.create({ data });
  }

  async deleteCategory(id: string) {
    // Check if category has expenses
    const count = await this.prisma.expense.count({ where: { categoryId: id } });
    if (count > 0) {
      throw new BadRequestException('Cannot delete category with existing expenses');
    }
    await this.prisma.expenseCategory.delete({ where: { id } });
    return { success: true };
  }

  // ================= EXPENSES =================

  async findAll(page = 1, limit = 10, startDate?: string, endDate?: string) {
    const skip = (page - 1) * limit;
    
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate + 'T23:59:59.999Z'),
        }
      };
    }

    const [data, total] = await Promise.all([
      this.prisma.expense.findMany({
        where: dateFilter,
        skip,
        take: limit,
        orderBy: { date: 'desc' },
        include: {
          category: true,
          user: { select: { name: true } },
        },
      }),
      this.prisma.expense.count({ where: dateFilter }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async create(data: CreateExpenseDto, userId: string) {
    // Validate category
    const category = await this.prisma.expenseCategory.findUnique({
      where: { id: data.categoryId },
    });
    if (!category) {
      throw new NotFoundException('Expense category not found');
    }

    return this.prisma.expense.create({
      data: {
        amount: data.amount,
        description: data.description,
        categoryId: data.categoryId,
        userId: userId,
        date: data.date ? new Date(data.date) : new Date(),
      },
      include: {
        category: true,
        user: { select: { name: true } },
      },
    });
  }

  async remove(id: string) {
    const expense = await this.prisma.expense.findUnique({ where: { id } });
    if (!expense) throw new NotFoundException('Expense not found');
    await this.prisma.expense.delete({ where: { id } });
    return { success: true };
  }
}
