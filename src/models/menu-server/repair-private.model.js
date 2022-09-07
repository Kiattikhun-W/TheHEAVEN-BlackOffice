import { BaseFetch } from "../main-model";
import { createQueryString } from "../../utils";
import GLOBAL from "../../GLOBAL";

export default class RepairPrivateModel extends BaseFetch {
  getRepairPrivateBy = (data) => {
    const query = createQueryString(data);
    console.log("datapath", query);

    const res = this.authFetch({
      url: `api/v1/repair-private-history/find-all?${query}`,
      method: "GET",
    });
    return res;
  };

  insertRepairPrivateImage = async (data) =>{
    const form_data = new FormData()
    console.log(data)
    if(data.repair_private_image.file){
      form_data.append("image", data.repair_private_image.file, data.repair_private_image.file.name)       
      form_data.append("id", data.id)       

      const res_upload = await fetch(
        `${GLOBAL.BASE_SERVER.URL_IMG}api/v1/repair-private-history/create/image`,
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

  updateRepairPrivateBy = (id, data) =>
    this.authFetch({
      url: "api/v1/repair-private-history/update/" + id,
      method: "PATCH",
      body: JSON.stringify(data),
    });
  generateRepairPrivateLastCode = (data) =>
    this.authFetch({
      url: "repair-private-history/generateRepairPrivateLastCode",
      method: "POST",
      body: JSON.stringify(data),
    });

  getRepairPrivateByCode = (data) =>
    this.authFetch({
      url: "api/v1/repair-private-history/find-one/" + data.id,
      method: "GET",
    });

  insertRepairPrivate = (data) =>
    this.authFetch({
      url: "api/v1/repair-private-history/create",
      method: "POST",
      body: JSON.stringify(data),
    });

  deleteRepairPrivateByCode = (id) =>
    this.authFetch({
      url: "api/v1/repair-private-history/delete/" + id,
      method: "DELETE",
      // body: JSON.stringify(data),
    });
}
