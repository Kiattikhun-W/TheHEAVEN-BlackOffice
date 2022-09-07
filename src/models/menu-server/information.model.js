import { BaseFetch } from "../main-model";
import { createQueryString } from "../../utils";

export default class InformationModel extends BaseFetch {
  getInformationBy = (data) => {
    const query = createQueryString(data);
    console.log("datapath", query);

    const res = this.authFetch({
      url: `api/v1/information/find-all?${query}`,
      method: "GET",
    });
    return res;
  };
  getInformationMessageBy = (data) => {
    const query = createQueryString(data);
    console.log("datapath", query);

    const res = this.authFetch({
      url: `api/v1/information/find-all-message?${query}`,
      method: "GET",
    });
    return res;
  };

  updateInformationBy = (id, data) =>
    this.authFetch({
      url: "api/v1/information/update/" + id,
      method: "PATCH",
      body: JSON.stringify(data),
    });
  generateInformationLastCode = (data) =>
    this.authFetch({
      url: "information/generateInformationLastCode",
      method: "POST",
      body: JSON.stringify(data),
    });

  getInformationByCode = (data) =>
    this.authFetch({
      url: "api/v1/information/find-one/" + data.id,
      method: "GET",
    });

  insertInformation = (data) =>
    this.authFetch({
      url: "api/v1/information/create",
      method: "POST",
      body: JSON.stringify(data),
    });

  insertInformationMessage = (data) =>
    this.authFetch({
      url: "api/v1/information/create/message",
      method: "POST",
      body: JSON.stringify(data),
    });

  deleteInformationByCode = (id) =>
    this.authFetch({
      url: "api/v1/information/delete/" + id,
      method: "DELETE",
      // body: JSON.stringify(data),
    });
}
