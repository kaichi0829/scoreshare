import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  const countUp = () => setCount(count + 1)
  const countDown = () => setCount(count - 1)
  const reset = () => setCount(0)

  return (
    <div className="app">
      <div className="counter-card">
        <h1 className="count-display">{count}</h1>
        
        <div className="button-group">
          <button onClick={countUp} className="btn btn-up">+1</button>
          <button onClick={countDown} className="btn btn-down">-1</button>
          <button onClick={reset} className="btn btn-reset">RESET</button>
        </div>
      </div>
    </div>
  )
}

export default App
