import React, { useState, useEffect, useRef } from 'react';
import './Home.css';

const Home = () => {
  const [price, setPrice] = useState(null);
  const [name, setName] = useState('');
  const [submittedName, setSubmittedName] = useState('');
  const socket = useRef(null);

  useEffect(() => {
    if (!submittedName) return;

    // Reset price on new subscription
    setPrice(null);

    socket.current = new WebSocket('wss://ws.finnhub.io?token=d28aqa1r01qjsuf29afgd28aqa1r01qjsuf29ag0');

    socket.current.onopen = () => {
      socket.current.send(JSON.stringify({ type: 'subscribe', symbol: submittedName.toUpperCase() }));
    };

    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'trade') {
        const latestPrice = message.data[0]?.p;
        if (latestPrice) setPrice(latestPrice);
      }
    };

    socket.current.onerror = (err) => console.error('WebSocket error:', err);
    socket.current.onclose = () => console.log('WebSocket closed');

    return () => {
      if (socket.current && socket.current.readyState === WebSocket.OPEN) {
        socket.current.send(JSON.stringify({ type: 'unsubscribe', symbol: submittedName.toUpperCase() }));
        socket.current.close();
      }
    };
  }, [submittedName]);

  const handleSearch = () => {
    // Trigger subscription change by updating submittedName
    setSubmittedName(name.trim());
  };

  return (
    <div className="usercontainer">
      <h1>CHARTS</h1>

      <div className="usercontainer-text">
        <p>Get Realtime Chart</p>
        <p>updates and much</p>
        <p>more!!!!</p>
      </div>

      <div className="usercontainer-input">
        <input
          type="text"
          id="user-input"
          placeholder="Enter the stock symbol (e.g. AAPL)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="button" className="btn" onClick={handleSearch}>
          Search
        </button>
      </div>

      <div style={{ marginTop: 20 }}>
        <h2>Live Price:</h2>
        {price !== null ? <p>${price.toFixed(2)}</p> : <p>No data</p>}
      </div>
    </div>
  );
};

export default Home;
