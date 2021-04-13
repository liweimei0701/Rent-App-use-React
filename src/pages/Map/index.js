import React from 'react'
// import './index.scss'
import styles from './index.module.css'
import NavHeader from '../../components/NavHeader'
import { getCurrentCity, API } from '../../utils'
// import axios from 'axios'
import {Toast} from 'antd-mobile'
const BMap = window.BMap
const labelStyle = {
    cursor: 'pointer',
    border: '0px solid rgb(255, 0, 0)',
    padding: '0px',
    whiteSpace: 'nowrap',
    fontSize: '12px',
    color: 'rgb(255, 255, 255)',
    textAlign: 'center'
  }
export default class Map extends React.Component {
  componentDidMount() {
   this.initMap()
  }
  async initMap () {
       // 创建百度地图对象
    // 参数：表示地图容器的id值
    const map = new BMap.Map('container')
    const {label,value} = await getCurrentCity()
    this.map = map
    // console.log(label);
    const myGeo = new BMap.Geocoder();
    
	// 将地址解析结果显示在地图上,并调整地图视野
	myGeo.getPoint(label, point => {
		if (point) {
			map.centerAndZoom(point, 11)
            map.addControl(new BMap.ScaleControl())
            map.addControl(new BMap.NavigationControl())
            this.renderOverlays(value)
            // const res = await axios.get('http://localhost:8080/area/map', {
            //     params: {
            //         id: value
            //     }
            // })
            // res.data.body.forEach(item => {
            //     // console.log(item);
            //     const {longitude,latitude} = item.coord
            //     const point = new BMap.Point(longitude, latitude)
            //     const opts = {
            //         position: point,
            //         offset: new BMap.Size(-35, -35) // 设置文本偏移量
            //     }
            //     // 创建文本标注对象
            //     var label = new BMap.Label('', opts)
            //     label.setContent(`
            //     <div class="${styles.bubble}">
            //       <p class="${styles.name}">${item.label}</p>
            //       <p>${item.count}套</p>
            //     </div>
            //   `)
            //   label.addEventListener('click', () => {
            //       console.log('被点击了')
            //   })
            //     // 自定义文本标注样式
            //     label.setStyle(labelStyle)
            //     map.addOverlay(label)
            // })
            
		}
	},label)
    // 设置地图中心点坐标
    // const point = new BMap.Point(116.404, 39.915)
    // const point = new BMap.Point(121.61833152747242, 31.040108832402957)
    // // 使用中心点坐标初始化地图
    // map.centerAndZoom(point, 18)
  }
  async renderOverlays (id) {
      Toast.loading('loading...', 0, null, false)
    const res = await API.get('/area/map', {
        params: {
            id
        }
    })
    Toast.hide()
    const {nextZoom, type} = this.getTypesAndZoom()
    res.data.body.forEach(item => {
        // const {longitude,latitude} = item.coord
        const {label,value,count,coord:{longitude,latitude}} = item
        const point = new BMap.Point(longitude, latitude)
        this.createOverlays(nextZoom,count,type,label,value,point)
            })
  }
  getTypesAndZoom () {
    const curZoom = this.map.getZoom()
    let nextZoom
    let type
    if(curZoom >=10 && curZoom < 12) {
        nextZoom = 13
        type = 'circle'
    }else if (curZoom >=12 && curZoom < 14) {
        nextZoom = 15
        type = 'circle'
    }else {
        type = 'rect'
    }
    return {nextZoom, type}
}
createOverlays(nextZoom,count,type,label,value,point) {
    if(type ==='rect') {
        this.createRect(label,count,value,point)
    }else {
        this.createCircle(label,count,value,point,nextZoom)
    }
}
createRect(name,count,id,point) {
  const opts = {
      position: point,
      offset: new BMap.Size(-50, -24) // 设置文本偏移量
  }
        // 创建文本标注对象
  var label = new BMap.Label('', opts)
  label.setContent(`
    <div class="${styles.rect}">
      <span class="${styles.housename}">${name}</span>
      <span class="${styles.housenum}">${count}套</span>
      <i class="${styles.arrow}"></i>
    </div>
  `)
  label.addEventListener('click', () => {
      console.log(id)
      })
    // 自定义文本标注样式
  label.setStyle(labelStyle)
  this.map.addOverlay(label)
}
createCircle(name,count,id,point,zoom) {
  const opts = {
      position: point,
      offset: new BMap.Size(-35, -35) // 设置文本偏移量
  }
        // 创建文本标注对象
  var label = new BMap.Label('', opts)
  label.setContent(`
    <div class="${styles.bubble}">
      <p class="${styles.name}">${name}</p>
      <p>${count}套</p>
    </div>
    `)
  label.addEventListener('click', () => {
      // console.log(id,zoom)
      this.renderOverlays(id)
      setTimeout(() => this.map.clearOverlays(),0)
      this.map.centerAndZoom(point,zoom)
      })
    // 自定义文本标注样式
  label.setStyle(labelStyle)
  this.map.addOverlay(label)
}
  render() {
    return (
      <div className={styles.map}>
        <NavHeader>地图找房</NavHeader>
        {/* 地图容器： */}
        <div id="container" className={styles.container} />
      </div>
    )
  }
}
