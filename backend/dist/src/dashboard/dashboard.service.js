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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DashboardService = class DashboardService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStats() {
        const revenueResult = await this.prisma.order.aggregate({
            _sum: { totalAmount: true },
            where: { status: 'COMPLETED' }
        });
        const totalRevenue = revenueResult._sum.totalAmount || 0;
        const salesCount = await this.prisma.order.count({
            where: { status: 'COMPLETED' }
        });
        const stockResult = await this.prisma.product.aggregate({
            _sum: { stock: true }
        });
        const productsInStock = stockResult._sum.stock || 0;
        const lowStockCount = await this.prisma.product.count({
            where: { stock: { lt: 10 } }
        });
        const recentOrders = await this.prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                orderItems: true
            }
        });
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);
        const ordersLast7Days = await this.prisma.order.findMany({
            where: {
                status: 'COMPLETED',
                createdAt: { gte: sevenDaysAgo }
            },
            select: {
                createdAt: true,
                totalAmount: true
            }
        });
        const revenueMap = new Map();
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            revenueMap.set(dateStr, 0);
        }
        for (const order of ordersLast7Days) {
            const dateStr = order.createdAt.toISOString().split('T')[0];
            if (revenueMap.has(dateStr)) {
                revenueMap.set(dateStr, revenueMap.get(dateStr) + order.totalAmount);
            }
        }
        const revenueData = Array.from(revenueMap.entries()).map(([date, revenue]) => {
            const d = new Date(date);
            const shortDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            return {
                name: shortDate,
                revenue
            };
        });
        return {
            totalRevenue,
            salesCount,
            productsInStock,
            lowStockCount,
            recentOrders,
            revenueData
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map