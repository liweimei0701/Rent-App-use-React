import React from 'react'
import {Carousel, Flex, Grid, WingBlank} from 'antd-mobile'
// import axios from 'axios'
import './index.scss'
import {Link} from 'react-router-dom'
import nav1 from '../../assets/images/nav-1.png'
import nav2 from '../../assets/images/nav-2.png'
import nav3 from '../../assets/images/nav-3.png'
import nav4 from '../../assets/images/nav-4.png'
import { getCurrentCity,BASE_URL, API } from '../../utils'
import SearchHeader from '../../components/SearchHeader'
const NavItems = [
  {name:'整租',path:'/home/list',img:nav1},
  {name:'合租',path:'/home/list',img:nav2},
  {name:'地图找房',path:'/map',img:nav3},
  {name:'去出租',path:'/rent/add',img:nav4}
]
const BMap = window.BMap
// const data = Array.from(new Array(4)).map((_val, i) => ({
//   icon: 'https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png',
//   text: `name${i}`,
// }));
// navigator.geolocation.getCurrentPosition(position => 
//   console.log(position))
export default class Index extends React.Component {
    state = {
        // data: ['1', '2', '3'],
        swipers: [],
        group:[],
        news:[],
        cityName: '定位',
        isSwipersLoading: true,
        imgHeight: 235,
      }
      async getSwipers () {
        const res = await API.get('/home/swiper')
        this.setState({
          swipers: res.data.body,
          isSwipersLoading:false
        }) 
      }
      async getGroup (){
        const res = await API.get('/home/groups?area=AREA%7C88cff55c-aaa4-e2e0')
        this.setState({
          group: res.data.body
        })
      }
      async getNews (){
        const res = await API.get('/home/news?area=AREA%7C88cff55c-aaa4-e2e0')
        this.setState({
          news: res.data.body
        })
      }
      // async getCity () {
      //   const res = await axios.get ('http://localhost:8080/area/city?level=1')
      //   this.setState({
      //     cityName: res.data.body.label
      //   })
      // }
     async componentDidMount() {
        // simulate img loading
        // setTimeout(() => {
        //   this.setState({
        //     data: ['AiyWuByWklrrUDlFignR', 'TekJlZRVCjLFexlOCuWn', 'IJOtIlfsYdTyaDTRVrLI'],
        //   });
        // }, 100);
        this.getSwipers()
        this.getGroup()
        this.getNews()
        const curCity = await getCurrentCity()
        this.setState({
          cityName: curCity.label
         })
        // const myCity = new BMap.LocalCity()
        // myCity.get(async (result) => {
        //   const cityName = result.name
        //   const res = await axios.get ('http://localhost:8080/area/info?',{
        //     params: {
        //       name: cityName
        //     }
        //   })
        //   const { label, value } = res.data.body
        //   this.setState({
        //    cityName: label
        // })
        // localStorage.setItem('hkzf-city',JSON.stringify({label,value}))
        // })
      }
      renderSwipers(){
        return this.state.swipers.map(item => (
          <a
            key={item.id}
            href="http://www.alipay.com"
            style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
          >
            <img
              src={`${BASE_URL}${item.imgSrc}`}
              alt=""
              style={{ width: '100%', verticalAlign: 'top' }}
              onLoad={() => {
                // fire window resize event to change height
                window.dispatchEvent(new Event('resize'));
                this.setState({ imgHeight: 'auto' });
              }}
            />
          </a>
        ))
      }
      renderNav () {
        return NavItems.map(item =>
         <Flex.Item key={item.img}>
          <Link to={item.path}>
          <img src={item.img} alt=""/>
          <p>{item.name}</p>
          </Link>   
      </Flex.Item>)
      }
      renderGroup () {
        return (item) => 
        <Flex className='grid-item' justify='between' key={item.id}>
        <div>
          <p>{item.title}</p>
          <span>{item.desc}</span>
        </div>
        <div>
          <img src={`${BASE_URL}${item.imgSrc}`} alt=""/>
        </div>
        </Flex>
      }
      renderNews() {
        return this.state.news.map(item => (
          <div className="news-item" key={item.id}>
            <div className="imgwrap">
              <img
                className="img"
                src={`${BASE_URL}${item.imgSrc}`}
                alt=""
              />
            </div>
            <Flex className="content" direction="column" justify="between">
              <h3 className="title">{item.title}</h3>
              <Flex className="info" justify="between">
                <span>{item.from}</span>
                <span>{item.date}</span>
              </Flex>
            </Flex>
          </div>
        ))
      }
    
    render() {
        return (
            <div>
               <div className='swipe'> 
               <SearchHeader cityName={this.state.cityName}></SearchHeader>
              {
                 !this.state.isSwipersLoading &&  <Carousel
                 autoplay
                 infinite
                //  beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
                //  afterChange={index => console.log('slide to', index)}
               >
                 {this.renderSwipers()}
               </Carousel>
               }
              </div>
               <Flex className='nav'>
                {this.renderNav()}
               </Flex>
               <div className='group'>
                 <Flex className='group-title' justify='between'>
                   <h3>租房小组</h3>
                   <span>更多</span>
                 </Flex>
                 <Grid className='grid'
                       data={this.state.group} 
                       hasLine={false} 
                       square={false} 
                       activeStyle  
                       columnNum={2} 
                       renderItem={this.renderGroup()}/>
               </div>
               <div className="news">
                  <h3 className="group-title">最新资讯</h3>
                  <WingBlank size="md">{this.renderNews()}</WingBlank>
               </div>
            </div>
        )
    }
}