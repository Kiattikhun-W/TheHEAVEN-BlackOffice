import moment from 'moment'

const moments = require('moment-timezone')

moments().tz("Asia/Bangkok").format()

const monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"]

const timeFormat = {
  validateDate: (str) => {
    const date = new Date(str)

    return str && moment(date).isValid() ? date : ''
  },
  dateToStr: (date) => date && moment(date).isValid() ? moment.utc(date).tz("Asia/Bangkok").format('YYYY-MM-DD') : '',
  timeToStr: (date) => date && moment(date).isValid() ? moment.utc(date).tz("Asia/Bangkok").format('HHmm') : '',
  dateTimeToStr: (date) => date && moment(date).isValid() ? moment.utc(date).tz("Asia/Bangkok").format('YYYY-MM-DD HH:mm:ss') : '',
  showDateTH: (date) => {
    if (date && moment(date).isValid()) {
      const day = moment.utc(date).tz("Asia/Bangkok").format('DD')
      const month = moment.utc(date).tz("Asia/Bangkok").format('MM')
      const year = moment.utc(date).tz("Asia/Bangkok").format('YYYY')

      return `${day}/${month}/${year}`
    } else {
      return ''
    }
  },
  showDateTimeTH: (date) => {
    if (date && moment(date).isValid()) {
      const day = moment.utc(date).tz("Asia/Bangkok").format('DD')
      const month = moment.utc(date).tz("Asia/Bangkok").format('MM')
      const year = moment.utc(date).tz("Asia/Bangkok").format('YYYY')
      const time = moment.utc(date).tz("Asia/Bangkok").format('HH:mm')

      return `${day}/${month}/${year} ${time}`
    } else {
      return ''
    }
  },
  showFullDateTH: (date) => {
    if (date && moment(date).isValid()) {
      const day = moment.utc(date).tz("Asia/Bangkok").format('DD')
      const month = moment.utc(date).tz("Asia/Bangkok").format('MM')
      const year = moment.utc(date).tz("Asia/Bangkok").format('YYYY')

      return `${day} ${monthNames[+month - 1]} ${year}`
    } else {
      return ''
    }
  },
  showFullDateTimeTH: (date) => {
    if (date && moment(date).isValid()) {
      const day = moment.utc(date).tz("Asia/Bangkok").format('DD')
      const month = moment.utc(date).tz("Asia/Bangkok").format('MM')
      const year = moment.utc(date).tz("Asia/Bangkok").format('YYYY')
      const time = moment.utc(date).tz("Asia/Bangkok").format('HH:mm')

      return `${day} ${monthNames[+month - 1]} ${year} เวลา ${time} น.`
    } else {
      return ''
    }
  },
}

export default timeFormat