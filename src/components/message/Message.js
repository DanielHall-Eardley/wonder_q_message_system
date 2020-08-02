import React from 'react'
import styles from './Message.module.css'
import api from '../../helper/api'

export default ({message, setMessageList, readerId}) => {
  
  /*Make a request to mark a message as 'processed'
  and permantly remove it from the database*/
  const markMessageAsRead = async messageId => {
    const body = {
      messageId,
      readerId
    }
    
    const response = await api('message/process', body, 'PUT')
    
    if (response.messageList) {
      setMessageList(response.messageList)
    }
  }

  return (
    <li className={styles.listItem}>
      <p>{message.content}</p>
      <div className={styles.btnContainer}>
        <button onClick={() => markMessageAsRead(message.id)}>
          Mark as read
        </button>
      </div>
    </li>
  )
}