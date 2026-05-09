import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto, CreateExpenseCategoryDto } from './dto/create-expense.dto';
export declare class ExpensesService {
    private prisma;
    constructor(prisma: PrismaService);
    getCategories(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    createCategory(data: CreateExpenseCategoryDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteCategory(id: string): Promise<{
        success: boolean;
    }>;
    findAll(page?: number, limit?: number, startDate?: string, endDate?: string): Promise<{
        data: ({
            user: {
                name: string;
            } | null;
            category: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            categoryId: string;
            userId: string | null;
            date: Date;
            amount: number;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    create(data: CreateExpenseDto, userId: string): Promise<{
        user: {
            name: string;
        } | null;
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        categoryId: string;
        userId: string | null;
        date: Date;
        amount: number;
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
