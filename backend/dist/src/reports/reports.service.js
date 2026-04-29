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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReportsService = class ReportsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProfitLoss(startDate, endDate) {
        let dateFilter = {};
        if (startDate && endDate) {
            dateFilter = {
                createdAt: {
                    gte: new Date(startDate),
                    lte: new Date(endDate + 'T23:59:59.999Z'),
                }
            };
        }
        const revenueResult = await this.prisma.order.aggregate({
            _sum: { totalAmount: true },
            where: {
                status: 'COMPLETED',
                ...(startDate && endDate ? { createdAt: dateFilter['createdAt'] } : {}),
            }
        });
        const totalRevenue = revenueResult._sum.totalAmount || 0;
        const purchasesResult = await this.prisma.purchaseOrder.aggregate({
            _sum: { totalAmount: true },
            where: {
                status: 'RECEIVED',
                ...(startDate && endDate ? { createdAt: dateFilter['createdAt'] } : {}),
            }
        });
        const totalPurchases = purchasesResult._sum.totalAmount || 0;
        let expenseDateFilter = {};
        if (startDate && endDate) {
            expenseDateFilter = {
                date: {
                    gte: new Date(startDate),
                    lte: new Date(endDate + 'T23:59:59.999Z'),
                }
            };
        }
        const expensesResult = await this.prisma.expense.aggregate({
            _sum: { amount: true },
            where: expenseDateFilter,
        });
        const totalExpenses = expensesResult._sum.amount || 0;
        const grossProfit = totalRevenue - totalPurchases;
        const netProfit = grossProfit - totalExpenses;
        return {
            period: { startDate, endDate },
            totalRevenue,
            totalPurchases,
            grossProfit,
            totalExpenses,
            netProfit,
        };
    }
    async getStockSummary() {
        const products = await this.prisma.product.findMany({
            include: { category: true },
            orderBy: { stock: 'asc' },
        });
        const summary = products.map(p => ({
            id: p.id,
            sku: p.sku,
            name: p.name,
            category: p.category?.name || 'Uncategorized',
            stock: p.stock,
            price: p.price,
            potentialValue: p.stock * p.price,
        }));
        const totalStockValue = summary.reduce((sum, p) => sum + p.potentialValue, 0);
        const totalItems = summary.reduce((sum, p) => sum + p.stock, 0);
        return {
            products: summary,
            totals: {
                totalItems,
                totalStockValue,
            }
        };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map