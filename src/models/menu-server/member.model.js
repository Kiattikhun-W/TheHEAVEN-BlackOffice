import { BaseFetch } from '../main-model'
import { createQueryString } from "../../utils";

export default class MemberModel extends BaseFetch {
    getMemberBy = (data) => {
        const query = createQueryString(data);

        const res = this.authFetch({
        url: `api/v1/unit-user/find-all?${query}`,
        method: "GET",
    })
    return res

}

    updateMemberBy = (data) => this.authFetch({
        url: 'member/updateMemberBy',
        method: 'POST',
        body: JSON.stringify(data),
    })
    generateMemberLastCode = (data) => this.authFetch({
        url: 'member/generateMemberLastCode',
        method: 'POST',
        body: JSON.stringify(data),
    })
    
    getMemberByCode = (data) => this.authFetch({
        url: 'member/getMemberByCode',
        method: 'POST',
        body: JSON.stringify(data),
    })
    getMemberByIDP = (data) => this.authFetch({
        url: 'member/getMemberByIDP',
        method: 'POST',
        body: JSON.stringify(data),
    })

    getMemberByIdCard = (data) => this.authFetch({
        url: 'member/getMemberByIdCard',
        method: 'POST',
        body: JSON.stringify(data),
    })
    getMemberChartByMonth = (data) => this.authFetch({
        url: 'member/getMemberChartByMonth',
        method: 'POST',
        body: JSON.stringify(data),
    })  

    insertMember = (data) => this.authFetch({
        url: 'member/insertMember',
        method: 'POST',
        body: JSON.stringify(data),
    })

    deleteMemberByCode = (data) => this.authFetch({
        url: 'member/deleteMemberByCode',
        method: 'POST',
        body: JSON.stringify(data),
    })


}