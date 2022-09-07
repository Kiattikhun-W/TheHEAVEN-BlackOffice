import { BaseFetch } from "../main-model";
import { createQueryString } from "../../utils";
import GLOBAL from "../../GLOBAL";

export default class FacilityZoneModel extends BaseFetch {
  getFacilityZoneBy = (data) => {
    const query = createQueryString(data);
    console.log("datapath", query);

    const res = this.authFetch({
      url: `api/v1/facility-zone/find-all?${query}`,
      method: "GET",
    });
    return res;
  };

  updateFacilityZoneBy = (id, data) =>
    this.authFetch({
      url: "api/v1/facility-zone/update/" + id,
      method: "PATCH",
      body: JSON.stringify(data),
    });

  getFacilityZoneByCode = (data) =>
    this.authFetch({
      url: "api/v1/facility-zone/find-one/" + data.id,
      method: "GET",
    });

  insertFacilityZone = (data) =>
    this.authFetch({
      url: "api/v1/facility-zone/create",
      method: "POST",
      body: JSON.stringify(data),
    });

  deleteFacilityZoneByCode = (id) =>
    this.authFetch({
      url: "api/v1/facility-zone/delete/" + id,
      method: "DELETE",
      // body: JSON.stringify(data),
    });
    insertFacilityZoneImage = async (data) =>{
      const form_data = new FormData()
      console.log(data)
      if(data.facility_image.file){
        form_data.append("file", data.facility_image.file, data.facility_image.file.name)  
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
}
