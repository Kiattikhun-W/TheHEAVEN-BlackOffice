const homeMenu = ({ PERMISSIONS, NOTIFY = [] }) => {
  const demo_version = true
  const permissions = []
  const menus = []
  const settings = []

  PERMISSIONS.forEach(item => permissions[item.menu_name_en] = { permission_view: item.permission_view })
  console.log('PER', permissions)

  if ((permissions['properties'] && permissions['properties'].permission_view) || demo_version) {
    menus.push({
      _tag: 'CSidebarNavItem',
      name: 'โครงการ',
      to: '/manage-menu/properties',
      icon: <i className="c-sidebar-nav-icon fa fa-home" />,
      exact: false,
    })
  }
  // if ((permissions['dashboard'] && permissions['dashboard'].permission_view) || demo_version) {
  //   menus.push({
  //   _tag: 'CSidebarNavItem',
  //   name: 'แดชบอร์ด',
  //   to: '/manage-menu/dashboard',
  //   icon: <i className="c-sidebar-nav-icon fa fa-user" />,
  //   exact: false,
  //   })
  // }
  const setting_items = []

  if ((permissions['setting-user'] && permissions['setting-user'].permission_view) || demo_version) {
    setting_items.push({
      _tag: "CSidebarNavItem",
      name: "ผู้ใช้",
      to: "/setting/user",
      icon: <i className="c-sidebar-nav-icon fa fa-user" />,
      exact: false,
    })
  }
  if ((permissions['setting-repair-zone'] && permissions['setting-repair-zone'].permission_view) || demo_version) {
    setting_items.push({
      _tag: "CSidebarNavItem",
      name: "พื้นที่ซ่อม",
      to: "/setting/repair-zone",
      icon: <i className="c-sidebar-nav-icon fa fa-hotel" />,
      exact: false,
    })
  }
  if ((permissions['setting-repair-category'] && permissions['setting-repair-category'].permission_view) || demo_version) {
    setting_items.push({
      _tag: "CSidebarNavItem",
      name: "หมวดหมู่การซ่อม",
      to: "/setting/repair-category",
      icon: <i className="c-sidebar-nav-icon fa fa-wrench" />,
      exact: false,
    })
  }
  if (setting_items.length) {
    menus.push({
      _tag: 'CSidebarNavDropdown',
      name: 'ตั้งค่า',
      route: '/setting',
      icon: <i className="c-sidebar-nav-icon fa fa-cog" />,
      _children: setting_items,
    })
  }


  const navigations = []

  menus.length && navigations.push({ _tag: "CSidebarNavTitle", _children: ["ADMIN"], }, ...menus)
  settings.length && navigations.push({ _tag: "CSidebarNavTitle", _children: ["SETTING"], }, ...settings)


  return navigations
}

export default homeMenu