import React, { useEffect, useState } from 'react'
import {
  TheContent,
  TheSidebar,
  TheFooter,
  TheHeader
} from './index'

import { AuthConsumer, } from '../contexts/authContext'

const Login = React.lazy(() => import('../views/pages/login/Login'))


const TheLayout = () => {
  return (
    <AuthConsumer>
      {({ authenticated, user, permissions, idProp }) => (
        authenticated ? (
          < div className="c-app c-default-layout">
            {console.log('id', idProp)}
            <TheSidebar PERMISSIONS={permissions} />
            <div className="c-wrapper">
              <TheHeader />
              <div className="c-body">
                <TheContent PERMISSIONS={permissions} USER={user} />
              </div>
              <TheFooter />
            </div>
          </div>

        ) : <Login />
      )}
    </AuthConsumer >
  )
}

export default TheLayout