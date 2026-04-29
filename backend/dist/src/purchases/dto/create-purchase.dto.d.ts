declare class PurchaseItemDto {
    productId: string;
    quantity: number;
    unitCost: number;
}
export declare class CreatePurchaseDto {
    supplierId: string;
    notes?: string;
    items: PurchaseItemDto[];
}
export {};
