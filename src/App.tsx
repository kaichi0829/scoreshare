import { useState, useEffect } from 'react'
import './App.css'
import { db } from './lib/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

function App() {
  const [count, setCount] = useState(0)
  
  // 1. 起動時に Firestore から現在のカウントを取得
  useEffect(() => {
    const fetchCount = async () => {
      const docRef = doc(db, "counters", "main-counter");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setCount(docSnap.data().value);
      }
    };
    fetchCount();
  }, []);

  // 2. カウントが変わるたびに Firestore を更新する共通関数
  const updateCount = async (newValue: number) => {
    setCount(newValue);
    await setDoc(doc(db, "counters", "main-counter"), {
      value: newValue
    });
  };

  const countUp = () => updateCount(count + 1)
  const countDown = () => updateCount(count - 1)
  const reset = () => updateCount(0)

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