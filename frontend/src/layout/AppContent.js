import React, { useEffect, useState } from "react";
import { Layout, Row, Col, Card, Statistic } from "antd";
import AppTable from "../components/Table";
import LineChart from "../components/chart/LineChart";
import DoughnutChart from "../components/chart/DoughnutChart";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
const { Content } = Layout;

const AppContent = ({ dropdownText }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        let currency = dropdownText.toLowerCase();
        const response = await fetch(
          `http://127.0.0.1:8000/portfolio?portfolio_id=PEAFSGJPY&currency=${currency}`,
        );
        if (!response.ok) {
          throw new Error(`HTTP error: Status ${response.status}`);
        }
        let postsData = await response.json();
        setLoading(false);
        setData(postsData);
        setError(null);
      } catch (err) {
        setError(err.message);
        setData(null);
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, [dropdownText]);

  const portfolioSum = data?.reduce((sum, security) => {
    return sum + parseFloat(security.total_market_value);
  }, 0);

  const portfolioCost = data?.reduce((sum, security) => {
    return sum + parseFloat(security.total_cost);
  }, 0);

  const absChange = portfolioSum - portfolioCost;

  const percentChange = (absChange / portfolioCost) * 100;

  return (
    <Content
      style={{
        padding: "48px",
      }}
    >
      <div
        style={{
          padding: 0,
        }}
      >
        <Row gutter={[16, 16]} style={{ width: "100%", marginBottom: 16 }}>
          <Col span={6}>
            <Card title="Summary" style={{ height: "300px" }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} xl={24}>
                  <Statistic
                    title={`Net Asset Value (${dropdownText})`}
                    value={portfolioSum}
                    precision={2}
                    valueStyle={{ color: "#000000" }}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col xs={24} xl={12}>
                  <Statistic
                    title="Earnings"
                    value={absChange}
                    precision={2}
                    valueStyle={{
                      color: percentChange >= 0 ? "#3f8600" : "#cf1322",
                      fontSize: "22px",
                    }}
                  />
                </Col>
                <Col xs={24} xl={12}>
                  <Statistic
                    title="Earnings %"
                    value={percentChange}
                    precision={2}
                    valueStyle={{
                      color: percentChange >= 0 ? "#3f8600" : "#cf1322",
                      fontSize: "22px",
                    }}
                    prefix={
                      percentChange >= 0 ? (
                        <ArrowUpOutlined />
                      ) : (
                        <ArrowDownOutlined />
                      )
                    }
                    suffix="%"
                    style={{ paddingLeft: "20px" }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>

          <Col span={12}>
            <LineChart currency={dropdownText} />
          </Col>

          <Col span={6}>
            <DoughnutChart
              loading={loading}
              portfolioSum={portfolioSum}
              portfolioData={data}
            />
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ width: "100%" }}>
          <Col span={24}>
            <AppTable currency={dropdownText} portfolioData={data} />
          </Col>
        </Row>
      </div>
    </Content>
  );
};

export default AppContent;
