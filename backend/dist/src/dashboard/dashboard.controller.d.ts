import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
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
                quantity: number;
                unitPrice: number;
                subtotal: number;
                productId: string;
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
        totalPurchases: number;
        pendingPurchaseOrders: number;
    }>;
}
