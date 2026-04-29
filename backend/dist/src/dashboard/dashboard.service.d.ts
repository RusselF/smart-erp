import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getStats(): Promise<{
        totalRevenue: number;
        salesCount: number;
        productsInStock: number;
        lowStockCount: number;
        recentOrders: ({
            orderItems: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                orderId: string;
                productId: string;
                quantity: number;
                unitPrice: number;
                subtotal: number;
            }[];
        } & {
            totalAmount: number;
            status: import(".prisma/client").$Enums.OrderStatus;
            id: string;
            orderNumber: string;
            customerName: string | null;
            paymentMethod: string;
            userId: string | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
        revenueData: {
            name: string;
            revenue: number;
        }[];
        totalPurchases: number;
        pendingPurchaseOrders: number;
    }>;
}
