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

    fetch(`https://api.twelvedata.com/quote?symbol=${symbol}&apikey=demo`)
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
    fetch(`https://api.twelvedata.com/price?symbol=${symbol}&apikey=demo`)
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

  const handleSearch = () => {
  getLiveDate();      
  fetchStockData();   };

  return (
    <div className="usercontainer">
      <h1>📈 Stock Info</h1>

      <input
        type="text"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value.toUpperCase())}
        placeholder="Enter stock symbol (e.g., AAPL)"
      />
     <button onClick={handleSearch} className="btn">Search</button>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      {liveData && (
          <div className="live-price-container">
            <p><strong>Live Price:</strong> {liveData.price}</p>
          </div>
)}

    {stockData && (
      <div className="stock-info-container">
        <h2>{stockData.name} ({stockData.symbol})</h2>
        <p><strong>Exchange:</strong> {stockData.exchange}</p>
        <p><strong>Currency:</strong> {stockData.currency}</p>
        <p><strong>Date:</strong> {stockData.datetime}</p>
        <p><strong>High:</strong> ${stockData.high}</p>
        <p><strong>Low:</strong> ${stockData.low}</p>
        <p><strong>Close:</strong> ${stockData.close}</p>
        <p><strong>Change %:</strong> {parseFloat(stockData.percent_change).toFixed(2)}%</p>
      </div>
    )}

    </div>
  );
};

export default Home;
