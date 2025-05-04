import { Layout } from "antd";
const { Footer } = Layout;
const AppFooter = () => {
  return (
    <Footer style={{ textAlign: "center", flexShrink: 0 }}>
      ©{new Date().getFullYear()} Created by Lydia Ong
    </Footer>
  );
};

export default AppFooter;
