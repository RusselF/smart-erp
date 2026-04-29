import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
export declare class SuppliersController {
    private readonly suppliersService;
    constructor(suppliersService: SuppliersService);
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
    create(createSupplierDto: CreateSupplierDto): Promise<{
        id: string;
        email: string | null;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        contactPerson: string | null;
        phone: string | null;
        address: string | null;
    }>;
    update(id: string, updateDto: Partial<CreateSupplierDto>): Promise<{
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
