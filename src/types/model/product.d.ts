declare namespace Product {
    interface ProductParams {
        pageIndex?: number;
        pageSize?: number;
    }

    interface ProductItem {
        id: number;
        productName: string;
    }
}