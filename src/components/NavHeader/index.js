import React from 'react'
import {NavBar} from 'antd-mobile'
import {withRouter} from 'react-router-dom'
import PropTypes from 'prop-types'
// import './index.scss'
// import styles from './index.module.css'
import styles from './index.module.scss'
// console.log(styles);
function NavHeader({children,history}) {
    return (
        <NavBar
        className={styles.navBar}
         mode="light"
         icon={<i className='iconfont icon-back'/>}
         onLeftClick={() => history.go(-1)}
         >{children}</NavBar>
       )
}
NavHeader.propTypes = {
  children: PropTypes.string.isRequired
}
export default withRouter(NavHeader)