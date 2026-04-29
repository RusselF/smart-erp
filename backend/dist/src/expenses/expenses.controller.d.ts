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
            category: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
            };
            user: {
                name: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            amount: number;
            description: string;
            date: Date;
            categoryId: string;
            userId: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    create(data: CreateExpenseDto, req: any): Promise<{
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
        };
        user: {
            name: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        amount: number;
        description: string;
        date: Date;
        categoryId: string;
        userId: string | null;
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
