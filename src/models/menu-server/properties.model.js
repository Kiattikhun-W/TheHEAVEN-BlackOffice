import { BaseFetch } from '../main-model'
import { createQueryString } from "../../utils";
import GLOBAL from "../../GLOBAL";
export default class PropertiesModel extends BaseFetch {
  getPropertiesBy = (data) => {
    const query = createQueryString(data);
    const res = this.authFetch({
      url: `api/v1/property/find-all?${query}`,
      method: "GET",
    });
    return res;
  };

    updatePropertiesBy = (id,data) => this.authFetch({
        url: 'api/v1/property/update/'+ id,
        method: 'PATCH',
        body: JSON.stringify(data),
    })
    generatePropertiesLastCode = (data) => this.authFetch({
        url: 'properties/generatePropertiesLastCode',
        method: 'POST',
        body: JSON.stringify(data),
    })

    getPropertiesByCode = (data) =>
    this.authFetch({
      url: "api/v1/property/find-one/" + data.id,
      method: "GET",
    });  

    insertProperties = (data) => this.authFetch({
        url: 'api/v1/property/create',
        method: 'POST',
        body: JSON.stringify(data),
    })
    insertPropertiesImage = async (data) =>{
        const form_data = new FormData()
        console.log(data)
        if(data.property_image.file){
          form_data.append("file", data.property_image.file, data.property_image.file.name)  
          const res_upload = await fetch(
            `${GLOBAL.BASE_SERVER.URL_IMG}api/v1/media/upload/file`,
            {
              method: "POST",
              headers: GLOBAL.ACCESS_TOKEN,
              body: form_data,
            }
          )
            .then((response) => response.json().then((e) => e))
            .catch((error) => ({ require: false, data: [], err: error }));
            console.log("num",res_upload.result[0].id)
  
            return Number(res_upload.result[0].id)
      }
    }
    deletePropertiesByCode = (id) =>
    this.authFetch({
      url: "api/v1/property/delete/" + id,
      method: "DELETE",
      // body: JSON.stringify(data),
    });


}