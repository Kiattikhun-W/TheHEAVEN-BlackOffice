import { BaseFetch } from "../main-model";
import { createQueryString } from "../../utils";

export default class UnitModel extends BaseFetch {
  getUnitBy = (data) => {
    const query = createQueryString(data);
    const res = this.authFetch({
      url: `api/v1/unit/find-all?${query}`,
      method: "GET",
    });
    return res;
  };

  updateUnitBy = (id, data) =>
    this.authFetch({
      url: "api/v1/unit/update/" + id,
      method: "PATCH",
      body: JSON.stringify(data),
    });

  getUnitByCode = (data) =>
    this.authFetch({
      url: "api/v1/unit/find-one/"+data.id,
      method: "GET",
    });

  getUnitByIDP = (data) =>
    this.authFetch({
      url: "unit/getUnitByIDP",
      method: "POST",
      body: JSON.stringify(data),
    });

  insertUnit = (data) =>
    this.authFetch({
      url: "api/v1/unit/create",
      method: "POST",
      body: JSON.stringify(data),
    });

    deleteUnitByCode = (id) =>
    this.authFetch({
      url: "api/v1/unit/delete/" + id,
      method: "DELETE",
      // body: JSON.stringify(data),
    });
}
