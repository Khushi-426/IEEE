import { useState } from 'react'
import Home from './components/Home'
import LineChart from './components/LineChart'
import './App.css'


function App() {
  const [stockName, setStockName] = useState("");

  return (
    <>
      <Home onStockNameChange={setStockName}/>
      <LineChart stockName={stockName}/>
    </>
  )
}

export default App
