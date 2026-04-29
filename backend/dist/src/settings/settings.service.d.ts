import { PrismaService } from '../prisma/prisma.service';
export declare class SettingsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<Record<string, string>>;
    update(data: Record<string, string>): Promise<{
        success: boolean;
    }>;
}
