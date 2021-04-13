import React from 'react'
import {Redirect, Route} from 'react-router-dom'
import Index from '../Index'
import Profile from '../Profile'
import HouseList from '../HouseList'
import News from '../News'
import { TabBar } from 'antd-mobile'
import './index.scss'
const HomeItems = [
    {title:'首页',icon:'icon-ind',path:'/home'},
    {title:'找房',icon:'icon-findHouse',path:'/home/list'},
    {title:'咨询',icon:'icon-infom',path:'/home/news'},
    {title:'我的',icon:'icon-my',path:'/home/profile'}
]
export default class Home extends React.Component {
    state = {
        selectedTab: this.props.location.pathname,
        hidden: false,
        // fullScreen: false,
      }
      componentDidUpdate (prevprops){
        if (this.props.location.pathname !== prevprops.location.pathname) {
          this.setState({
            selectedTab: this.props.location.pathname
          })
        }
      }
      renderHomeItems = () => {
          return HomeItems.map(item => <TabBar.Item
            title={item.title}
            key={item.path}
            icon={
                <i className= {`iconfont ${item.icon}`}></i>
            }
            selectedIcon={ <i className= {`iconfont ${item.icon}`}></i>
            }
            selected={this.state.selectedTab === item.path}
            onPress={() => {
                this.props.history.push(item.path)
              // this.setState({
              //   selectedTab: item.path,
              // })
            }}
          >
          </TabBar.Item>)
      }
    render () {
        return (
            <div className='home'>
              <Route exact path='/' render={() => <Redirect to='/home'/>}></Route>
                <Route exact path='/home' component={Index}></Route>
                <Route path='/home/profile' component={Profile}></Route>
                <Route path='/home/list' component={HouseList}></Route>
                <Route path='/home/news' component={News}></Route>
        <div className='positionBottom'>
           <TabBar
          unselectedTintColor="#949494"
          tintColor="#33A3F4"
          barTintColor="white"
          noRenderContent ={true}
        //   hidden={this.state.hidden}
        >
            {this.renderHomeItems()}
        </TabBar>
        </div>
            </div>
        )
    }
}