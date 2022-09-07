import React from 'react'
import { DatePicker } from "antd"
import moment from 'moment'

export default class RevelDatePicker extends React.Component {
  _disabledDate = (date) => {
    const { minDate, maxDate } = this.props

    if (minDate && maxDate) {
      return date && (date > moment(maxDate).clone() || date < moment(minDate).clone())
    } else if (minDate) {
      return date && date < moment(minDate).clone()
    } else if (maxDate) {
      return date && date > moment(maxDate).clone()
    }
  }

  _onChange = (e) => {
    if (this.props.onChange) this.props.onChange(e ? e._d : '')
  }

  render() {
    let { setProps } = this.props

    return (
      <DatePicker
        className={(this.props.className || 'form-control')}
        value={(this.props.value ? moment(this.props.value, "YYYY/MM/DD") : '')}
        format={(this.props.format || "DD/MM/YYYY")}
        allowClear={(this.props.allowClear || false)}
        onChange={this._onChange}
        disabledDate={this._disabledDate}
        style={this.props.style || {}}
        showTime={this.props.showTime ? true : false}
        {...setProps}
      />
    )
  }
}