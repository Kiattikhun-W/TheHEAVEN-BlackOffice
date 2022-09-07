import { BaseFetch } from "../main-model";
import { createQueryString } from "../../utils";
import GLOBAL from "../../GLOBAL";

export default class FacilityBookModel extends BaseFetch {
  getFacilityBookBy = (data) => {
    const query = createQueryString(data);
    console.log("datapath", query);

    const res = this.authFetch({
      url: `api/v1/facility-book/find-all?${query}`,
      method: "GET",
    });
    return res;
  };

  checkDateTimeBooking = (data) =>
    this.authFetch({
      url: "api/v1/facility-book/check-date-time-booking",
      method: "POST",
      body: JSON.stringify(data),
    });
  checkInFacilityBook = (data) =>
    this.authFetch({
      url: "api/v1/facility-book/booking/check-in",
      method: "PATCH",
      body: JSON.stringify(data),
    });
    cancelFacilityBook = (data) =>
    this.authFetch({
      url: "api/v1/facility-book/booking/cancel",
      method: "PATCH",
      body: JSON.stringify(data),
    });


  updateFacilityBookBy = (id, data) =>
    this.authFetch({
      url: "api/v1/facility-book/update/" + id,
      method: "PATCH",
      body: JSON.stringify(data),
    });

  getFacilityBookByCode = (data) =>
    this.authFetch({
      url: "api/v1/facility-book/find-one/" + data.id,
      method: "GET",
    });

  insertFacilityBook = (data) =>
    this.authFetch({
      url: "api/v1/facility-book/create",
      method: "POST",
      body: JSON.stringify(data),
    });

  deleteFacilityBookByCode = (id) =>
    this.authFetch({
      url: "api/v1/facility-book/delete/" + id,
      method: "DELETE",
      // body: JSON.stringify(data),
    });
  insertFacilityBookImage = async (data) => {
    const form_data = new FormData()
    console.log(data)
    if (data.facility_image.file) {
      form_data.append("file", data.facility_image.file, data.facility_image.file.name)
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
      console.log("num", res_upload.result[0].id)

      return Number(res_upload.result[0].id)
    }
  }
}
