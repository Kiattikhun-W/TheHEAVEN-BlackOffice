import { BaseFetch } from "../main-model";
import { createQueryString } from "../../utils";

export default class MediaPrivate extends BaseFetch {
  getMediaPrivateBy = (data) => {
    const query = createQueryString(data);
    console.log("datapath", query);

    const res = this.authFetch({
      url: `api/v1/media-repair-private/find-all?${query}`,
      method: "GET",
    });
    return res;
  };

  updateMediaPrivateBy = (id, data) =>
    this.authFetch({
      url: "api/v1/media-repair-private/update/" + id,
      method: "PATCH",
      body: JSON.stringify(data),
    });

  getMediaPrivateByCode = (data) =>
    this.authFetch({
      url: "api/v1/media-repair-private/find-one/" + data.id,
      method: "GET",
    });

  insertMediaPrivate = (data) =>
    this.authFetch({
      url: "api/v1/media-repair-private/create",
      method: "POST",
      body: JSON.stringify(data),
    });

  deleteMediaPrivateByCode = (id) =>
    this.authFetch({
      url: "api/v1/media-repair-private/delete/" + id,
      method: "DELETE",
      // body: JSON.stringify(data),
    });
}
