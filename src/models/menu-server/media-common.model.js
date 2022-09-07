import { BaseFetch } from "../main-model";
import { createQueryString } from "../../utils";

export default class MediaCommonModel extends BaseFetch {
  getMediaCommonBy = (data) => {
    const query = createQueryString(data);
    console.log("datapath", query);

    const res = this.authFetch({
      url: `api/v1/media-repair-common/find-all?${query}`,
      method: "GET",
    });
    return res;
  };

  updateMediaCommonBy = (id, data) =>
    this.authFetch({
      url: "api/v1/media-repair-common/update/" + id,
      method: "PATCH",
      body: JSON.stringify(data),
    });
  generateMediaCommonLastCode = (data) =>
    this.authFetch({
      url: "media-repair-common/generateMediaCommonLastCode",
      method: "POST",
      body: JSON.stringify(data),
    });

  getMediaCommonByCode = (data) =>
    this.authFetch({
      url: "api/v1/media-repair-common/find-one/" + data.id,
      method: "GET",
    });

  insertMediaCommon = (data) =>
    this.authFetch({
      url: "api/v1/media-repair-common/create",
      method: "POST",
      body: JSON.stringify(data),
    });

  deleteMediaCommonByCode = (id) =>
    this.authFetch({
      url: "api/v1/media-repair-common/delete/" + id,
      method: "DELETE",
      // body: JSON.stringify(data),
    });
}
