import React, {useState} from 'react'
import styles from './GenerateMessage.module.css'
import api from '../../helper/api'

export default () => {
  const [intervalId, setIntervalId] = useState(null)
  const [content, setContent] = useState(null)

  //Get a random dad joke
  const getDadJoke = async () => {
    const res = await fetch('https://icanhazdadjoke.com/', {
      headers: {
        'Accept': 'application/json'
      }
    })
    const dadJoke = await res.json()
    return dadJoke
  }


  //Start sending dad jokes every 10 seconds
  const startMsgGeneration = () => {
    const savedIntervalId = setInterval(async () => {
      const dadJoke = await getDadJoke()
      
      const body = {
        content: dadJoke.joke
      }

      const response = await api('message/submit', body, 'POST')

      if (response.error) {
        alert(response.error)
      } else {
        console.log(response.message)
      }
    }, 2000)

    setIntervalId(savedIntervalId)
  }

  //Stop the dad jokes
  const stopMsgGeneration = () => {
    clearInterval(intervalId)
  }

  //Allow the user to submit a message
  const submitMessage = async (event) => {
    event.preventDefault()
  
    const body = {
      content
    }

    const response = await api('message/submit', body, 'POST')

    if (response.error) {
      alert(response.error)
    } else {
      console.log(response.message)
    }
  }


  return (
    <section className={styles.formContainer}>
      <form onSubmit={submitMessage}>
        <label htmlFor="message-content">Write a message</label>
        <textarea id="message-content" onInput={(event) => setContent(event.target.value)}></textarea>
        <button>Send</button>
      </form>
      <button onClick={startMsgGeneration} className={styles.button}>
        Start automatic message generation
      </button>
      <button onClick={stopMsgGeneration} className={styles.button}>
        Stop automatic message generation
      </button>
    </section>
  )
}