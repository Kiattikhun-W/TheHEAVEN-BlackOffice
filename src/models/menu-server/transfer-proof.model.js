import { BaseFetch } from "../main-model";
import { createQueryString } from "../../utils";

export default class TransferProofModel extends BaseFetch {
  getTransferProofBy = (data) => {
    const query = createQueryString(data);
    console.log("datapath", query);

    const res = this.authFetch({
      url: `api/v1/transfer-proof/find-all?${query}`,
      method: "GET",
    });
    return res;
  };

  updateTransferProofBy = (id, data) =>
    this.authFetch({
      url: "api/v1/transfer-proof/update/" + id,
      method: "PATCH",
      body: JSON.stringify(data),
    });

    confirmedTransfer = (id, data) =>
    this.authFetch({
      url: "api/v1/transfer-proof/confirmed/" + id,
      method: "PATCH",
      body: JSON.stringify(data),
    });
 
  getTransferProofByCode = (data) =>
    this.authFetch({
      url: "api/v1/transfer-proof/find-one/" + data.id,
      method: "GET",
    });

  insertTransferProof = (data) =>
    this.authFetch({
      url: "api/v1/transfer-proof/create",
      method: "POST",
      body: JSON.stringify(data),
    });

  deleteTransferProofByCode = (id) =>
    this.authFetch({
      url: "api/v1/transfer-proof/delete/" + id,
      method: "DELETE",
      // body: JSON.stringify(data),
    });

    sendRejectedTransfer = (data) =>
    this.authFetch({
      url: "api/v1/transfer-proof/sendRejected",
      method: "POST",
      body: JSON.stringify(data),
    });
    sendConfirmTransfer = (data) =>
    this.authFetch({
      url: "api/v1/transfer-proof/sendConfirm",
      method: "POST",
      body: JSON.stringify(data),
    });
}
