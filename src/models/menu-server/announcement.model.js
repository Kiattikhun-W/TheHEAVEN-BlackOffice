import { BaseFetch } from "../main-model";
import { createQueryString } from "../../utils";
import GLOBAL from "../../GLOBAL";

export default class AnnouncementModel extends BaseFetch {
  getAnnouncementBy = (data) => {
    const query = createQueryString(data);
    console.log("datapath", query);

    const res = this.authFetch({
      url: `api/v1/announcement/find-all?${query}`,
      method: "GET",
    });
    return res;
  };

  updateAnnouncementBy = (id, data) =>
    this.authFetch({
      url: "api/v1/announcement/update/" + id,
      method: "PATCH",
      body: JSON.stringify(data),
    });

  getAnnouncementByCode = (data) =>
    this.authFetch({
      url: "api/v1/announcement/find-one/" + data.id,
      method: "GET",
    });

  insertAnnouncement = (data) =>
    this.authFetch({
      url: "api/v1/announcement/create",
      method: "POST",
      body: JSON.stringify(data),
    });

  deleteAnnouncementByCode = (id) =>
    this.authFetch({
      url: "api/v1/announcement/delete/" + id,
      method: "DELETE",
      // body: JSON.stringify(data),
    });

  insertAnnouncementImage = async (data) => {
    const form_data = new FormData()
    console.log(data)
    if (data.announcement_image.file) {
      form_data.append("file", data.announcement_image.file, data.announcement_image.file.name)
      const res_upload = await fetch(
        `${GLOBAL.BASE_SERVER.URL_IMG}api/v1/media/upload/file`,
        {
          method: "POST",
          headers: GLOBAL.ACCESS_TOKEN,
          body: form_data,
        }
      )
        .then((response) => response.json().then((e) => e))
        .catch((error) => ({ require: false, data: [], err: error }));

      return Number(res_upload.result[0].id)
    }
  }
  sendAnnouncementLine = (data) =>
    this.authFetch({
      url: "api/v1/announcement/sendline",
      method: "POST",
      body: JSON.stringify(data),
    });
}
