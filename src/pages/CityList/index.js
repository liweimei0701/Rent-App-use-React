import React from 'react'
import {Toast} from 'antd-mobile'
import './index.scss'
import axios from 'axios'
import {getCurrentCity, setCity} from '../../utils'
import {List, AutoSizer} from 'react-virtualized'
import NavHeader from '../../components/NavHeader'
const INDEX_HEIGHT = 36
const CITY_NAME_HEIGHT = 50
const formatCityList = (list) => {
    const cityList = {}
    // const cityIndex = []
    list.forEach(item => {
        const firstLetter = item.short[0]
        if(firstLetter in cityList) {
            cityList[firstLetter].push(item)
        }else {
            cityList[firstLetter] = [item]
        }
    })
    const cityIndex = Object.keys(cityList).sort()
    return {
        cityList,
        cityIndex
    }
}
const formatCityIndex = (letter) => {
    switch (letter) {
        case '#':
        return '当前定位'
        case 'hot':
            return '热门城市'
        default:
            return letter.toUpperCase()
    }
}
const CITY_HAS_HOUSE = ['北京','上海','广州','深圳']
// const list =Array.from(new Array(10000)).map((item,index) => `${index} -组件列表项`)
export default class CityList extends React.Component {
    state = {
        cityList: {},
        cityIndex: [],
        activeIndex: 0
    }
    listRef = React.createRef()
    async componentDidMount() {
       await this.fetchCityList ()
        this.listRef.current.measureAllRows()
    }
    changeCity = ({label, value}) => {
        if(CITY_HAS_HOUSE.indexOf(label)>-1) {
            setCity({label,value})
            this.props.history.go(-1)
        }else {
            Toast.info('暂无房源',1,false)
        }
    }
    rowRenderer = ({ key,  index,  style, }) => {
        const {cityIndex, cityList} = this.state
        const letter = cityIndex[index]
        const list = cityList[letter]
        // console.log(list)
        return (
          <div key={key} style={style} className='city'>
              <div className="title">{formatCityIndex(letter)}</div>
              {
                  list.map(item => <div key={item.value} className='name'
                   onClick={() => {this.changeCity(item)}}>{item.label}</div>)
              }
          </div>
        )
      }
    calcHeight = ({index}) => {
        const {cityIndex, cityList} = this.state
        const letter = cityIndex[index]
        const list = cityList[letter]
        return INDEX_HEIGHT + CITY_NAME_HEIGHT*list.length
    }
    goToCityIndex = (index) => {
        // console.log(index);
        this.listRef.current.scrollToRow(index)
    }
    async fetchCityList () {
        const res = await axios.get('http://localhost:8080/area/city?level=1')
        const {cityList, cityIndex} = formatCityList(res.data.body)
        const hotRes = await axios.get('http://localhost:8080/area/hot')
        cityIndex.unshift('hot')
        cityList['hot'] = hotRes.data.body
        const curCity = await getCurrentCity()
        cityIndex.unshift('#')
        cityList['#'] = [curCity]
        // console.log(cityList)
        this.setState({
            cityList,
            cityIndex
        })
    }
    renderCityIndex () {
        const {cityIndex,activeIndex} = this.state
        return  (
             cityIndex.map ((item,index) => 
                 <li className="city-index-item" key={item} onClick={() => this.goToCityIndex(index)}>
                     <span className={index === activeIndex ? "index-active" : ''}>{item ==='hot' ? item = '热' : item.toUpperCase()}</span>
                 </li>
        )       
       )
    }
    onRowsRendered = ({startIndex}) => {
        if(this.state.activeIndex !== startIndex) {
            this.setState({
                activeIndex: startIndex
            })
        }
    }
    render () {
        return (
            <div className='citylist'>
                  <NavHeader>城市选择</NavHeader>
                   <AutoSizer>
                       {
                           ({width,height}) => 
                           <List
                           ref={this.listRef}
                           width={width}
                           height={height}
                           rowCount={this.state.cityIndex.length}
                           rowHeight={this.calcHeight}
                           rowRenderer={this.rowRenderer}
                           onRowsRendered={this.onRowsRendered}
                           scrollToAlignment='start'
                            />
                       }
                   </AutoSizer>
                   <ul className="city-index">
                       {
                           this.renderCityIndex()
                       }
                   </ul>
            </div>
        )
    }
}