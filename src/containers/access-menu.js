import React from "react";


let propertyid = localStorage.getItem("propertyid");

export let PropertiesMenu = [
  {
    _tag: "CSidebarNavTitle",
    _children: ["Properties Menu"],
  },
  
  {
    _tag: "CSidebarNavItem",
    name: "ยูนิต",
    icon: <i className="c-sidebar-nav-icon fa fa-list" />,
    to: `/properties/${propertyid}/unit`,
  },
  
  {
    _tag: "CSidebarNavItem",
    name: "ลูกบ้าน",
    to: `/properties/${propertyid}/member`,
    icon: <i className="c-sidebar-nav-icon fa fa-user" />,
  },
  {
    _tag: "CSidebarNavItem",
    name: "ประกาศ",
    to: `/properties/${propertyid}/announcement`,
    icon: <i className="c-sidebar-nav-icon fa fa-bullhorn" />,
  },
  {
    _tag: "CSidebarNavDropdown",
    name: "แจ้งซ่อม",
    route: '/repaircommon',
    icon: <i className="c-sidebar-nav-icon fa fa-cog" />,
    _children: [
      {
        _tag: "CSidebarNavItem",
        name: "แจ้งซ่อมพื้นที่ส่วนกลาง",
        to: `/properties/${propertyid}/repaircommon`,
      },
      {
        _tag: "CSidebarNavItem",
        name: "แจ้งซ่อมพื้นที่ส่วนตัว",
        to: `/properties/${propertyid}/repairprivate`,
      },
    ],
  },
  {
    _tag: "CSidebarNavItem",
    name: "สมุดโทรศัพท์",
    to: `/properties/${propertyid}/phonedirectory`,
    icon: <i className="c-sidebar-nav-icon fa fa-phone" />,
  },
  {
    _tag: "CSidebarNavDropdown",
    name: "พื้นที่ส่วนกลาง",
    route: '/facility',
    icon: <i className="c-sidebar-nav-icon fa fa-star" />,
    _children: [
      {
        _tag: "CSidebarNavItem",
        name: "พื้นที่ส่วนกลาง",
        to: `/properties/${propertyid}/facilityzone`,
      },
      {
        _tag: "CSidebarNavItem",
        name: "จองพื้นที่ส่วนกลาง",
        to: `/properties/${propertyid}/facilitybook`,
      },
    ],
  },
  {
    _tag: "CSidebarNavDropdown",
    name: "แบบสอบถาม",
    route: '/survey',
    icon: <i className="c-sidebar-nav-icon fa fa-question-circle-o" />,
    _children: [
      {
        _tag: "CSidebarNavItem",
        name: "แบบสอบถาม",
        to: `/properties/${propertyid}/survey`,
      },
      {
        _tag: "CSidebarNavItem",
        name: "ผลแบบสอบถาม",
        to: `/properties/${propertyid}/surveyanswer`,
      },
    ],
  },
  {
    _tag: "CSidebarNavItem",
    name: "กระทู้",
    to: `/properties/${propertyid}/information`,
    icon: <i className="c-sidebar-nav-icon fa fa-inbox" />,
  },
  {
    _tag: "CSidebarNavDropdown",
    name: "ค่าใช้จ่าย",
    route: '/expenses',
    icon: <i className="c-sidebar-nav-icon fa fa-money" />,
    _children: [
      {
        _tag: "CSidebarNavItem",
        name: "ใบแจ้งหนี้ค้างชำระ",
        to: `/properties/${propertyid}/expenses`,
      },
      {
        _tag: "CSidebarNavItem",
        name: "ตรวจสอบการชำระเงิน",
        to: `/properties/${propertyid}/transferproof`,
      },
      {
        _tag: "CSidebarNavItem",
        name: "ใบเสร็จ",
        to: `/properties/${propertyid}/receipt`,
      },
    ],
  },
  {
    _tag: "CSidebarNavItem",
    name: "พัสดุไปรษณีย์",
    to: `/properties/${propertyid}/mailparcel`,
    icon: <i className="c-sidebar-nav-icon fa fa-archive" />,
  },
];

export const changePropertiesId = (id) => {
  PropertiesMenu = [
    {
      _tag: "CSidebarNavTitle",
      _children: ["Properties Menu"],
    },
    {
        _tag: "CSidebarNavItem",
        name: "ยูนิต",
        icon: <i className="c-sidebar-nav-icon fa fa-list" />,
        to: `/properties/${id}/unit`,
      },
      
      {
        _tag: "CSidebarNavItem",
        name: "ลูกบ้าน",
        to: `/properties/${id}/member`,
        icon: <i className="c-sidebar-nav-icon fa fa-user" />,
      },
      {
        _tag: "CSidebarNavItem",
        name: "ประกาศ",
        to: `/properties/${id}/announcement`,
        icon: <i className="c-sidebar-nav-icon fa fa-bullhorn" />,
      },
      {
        _tag: "CSidebarNavDropdown",
        name: "แจ้งซ่อม",
        route: '/repaircommon',
        icon: <i className="c-sidebar-nav-icon fa fa-cog" />,
        _children: [
          {
            _tag: "CSidebarNavItem",
            name: "แจ้งซ่อมพื้นที่ส่วนกลาง",
            to: `/properties/${id}/repaircommon`,
          },
          {
            _tag: "CSidebarNavItem",
            name: "แจ้งซ่อมพื้นที่ส่วนตัว",
            to: `/properties/${id}/repairprivate`,
          },
        ],
      },
      {
        _tag: "CSidebarNavItem",
        name: "สมุดโทรศัพท์",
        to: `/properties/${id}/phonedirectory`,
        icon: <i className="c-sidebar-nav-icon fa fa-phone" />,
      },
      {
        _tag: "CSidebarNavDropdown",
        name: "พื้นที่ส่วนกลาง",
        route: '/facility',
        icon: <i className="c-sidebar-nav-icon fa fa-star" />,
        _children: [
          {
            _tag: "CSidebarNavItem",
            name: "พื้นที่ส่วนกลาง",
            to: `/properties/${id}/facilityzone`,
          },
          {
            _tag: "CSidebarNavItem",
            name: "จองพื้นที่ส่วนกลาง",
            to: `/properties/${id}/facilitybook`,
          },
        ],
      },
      {
        _tag: "CSidebarNavDropdown",
        name: "แบบสอบถาม",
        route: '/survey',
        icon: <i className="c-sidebar-nav-icon fa fa-question-circle-o" />,
        _children: [
          {
            _tag: "CSidebarNavItem",
            name: "แบบสอบถาม",
            to: `/properties/${id}/survey`,
          },
          {
            _tag: "CSidebarNavItem",
            name: "ผลแบบสอบถาม",
            to: `/properties/${id}/surveyanswer`,
          },
        ],
      },
      {
        _tag: "CSidebarNavDropdown",
        name: "ค่าใช้จ่าย",
        route: '/expenses',
        icon: <i className="c-sidebar-nav-icon fa fa-money" />,
        _children: [
          {
            _tag: "CSidebarNavItem",
            name: "ใบแจ้งหนี้ค้างชำระ",
            to: `/properties/${id}/expenses`,
          },
          {
            _tag: "CSidebarNavItem",
            name: "ตรวจสอบการชำระเงิน",
            to: `/properties/${id}/transferproof`,
          },
          {
            _tag: "CSidebarNavItem",
            name: "ใบเสร็จ",
            to: `/properties/${id}/receipt`,
          },
        ],
      },
      
      {
        _tag: "CSidebarNavItem",
        name: "กระทู้",
        to: `/properties/${id}/information`,
        icon: <i className="c-sidebar-nav-icon fa fa-inbox" />,
      },
      {
        _tag: "CSidebarNavItem",
        name: "พัสดุไปรษณีย์",
        to: `/properties/${id}/mailparcel`,
        icon: <i className="c-sidebar-nav-icon fa fa-archive" />,
      },
     
         
  ];
};
