import { BaseFetch } from "../main-model";
import { createQueryString } from "../../utils";

export default class ExpenseListModel extends BaseFetch {
  getExpenseListBy = (data) => {
    const query = createQueryString(data);
    const res = this.authFetch({
      url: `api/v1/expense-list/find-all?${query}`,
      method: "GET",
    });
    return res;
  };
  updateExpenseListBy = (data) =>
    this.authFetch({
      url: "expense-list/updateExpenseListBy",
      method: "POST",
      body: JSON.stringify(data),
    });
  generateExpenseListLastCode = (data) =>
    this.authFetch({
      url: "expense-list/generateExpenseListLastCode",
      method: "POST",
      body: JSON.stringify(data),
    });

  getExpenseListByCode = (data) =>
    this.authFetch({
      url: "expense-list/getExpenseListByCode",
      method: "POST",
      body: JSON.stringify(data),
    });

  insertExpenseList = (data) =>
    this.authFetch({
      url: "expense-list/insertExpenseList",
      method: "POST",
      body: JSON.stringify(data),
    });

  deleteExpenseListByCode = (data) =>
    this.authFetch({
      url: "expense-list/deleteExpenseListByCode",
      method: "POST",
      body: JSON.stringify(data),
    });
}
