import React, { Suspense } from 'react'
import {
  Redirect,
  Route,
  Switch
} from 'react-router-dom'
import { CContainer, CFade } from '@coreui/react'

import routes from '../routes'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

const TheContent = ({ NOTIFY, PERMISSIONS, USER, }) => {
  const _generatePermission = (data) => PERMISSIONS.find(item => item.menu_name_en === data.key) || {
    permission_view: true,
    permission_add: true,
    permission_edit: true,
    permission_approve: true,
    permission_cancel: true,
    permission_delete: true,
  }

  return (
    <main className="c-main">
      <CContainer fluid>
        <Suspense fallback={loading}>
          <Switch>
            {routes.map((route, idx) => {
              let PERMISSION = _generatePermission({ key: route.key, })

              return route.component && PERMISSION.permission_view && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  render={props => (
                    <CFade>
                      <route.component {...props} session={{ NOTIFY, PERMISSION, USER, }} />
                    </CFade>
                  )}
                />
              )
            })}
            <Redirect from="/" to="/" />
          </Switch>
        </Suspense>
      </CContainer>
    </main>
  )
}

export default React.memo(TheContent)