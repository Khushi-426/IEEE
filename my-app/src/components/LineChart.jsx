import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import './LineChart.css';

const LineChart = ({ stockName }) => {
  const canvasRef = useRef(null);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!stockName) return;

    const fetchData = async () => {
      try {
        setError("");
        const response = await fetch(
          `https://api.twelvedata.com/time_series?symbol=${stockName}&interval=1day&apikey=c2f2da4c72db4d1d83e371cc66d718dc&outputsize=30`
        );
        const data = await response.json();

        if (data.status === "error" || data.code) {
          setError(data.message || "Something went wrong");
          return;
        }

        const extractedData = data.values.map(item => ({
          datetime: item.datetime,
          close: parseFloat(item.close),
        }));

        setChartData(extractedData.reverse());
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch stock data");
      }
    };

    fetchData();
  }, [stockName]);

  useEffect(() => {
    if (!chartData.length) return;

    const ctx = canvasRef.current;

    const chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: chartData.map(item => item.datetime),
        datasets: [
          {
            label: `${stockName} Closing Price`,
            data: chartData.map(item => item.close),
            borderColor: '#00cc66',
            backgroundColor: 'rgba(0, 255, 153, 0.2)',
            tension: 0.4,
            pointRadius: 3,
            pointBackgroundColor: '#00ff99',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: '#ffffff',
              font: {
                size: 14,
              },
            },
          },
          title: {
            display: true,
            text: `Stock Price Movement: ${stockName}`,
            color: '#ff4444',
            font: {
              size: 18,
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date',
              color: '#ff4444',
              font: {
                size: 16,
              },
            },
            ticks: {
              color: '#cccccc',
              maxTicksLimit: 6,
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Price (USD)',
              color: '#ff4444',
              font: {
                size: 16,
              },
            },
            ticks: {
              color: '#cccccc',
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
            },
          },
        },
      },
    });

    return () => {
      chartInstance.destroy();
    };
  }, [chartData, stockName]);

  return (
    <div className="chart-container">
      <h2 className="chart-title">
        {stockName ? `Line Chart for ${stockName}` : "No stock selected yet"}
      </h2>

      {error && <p className="chart-error">{error}</p>}

      <div style={{ height: '400px' }}>
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
};

export default LineChart;
