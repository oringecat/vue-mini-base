import { reactive, shallowRef, computed, toRefs } from 'vue'
import { cloneDeep } from 'lodash'
import type { FilterData, FilterOption, DataTableOptions } from './types'

export function useDataTable<T>(options: DataTableOptions = {}) {
    const state = reactive({
        total: 0, // 总条数
        pageSize: options.pageSize ?? 20, // 每页条数
        pageIndex: options.pageIndex ?? 1, // 当前页码
        firstLoaded: false, // 标记首次加载
        failed: false // 是否失败
    })

    const rawData = shallowRef<T[]>([]) // 原始数据
    const filterData = shallowRef<FilterData<T>[]>([]) // 过滤选项

    // 总页数
    const pageCount = computed(() => Math.ceil(state.total / state.pageSize) || 1)

    // 是否有更多
    const hasMore = computed(() => !state.firstLoaded || state.pageIndex < pageCount.value)

    const matchesFilter = (row: T, filter: FilterData<T>) => {
        return filter.fields.some((field) => {
            const value = row[field]
            if (typeof value === 'number') {
                return filter.values.includes(value)
            }
            return filter.values.some((text) => String(value).toLowerCase().includes(String(text).toLowerCase()))
        })
    }

    // 数据列表
    const dataList = computed(() => {
        // 过滤查询条件
        const result = rawData.value.filter((item) => filterData.value.every((filter) => matchesFilter(item, filter)))

        // 本地分页
        if (options.localPagination) {
            state.total = result.length

            if (options.paginationType === 'page') {
                const startIndex = (state.pageIndex - 1) * state.pageSize
                const endIndex = state.pageIndex * state.pageSize
                return result.slice(startIndex, endIndex)
            }

            return result
        }

        return result
    })

    // 更新列表
    const updateItems = (data: T[], count = 0) => {
        state.total = count || data.length
        state.firstLoaded = true
        state.failed = false

        if (state.pageIndex === 1 || options.paginationType === 'page') {
            rawData.value = data
        } else {
            rawData.value = [...rawData.value, ...data]
        }
    }

    // 重置页码
    const resetPage = () => {
        state.failed = false
        state.total = 0
        return state.pageIndex = 1
    }

    // 下一页
    const nextPage = () => {
        return state.pageIndex < pageCount.value ? ++state.pageIndex : 1
    }

    return {
        dataList,
        pageCount,
        hasMore,
        filterData,
        updateItems,
        resetPage,
        nextPage,
        ...toRefs(state)
    }
}

export function useDataFilter<T>(defaultOption: FilterOption<T, keyof T>) {
    const defaultOptionCopy = cloneDeep(defaultOption)

    const filterOption: FilterOption<T, keyof T> = reactive(Object.create(defaultOptionCopy))

    const queryParams = computed(() => getQueryParams())

    // 重置过滤条件
    const resetFilters = (...fields: (keyof T)[]) => {
        defaultOption.filters.forEach((defaultItem, index) => {
            if (!defaultItem.locked) {
                const currentItem = filterOption.filters[index]!
                if (!fields.length || fields.includes(defaultItem.field)) {
                    currentItem.value = defaultItem.value
                }
            }
        })
    }

    // 获取过滤参数，支持多条件查询
    const getFilterParams = (clear = false) => {
        if (clear) resetFilters()
        const options: FilterData<T>[] = []

        // filterOption.items.forEach((e) => {
        //     const { keys, value } = e
        //     if (value) {
        //         options.push({
        //             keys,
        //             filteredValue: [value],
        //         })
        //     }
        // })

        return options
    }

    // 获取查询参数，支持多条件查询
    const getQueryParams = (clear = false) => {
        if (clear) resetFilters()
        const params: Partial<T> = {}

        filterOption.filters.forEach((e) => {
            if (e.value !== undefined) {
                params[e.field] = e.value
            }
        })

        return params
    }

    return {
        queryParams,
        filterOption,
        getFilterParams,
        getQueryParams,
        resetFilters
    }
}