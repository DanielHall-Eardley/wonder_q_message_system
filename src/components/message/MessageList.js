import React from 'react'
import styles from './MessageList.module.css'
import Message from './Message.js'

export default ({messageList, setMessageList, readerId}) => {
  if (messageList.length < 1) {
    return <p className='notification'>No messages</p>
  }

  return (
    <ul className={styles.list}>
      {messageList.map(message => {
        return <Message 
          key={message.id}
          message={message} 
          readerId={readerId}
          setMessageList={setMessageList}/>
      })}
    </ul>
  )
}