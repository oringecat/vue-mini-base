/** 
 * 数据表配置项
 */
export interface DataTableOptions {
    localPagination?: boolean; // 是否进行本地分页
    pageSize?: number; // 每页条数
    pageIndex?: number; // 当前页码
}

/** 
 * 数据过滤项
 */
export interface FilterData<T> {
    fields: (keyof T)[]; // 多条件字段
    values: (T[keyof T])[]; // 多选过滤或模糊查询
}

/**
 * 过滤选项
 */
export interface FilterOption<T, K extends keyof T> {
    filters: FilterItem<T, K>[];
    buttons?: ActionButton[];
}

/** 
 * 过滤项
 */
export interface FilterItem<T, K extends keyof T> {
    field: K;
    label?: string;
    value?: T[K];
    locked?: boolean; // 重置时是否阻止清空当前值
    placeholder?: string;
    multiple?: boolean;
    required?: boolean;
    width?: number;
    visibility?: () => boolean; // 控制元素显示或隐藏
    options?: () => {
        label: string;
        value: T[K];
    }[];
    onChange?: (value?: T[K]) => void;
}

/** 
 * 动作按钮
 */
export interface ActionButton {
    label: string;
    className?: string;
    validateEvent?: boolean; // 是否触发表单验证
    onClick: () => void;
}