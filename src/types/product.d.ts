// 类别
export interface Category {
  id: number
  parentId: number
  categoryName: string
}

// 基础属性
export interface CategoryAttribute {
  id: number
  categoryId: number
  attributeName: string
  attributeType: number
  isRequired: boolean
}

// 销售属性
export interface SaleAttribute {
  id: number
  categoryId: number
  saleName: string
  isCustom: boolean
}

// 销售规格
export interface SaleSpec {
  id: number
  saleId: number
  specName: string
}

// 商品
export interface Product {
  id: number
  categoryId: number
  productName: string
}

// 商品属性
export interface ProductAttribute {
  productId: number
  attributeId: number
  attributeName: string
}

// 自定义规格
export interface ProductSpec {
  productId: number
  specId: number
  customName: string
}

// 库存单位
export interface ProductSku {
  id: number
  productId: number
  code: string
  price: number
  stock: number
  status: number // 状态（1-上架，0-下架）
}

// 库存规格
export interface ProductSkuSpec {
  skuId: number
  specId: number
}

// 商品单元
export interface ProductSpu {
  id: number
}
