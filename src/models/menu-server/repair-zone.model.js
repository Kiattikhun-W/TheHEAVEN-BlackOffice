import { BaseFetch } from "../main-model";
import { createQueryString } from "../../utils";

export default class RepairZoneModel extends BaseFetch {
  getRepairZoneBy = (data) => {
    const query = createQueryString(data);
    console.log("datapath", query);

    const res = this.authFetch({
      url: `api/v1/repair-zone/find-all?${query}`,
      method: "GET",
    });
    return res;
  };

  updateRepairZoneBy = (id, data) =>
    this.authFetch({
      url: "api/v1/repair-zone/update/" + id,
      method: "PATCH",
      body: JSON.stringify(data),
    });
  generateRepairZoneLastCode = (data) =>
    this.authFetch({
      url: "repair-zone/generateRepairZoneLastCode",
      method: "POST",
      body: JSON.stringify(data),
    });

  getRepairZoneByCode = (data) =>
    this.authFetch({
      url: "api/v1/repair-zone/find-one/" + data.id,
      method: "GET",
    });

  insertRepairZone = (data) =>
    this.authFetch({
      url: "api/v1/repair-zone/create",
      method: "POST",
      body: JSON.stringify(data),
    });

  deleteRepairZoneByCode = (id) =>
    this.authFetch({
      url: "api/v1/repair-zone/delete/" + id,
      method: "DELETE",
      // body: JSON.stringify(data),
    });
}
