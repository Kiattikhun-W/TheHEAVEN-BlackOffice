import { BaseFetch } from "../main-model";
import { createQueryString } from "../../utils";

export default class UnitMemberModel extends BaseFetch {
  getUnitMemberBy = (data) => {
    const query = createQueryString(data);
    const res = this.authFetch({
      url: `api/v1/unit-user/find-all?${query}`,
      method: "GET",
    });
    return res;
  };

  getUnitMemberWebBy = (data) => {
    const query = createQueryString(data);
    const res = this.authFetch({
      url: `api/v1/unit-user/find-all-web?${query}`,
      method: "GET",
    });
    return res;
  };

  updateUnitMemberBy = (data) =>
    this.authFetch({
      url: "unit-member/updateUnitMemberBy",
      method: "POST",
      body: JSON.stringify(data),
    });
  generateUnitMemberLastCode = (data) =>
    this.authFetch({
      url: "unit-member/generateUnitMemberLastCode",
      method: "POST",
      body: JSON.stringify(data),
    });

  getUnitMemberByCode = (data) =>
    this.authFetch({
      url: "api/v1/unit-user/find-one/" + data.id,
      method: "GET",
    });

  insertUnitMember = (data) =>
    this.authFetch({
      url: "api/v1/unit-user/create",
      method: "POST",
      body: JSON.stringify(data),
    });

    deleteUnitMemberByCode = (id) =>
    this.authFetch({
      url: "api/v1/unit-user/delete/" + id,
      method: "DELETE",
      // body: JSON.stringify(data),
    });
}
