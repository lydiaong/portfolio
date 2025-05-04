import { DownOutlined, MoneyCollectOutlined } from "@ant-design/icons";
import { Button, Dropdown, Space } from "antd";

const items = [
  {
    label: "SGD",
    key: "sgd",
  },
  {
    label: "JPY",
    key: "jpy",
  },
  {
    label: "USD",
    key: "usd",
  },
];

const DropdownBtn = ({ dropdownText, setDropdownText }) => {
  const handleMenuClick = (event) => {
    setDropdownText(event.key.toUpperCase());
  };
  const menuProps = {
    items,
    onClick: handleMenuClick,
  };
  return (
    <Dropdown menu={menuProps}>
      <Button data-testid="drop-down-button">
        <Space>
          <MoneyCollectOutlined />
          {dropdownText}
          <DownOutlined />
        </Space>
      </Button>
    </Dropdown>
  );
};

export default DropdownBtn;
