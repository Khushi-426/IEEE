// LineChart.js
import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import './LineChart.css'

const LineChart = ({ stockName }) => {
  const canvasRef = useRef(null); // Reference to the canvas
  const [chartData, setChartData] = useState([]); // Array of {datetime, close}
  const [error, setError] = useState(""); // For error handling

  useEffect(() => {
    if (!stockName) return;

    // Fetch historical time series data (not just one quote)
    const fetchData = async () => {
      try {
        setError(""); // Clear previous errors
        const response = await fetch(
          `https://api.twelvedata.com/time_series?symbol=${stockName}&interval=1day&apikey=c2f2da4c72db4d1d83e371cc66d718dc&outputsize=30`
        );
        const data = await response.json();

        if (data.status === "error" || data.code) {
          setError(data.message || "Something went wrong");
          return;
        }

        // Save only datetime and close price
        const extractedData = data.values.map(item => ({
          datetime: item.datetime,
          close: parseFloat(item.close),
        }));

        setChartData(extractedData.reverse()); // Reverse for oldest to newest
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch stock data");
      }
    };

    fetchData();
  }, [stockName]); // Re-run when stockName changes

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
            borderColor: 'blue',
            backgroundColor: 'lightblue',
            tension: 0.3, // smooth curves
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            ticks: {
              maxTicksLimit: 5,
            },
          },
        },
      },
    });

    // Cleanup chart on unmount or update
    return () => {
      chartInstance.destroy();
    };
  }, [chartData, stockName]);

  return (
    <div className="line-chart-container">
      <h2>
        Line Chart for {stockName || "No stock selected yet"}
      </h2>

      {error && <p>{error}</p>}

      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default LineChart;
