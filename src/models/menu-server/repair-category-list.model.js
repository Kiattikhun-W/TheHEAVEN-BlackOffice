import { BaseFetch } from '../main-model'

export default class RepairCategoryListModel extends BaseFetch {
    getRepairCategoryListBy = (data) => this.authFetch({
        url: 'repair-category-list/getRepairCategoryListBy',
        method: 'POST',
        body: JSON.stringify(data),
    })

    updateRepairCategoryListBy = (data) => this.authFetch({
        url: 'repair-category-list/updateRepairCategoryListBy',
        method: 'POST',
        body: JSON.stringify(data),
    })
    generateRepairCategoryListLastCode = (data) => this.authFetch({
        url: 'repair-category-list/generateRepairCategoryListLastCode',
        method: 'POST',
        body: JSON.stringify(data),
    })

    getRepairCategoryListByCode = (data) => this.authFetch({
        url: 'repair-category-list/getRepairCategoryListByCode',
        method: 'POST',
        body: JSON.stringify(data),
    })    

    insertRepairCategoryList = (data) => this.authFetch({
        url: 'repair-category-list/insertRepairCategoryList',
        method: 'POST',
        body: JSON.stringify(data),
    })

    deleteRepairCategoryListByCode = (data) => this.authFetch({
        url: 'repair-category-list/deleteRepairCategoryListByCode',
        method: 'POST',
        body: JSON.stringify(data),
    })


}