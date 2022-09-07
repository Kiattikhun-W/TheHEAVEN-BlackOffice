import { BaseFetch } from "../main-model";
import { createQueryString } from "../../utils";
import GLOBAL from "../../GLOBAL";

export default class RepairCommonModel extends BaseFetch {
  getRepairCommonBy = (data) => {
    const query = createQueryString(data);
    console.log("datapath", query);

    const res = this.authFetch({
      url: `api/v1/repair-common-history/find-all?${query}`,
      method: "GET",
    });
    return res;
  };
  getRepairCommonTop5By = (data) => {
    const query = createQueryString(data);
    console.log("datapath", query);

    const res = this.authFetch({
      url: `api/v1/repair-common-history/find-top5?${query}`,
      method: "GET",
    });
    return res;
  };

  updateRepairCommonBy = (id, data) =>
    this.authFetch({
      url: "api/v1/repair-common-history/update/" + id,
      method: "PATCH",
      body: JSON.stringify(data),
    });
  generateRepairCommonLastCode = (data) =>
    this.authFetch({
      url: "repair-common-history/generateRepairCommonLastCode",
      method: "POST",
      body: JSON.stringify(data),
    });

  getRepairCommonByCode = (data) =>
    this.authFetch({
      url: "api/v1/repair-common-history/find-one/" + data.id,
      method: "GET",
    });

  insertRepairCommon = (data) =>
    this.authFetch({
      url: "api/v1/repair-common-history/create",
      method: "POST",
      body: JSON.stringify(data),
    });

    insertRepairCommonImage = async (data) =>{
      const form_data = new FormData()
      console.log(data)
      if(data.repair_common_image.file){
        form_data.append("image", data.repair_common_image.file, data.repair_common_image.file.name)       
        form_data.append("id", data.id)       

        const res_upload = await fetch(
          `${GLOBAL.BASE_SERVER.URL_IMG}api/v1/repair-common-history/create/image`,
          {
            method: "POST",
            headers: GLOBAL.ACCESS_TOKEN,
            body: form_data,
          }
        )
          .then((response) => response.json().then((e) => e))
          .catch((error) => ({ require: false, data: [], err: error }));

          return res_upload
    }
  }


    

  deleteRepairCommonByCode = (id) =>
    this.authFetch({
      url: "api/v1/repair-common-history/delete/" + id,
      method: "DELETE",
      // body: JSON.stringify(data),
    });
}
