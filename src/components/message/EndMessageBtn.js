import React from 'react'
import api from '../../helper/api.js'

export default ({setMessageList, readerId}) => {

  //clear the current message session
  const endMessageSession = async () => {
    const body = {
      readerId
    }
    const response = await api('message/clear/', body, 'DELETE')
    console.log(response.message)
    setMessageList([])
  }

  return <button onClick={endMessageSession}>
    Clear Messages
  </button>
}