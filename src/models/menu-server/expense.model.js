import { BaseFetch } from "../main-model";
import { createQueryString } from "../../utils";

export default class ExpenseModel extends BaseFetch {
  getExpenseBy = (data) => {
    const query = createQueryString(data);
    const res = this.authFetch({
      url: `api/v1/expense/find-all?${query}`,
      method: "GET",
    });
    return res;
  };

  updateExpenseBy = (id, data) =>
    this.authFetch({
      url: "api/v1/expense/update/" + id,
      method: "PATCH",
      body: JSON.stringify(data),
    });
  generateExpenseLastCode = (data) =>
    this.authFetch({
      url: "expense/generateExpenseLastCode",
      method: "POST",
      body: JSON.stringify(data),
    });

  getExpenseByCode = (data) =>
    this.authFetch({
      url: "api/v1/expense/find-one/" + data.id,
      method: "GET",
    });

  insertExpense = (data) =>
    this.authFetch({
      url: "api/v1/expense/create",
      method: "POST",
      body: JSON.stringify(data),
    });

    sendExpenseLine = (data) =>
    this.authFetch({
      url: "api/v1/expense/sendline",
      method: "POST",
      body: JSON.stringify(data),
    });

    deleteExpenseByCode = (id) =>
    this.authFetch({
      url: "api/v1/expense/delete/" + id,
      method: "DELETE",
      // body: JSON.stringify(data),
    });
}
