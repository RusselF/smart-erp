import { ExpensesService } from './expenses.service';
import { CreateExpenseDto, CreateExpenseCategoryDto } from './dto/create-expense.dto';
export declare class ExpensesController {
    private readonly expensesService;
    constructor(expensesService: ExpensesService);
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
    findAll(page?: string, limit?: string, startDate?: string, endDate?: string): Promise<{
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
    create(data: CreateExpenseDto, req: any): Promise<{
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
