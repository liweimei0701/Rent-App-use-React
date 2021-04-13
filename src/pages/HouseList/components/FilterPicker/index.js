import React, { Component } from 'react'

import { PickerView } from 'antd-mobile'

import FilterFooter from '../../../../components/FilterFooter'

export default class FilterPicker extends Component {
  state= {
    value:this.props.defaultValue
  }
  onChange = (val) => {
    this.setState({
      value: val
    })
  }
  render() {
    const { onCancel, onSave,data,col,type} = this.props
    const {value} = this.state
    return (
      <>
        {/* 选择器组件： */}
        <PickerView data={data} value={value} cols={col} onChange={this.onChange} />

        {/* 底部按钮 */}
        <FilterFooter onCancel={() => onCancel(type)} onSave={() => {onSave(value,type)}} />
      </>
    )
  }
}
