import React from 'react'
import {Flex} from 'antd-mobile'
import SearchHeader from '../../components/SearchHeader'
import Filter from './components/Filter'
import {API,getCurrentCity} from '../../utils'
import styles from './index.module.scss'
export default class HouseList extends React.Component {
    state = {
        list:[],
        count:0
    }
    filter = {}
    componentDidMount() {
        this.getSearchList()
    }
    onFilter = (filters) => {
        this.filter = filters
        // console.log(this.filter);
        this.getSearchList()
    }
    getSearchList = async () => {
       const {value} = getCurrentCity()
        const res = await API.get('/houses', {
            params:{
                ...this.filter,
                cityId:value,
                start:1,
                end:20
            }
        })
        // console.log(res);
        const {list,count} = res.data.body
        this.setState({
            list,
            count
        })
        // console.log(list,count);
    }
    render() {
        return (
            <div className={styles.root}>
                <Flex className={styles.listHeader}>
                <i className='iconfont icon-back' onClick={() => this.props.history.go(-1)}></i>
                <SearchHeader cityName='上海' className={styles.listSearch}></SearchHeader>
                </Flex>
                <Filter onFilter={this.onFilter}/>
            </div>
        )
    }
}