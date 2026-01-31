import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'
import { useEffect } from 'react'

function App() {
  const [jokes, setJokes] = useState([]);

  useEffect(() => {
    axios.get('/api/jokes')
      .then(response => {
        setJokes(response.data);
      }
    )
    .catch((error)=>{
      console.error("There was an error fetching the jokes!", error);
    })
  })

  return (
    <>
      <h1>Jokes</h1>
      <p> {jokes.length} Jokes </p>
      {jokes.map((joke, index) => (
        <div key={joke.id}>
          <h3>{joke.title}</h3>
          <p>{joke.punchline}</p>
        </div>
      ))}
    </>
  )
}

export default App
