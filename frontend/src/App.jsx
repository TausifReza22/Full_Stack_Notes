import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [data, setData] = useState([])

  useEffect(() => {
    fetch("http://localhost:3000/api/data")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setData(data.data);
      });
    
  }, [])

  return (
    <>
      {data.map((item, index) => (
        <div key={index} className="card">
          <h1>{item.first_name}</h1>
        </div>
      ))}
    </>
  );
}

export default App
