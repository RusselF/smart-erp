import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    // 1. Total Revenue
    const revenueResult = await this.prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: 'COMPLETED' }
    });
    const totalRevenue = revenueResult._sum.totalAmount || 0;

    // 2. Total Sales Count
    const salesCount = await this.prisma.order.count({
      where: { status: 'COMPLETED' }
    });

    // 3. Products in stock (total qty)
    const stockResult = await this.prisma.product.aggregate({
      _sum: { stock: true }
    });
    const productsInStock = stockResult._sum.stock || 0;

    // 4. Low Stock Items (count of products where stock < 10)
    const lowStockCount = await this.prisma.product.count({
      where: { stock: { lt: 10 } }
    });

    // 5. Recent Orders (last 5)
    const recentOrders = await this.prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        orderItems: true
      }
    });

    // 6. Revenue Data (Last 7 Days)
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

    // Group by day string
    const revenueMap = new Map<string, number>();
    
    // Initialize last 7 days with 0
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0]; // YYYY-MM-DD
      revenueMap.set(dateStr, 0);
    }

    // Accumulate
    for (const order of ordersLast7Days) {
      const dateStr = order.createdAt.toISOString().split('T')[0];
      if (revenueMap.has(dateStr)) {
        revenueMap.set(dateStr, revenueMap.get(dateStr)! + order.totalAmount);
      }
    }

    const revenueData = Array.from(revenueMap.entries()).map(([date, revenue]) => {
      // Convert to short date format e.g. "Apr 23"
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
}
