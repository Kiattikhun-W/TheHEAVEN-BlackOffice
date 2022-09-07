export {
    BaseServerFile,
    SaleServerFile,
    HrServerFile
} from './file-manager'
export { default as handleFilter } from './handle-filter'
export { default as numberFormat } from './number-format'
export { default as timeFormat } from './time-format'

export const lineUniversalLink =
  process.env.REACT_APP_LINE_UNIVERSAL_LINK ||
  "https://liff.line.me/1656594548-K76XQjo3";

export const createQueryString = (values) => {
    if (!values) {
      return "";
    }
    let query = "";
    let result = {};
    for (const [key, value] of Object.entries(values)) {
      if (value || value === 0 || value === false) {
        result = { ...result, [key]: value };
      }
    }
    Object.entries(result).forEach(([key, value], index) => {
      if (index === Object.keys(result).length - 1) {
        if (value || value === 0 || value === false) {
          query += `${key}=${value}`;
        }
      } else {
        if (value || value === 0 || value === false) {
          query += `${key}=${value}&`;
        }
      }
    });
    return query;
  };
  export const _isEmpty = (data = {}) => {
    const queryDefault =
      data === null || data === "undefined" || data === undefined || data === "";
    if (queryDefault) return true;
    if (typeof data === "number") return false;
    if (typeof data === "string") return false;
    const obj = queryDefault ? [] : data;
    return Object.entries(obj).length === 0;
  };