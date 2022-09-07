import { BaseFetch } from "../main-model";
import { createQueryString } from "../../utils";

export default class MailParcelModel extends BaseFetch {
  getMailParcelBy = (data) => {
    const query = createQueryString(data);
    const res = this.authFetch({
      url: `api/v1/mail-parcel/find-all?${query}`,
      method: "GET",
    });
    return res;
  };

  updateMailParcelBy = (id, data) =>
    this.authFetch({
      url: "api/v1/mail-parcel/update/" + id,
      method: "PATCH",
      body: JSON.stringify(data),
    });
  generateMailParcelLastCode = (data) =>
    this.authFetch({
      url: "mail-parcel/generateMailParcelLastCode",
      method: "POST",
      body: JSON.stringify(data),
    });

  getMailParcelByCode = (data) =>
    this.authFetch({
      url: "api/v1/mail-parcel/find-one/" + data.id,
      method: "GET",
    });

  insertMailParcel = (data) =>
    this.authFetch({
      url: "api/v1/mail-parcel/create",
      method: "POST",
      body: JSON.stringify(data),
    });

  deleteMailParcelByCode = (id) =>
    this.authFetch({
      url: "api/v1/mail-parcel/delete/" + id,
      method: "DELETE",
      // body: JSON.stringify(data),
    });
}
