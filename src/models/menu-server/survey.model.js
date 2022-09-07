import { BaseFetch } from "../main-model";
import { createQueryString } from "../../utils";

export default class SurveyModel extends BaseFetch {
  getSurveyBy = (data) => {
    const query = createQueryString(data);
    console.log("datapath", query);

    const res = this.authFetch({
      url: `api/v1/survey/find-all?${query}`,
      method: "GET",
    });
    return res;
  };

  updateSurveyBy = (id, data) =>
    this.authFetch({
      url: "api/v1/survey/update/" + id,
      method: "PATCH",
      body: JSON.stringify(data),
    });
  generateSurveyLastCode = (data) =>
    this.authFetch({
      url: "survey/generateSurveyLastCode",
      method: "POST",
      body: JSON.stringify(data),
    });

  getSurveyByCode = (data) =>
    this.authFetch({
      url: "api/v1/survey/find-one/" + data.id,
      method: "GET",
    });

  insertSurvey = (data) =>
    this.authFetch({
      url: "api/v1/survey/create",
      method: "POST",
      body: JSON.stringify(data),
    });

  deleteSurveyByCode = (id) =>
    this.authFetch({
      url: "api/v1/survey/delete/" + id,
      method: "DELETE",
      // body: JSON.stringify(data),
    });

    sendSurveyLine = (data) =>
    this.authFetch({
      url: "api/v1/survey/sendline",
      method: "POST",
      body: JSON.stringify(data),
    });
}
