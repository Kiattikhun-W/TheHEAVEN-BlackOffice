import GLOBAL from '../GLOBAL'

class MainModel {
    directEndpointFetch = (endpoint, data) => fetch(endpoint, {
        method: data.method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: data.body,
    }).then((response) => response.json().then((e) => e)).catch((error) => ({ require: false, data: [], error, }))

    authEndpointFetch = async (endpoint, data) => {
        const response = await fetch(endpoint, {
            method: data.method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...GLOBAL.ACCESS_TOKEN,
            },
            body: data.body,
        }).then((response) => response.json().then((e) => e)).catch((error) => ({ require: false, data: [], error, }))

        if (response.unauthorized) {
            console.log('unauthorized', response.error)

            localStorage.clear()
            window.location.reload()
        }

        return response
    }
}

export class BaseFetch extends MainModel {
    directFetch = (data) => this.directEndpointFetch(`${GLOBAL.BASE_SERVER.URL}${data.url}`, data)
    authFetch = (data) => this.authEndpointFetch(`${GLOBAL.BASE_SERVER.URL}${data.url}`, data)
}

