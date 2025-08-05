import React, { useState } from 'react';
import './Home.css';

const Home = ({ onStockNameChange }) => {
  const [symbol, setSymbol] = useState("AAPL");
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState("");
  const [liveData, setLiveData] = useState(null);

  const fetchStockData = () => {
    setError(""); 
    setStockData(null); 

    fetch(`https://api.twelvedata.com/quote?symbol=${symbol}&apikey=c2f2da4c72db4d1d83e371cc66d718dc`)
      .then((res) => res.json())
      .then((data) => {
        console.log("API response:", data);

        if (data.code || data.status === "error") {
          setError(data.message || "Something went wrong");
          return;
        }

        const extracted = {
          name: data.name,
          symbol: data.symbol,
          exchange: data.exchange,
          currency: data.currency,
          datetime: data.datetime,
          open: data.open,
          high: data.high,
          low: data.low,
          close: data.close,
          percent_change: data.percent_change,
        };
        setStockData(extracted);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Failed to fetch stock data");
      });
  };

  function getLiveDate(){
    fetch(`https://api.twelvedata.com/price?symbol=${symbol}&apikey=c2f2da4c72db4d1d83e371cc66d718dc&interval`)
  .then((res) => res.json())
      .then((data) => {
        console.log("API response:", data);

        if (data.code || data.status === "error") {
          setError(data.message || "Something went wrong");
          return;
        }

        const extractedLive = {
          price: data.price,
        };
        setLiveData(extractedLive);
        onStockNameChange(symbol);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Failed to fetch stock data");
      });
  };

  return (
    <div className="usercontainer">
      <h1>📈 Stock Info</h1>

      <input
        type="text"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value.toUpperCase())}
        placeholder="Enter stock symbol (e.g., AAPL)"
      />
      <button onClick={getLiveDate} className="btn" >Search</button>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      {liveData && (
        <div style={{ marginTop: "20px", border: "1px solid #ccc", padding: "15px", borderRadius: "8px" }}>
          {/* <h2>{stockData.name} ({stockData.symbol})</h2>
          <p><strong>Exchange:</strong> {stockData.exchange}</p>5
          <p><strong>Currency:</strong> {stockData.currency}</p>
          <p><strong>Date:</strong> {stockData.datetime}</p>
          <p><strong>Open:</strong> ${stockData.open}</p>
          <p><strong>High:</strong> ${stockData.high}</p>
          <p><strong>Low:</strong> ${stockData.low}</p>
          <p><strong>Close:</strong> ${stockData.close}</p>
          <p><strong>Change %:</strong> {parseFloat(stockData.percent_change).toFixed(2)}%</p> */}
          <p><strong>Live Price:</strong> {liveData.price}</p>
        </div>
      )}
    </div>
  );
};

export default Home;
