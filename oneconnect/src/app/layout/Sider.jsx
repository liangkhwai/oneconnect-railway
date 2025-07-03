import { Menu, Layout } from "antd";
import React from "react";
import SiderItem from "./components/SiderItem";
import { useUser } from "@clerk/clerk-react";

const { Sider } = Layout;
const SiderLayout = () => {
    const {user, isLoaded} = useUser()

    if(isLoaded){
        console.log(user)
    }

  return (
    <Sider
    //   collapsible
      breakpoint="lg"
      collapsedWidth="0"
      onBreakpoint={(broken) => {
        console.log(broken);
      }}
      onCollapse={(collapsed, type) => {
        console.log(collapsed, type);
      }}
    >
      <div className="demo-logo-vertical" />
      <SiderItem />
    </Sider>
  );
};
export default SiderLayout;
