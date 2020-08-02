import React from 'react'
import getApi from '../../helper/getApi.js'

export default ({setMessageList, readerId}) => {

  //request a new batch of messages
  const getMessageSession = async () => {
    const response = await getApi(`message/list/${readerId}`)
    
    if (response.error) {
      alert(response.error)
    } else {
      setMessageList(response.messageList)
    }
  }

  return <button onClick={getMessageSession}>
    Check for messages
  </button>
}
