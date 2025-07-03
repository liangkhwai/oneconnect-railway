import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import React from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";

const SiderItem = () => {
  const items = [
    {
      key: "1",
      icon: <UserOutlined />,
      label: <Link to="/">One Connect</Link>,
    },
    {
      key: "2",
      icon: <VideoCameraOutlined />,
      label: <Link to="/request-place">Map</Link>,
    },
  ];

  return (
    <Menu
      theme="dark"
      mode="inline"
      defaultSelectedKeys={["1"]}
      items={items}
    />
  );
};
export default SiderItem;
