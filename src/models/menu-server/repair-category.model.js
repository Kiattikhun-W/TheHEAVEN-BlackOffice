import { BaseFetch } from "../main-model";
import { createQueryString } from "../../utils";

export default class RepairCategoryModel extends BaseFetch {
  getRepairCategoryBy = (data) => {
    const query = createQueryString(data);
    console.log("datapath", query);

    const res = this.authFetch({
      url: `api/v1/repair-category/find-all?${query}`,
      method: "GET",
    });
    return res;
  };

  updateRepairCategoryBy = (id, data) =>
    this.authFetch({
      url: "api/v1/repair-category/update/" + id,
      method: "PATCH",
      body: JSON.stringify(data),
    });
  generateRepairCategoryLastCode = (data) =>
    this.authFetch({
      url: "repair-category/generateRepairCategoryLastCode",
      method: "POST",
      body: JSON.stringify(data),
    });

  getRepairCategoryByCode = (data) =>
    this.authFetch({
      url: "api/v1/repair-category/find-one/" + data.id,
      method: "GET",
    });

  insertRepairCategory = (data) =>
    this.authFetch({
      url: "api/v1/repair-category/create",
      method: "POST",
      body: JSON.stringify(data),
    });

  deleteRepairCategoryByCode = (id) =>
    this.authFetch({
      url: "api/v1/repair-category/delete/" + id,
      method: "DELETE",
      // body: JSON.stringify(data),
    });
}
