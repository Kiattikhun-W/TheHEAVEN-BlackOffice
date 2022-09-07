import GLOBAL from '../GLOBAL'

class FileManager {
  authUploadFile = async (endpoint, data) => {
    const { upload_path, src } = data

    if (src.file) {
      const form_data = new FormData()

      form_data.append('upload_path', upload_path)
      form_data.append('files', src.file)

      const res_upload = await fetch(`${endpoint}file-upload/uploadFile`, {
        method: 'post',
        headers: GLOBAL.ACCESS_TOKEN,
        body: form_data,
      }).then((response) => response.json().then((e) => e)).catch((error) => ({ require: false, data: [], err: error }))

      if (res_upload.require) {
        src.old && await this.authDeleteFile(endpoint, { file_path: src.old })

        return res_upload.data.file_name
      } else {
        return src.old
      }
    } else {
      return src.old
    }
  }

  authDeleteFile = (endpoint, data) => fetch(`${endpoint}file-upload/deleteFlie`, {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...GLOBAL.ACCESS_TOKEN,
    },
    body: JSON.stringify(data),
  }).then((response) => response.json().then((e) => e)).catch((error) => ({ require: false, data: [], err: error }))
}

export class BaseServerFile extends FileManager {
  uploadFile = (data) => this.authUploadFile(`${GLOBAL.BASE_SERVER.URL}`, data)
  deleteFile = (data) => this.authDeleteFile(`${GLOBAL.BASE_SERVER.URL}`, data)
}

export class SaleServerFile extends FileManager {
  uploadFile = (data) => this.authUploadFile(`${GLOBAL.SALE_SERVER.URL}`, data)
  deleteFile = (data) => this.authDeleteFile(`${GLOBAL.SALE_SERVER.URL}`, data)
}

export class HrServerFile extends FileManager {
  uploadFile = (data) => this.authUploadFile(`${GLOBAL.HR_SERVER.URL}`, data)
  deleteFile = (data) => this.authDeleteFile(`${GLOBAL.HR_SERVER.URL}`, data)
}