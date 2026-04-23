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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const crypto_1 = require("crypto");
let OrdersService = class OrdersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createOrderDto, userId) {
        const { customerName, paymentMethod, items } = createOrderDto;
        if (!items || items.length === 0) {
            throw new common_1.BadRequestException('Order items cannot be empty');
        }
        return this.prisma.$transaction(async (tx) => {
            let totalAmount = 0;
            const orderItemsData = [];
            for (const item of items) {
                const product = await tx.product.findUnique({
                    where: { id: item.productId }
                });
                if (!product) {
                    throw new common_1.BadRequestException(`Product with ID ${item.productId} not found`);
                }
                if (product.stock < item.quantity) {
                    throw new common_1.BadRequestException(`Insufficient stock for product ${product.name}`);
                }
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: product.stock - item.quantity }
                });
                const subtotal = product.price * item.quantity;
                totalAmount += subtotal;
                orderItemsData.push({
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: product.price,
                    subtotal: subtotal
                });
            }
            const orderNumber = `ORD-${Date.now()}-${(0, crypto_1.randomBytes)(2).toString('hex').toUpperCase()}`;
            const order = await tx.order.create({
                data: {
                    orderNumber,
                    customerName,
                    paymentMethod: paymentMethod || 'CASH',
                    totalAmount,
                    userId,
                    orderItems: {
                        create: orderItemsData
                    }
                },
                include: {
                    orderItems: {
                        include: {
                            product: true
                        }
                    }
                }
            });
            return order;
        });
    }
    async findAll(page = 1, limit = 10, search) {
        const skip = (page - 1) * limit;
        const where = search ? {
            OR: [
                { orderNumber: { contains: search, mode: 'insensitive' } },
                { customerName: { contains: search, mode: 'insensitive' } }
            ]
        } : {};
        const [orders, total] = await Promise.all([
            this.prisma.order.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.order.count({ where }),
        ]);
        return {
            data: orders,
            meta: {
                total,
                page,
                lastPage: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                orderItems: {
                    include: {
                        product: true
                    }
                },
                user: {
                    select: { id: true, name: true, email: true }
                }
            }
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        return order;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map