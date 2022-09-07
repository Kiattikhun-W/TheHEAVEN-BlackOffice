import { BaseFetch } from '../main-model'
import { createQueryString } from "../../utils";

export default class PhoneDirectoryModel extends BaseFetch {
    getPhoneDirectoryBy = (data) => {
        const query = createQueryString(data);
        console.log("datapath", query);
    
        const res = this.authFetch({
          url: `api/v1/phone-directory/find-all?${query}`,
          method: "GET",
        });
        return res;
      };
    
      updatePhoneDirectoryBy = (id, data) =>
        this.authFetch({
          url: "api/v1/phone-directory/update/" + id,
          method: "PATCH",
          body: JSON.stringify(data),
        });
      
      getPhoneDirectoryByCode = (data) =>
        this.authFetch({
          url: "api/v1/phone-directory/find-one/" + data.id,
          method: "GET",
        });
    
      insertPhoneDirectory = (data) =>
        this.authFetch({
          url: "api/v1/phone-directory/create",
          method: "POST",
          body: JSON.stringify(data),
        });
    
      deletePhoneDirectoryByCode = (id) =>
        this.authFetch({
          url: "api/v1/phone-directory/delete/" + id,
          method: "DELETE",
          // body: JSON.stringify(data),
        });


}