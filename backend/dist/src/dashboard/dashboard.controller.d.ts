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
    }>;
}
