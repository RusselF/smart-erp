"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpensesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ExpensesService = class ExpensesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCategories() {
        return this.prisma.expenseCategory.findMany({
            orderBy: { name: 'asc' },
        });
    }
    async createCategory(data) {
        const existing = await this.prisma.expenseCategory.findUnique({
            where: { name: data.name },
        });
        if (existing) {
            throw new common_1.BadRequestException('Category already exists');
        }
        return this.prisma.expenseCategory.create({ data });
    }
    async deleteCategory(id) {
        const count = await this.prisma.expense.count({ where: { categoryId: id } });
        if (count > 0) {
            throw new common_1.BadRequestException('Cannot delete category with existing expenses');
        }
        await this.prisma.expenseCategory.delete({ where: { id } });
        return { success: true };
    }
    async findAll(page = 1, limit = 10, startDate, endDate) {
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
    async create(data, userId) {
        const category = await this.prisma.expenseCategory.findUnique({
            where: { id: data.categoryId },
        });
        if (!category) {
            throw new common_1.NotFoundException('Expense category not found');
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
    async remove(id) {
        const expense = await this.prisma.expense.findUnique({ where: { id } });
        if (!expense)
            throw new common_1.NotFoundException('Expense not found');
        await this.prisma.expense.delete({ where: { id } });
        return { success: true };
    }
};
exports.ExpensesService = ExpensesService;
exports.ExpensesService = ExpensesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExpensesService);
//# sourceMappingURL=expenses.service.js.map