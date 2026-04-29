import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createOrderDto: CreateOrderDto, userId?: string): Promise<{
        orderItems: ({
            product: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                sku: string;
                description: string | null;
                price: number;
                stock: number;
                categoryId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            quantity: number;
            unitPrice: number;
            subtotal: number;
            orderId: string;
        })[];
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
    }>;
    findAll(page?: number, limit?: number, search?: string): Promise<{
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            customerName: string | null;
            paymentMethod: string;
            orderNumber: string;
            totalAmount: number;
            status: import(".prisma/client").$Enums.OrderStatus;
            userId: string | null;
        }[];
        meta: {
            total: number;
            page: number;
            lastPage: number;
        };
    }>;
    findOne(id: string): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
        } | null;
        orderItems: ({
            product: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                sku: string;
                description: string | null;
                price: number;
                stock: number;
                categoryId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            quantity: number;
            unitPrice: number;
            subtotal: number;
            orderId: string;
        })[];
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
    }>;
}
