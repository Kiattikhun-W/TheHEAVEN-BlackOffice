import React from 'react'
import { Route, Switch } from 'react-router-dom'

const View = React.lazy(() => import('./view'))
const Insert = React.lazy(() => import('./insert'))
// const Update = React.lazy(() => import('./update'))

const Announcement = ({ match, session, }) => {
  const { permission_add, permission_edit, } = session.PERMISSION

  return (
    <Switch>
      {permission_add && <Route exact path={`${match.path}/insert`} render={props => <Insert {...props} {...session} />} />}
      {/* {permission_edit && <Route exact path={`${match.path}/update/:code`} render={props => <Update {...props} {...session} />} />} */}
      <Route path={`${match.path}`} render={props => <View {...props} {...session} />} />
    </Switch> 
  )
}

export default Announcement