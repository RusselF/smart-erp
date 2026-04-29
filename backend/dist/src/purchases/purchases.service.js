"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchasesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PurchasesService = class PurchasesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generatePoNumber() {
        const today = new Date();
        const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
        const count = await this.prisma.purchaseOrder.count({
            where: {
                createdAt: {
                    gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
                },
            },
        });
        return `PO-${dateStr}-${String(count + 1).padStart(4, '0')}`;
    }
    async create(data, userId) {
        const poNumber = await this.generatePoNumber();
        const productIds = data.items.map(i => i.productId);
        const products = await this.prisma.product.findMany({
            where: { id: { in: productIds } },
        });
        if (products.length !== productIds.length) {
            throw new common_1.BadRequestException('One or more products not found');
        }
        const itemsWithSubtotal = data.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            unitCost: item.unitCost,
            subtotal: item.quantity * item.unitCost,
        }));
        const totalAmount = itemsWithSubtotal.reduce((sum, i) => sum + i.subtotal, 0);
        return this.prisma.purchaseOrder.create({
            data: {
                poNumber,
                supplierId: data.supplierId,
                totalAmount,
                status: 'DRAFT',
                notes: data.notes,
                userId,
                items: {
                    create: itemsWithSubtotal,
                },
            },
            include: {
                items: { include: { product: true } },
                supplier: true,
            },
        });
    }
    async findAll(params) {
        const page = params?.page || 1;
        const limit = params?.limit || 10;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.purchaseOrder.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    supplier: true,
                    user: { select: { name: true } },
                    _count: { select: { items: true } },
                },
            }),
            this.prisma.purchaseOrder.count(),
        ]);
        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const po = await this.prisma.purchaseOrder.findUnique({
            where: { id },
            include: {
                items: { include: { product: true } },
                supplier: true,
                user: { select: { name: true } },
            },
        });
        if (!po)
            throw new common_1.NotFoundException('Purchase Order not found');
        return po;
    }
    async receive(id) {
        const po = await this.prisma.purchaseOrder.findUnique({
            where: { id },
            include: { items: true },
        });
        if (!po)
            throw new common_1.NotFoundException('Purchase Order not found');
        if (po.status === 'RECEIVED')
            throw new common_1.BadRequestException('PO already received');
        if (po.status === 'CANCELLED')
            throw new common_1.BadRequestException('Cannot receive a cancelled PO');
        return this.prisma.$transaction(async (tx) => {
            const updatedPO = await tx.purchaseOrder.update({
                where: { id },
                data: { status: 'RECEIVED' },
                include: {
                    items: { include: { product: true } },
                    supplier: true,
                },
            });
            for (const item of po.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { increment: item.quantity } },
                });
            }
            return updatedPO;
        });
    }
    async cancel(id) {
        const po = await this.prisma.purchaseOrder.findUnique({ where: { id } });
        if (!po)
            throw new common_1.NotFoundException('Purchase Order not found');
        if (po.status !== 'DRAFT')
            throw new common_1.BadRequestException('Only DRAFT POs can be cancelled');
        return this.prisma.purchaseOrder.update({
            where: { id },
            data: { status: 'CANCELLED' },
        });
    }
};
exports.PurchasesService = PurchasesService;
exports.PurchasesService = PurchasesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PurchasesService);
//# sourceMappingURL=purchases.service.js.map