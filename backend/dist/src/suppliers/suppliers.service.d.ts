import { PrismaService } from '../prisma/prisma.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
export declare class SuppliersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        _count: {
            purchaseOrders: number;
        };
    } & {
        id: string;
        email: string | null;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        contactPerson: string | null;
        phone: string | null;
        address: string | null;
    })[]>;
    create(data: CreateSupplierDto): Promise<{
        id: string;
        email: string | null;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        contactPerson: string | null;
        phone: string | null;
        address: string | null;
    }>;
    update(id: string, data: Partial<CreateSupplierDto>): Promise<{
        id: string;
        email: string | null;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        contactPerson: string | null;
        phone: string | null;
        address: string | null;
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
