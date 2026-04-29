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
                productId: string;
                quantity: number;
                unitPrice: number;
                subtotal: number;
                orderId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            customerName: string | null;
            paymentMethod: string;
            orderNumber: string;
            totalAmount: number;
            status: import(".prisma/client").$Enums.OrderStatus;
            userId: string | null;
        })[];
        revenueData: {
            name: string;
            revenue: number;
        }[];
    }>;
}
