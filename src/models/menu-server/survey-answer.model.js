import { BaseFetch } from "../main-model";
import { createQueryString } from "../../utils";

export default class SurveyAnswerModel extends BaseFetch {
  getSurveyAnswerBy = (data) => {
    const query = createQueryString(data);

    const res = this.authFetch({
      url: `api/v1/survey-answer/find-all?${query}`,
      method: "GET",
    });
    return res;
  };

  updateSurveyAnswerBy = (data) =>
    this.authFetch({
      url: "survey-answer/updateSurveyAnswerBy",
      method: "POST",
      body: JSON.stringify(data),
    });
  generateSurveyAnswerLastCode = (data) =>
    this.authFetch({
      url: "survey-answer/generateSurveyAnswerLastCode",
      method: "POST",
      body: JSON.stringify(data),
    });

  getSurveyAnswerByCode = (data) =>
    this.authFetch({
      url: "survey-answer/getSurveyAnswerByCode",
      method: "POST",
      body: JSON.stringify(data),
    });

  insertSurveyAnswer = (data) =>
    this.authFetch({
      url: "survey-answer/insertSurveyAnswer",
      method: "POST",
      body: JSON.stringify(data),
    });

  deleteSurveyAnswerByCode = (data) =>
    this.authFetch({
      url: "survey-answer/deleteSurveyAnswerByCode",
      method: "POST",
      body: JSON.stringify(data),
    });
}
