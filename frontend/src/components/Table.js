import React from "react";
import { Table, Card } from "antd";
const columns = [
  {
    title: "Mutual Fund",
    dataIndex: "shortname",
    key: "shortname",
  },
  {
    title: "Ticker",
    dataIndex: "security",
    key: "security",
  },
  {
    title: "Position (10K)",
    dataIndex: "totalPosition10K",
    key: "totalPosition10K",
  },
  {
    title: "Purchase Price",
    dataIndex: "cost_price",
    key: "cost_price",
  },
  {
    title: "Last Price",
    dataIndex: "closing_price",
    key: "closing_price",
  },
  {
    title: "Current Market Value (M)",
    dataIndex: "totalMarketValueM",
    key: "totalMarketValueM",
  },
];

const AppTable = ({ currency, portfolioData }) => {
  const calculatedPortfolioData = portfolioData?.map((security) => {
    const totalPositionK = (security.position / 10000).toFixed(2);
    const totalValue = parseFloat(security.total_market_value);
    const totalValueM = (totalValue / 1_000_000).toFixed(2);

    return {
      ...security,
      totalPosition10K: `${totalPositionK}K`,
      totalMarketValueM: `${totalValueM}M`, // Cost
    };
  });
  return (
    <Card title={`Holdings (${currency})`} style={{ padding: "8px" }}>
      <Table
        loading={portfolioData == null}
        columns={columns}
        pagination={{ pageSize: 50 }}
        scroll={{ y: 55 * 5 }}
        dataSource={calculatedPortfolioData}
        rowKey="security"
      />
    </Card>
  );
};
export default AppTable;
