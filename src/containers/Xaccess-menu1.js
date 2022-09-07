const accessMenu = ({ PERMISSIONS, NOTIFY = [] }) => {
  const demo_version = true
  const permissions = []
  const accounts = [], human_resources = [], masters = [], purchases = [], sales = [], stocks = [], reports = [], menus = []
  let propertyid = localStorage.getItem("propertyid");

  console.log('PER', permissions)

  PERMISSIONS.forEach(item => permissions[item.menu_name_en] = { permission_view: item.permission_view })

  if ((permissions['menu'] && permissions['menu'].permission_view) || demo_version) {
    menus.push({
      _tag: 'CSidebarNavItem',
      name: 'ยูนิต',
      to: `/properties/${propertyid}/unit`,
      icon: <i className="c-sidebar-nav-icon fa fa-home" />,
      exact: false,
    })
  }
  if ((permissions['maintain'] && permissions['maintain'].permission_view) || demo_version) {
    menus.push({
      _tag: 'CSidebarNavItem',
      name: 'สมาชิก',
      to: `/properties/${propertyid}/member`,
      icon: <i className="c-sidebar-nav-icon fa fa-user" />,
      exact: false,
    })
  }

  // if ((permissions['properties'] && permissions['properties'].permission_view) || demo_version) {
  //   menus.push({
  //   _tag: 'CSidebarNavItem',
  //   name: 'โครงการ',
  //   to: '/manage-menu/properties',
  //   icon: <i className="c-sidebar-nav-icon fa fa-user" />,
  //   exact: false,
  //   })
  // }

  // if ((permissions['account-stucture'] && permissions['account-stucture'].permission_view) || demo_version) {
  //   accounts.push({
  //     _tag: "CSidebarNavItem",
  //     name: "ผังบัญชี",
  //     to: "/account-stucture",
  //     icon: <i className="c-sidebar-nav-icon fa fa-book" />,
  //     exact: false,
  //   })
  // }

  // const finance_items = []
  // if ((permissions['billing-note-customer'] && permissions['billing-note-customer'].permission_view) || demo_version) {
  //   finance_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'วางบิล',
  //     to: '/finance/billing-note-customer',
  //     icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['billing-note-supplier'] && permissions['billing-note-supplier'].permission_view) || demo_version) {
  //   finance_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'รับวางบิล',
  //     to: '/finance/billing-note-supplier',
  //     icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['finance-debit'] && permissions['finance-debit'].permission_view) || demo_version) {
  //   finance_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'รับชำระหนี้',
  //     to: '/finance/finance-debit',
  //     icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['finance-credit'] && permissions['finance-credit'].permission_view) || demo_version) {
  //   finance_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'จ่ายชำระหนี้',
  //     to: '/finance/finance-credit',
  //     icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['expenses-note'] && permissions['expenses-note'].permission_view) || demo_version) {
  //   finance_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'ค่าใช้จ่ายอื่นๆ',
  //     to: '/finance/expenses-note',
  //     icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
  //     exact: false,
  //   })
  // }

  // finance_items.length && accounts.push({
  //   _tag: "CSidebarNavDropdown",
  //   name: "การเงิน",
  //   route: '/finance',
  //   icon: <i className="c-sidebar-nav-icon fa fa-list" />,
  //   _children: finance_items,
  // })

  // const journal_items = []
  // if ((permissions['journal-general'] && permissions['journal-general'].permission_view) || demo_version) {
  //   journal_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'สมุดรายวันทั่วไป',
  //     to: '/journal/journal-general',
  //     icon: <i className="c-sidebar-nav-icon fa fa-book" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['journal-cash-purchase'] && permissions['journal-cash-purchase'].permission_view) || demo_version) {
  //   journal_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'สมุดรายวันซื้อสด',
  //     to: '/journal/journal-cash-purchase',
  //     icon: <i className="c-sidebar-nav-icon fa fa-book" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['journal-credit-purchase'] && permissions['journal-credit-purchase'].permission_view) || demo_version) {
  //   journal_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'สมุดรายวันซื้อเชื่อ',
  //     to: '/journal/journal-credit-purchase',
  //     icon: <i className="c-sidebar-nav-icon fa fa-book" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['journal-cash-sale'] && permissions['journal-cash-sale'].permission_view) || demo_version) {
  //   journal_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'สมุดรายวันขายสด',
  //     to: '/journal/journal-cash-sale',
  //     icon: <i className="c-sidebar-nav-icon fa fa-book" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['journal-credit-sale'] && permissions['journal-credit-sale'].permission_view) || demo_version) {
  //   journal_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'สมุดรายวันขายเชื่อ',
  //     to: '/journal/journal-credit-sale',
  //     icon: <i className="c-sidebar-nav-icon fa fa-book" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['journal-credit-note-supplier'] && permissions['journal-credit-note-supplier'].permission_view) || demo_version) {
  //   journal_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'สมุดรายวันรับลดหนี้/ส่งคืน',
  //     to: '/journal/journal-credit-note-supplier',
  //     icon: <i className="c-sidebar-nav-icon fa fa-book" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['journal-debit-note-supplier'] && permissions['journal-debit-note-supplier'].permission_view) || demo_version) {
  //   journal_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'สมุดรายวันรับเพิ่มหนี้',
  //     to: '/journal/journal-debit-note-supplier',
  //     icon: <i className="c-sidebar-nav-icon fa fa-book" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['journal-credit-note-customer'] && permissions['journal-credit-note-customer'].permission_view) || demo_version) {
  //   journal_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'สมุดรายวันลดหนี้/รับคืน ลูกค้า',
  //     to: '/journal/journal-credit-note-customer',
  //     icon: <i className="c-sidebar-nav-icon fa fa-book" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['journal-debit-note-customer'] && permissions['journal-debit-note-customer'].permission_view) || demo_version) {
  //   journal_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'สมุดรายวันเพิ่มหนี้ลูกค้า',
  //     to: '/journal/journal-debit-note-customer',
  //     icon: <i className="c-sidebar-nav-icon fa fa-book" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['journal-cash-receipt'] && permissions['journal-cash-receipt'].permission_view) || demo_version) {
  //   journal_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'สมุดรายวันรับเงิน',
  //     to: '/journal/journal-cash-receipt',
  //     icon: <i className="c-sidebar-nav-icon fa fa-book" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['journal-cash-payment'] && permissions['journal-cash-payment'].permission_view) || demo_version) {
  //   journal_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'สมุดรายวันจ่ายเงิน',
  //     to: '/journal/journal-cash-payment',
  //     icon: <i className="c-sidebar-nav-icon fa fa-book" />,
  //     exact: false,
  //   })
  // }

  // journal_items.length && accounts.push({
  //   _tag: "CSidebarNavDropdown",
  //   name: "สมุดรายวัน (Journal)",
  //   route: '/journal',
  //   icon: <i className="c-sidebar-nav-icon fa fa-list" />,
  //   _children: journal_items,
  // })

  // const manage_bank_items = []
  // if ((permissions['cheque-receive'] && permissions['cheque-receive'].permission_view) || demo_version) {
  //   manage_bank_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'ทะเบียนเช็ครับ',
  //     to: '/manage-bank/cheque-receive',
  //     icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['cheque-pay'] && permissions['cheque-pay'].permission_view) || demo_version) {
  //   manage_bank_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'ทะเบียนเช็คจ่าย',
  //     to: '/manage-bank/cheque-pay',
  //     icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['book-bank'] && permissions['book-bank'].permission_view) || demo_version) {
  //   manage_bank_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'สมุดบัญชี',
  //     to: '/manage-bank/book-bank',
  //     icon: <i className="c-sidebar-nav-icon fa fa-book" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['bank'] && permissions['bank'].permission_view) || demo_version) {
  //   manage_bank_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'ธนาคาร',
  //     to: '/manage-bank/bank',
  //     icon: <i className="c-sidebar-nav-icon fa fa-bank" />,
  //     exact: false,
  //   })
  // }

  // manage_bank_items.length && accounts.push({
  //   _tag: "CSidebarNavDropdown",
  //   name: "จัดการธนาคาร",
  //   route: '/manage-bank',
  //   icon: <i className="c-sidebar-nav-icon fa fa-list" />,
  //   _children: manage_bank_items,
  // })

  // const manage_account_items = []
  // if ((permissions['account-setting'] && permissions['account-setting'].permission_view) || demo_version) {
  //   manage_account_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'บัญชีลงรายวัน',
  //     to: '/manage-account/account-setting',
  //     icon: <i className="c-sidebar-nav-icon fa fa-cog" />,
  //     exact: false,
  //   })
  // }

  // if ((permissions['debit-receipt'] && permissions['debit-receipt'].permission_view) || demo_version) {
  //   manage_account_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'วิธีการชำระ POS',
  //     to: '/manage-account/debit-receipt',
  //     icon: <i className="c-sidebar-nav-icon fa fa-cog" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['debit-receipt-type'] && permissions['debit-receipt-type'].permission_view) || demo_version) {
  //   manage_account_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'ประเภทการชำระ POS',
  //     to: '/manage-account/debit-receipt-type',
  //     icon: <i className="c-sidebar-nav-icon fa fa-cog" />,
  //     exact: false,
  //   })
  // }

  // if ((permissions['debit-account'] && permissions['debit-account'].permission_view) || demo_version) {
  //   manage_account_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'วิธีการรับชำระ',
  //     to: '/manage-account/debit-account',
  //     icon: <i className="c-sidebar-nav-icon fa fa-cog" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['credit-account'] && permissions['credit-account'].permission_view) || demo_version) {
  //   manage_account_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'วิธีการจ่ายชำระ',
  //     to: '/manage-account/credit-account',
  //     icon: <i className="c-sidebar-nav-icon fa fa-cog" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['paper-lock'] && permissions['paper-lock'].permission_view) || demo_version) {
  //   manage_account_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'ล็อกงวดบัญชี',
  //     to: '/manage-account/paper-lock',
  //     icon: <i className="c-sidebar-nav-icon fa fa-lock" />,
  //     exact: false,
  //   })
  // }

  // manage_account_items.length && accounts.push({
  //   _tag: "CSidebarNavDropdown",
  //   name: "จัดการบัญชี",
  //   route: '/manage-account',
  //   icon: <i className="c-sidebar-nav-icon fa fa-list" />,
  //   _children: manage_account_items,
  // })


  // if ((permissions['employee'] && permissions['employee'].permission_view) || demo_version) {
  //   human_resources.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'พนักงาน',
  //     to: '/human-resource/employee',
  //     icon: <i className="c-sidebar-nav-icon fa fa-id-card" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['employee-position'] && permissions['employee-position'].permission_view) || demo_version) {
  //   human_resources.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'ตำแหน่ง',
  //     to: '/human-resource/employee-position',
  //     icon: <i className="c-sidebar-nav-icon fa fa-suitcase" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['shift-work'] && permissions['shift-work'].permission_view) || demo_version) {
  //   human_resources.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'กะงาน',
  //     to: '/human-resource/shift-work',
  //     icon: <i className="c-sidebar-nav-icon fa fa-calendar" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['payroll-default'] && permissions['payroll-default'].permission_view) || demo_version) {
  //   human_resources.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'ตั้งค่าเงินเดือน',
  //     to: '/human-resource/payroll-default',
  //     icon: <i className="c-sidebar-nav-icon fa fa-money" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['salary-pay-slip'] && permissions['salary-pay-slip'].permission_view) || demo_version) {
  //   human_resources.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'ใบแจ้งเงินเดือน',
  //     to: '/human-resource/salary-pay-slip',
  //     icon: <i className="c-sidebar-nav-icon fa fa-credit-card" />,
  //     exact: false,
  //   })
  // }

  // const manage_company_items = []
  // if ((permissions['company-info'] && permissions['company-info'].permission_view) || demo_version) {
  //   manage_company_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'ข้อมูลบริษัท',
  //     to: '/manage-company/company-info',
  //     icon: <i className="c-sidebar-nav-icon fa fa-building-o" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['company-branch'] && permissions['company-branch'].permission_view) || demo_version) {
  //   manage_company_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'สาขาบริษัท',
  //     to: '/manage-company/company-branch',
  //     icon: <i className="c-sidebar-nav-icon fa fa-map-marker" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['department'] && permissions['department'].permission_view) || demo_version) {
  //   manage_company_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'แผนก/ฝ่าย',
  //     to: '/manage-company/department',
  //     icon: <i className="c-sidebar-nav-icon fa fa-users" />,
  //     exact: false,
  //   })
  // }

  // manage_company_items.length && masters.push({
  //   _tag: "CSidebarNavDropdown",
  //   name: "จัดการข้อมูลบริษัท",
  //   route: '/manage-company',
  //   icon: <i className="c-sidebar-nav-icon fa fa-list" />,
  //   _children: manage_company_items,
  // })

  // const manage_product_items = []
  // if ((permissions['product'] && permissions['product'].permission_view) || demo_version) {
  //   manage_product_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'รายการสินค้า',
  //     to: '/manage-product/product',
  //     icon: <i className="c-sidebar-nav-icon fa fa-cube" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['shortcut-product'] && permissions['shortcut-product'].permission_view) || demo_version) {
  //   manage_product_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'สินค้าขายบ่อย',
  //     to: '/manage-product/shortcut-product',
  //     icon: <i className="c-sidebar-nav-icon fa fa-cubes" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['product-group'] && permissions['product-group'].permission_view) || demo_version) {
  //   manage_product_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'กลุ่มสินค้า',
  //     to: '/manage-product/product-group',
  //     icon: <i className="c-sidebar-nav-icon fa fa-cubes" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['product-category'] && permissions['product-category'].permission_view) || demo_version) {
  //   manage_product_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'หมวดหมู่สินค้า',
  //     to: '/manage-product/product-category',
  //     icon: <i className="c-sidebar-nav-icon fa fa-cubes" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['product-type'] && permissions['product-type'].permission_view) || demo_version) {
  //   manage_product_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'ประเภทสินค้า',
  //     to: '/manage-product/product-type',
  //     icon: <i className="c-sidebar-nav-icon fa fa-cubes" />,
  //     exact: false,
  //   })
  // }

  // manage_product_items.length && masters.push({
  //   _tag: "CSidebarNavDropdown",
  //   name: "จัดการสินค้า",
  //   route: '/manage-product',
  //   icon: <i className="c-sidebar-nav-icon fa fa-list" />,
  //   _children: manage_product_items,
  // })

  // const manage_customer_items = []
  // if ((permissions['customer'] && permissions['customer'].permission_view) || demo_version) {
  //   manage_customer_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'ลูกค้า',
  //     to: '/manage-customer/customer',
  //     icon: <i className="c-sidebar-nav-icon fa fa-address-card-o" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['customer-type'] && permissions['customer-type'].permission_view) || demo_version) {
  //   manage_customer_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'ประเภทลูกค้า',
  //     to: '/manage-customer/customer-type',
  //     icon: <i className="c-sidebar-nav-icon fa fa-users" />,
  //     exact: false,
  //   })
  // }

  // manage_customer_items.length && masters.push({
  //   _tag: "CSidebarNavDropdown",
  //   name: "จัดการลูกค้า",
  //   route: '/manage-customer',
  //   icon: <i className="c-sidebar-nav-icon fa fa-list" />,
  //   _children: manage_customer_items,
  // })

  // const manage_supplier_items = []
  // if ((permissions['supplier'] && permissions['supplier'].permission_view) || demo_version) {
  //   manage_supplier_items.push({
  //     _tag: "CSidebarNavItem",
  //     name: "ผู้ขาย",
  //     to: "/manage-supplier/supplier",
  //     icon: <i className="c-sidebar-nav-icon fa fa-building-o" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['salesman'] && permissions['salesman'].permission_view) || demo_version) {
  //   manage_supplier_items.push({
  //     _tag: "CSidebarNavItem",
  //     name: "พนักงานขาย",
  //     to: "/manage-salesman/salesman",
  //     icon: <i className="c-sidebar-nav-icon fa fa-building-o" />,
  //     exact: false,
  //   })
  // }


  // manage_supplier_items.length && masters.push({
  //   _tag: "CSidebarNavDropdown",
  //   name: "จัดการผู้ขาย",
  //   route: '/manage-supplier',
  //   icon: <i className="c-sidebar-nav-icon fa fa-list" />,
  //   _children: manage_supplier_items,
  // })

  // const manage_user_items = []
  // if ((permissions['user'] && permissions['user'].permission_view) || demo_version) {
  //   manage_user_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'ผู้ใช้งานระบบ',
  //     to: '/manage-user/user',
  //     icon: <i className="c-sidebar-nav-icon fa fa-user" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['license'] && permissions['license'].permission_view) || demo_version) {
  //   manage_user_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'สิทธิ์การใช้งาน',
  //     to: '/manage-user/license',
  //     icon: <i className="c-sidebar-nav-icon fa fa-desktop" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['user-position'] && permissions['user-position'].permission_view) || demo_version) {
  //   manage_user_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'ตำแหน่ง',
  //     to: '/manage-user/user-position',
  //     icon: <i className="c-sidebar-nav-icon fa fa-cogs" />,
  //     exact: false,
  //   })
  // }

  // manage_user_items.length && masters.push({
  //   _tag: "CSidebarNavDropdown",
  //   name: "จัดการผู้ใช้",
  //   route: '/manage-user',
  //   icon: <i className="c-sidebar-nav-icon fa fa-list" />,
  //   _children: manage_user_items,
  // })

  // if ((permissions['purchase-request'] && permissions['purchase-request'].permission_view) || demo_version) {
  //   purchases.push({
  //     _tag: "CSidebarNavItem",
  //     name: "ขอซื้อสินค้า (PR)",
  //     to: "/purchase-request",
  //     icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
  //     exact: false,
  //     badge: {
  //       color: 'danger',
  //       text: NOTIFY.notify_purchase_requests && NOTIFY.notify_purchase_requests.length ? NOTIFY.notify_purchase_requests.length : '',
  //     },
  //   })
  // }
  // if ((permissions['purchase-order'] && permissions['purchase-order'].permission_view) || demo_version) {
  //   purchases.push({
  //     _tag: "CSidebarNavItem",
  //     name: "สั่งซื้อ (PO)",
  //     to: "/purchase-order",
  //     icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
  //     exact: false,
  //     badge: {
  //       color: 'danger',
  //       text: NOTIFY.notify_purchase_orders && NOTIFY.notify_purchase_orders.length ? NOTIFY.notify_purchase_orders.length : '',
  //     },
  //   })
  // }
  // if ((permissions['purchase-deposit'] && permissions['purchase-deposit'].permission_view) || demo_version) {
  //   purchases.push({
  //     _tag: "CSidebarNavItem",
  //     name: "จ่ายเงินมัดจำ",
  //     to: "/purchase-deposit",
  //     icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['invoice-supplier'] && permissions['invoice-supplier'].permission_view) || demo_version) {
  //   purchases.push({
  //     _tag: "CSidebarNavItem",
  //     name: "ใบรับสินค้า (RR)",
  //     to: "/invoice-supplier",
  //     icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
  //     exact: false,
  //     badge: {
  //       color: 'danger',
  //       text: NOTIFY.notify_invoice_suppliers && NOTIFY.notify_invoice_suppliers.length ? NOTIFY.notify_invoice_suppliers.length : '',
  //     },
  //   })
  // }
  // if ((permissions['credit-note-supplier'] && permissions['credit-note-supplier'].permission_view) || demo_version) {
  //   purchases.push({
  //     _tag: "CSidebarNavItem",
  //     name: "ใบรับลดหนี้/ส่งคืนสินค้า",
  //     to: "/credit-note-supplier",
  //     icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
  //     exact: false,
  //     badge: {
  //       color: 'danger',
  //       text: NOTIFY.notify_credit_note_suppliers && NOTIFY.notify_credit_note_suppliers.length ? NOTIFY.notify_credit_note_suppliers.length : '',
  //     },
  //   })
  // }
  // if ((permissions['debit-note-supplier'] && permissions['debit-note-supplier'].permission_view) || demo_version) {
  //   purchases.push({
  //     _tag: "CSidebarNavItem",
  //     name: "ใบรับเพิ่มหนี้",
  //     to: "/debit-note-supplier",
  //     icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['schedule-plan'] && permissions['schedule-plan'].permission_view) || demo_version) {
  //   purchases.push({
  //     _tag: "CSidebarNavItem",
  //     name: "รายการนัดหมาย",
  //     to: "/schedule-plan",
  //     icon: <i className="c-sidebar-nav-icon fa fa-clock-o" />,
  //     exact: false,
  //   })
  // }

  // const marketing_items = []
  // if ((permissions['promotion'] && permissions['promotion'].permission_view) || demo_version) {
  //   marketing_items.push({
  //     _tag: "CSidebarNavItem",
  //     name: "โปรโมชั่น",
  //     to: "/marketing/promotion",
  //     icon: <i className="c-sidebar-nav-icon fa fa-tag" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['points'] && permissions['points'].permission_view) || demo_version) {
  //   marketing_items.push({
  //     _tag: "CSidebarNavItem",
  //     name: "ระบบสะสมแต้ม",
  //     to: "/marketing/points",
  //     icon: <i className="c-sidebar-nav-icon fa fa-product-hunt" />,
  //     exact: false,
  //   })
  // }
  // marketing_items.length && sales.push({
  //   _tag: "CSidebarNavDropdown",
  //   name: "ส่งเสริมการขาย",
  //   route: '/marketing',
  //   icon: <i className="c-sidebar-nav-icon fa fa-tags" />,
  //   _children: marketing_items,
  // })

  // if ((permissions['quotation'] && permissions['quotation'].permission_view) || demo_version) {
  //   sales.push({
  //     _tag: "CSidebarNavItem",
  //     name: "ใบเสนอราคา",
  //     to: "/quotation",
  //     icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['sale-order'] && permissions['sale-order'].permission_view) || demo_version) {
  //   sales.push({
  //     _tag: "CSidebarNavItem",
  //     name: "ใบสั่งขาย",
  //     to: "/sale-order",
  //     icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['sale-deposit'] && permissions['sale-deposit'].permission_view) || demo_version) {
  //   sales.push({
  //     _tag: "CSidebarNavItem",
  //     name: "รับเงินมัดจำ",
  //     to: "/sale-deposit",
  //     icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['receipt'] && permissions['receipt'].permission_view) || demo_version) {
  //   sales.push({
  //     _tag: "CSidebarNavItem",
  //     name: "ใบเสร็จรับเงิน",
  //     to: "/receipt",
  //     icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['receipt-payment'] && permissions['receipt-payment'].permission_view) || demo_version) {
  //   sales.push({
  //     _tag: "CSidebarNavItem",
  //     name: "อนุมัติการโอน",
  //     to: "/receipt-payment",
  //     icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
  //     exact: false,
  //     badge: {
  //       color: 'danger',
  //       text: NOTIFY.notify_receipt_payments && NOTIFY.notify_receipt_payments.length ? NOTIFY.notify_receipt_payments.length : '',
  //     },
  //   })
  // }
  // if ((permissions['sale-cut-off'] && permissions['sale-cut-off'].permission_view) || demo_version) {
  //   sales.push({
  //     _tag: "CSidebarNavItem",
  //     name: "รายการส่งยอด",
  //     to: "/sale-cut-off",
  //     icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
  //     exact: false,
  //     badge: {
  //       color: 'danger',
  //       text: NOTIFY.notify_sale_cut_offs && NOTIFY.notify_sale_cut_offs.length ? NOTIFY.notify_sale_cut_offs.length : '',
  //     },
  //   })
  // }
  // if ((permissions['sale-close-shift'] && permissions['sale-close-shift'].permission_view) || demo_version) {
  //   sales.push({
  //     _tag: "CSidebarNavItem",
  //     name: "รายการปิดกะ",
  //     to: "/sale-close-shift",
  //     icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
  //     exact: false,
  //     badge: {
  //       color: 'danger',
  //       text: NOTIFY.notify_sale_close_shifts && NOTIFY.notify_sale_close_shifts.length ? NOTIFY.notify_sale_close_shifts.length : '',
  //     },
  //   })
  // }
  // if ((permissions['delivery-note'] && permissions['delivery-note'].permission_view) || demo_version) {
  //   sales.push({
  //     _tag: "CSidebarNavItem",
  //     name: "ใบส่งสินค้า",
  //     to: "/delivery-note",
  //     icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['invoice-customer'] && permissions['invoice-customer'].permission_view) || demo_version) {
  //   sales.push({
  //     _tag: "CSidebarNavItem",
  //     name: "ใบกำกับภาษี (IV)",
  //     to: "/invoice-customer",
  //     icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['credit-note-customer'] && permissions['credit-note-customer'].permission_view) || demo_version) {
  //   sales.push({
  //     _tag: "CSidebarNavItem",
  //     name: "ใบลดหนี้/รับคืนสินค้า",
  //     to: "/credit-note-customer",
  //     icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['debit-note-customer'] && permissions['debit-note-customer'].permission_view) || demo_version) {
  //   sales.push({
  //     _tag: "CSidebarNavItem",
  //     name: "ใบเพิ่มหนี้",
  //     to: "/debit-note-customer",
  //     icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
  //     exact: false,
  //   })
  // }

  // if ((permissions['stock-search'] && permissions['stock-search'].permission_view) || demo_version) {
  //   stocks.push({
  //     _tag: "CSidebarNavItem",
  //     name: "ค้นหาสินค้า",
  //     to: "/stock-search",
  //     icon: <i className="c-sidebar-nav-icon fa fa-search" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['stock-issue'] && permissions['stock-issue'].permission_view) || demo_version) {
  //   stocks.push({
  //     _tag: "CSidebarNavItem",
  //     name: "เบิกใช้สินค้า",
  //     to: "/stock-issue",
  //     icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['stock-move'] && permissions['stock-move'].permission_view) || demo_version) {
  //   stocks.push({
  //     _tag: "CSidebarNavItem",
  //     name: "โอนสินค้า",
  //     to: "/stock-move",
  //     icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
  //     exact: false,
  //     badge: {
  //       color: 'danger',
  //       text: NOTIFY.notify_stock_moves && NOTIFY.notify_stock_moves.length ? NOTIFY.notify_stock_moves.length : '',
  //     },
  //   })
  // }
  // if ((permissions['stock-pack'] && permissions['stock-pack'].permission_view) || demo_version) {
  //   stocks.push({
  //     _tag: "CSidebarNavItem",
  //     name: "รวมสินค้า",
  //     to: "/stock-pack",
  //     icon: <i className="c-sidebar-nav-icon fa fa-archive" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['stock-unpack'] && permissions['stock-unpack'].permission_view) || demo_version) {
  //   stocks.push({
  //     _tag: "CSidebarNavItem",
  //     name: "แยกสินค้า",
  //     to: "/stock-unpack",
  //     icon: <i className="c-sidebar-nav-icon fa fa-arrows" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['stock-change'] && permissions['stock-change'].permission_view) || demo_version) {
  //   stocks.push({
  //     _tag: "CSidebarNavItem",
  //     name: "เปลี่ยนสินค้า",
  //     to: "/stock-change",
  //     icon: <i className="c-sidebar-nav-icon fa fa-exchange" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['stock-group'] && permissions['stock-group'].permission_view) || demo_version) {
  //   stocks.push({
  //     _tag: "CSidebarNavItem",
  //     name: "คลังสินค้า",
  //     to: "/stock-group",
  //     icon: <i className="c-sidebar-nav-icon fa fa-cubes" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['stock-setting'] && permissions['stock-setting'].permission_view) || demo_version) {
  //   stocks.push({
  //     _tag: "CSidebarNavItem",
  //     name: "ตั้งค่าคลังสินค้า",
  //     to: "/stock-setting",
  //     icon: <i className="c-sidebar-nav-icon fa fa-gears" />,
  //     exact: false,
  //   })
  // }
  // const sales_items = []
  // if ((permissions['report-sale-01'] && permissions['report-sale-01'].permission_view) || demo_version) {
  //   sales_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'รายงานยอดขาย',
  //     to: '/report/report-sale/report-sale-01',
  //     icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['report-sale-02'] && permissions['report-sale-02'].permission_view) || demo_version) {
  //   sales_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'ยอดขายตามเขต',
  //     to: '/report/report-sale/report-sale-02',
  //     icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['report-sale-03'] && permissions['report-sale-03'].permission_view) || demo_version) {
  //   sales_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'ยอดขายรายเดือน',
  //     to: '/report/report-sale/report-sale-03',
  //     icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
  //     exact: false,
  //   })
  // }

  // sales_items.length && reports.push({
  //   _tag: "CSidebarNavDropdown",
  //   name: "ยอดขาย",
  //   route: '/report/report-sale',
  //   icon: <i className="c-sidebar-nav-icon fa fa-list" />,
  //   _children: sales_items,
  // })

  // const debtor_items = []
  // if ((permissions['report-debtor-01'] && permissions['report-debtor-01'].permission_view) || demo_version) {
  //   debtor_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'ใบกำกับภาษี',
  //     to: '/report/report-debtor/report-debtor-01',
  //     icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['report-debtor-02'] && permissions['report-debtor-02'].permission_view) || demo_version) {
  //   debtor_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'ใบวางบิล',
  //     to: '/report/report-debtor/report-debtor-02',
  //     icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['report-debtor-cn'] && permissions['report-debtor-cn'].permission_view) || demo_version) {
  //   debtor_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'ใบลดหนี้',
  //     to: '/report/report-debtor/report-debtor-cn',
  //     icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['report-debtor-dn'] && permissions['report-debtor-dn'].permission_view) || demo_version) {
  //   debtor_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'ใบเพิ่มหนี้',
  //     to: '/report/report-debtor/report-debtor-dn',
  //     icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['report-debtor-04'] && permissions['report-debtor-04'].permission_view) || demo_version) {
  //   debtor_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'รับชำระหนี้',
  //     to: '/report/report-debtor/report-debtor-04',
  //     icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['report-debtor-05'] && permissions['report-debtor-05'].permission_view) || demo_version) {
  //   debtor_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'ลูกหนี้คงค้าง',
  //     to: '/report/report-debtor/report-debtor-05',
  //     icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['report-debtor-06'] && permissions['report-debtor-06'].permission_view) || demo_version) {
  //   debtor_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'สถานะลูกหนี้',
  //     to: '/report/report-debtor/report-debtor-06',
  //     icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['report-debtor-07'] && permissions['report-debtor-07'].permission_view) || demo_version) {
  //   debtor_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'วิเคราะห์อายุลูกหนี้',
  //     to: '/report/report-debtor/report-debtor-07',
  //     icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['report-debtor-09'] && permissions['report-debtor-09'].permission_view) || demo_version) {
  //   debtor_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'รายละเอียดลูกค้า',
  //     to: '/report/report-debtor/report-debtor-09',
  //     icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
  //     exact: false,
  //   })
  // }

  // debtor_items.length && reports.push({
  //   _tag: "CSidebarNavDropdown",
  //   name: "ลูกหนี้",
  //   route: '/report/report-debtor',
  //   icon: <i className="c-sidebar-nav-icon fa fa-list" />,
  //   _children: debtor_items,
  // })

  // const creditor_items = []
  // if ((permissions['report-creditor-01'] && permissions['report-creditor-01'].permission_view) || demo_version) {
  //   creditor_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'ใบสั่งซื้อ',
  //     to: '/report/report-creditor/report-creditor-01',
  //     icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['report-creditor-02'] && permissions['report-creditor-02'].permission_view) || demo_version) {
  //   creditor_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'ใบรับสินค้า',
  //     to: '/report/report-creditor/report-creditor-02',
  //     icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['report-creditor-04'] && permissions['report-creditor-04'].permission_view) || demo_version) {
  //   creditor_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'การจ่ายชำระหนี้',
  //     to: '/report/report-creditor/report-creditor-04',
  //     icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['report-creditor-05'] && permissions['report-creditor-05'].permission_view) || demo_version) {
  //   creditor_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'เจ้าหนี้คงค้าง',
  //     to: '/report/report-creditor/report-creditor-05',
  //     icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['report-creditor-06'] && permissions['report-creditor-06'].permission_view) || demo_version) {
  //   creditor_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'สถานะเจ้าหนี้',
  //     to: '/report/report-creditor/report-creditor-06',
  //     icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['report-creditor-07'] && permissions['report-creditor-07'].permission_view) || demo_version) {
  //   creditor_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'วิเคราะห์อายุเจ้าหนี้',
  //     to: '/report/report-creditor/report-creditor-07',
  //     icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['report-creditor-09'] && permissions['report-creditor-09'].permission_view) || demo_version) {
  //   creditor_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'รายละเอียดผู้ขาย',
  //     to: '/report/report-creditor/report-creditor-09',
  //     icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
  //     exact: false,
  //   })
  // }

  // creditor_items.length && reports.push({
  //   _tag: "CSidebarNavDropdown",
  //   name: "เจ้าหนี้",
  //   route: '/report/report-creditor',
  //   icon: <i className="c-sidebar-nav-icon fa fa-list" />,
  //   _children: creditor_items,
  // })

  // const tax_items = []
  // if ((permissions['report-tax-01'] && permissions['report-tax-01'].permission_view) || demo_version) {
  //   tax_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'ภาษีซื้อ',
  //     to: '/report/report-tax/report-tax-01',
  //     icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['report-tax-02'] && permissions['report-tax-02'].permission_view) || demo_version) {
  //   tax_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'ภาษีขาย',
  //     to: '/report/report-tax/report-tax-02',
  //     icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
  //     exact: false,
  //   })
  // }
  // tax_items.length && reports.push({
  //   _tag: "CSidebarNavDropdown",
  //   name: "ภาษี",
  //   route: '/report/report-tax',
  //   icon: <i className="c-sidebar-nav-icon fa fa-list" />,
  //   _children: tax_items,
  // })

  // const stock_items = []
  // if ((permissions['report-stock-01'] && permissions['report-stock-01'].permission_view) || demo_version) {
  //   stock_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'สินค้าและวัตถุดิบ',
  //     to: '/report/report-stock/report-stock-01',
  //     icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['report-stock-02'] && permissions['report-stock-02'].permission_view) || demo_version) {
  //   stock_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'สินค้าคงเหลือ',
  //     to: '/report/report-stock/report-stock-02',
  //     icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['report-stock-03'] && permissions['report-stock-03'].permission_view) || demo_version) {
  //   stock_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'สรุปยอดเคลื่อนไหวสินค้า',
  //     to: '/report/report-stock/report-stock-03',
  //     icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
  //     exact: false,
  //   })
  // }
  // if ((permissions['report-stock-04'] && permissions['report-stock-04'].permission_view) || demo_version) {
  //   stock_items.push({
  //     _tag: 'CSidebarNavItem',
  //     name: 'รายละเอียดสินค้า',
  //     to: '/report/report-stock/report-stock-04',
  //     icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
  //     exact: false,
  //   })
  // }
  // stock_items.length && reports.push({
  //   _tag: "CSidebarNavDropdown",
  //   name: "สินค้าคงคลัง",
  //   route: '/report/report-stock',
  //   icon: <i className="c-sidebar-nav-icon fa fa-list" />,
  //   _children: stock_items,
  // })

  const navigations = []

  menus.length && navigations.push({ _tag: "CSidebarNavTitle", _children: ["Menu"], }, ...menus)

  sales.length && navigations.push({ _tag: "CSidebarNavTitle", _children: ["Sale"], }, ...sales)
  purchases.length && navigations.push({ _tag: "CSidebarNavTitle", _children: ["Purchase"], }, ...purchases)
  stocks.length && navigations.push({ _tag: "CSidebarNavTitle", _children: ["Stock"], }, ...stocks)
  human_resources.length && navigations.push({ _tag: "CSidebarNavTitle", _children: ["Human-Resource"], }, ...human_resources)
  accounts.length && navigations.push({ _tag: "CSidebarNavTitle", _children: ["Account"], }, ...accounts)
  masters.length && navigations.push({ _tag: "CSidebarNavTitle", _children: ["Master-Data"], }, ...masters)
  reports.length && navigations.push({ _tag: "CSidebarNavTitle", _children: ["Report"], }, ...reports)

  return navigations
}

export default accessMenu