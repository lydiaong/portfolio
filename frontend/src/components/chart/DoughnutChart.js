// DoughnutChart.js
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Card, Spin, Typography } from "antd";
const { Text } = Typography;
// Register required elements
ChartJS.register(ArcElement, Tooltip, Legend);

const options = {
  // responsive: true,
  maintainAspectRatio: false,
  plugins: {
    responsive: true,
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          const value = context.parsed;
          return `${value}%`;
        },
      },
    },
  },
};

const DoughnutChart = ({ portfolioSum, portfolioData }) => {
  const labels = portfolioData?.map((security) => security?.security);

  const portfolioAllocation = portfolioData?.map((security) => {
    const value = parseFloat(security.total_market_value);
    const percent = (value / portfolioSum) * 100;
    return percent.toFixed(1);
  });
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Asset Allocation",
        data: portfolioAllocation,
        backgroundColor: [
          "#36A2EB",
          "#FF6384",
          "#FFCE56",
          "#4BC0C0",
          "#d9ead3",
          "#cfe2f3",
        ],
        borderWidth: 1,
      },
    ],
  };
  return (
    <Card
      title="Portfolio Allocation"
      className="w-full"
      style={{ height: "300px" }}
    >
      <div className="h-64 w-full" style={{ height: "200px", width: "100%" }}>
        {portfolioData === null && <Spin />}
        {portfolioData && <Doughnut data={data} options={options} />}
      </div>
      <Text
        type="secondary"
        style={{ fontSize: "12px", display: "inline-block" }}
      >
        * Hover for values
      </Text>
    </Card>
  );
};

export default DoughnutChart;
