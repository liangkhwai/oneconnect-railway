import React from "react";

import { Layout, Menu, theme } from "antd";
import SiderLayout from "./Sider";
import Navbar from "./Navbar";
import { Link, Outlet } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
const { Header, Content, Footer, Sider } = Layout;

const DefaultLayout = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();


  return (
    <Layout style={{ minHeight: "100vh" }}>
      <SiderLayout />
      <Layout className="flex flex-col">
        {/* <Header style={{ padding: 0, background: colorBgContainer }} /> */}
        <Navbar />
        <Content style={{ margin: "24px 16px 0", flex: 1 }}>
          <div
            style={{
              padding: 24,
              height: "100%",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          <a
            href="https://www.gistda.or.th/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by GISTDA
          </a>
        </Footer>
      </Layout>
    </Layout>
  );
};
export default DefaultLayout;
