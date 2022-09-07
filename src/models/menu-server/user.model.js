import { BaseFetch } from '../main-model'
import { createQueryString } from "../../utils";

export default class UserModel extends BaseFetch {
    checkLogin = (data) => this.directFetch({
        url: 'api/auth/user',
        method: 'POST',
        body: JSON.stringify(data),
    })
    getUserProfile = (data) => this.authFetch({
        url: 'api/auth/user/profile',
        method: 'GET',
        body: JSON.stringify(data),
    })
    verifyToken = (data) => this.authFetch({
        url: 'api/auth/verify-token',
        method: 'POST',
        body: JSON.stringify(data),
    })

    generateUserLastCode = (data) => this.authFetch({
        url: 'user/generateUserLastCode',
        method: 'POST',
        body: JSON.stringify(data),
    })

    getUserBy = (data) => {
        const query = createQueryString(data);
        const res = this.authFetch({
            url: `api/v1/user/find-all?${query}`,
            method: 'GET',
        })
        return res

    }

    getUserByCode = (data) =>
    this.authFetch({
      url: "api/v1/user/find-one/" + data.id,
      method: "GET",
    });

    checkUsernameBy = (data) => this.authFetch({
        url: 'user/checkUsernameBy',
        method: 'POST',
        body: JSON.stringify(data),
    })

    updateUserBy = (id, data) =>
    this.authFetch({
      url: "api/v1/user/update/" + id,
      method: "PATCH",
      body: JSON.stringify(data),
    });

    updateUserStatusBy = (data) => this.authFetch({
        url: 'user/updateUserStatusBy',
        method: 'POST',
        body: JSON.stringify(data),
    })

    insertUser = (data) => this.authFetch({
        url: 'api/v1/user/create',
        method: 'POST',
        body: JSON.stringify(data),
    })

    deleteUserByCode = (id) =>
    this.authFetch({
      url: "api/v1/user/delete/" + id,
      method: "DELETE",
      // body: JSON.stringify(data),
    });
}