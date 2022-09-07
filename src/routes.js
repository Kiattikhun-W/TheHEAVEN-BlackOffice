import React from "react"

const routes = [
  { key: 'properties-unit', name: "Unit", path: "/properties/:idp/unit", component: React.lazy(() => import("./views/menu/unit")) },
  { key: 'properties-member', name: "Member", path: "/properties/:idp/member", component: React.lazy(() => import("./views/menu/member")) },
  { key: 'properties-repair-commmon', name: "Repair Common", path: "/properties/:idp/repaircommon", component: React.lazy(() => import("./views/menu/common-repair")) },
  { key: 'properties-private-repair', name: "Private Repair", path: "/properties/:idp/repairprivate", component: React.lazy(() => import("./views/menu/private-repair")) },
  { key: 'properties-phone-directory', name: "Phone Directory", path: "/properties/:idp/phonedirectory", component: React.lazy(() => import("./views/menu/phone-directory")) },
  { key: 'properties-facility-zone', name: "Facility Zone", path: "/properties/:idp/facilityzone", component: React.lazy(() => import("./views/menu/facility-zone")) },
  { key: 'properties-facility-booking', name: "Facility Book", path: "/properties/:idp/facilitybook", component: React.lazy(() => import("./views/menu/facility-book")) },
  { key: 'properties-survey', name: "Survey", path: "/properties/:idp/survey", component: React.lazy(() => import("./views/menu/survey")) },
  { key: 'properties-survey-answer', name: "Answer", path: "/properties/:idp/surveyanswer", component: React.lazy(() => import("./views/menu/survey-answer")) },
  { key: 'properties-expenses', name: "Expenses", path: "/properties/:idp/expenses", component: React.lazy(() => import("./views/menu/expenses")) },
  { key: 'properties-mail-parcel', name: "Mail Parcel", path: "/properties/:idp/mailparcel", component: React.lazy(() => import("./views/menu/mail-parcel")) },
  { key: 'properties-information', name: "Information", path: "/properties/:idp/information", component: React.lazy(() => import("./views/menu/information")) },
  { key: 'properties-receipt', name: "Receipt", path: "/properties/:idp/receipt", component: React.lazy(() => import("./views/menu/receipt")) },
  { key: 'properties-transfer-proof', name: "TransferProof", path: "/properties/:idp/transferproof", component: React.lazy(() => import("./views/menu/transfer-proof")) },
  { key: 'properties-announcement', name: "Announcement", path: "/properties/:idp/announcement", component: React.lazy(() => import("./views/menu/announcement")) },


  { key: 'manage-menu', name: "Properties", path: "/manage-menu/properties", component: React.lazy(() => import("./views/menu/properties")) },
  { key: 'manage-menu', name: "Dashboard", path: "/manage-menu/dashboard", component: React.lazy(() => import("./views/menu/dashboard")) },
  { key: 'setting-user', name: "User", path: "/setting/user", component: React.lazy(() => import("./views/setting/user")) },
  { key: 'setting-repair-zone', name: "Repair Zone", path: "/setting/repair-zone", component: React.lazy(() => import("./views/setting/repair-zone")) },
  { key: 'setting-repair-category', name: "Repair Category", path: "/setting/repair-category", component: React.lazy(() => import("./views/setting/repair-category")) },
  
  { path: "/", exact: true, name: "Home" },
]

export default routes