import React from 'react'
import  { useState, useEffect } from 'react';
const Stock = () => {
  const [price, setPrice] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // 1. Create WebSocket connection
    const ws = new WebSocket('wss://ws.finnhub.io?token=d28aqa1r01qjsuf29afgd28aqa1r01qjsuf29ag0');

    // 2. On connection open, subscribe to AAPL price updates
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'subscribe', symbol: 'AAPL' }));
    };

    // 3. Listen for messages
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'trade') {
        // message.data is an array of trade objects, get latest price
        const latestPrice = message.data[0]?.p;
        if (latestPrice) setPrice(latestPrice);
      }
    };

    // 4. On error or close, log it (optional)
    ws.onerror = (err) => console.error('WebSocket error:', err);
    ws.onclose = () => console.log('WebSocket closed');

    setSocket(ws);

    // 5. Cleanup on component unmount
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'unsubscribe', symbol: 'AAPL' }));
      }
      ws.close();
    };
  }, []); // Empty deps = run once on mount

  return (
    <div>
      <h2>Live AAPL Price</h2>
      {price ? <p>${price.toFixed(2)}</p> : <p>Loading...</p>}
    </div>
  );

}

export default Stock
