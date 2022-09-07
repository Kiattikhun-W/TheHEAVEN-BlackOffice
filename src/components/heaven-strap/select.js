import React from 'react'
import { Select } from "antd"

export default class RevelSelect extends React.Component {
  _onChange = (e) => {
    if (this.props.onChange) this.props.onChange(e)
    if (this.props.onChangeObject) {
      if (this.props.mode === 'multiple' && this.props.mode === 'tags') {
        var arr = []
        e.forEach(item => {
          arr.push(this.props.options.find(val => val.value === item))
        });
        this.props.onChangeObject(arr)
      } else {
        this.props.onChangeObject(this.props.options.find(val => val.value === e))
      }
    }
  }

  render() {
    let { setProps } = this.props

    return (
      <Select
        mode={(this.props.mode || '')}
        className={(this.props.className || 'w-100')}
        options={(this.props.options || [])}
        value={(this.props.value || '')}
        placeholder={(this.props.placeholder || 'select..')}
        showSearch={(this.props.showSearch || true)}
        disabled={(this.props.disabled || false)}
        filterOption={(input, option) => option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        onChange={this._onChange}
        style={this.props.style || {}}

        {...setProps}
      />
    )
  }
}