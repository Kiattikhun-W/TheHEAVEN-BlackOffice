import { BaseFetch } from "../main-model";
import { createQueryString } from "../../utils";

export default class ReceiptTheHeavenModel extends BaseFetch {
  getReceiptBy = (data) => {
    const query = createQueryString(data);
    const res = this.authFetch({
      url: `api/v1/receipt/find-all?${query}`,
      method: "GET",
    });
    return res;
  };

  updateReceiptBy = (id, data) =>
    this.authFetch({
      url: "api/v1/receipt/update/" + id,
      method: "PATCH",
      body: JSON.stringify(data),
    });

  getReceiptByCode = (data) =>
    this.authFetch({
      url: "api/v1/receipt/find-one/" + data.id,
      method: "GET",
    });

  insertReceipt = (data) =>
    this.authFetch({
      url: "api/v1/receipt/create",
      method: "POST",
      body: JSON.stringify(data),
    });

  deleteReceiptByCode = (id) =>
    this.authFetch({
      url: "api/v1/receipt/delete/" + id,
      method: "DELETE",
      // body: JSON.stringify(data),
    });
}
