import { Layout, Typography, Avatar } from "antd";
import DropdownBtn from "../components/Dropdown";
import { UserOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;
const { Header } = Layout;

const AppHeader = ({ dropdownText, setDropdownText }) => (
  <Header
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <Title
      level={3}
      style={{
        color: "white",
        display: "inline-block",
      }}
    >
      Your Portfolio - PEAFSGJPY
    </Title>

    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <Avatar size="default" icon={<UserOutlined />} className="bg-blue-500" />
      <Text style={{ color: "white" }}>Lydia Ong</Text>
      <DropdownBtn
        dropdownText={dropdownText}
        setDropdownText={setDropdownText}
      />
    </div>
  </Header>
);

export default AppHeader;
