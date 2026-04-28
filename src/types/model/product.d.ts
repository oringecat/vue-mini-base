declare namespace Product {
    interface ProductParams {
        pageIndex?: number;
        pageSize?: number;
    }

    interface ProductItem {
        productName: string;
    }
}