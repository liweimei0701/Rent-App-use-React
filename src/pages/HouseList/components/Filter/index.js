/* 
  条件筛选栏 - 父组件
*/
import React, { Component } from 'react'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'
import {API,getCurrentCity} from '../../../../utils'
 
import styles from './index.module.css'

const titleSelectedStatus = {
  // false 表示不亮；true 表示高亮
  area: false,
  mode: false,
  price: false,
  more: false
}
const selectedValues = {
  area: ['area','null'],
  mode:['null'],
  price:['null'],
  more:[]
}
export default class Filter extends Component {
  state = {
    // 标题高亮数据
    titleSelectedStatus,
    // 表示展示对话框的类型（ 有可能展示 FilterPicker 组件，有可能展示 FilterMore 组件 ）
    openType: '',
    filterData: {},
    selectedValues
  }
  componentDidMount() {
    this.getFilterData()
  }
  async getFilterData () {
    const {value} = await getCurrentCity()
    const res = await API.get('/houses/condition', {
      params: {
        id: value
      }
    })
    this.setState({
      filterData: res.data.body
    })
  }
  
  renderFilterPicker = () =>  {  
    const {openType} = this.state
    const {area,subway,rentType,price} = this.state.filterData
    if (openType === 'more' || openType === '') {
      return null
    } 
    let data 
    let col = 1
    let defaultValue = this.state.selectedValues[openType]
    switch (openType) {
      case 'area':
        data = [area,subway]
        col = 3
        break;
      case 'mode':
        data = rentType
        break;
      case 'price':
        data = price
        break;
      default:
        break;
    }
    return (<FilterPicker
       key={openType}
       data={data} col={col} 
       onCancel={this.onCancel}
       onSave={this.onSave} 
       type={openType}
       defaultValue={defaultValue}/>
    )
  }
  // 切换标题高亮
  // 参数 type 表示：当前点击菜单的类型
  changeTitleSelected = type => {
    const {titleSelectedStatus,selectedValues} = this.state
    const newTitleSlectedStatus = {...titleSelectedStatus}
    Object.keys(titleSelectedStatus).forEach(key => {
      const selectVal = selectedValues[key]
      if(key === type) {
        newTitleSlectedStatus[type] = true
      }else {
        const selectedType = this.getTitleSlectedStatus(key,selectVal)
        Object.assign(newTitleSlectedStatus,selectedType)
        // console.log(newTitleSlectedStatus);
      }
    })
    this.setState({
      // titleSelectedStatus: {
      //   ...this.state.titleSelectedStatus,
      //   [type]: true
      // },
      titleSelectedStatus: newTitleSlectedStatus,
      openType: type
    })
  }
  // 根据选中值与否高亮
  getTitleSlectedStatus = (key,selectVal) => {
    const newTitleSlectedStatus = {}
    
    if(key ==='area' && (selectVal.length === 3 || selectVal[0] === 'subway')) {
      newTitleSlectedStatus[key] = true
    }else if (key === 'mode' && selectVal[0] !== 'null') {
      newTitleSlectedStatus[key] = true
    }else if (key === 'price' && selectVal[0] !== 'null') {
      newTitleSlectedStatus[key] = true
    }else if(key === 'more' && selectVal.length > 0) {
      newTitleSlectedStatus[key] = true
    }else {
      newTitleSlectedStatus[key] = false
    }
    return newTitleSlectedStatus

  }

  // 隐藏对话框
  onCancel = (type) => {
    const selectVal = this.state.selectedValues[type]
    const newTitleSlectedStatus = this.getTitleSlectedStatus(type,selectVal)
    this.setState({
      openType: '',
      titleSelectedStatus:{...this.state.titleSelectedStatus,...newTitleSlectedStatus}
    })
  }

  // 保存数据
  onSave = (value,type) => {
    // console.log(value,type);
    const newTitleSlectedStatus = this.getTitleSlectedStatus(type,value)
    const newSelectedValues = {
      ...this.state.selectedValues,
      [type]:value
    }
    this.setState({
      openType: '',
      selectedValues: newSelectedValues,
      titleSelectedStatus:{...this.state.titleSelectedStatus,...newTitleSlectedStatus}
    })
    // console.log(this.state.selectedValues, newSelectedValues);
    const filters = {}
    const area = newSelectedValues.area
    const areaKey = area[0]
    let areaValue
    if(area.length === 2) {
      areaValue = 'null'
    } else if (area.length === 3) {
      areaValue = area[2] === 'null' ? area[1] : area[2]
    }
    filters[areaKey] = areaValue
    filters.rentType = newSelectedValues.mode[0]
    filters.price = newSelectedValues.price[0]
    filters.more = newSelectedValues.more.join(',')
    this.props.onFilter(filters)
  }
  renderFilterMore = () => {
    const{openType,filterData:{roomType,oriented,floor,characteristic}} = this.state
    const data = {roomType,oriented,floor,characteristic}
    let defaultValue = this.state.selectedValues.more
    if(openType !== 'more') {
      return null
    }
    return (
      <FilterMore data={data} type={openType} onSave={this.onSave} defaultValue={defaultValue} onCancel={this.onCancel}/>
    )
  }
  render() {
    const { titleSelectedStatus, openType } = this.state

    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {openType === 'area' || openType === 'mode' || openType === 'price' ? (
          <div className={styles.mask} onClick={() => this.onCancel(openType)} />
        ) : null}

        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle
            titleSelectedStatus={titleSelectedStatus}
            onClick={this.changeTitleSelected}
          />

          {/* 前三个菜单对应的内容： */}
          {this.renderFilterPicker()}

          {/* 最后一个菜单对应的内容： */}
          {/* <FilterMore /> */}
          {this.renderFilterMore()}
        </div>
      </div>
    )
  }
}
