export declare class OrderItemDto {
    productId: string;
    quantity: number;
}
export declare class CreateOrderDto {
    customerName?: string;
    paymentMethod?: string;
    items: OrderItemDto[];
}
