import { Menu, theme } from "antd";
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { UserButton, useUser } from "@clerk/clerk-react";

const NavbarMenu = () => {
  const items = [
    {
      key: "1",
      label: <UserButton showName />,
    },
  ];
  return <Menu className="justify-end" mode="horizontal" items={items} />;
};

export default NavbarMenu;
