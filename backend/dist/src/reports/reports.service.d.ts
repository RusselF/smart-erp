import { PrismaService } from '../prisma/prisma.service';
export declare class ReportsService {
    private prisma;
    constructor(prisma: PrismaService);
    getProfitLoss(startDate?: string, endDate?: string): Promise<{
        period: {
            startDate: string | undefined;
            endDate: string | undefined;
        };
        totalRevenue: number;
        totalPurchases: number;
        grossProfit: number;
        totalExpenses: number;
        netProfit: number;
    }>;
    getStockSummary(): Promise<{
        products: {
            id: string;
            sku: string;
            name: string;
            category: string;
            stock: number;
            price: number;
            potentialValue: number;
        }[];
        totals: {
            totalItems: number;
            totalStockValue: number;
        };
    }>;
}
