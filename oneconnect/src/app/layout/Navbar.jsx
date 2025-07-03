import { Layout } from "antd";
import NavbarMenu from "./components/NavbarMenu";
const { Header } = Layout;
const Navbar = () => {
  return (
    <Header style={{ padding: 0 }}>
      <NavbarMenu />
    </Header>
  );
};

export default Navbar;
