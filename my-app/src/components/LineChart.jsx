import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import './LineChart.css';

const LineChart = ({ stockName }) => {
  const canvasRef = useRef(null);             
  const [chart, setChart] = useState(null);   
  const [data, setData] = useState([]);       
  const [error, setError] = useState("");     
  
  useEffect(() => {
    if (!stockName) return;

    const fetchStockData = async () => {
      setError(""); // Clear previous errors

      try {
        const response = await fetch(
          `https://api.twelvedata.com/time_series?symbol=${stockName}&interval=1day&apikey=c2f2da4c72db4d1d83e371cc66d718dc&outputsize=30`
        );

        const json = await response.json();

        if (json.status === "error" || json.code) {
          setError(json.message || "Something went wrong");
          return;
        }

        const formattedData = json.values.map(item => ({
          date: item.datetime,
          price: parseFloat(item.close),
        })).reverse();

        setData(formattedData);

      } catch (err) {
        console.error(err);
        setError("Failed to fetch stock data");
      }
    };

    fetchStockData();
  }, [stockName]);

  
  useEffect(() => {
    if (data.length === 0) return;

    
    if (chart) {
      chart.destroy();
    }

    const ctx = canvasRef.current;

    const newChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(item => item.date),
        datasets: [
          {
            label: `${stockName} Closing Price`,
            data: data.map(item => item.price),
            borderColor: '#00cc66',
            backgroundColor: 'rgba(0, 255, 153, 0.2)',
            tension: 0.4,
            pointRadius: 3,
            pointBackgroundColor: '#00ff99',

           
            segment: {
              borderColor: ctx => {
                const current = ctx.p0.parsed.y;
                const next = ctx.p1.parsed.y;
                return next < current ? 'red' : '#00cc66';
              },
            },
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
              font: { size: 14 },
            },
          },
          title: {
            display: true,
            text: `Stock Price Movement: ${stockName}`,
            color: '#ff4444',
            font: { size: 18 },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date',
              color: '#ff4444',
              font: { size: 16 },
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
              font: { size: 16 },
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

    setChart(newChart);
    return () => {
      newChart.destroy();
    };
  }, [data, stockName]);

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
