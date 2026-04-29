import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
export declare class PurchasesController {
    private readonly purchasesService;
    constructor(purchasesService: PurchasesService);
    create(dto: CreatePurchaseDto, req: any): Promise<{
        supplier: {
            id: string;
            email: string | null;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            contactPerson: string | null;
            phone: string | null;
            address: string | null;
        };
        items: ({
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
            quantity: number;
            subtotal: number;
            productId: string;
            unitCost: number;
            purchaseOrderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        totalAmount: number;
        status: import(".prisma/client").$Enums.PurchaseStatus;
        userId: string | null;
        poNumber: string;
        notes: string | null;
        supplierId: string;
    }>;
    findAll(page?: string, limit?: string): Promise<{
        data: ({
            user: {
                name: string;
            } | null;
            supplier: {
                id: string;
                email: string | null;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                contactPerson: string | null;
                phone: string | null;
                address: string | null;
            };
            _count: {
                items: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            totalAmount: number;
            status: import(".prisma/client").$Enums.PurchaseStatus;
            userId: string | null;
            poNumber: string;
            notes: string | null;
            supplierId: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        user: {
            name: string;
        } | null;
        supplier: {
            id: string;
            email: string | null;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            contactPerson: string | null;
            phone: string | null;
            address: string | null;
        };
        items: ({
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
            quantity: number;
            subtotal: number;
            productId: string;
            unitCost: number;
            purchaseOrderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        totalAmount: number;
        status: import(".prisma/client").$Enums.PurchaseStatus;
        userId: string | null;
        poNumber: string;
        notes: string | null;
        supplierId: string;
    }>;
    receive(id: string): Promise<{
        supplier: {
            id: string;
            email: string | null;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            contactPerson: string | null;
            phone: string | null;
            address: string | null;
        };
        items: ({
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
            quantity: number;
            subtotal: number;
            productId: string;
            unitCost: number;
            purchaseOrderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        totalAmount: number;
        status: import(".prisma/client").$Enums.PurchaseStatus;
        userId: string | null;
        poNumber: string;
        notes: string | null;
        supplierId: string;
    }>;
    cancel(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        totalAmount: number;
        status: import(".prisma/client").$Enums.PurchaseStatus;
        userId: string | null;
        poNumber: string;
        notes: string | null;
        supplierId: string;
    }>;
}
