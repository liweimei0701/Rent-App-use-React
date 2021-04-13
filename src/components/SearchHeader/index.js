import React from 'react'
import {Flex} from 'antd-mobile'
import {withRouter} from 'react-router-dom'
import PropTypes from 'prop-types'
import styles from './index.module.scss'
 function SearchHeader ({cityName, history, className}) {
   return (
    <Flex className={[styles.root,className].join(' ')}>
    <Flex className={styles.search}>
      <div className={styles.searchLeft} onClick={() => history.push('/citylist')}>
        <span>{cityName}</span>
        <i className='iconfont icon-arrow'></i>
      </div>
      <div className={styles.searchRight} onClick={() => history.push('/search')}>
        <i className='iconfont icon-seach'></i>
        <span>请输入城市或地址</span>
      </div>
    </Flex>
    <i className='iconfont icon-map' onClick={() => history.push('/map')}></i>
  </Flex>
   )
}
SearchHeader.propTypes = {
    cityName:PropTypes.string.isRequired,
    className:PropTypes.string
}
SearchHeader.defaultProps = {
    className:''
}
export default withRouter(SearchHeader)