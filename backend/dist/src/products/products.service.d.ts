import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
export interface GetProductsParams {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
}
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.ProductUncheckedCreateInput): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        sku: string;
        description: string | null;
        price: number;
        stock: number;
        categoryId: string | null;
    }>;
    findAll(params: GetProductsParams): Promise<{
        data: ({
            category: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
            } | null;
        } & {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            sku: string;
            description: string | null;
            price: number;
            stock: number;
            categoryId: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Prisma.Prisma__ProductClient<({
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
        } | null;
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        sku: string;
        description: string | null;
        price: number;
        stock: number;
        categoryId: string | null;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, data: Prisma.ProductUncheckedUpdateInput): Prisma.Prisma__ProductClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        sku: string;
        description: string | null;
        price: number;
        stock: number;
        categoryId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: string): Prisma.Prisma__ProductClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        sku: string;
        description: string | null;
        price: number;
        stock: number;
        categoryId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
