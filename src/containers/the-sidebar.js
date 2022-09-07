import React, { useState, useEffect, useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCreateElement,
  CSidebar,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarMinimizer,
  CSidebarNavDropdown,
  CSidebarNavItem,
  CSidebarBrand
} from '@coreui/react'
import logo from '../assets/icons/logo.png'
import { useHistory } from "react-router-dom";
import CIcon from "@coreui/icons-react";

import { PropertiesMenu } from './access-menu'
import homeMenu from './home-menu'
import { authContext } from '../contexts/authContext';
const TheSidebar = (props) => {

  const dispatch = useDispatch()
  const show = useSelector(state => state.sidebarShow)
  const { idProp, setIdProp } = useContext(authContext)
  const { PERMISSIONS, } = props

  const [menuHome, setMenuHome] = useState([])
  console.log('rerender');


  useEffect(() => {
    setMenuHome(homeMenu({ PERMISSIONS, }))
  }, [PERMISSIONS])

  const blackAdmin = () => {
    localStorage.removeItem("propertyid");
    setIdProp('')
  };

  return (
    <CSidebar show={show} onShowChange={(val) => dispatch({ type: 'set', sidebarShow: val })}>
      {/* <a href onClick={blackAdmin}><img src={logo} 
        className={"mx-auto d-block"} alt="logo" /></a> */}
      <CSidebarBrand
        className="d-md-down pos_rel bg-white"
        to="/manage-menu/dashboard"
        onClick={blackAdmin}
      >
        <CIcon className={"mx-auto d-block "} src={logo} />
      </CSidebarBrand>
      <CSidebarNav>
        <div style={{ color: '#6b6c6d', padding: 12, }}>
          <strong>THE HEAVEN</strong> - <strong style={{ color: '#818080', fontSize: '75%', }}>HOUSING ESTATE</strong>
        </div>
        {
          !idProp ?
            <CCreateElement
              items={menuHome}
              components={{
                CSidebarNavDivider,
                CSidebarNavDropdown,
                CSidebarNavItem,
                CSidebarNavTitle
              }}
            /> :
            <CCreateElement
              items={PropertiesMenu}
              components={{
                CSidebarNavDivider,
                CSidebarNavDropdown,
                CSidebarNavItem,
                CSidebarNavTitle
              }}
            />
        }

      </CSidebarNav>
      <CSidebarMinimizer className="c-d-md-down-none" />
    </CSidebar>
  )
}

export default React.memo(TheSidebar)