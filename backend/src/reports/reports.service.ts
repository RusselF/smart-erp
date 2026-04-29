import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getProfitLoss(startDate?: string, endDate?: string) {
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate + 'T23:59:59.999Z'),
        }
      };
    }

    // 1. Revenue (Completed Orders)
    const revenueResult = await this.prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: {
        status: 'COMPLETED',
        ...(startDate && endDate ? { createdAt: dateFilter['createdAt'] } : {}),
      }
    });
    const totalRevenue = revenueResult._sum.totalAmount || 0;

    // 2. COGS (Cost of Goods Sold)
    // For simplicity, COGS = sum(purchases RECEIVED in that period) 
    // OR we could calculate based on orderItems.
    // Usually COGS is calculated based on what was sold. 
    // Let's use orderItems joined with product to find the unitCost. Wait, Product doesn't store average cost right now.
    // Let's use Purchases as "Purchases / Inventory Cost" for the period instead of exact COGS for simplicity.
    const purchasesResult = await this.prisma.purchaseOrder.aggregate({
      _sum: { totalAmount: true },
      where: {
        status: 'RECEIVED',
        ...(startDate && endDate ? { createdAt: dateFilter['createdAt'] } : {}),
      }
    });
    const totalPurchases = purchasesResult._sum.totalAmount || 0;

    // 3. Expenses
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

    // Gross Profit = Revenue - Purchases
    const grossProfit = totalRevenue - totalPurchases;
    // Net Profit = Gross Profit - Expenses
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
      // Potential revenue if all stock sold
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
}
