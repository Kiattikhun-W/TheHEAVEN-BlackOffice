import { BaseFetch } from "../main-model";
import { createQueryString } from "../../utils";

export default class MediaModel extends BaseFetch {
  getMediaBy = (data) => {
    const query = createQueryString(data);
    console.log("datapath", query);

    const res = this.authFetch({
      url: `api/v1/media/find-all?${query}`,
      method: "GET",
    });
    return res;
  };

  updateMediaBy = (id, data) =>
    this.authFetch({
      url: "api/v1/media/update/" + id,
      method: "PATCH",
      body: JSON.stringify(data),
    });
  generateMediaLastCode = (data) =>
    this.authFetch({
      url: "media/generateMediaLastCode",
      method: "POST",
      body: JSON.stringify(data),
    });

  getMediaByCode = (data) =>
    this.authFetch({
      url: "api/v1/media/find-one/" + data.id,
      method: "GET",
    });

  insertMedia = (data) =>
    this.authFetch({
      url: "api/v1/media/create",
      method: "POST",
      body: JSON.stringify(data),
    });

  deleteMediaByCode = (id) =>
    this.authFetch({
      url: "api/v1/media/delete/" + id,
      method: "DELETE",
      // body: JSON.stringify(data),
    });
}
