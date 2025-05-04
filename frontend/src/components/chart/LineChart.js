import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Card, Spin } from "antd";

// Register components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
);

const LineChart = ({ currency }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchPortfolioReturns = async () => {
      try {
        let apiCurrency = currency.toLowerCase();
        const response = await fetch(
          `http://127.0.0.1:8000/returns?portfolio_id=PEAFSGJPY&currency=${apiCurrency}`,
        );
        if (!response.ok) {
          throw new Error(`HTTP error: Status ${response.status}`);
        }
        let postsData = await response.json();
        setData(postsData);
        setError(null);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setData(null);
        setLoading(true);
      }
    };

    fetchPortfolioReturns();
  }, [currency]);
  const labels = data?.map((dat) => dat.Date);
  const totalData = data?.map((dat) => dat.Total);
  const testdata = {
    labels: labels,
    datasets: [
      {
        label: "Investment Growth",
        data: totalData,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      y: { beginAtZero: false },
    },
  };
  return (
    <Card
      title={`Investment Growth (${currency.toUpperCase()})`}
      className="w-full"
      style={{ height: "300px" }}
    >
      <div className="h-64 w-full" style={{ height: "200px", width: "100%" }}>
        {loading && data === null && <Spin />}
        {!loading && data !== null && (
          <Line data={testdata} options={options} />
        )}
      </div>
    </Card>
  );
};

export default LineChart;
