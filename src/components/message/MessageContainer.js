import React, {useState, useEffect} from 'react'
import styles from './MessageContainer.module.css'

import CheckMessageBtn from './CheckMessageBtn.js'
import EndMessageBtn from './EndMessageBtn.js'
import MessageList from './MessageList.js'
import {v4 as uuid} from 'uuid'
import getApi from '../../helper/getApi.js'

/*Notes*
When I reference a reader's "message session" in my
comments, I am referring to a server side session that
is created to isolate a batch of messages that an individual
reader is processing from the main message queue until the reader 
has either marked all messages as processed or the session expires 
and any unprocessed messages are released back into the main message queue.
*/

export default () => {
  const [messageList, setMessageList] = useState([])
  const [readerId, setReaderId] = useState(null)

  
  /*request to get the reader's current message session*/
  const checkPendingMessages = async readerId => {
    const response = await getApi(`message/pending/${readerId}`)
   
    if (response.session) {
      setMessageList(response.session.messages)
    }
  }

  /*This function checks if a reader is logged in
  and depending on the result of the check, will either log 
  the reader in or dispatch a request to attempt the retrieval of
  a current message session associated with the reader*/
  useEffect(() => {
    let loggedInReader = localStorage.getItem('readerId')
    
    if (!loggedInReader) {
      loggedInReader = uuid()
      localStorage.setItem('readerId', loggedInReader)
    } else {
      checkPendingMessages(loggedInReader)
    }

    setReaderId(loggedInReader)
  }, [])

  return (
    <section>
      <div className={styles.btnContainer}>
        <CheckMessageBtn 
          setMessageList={setMessageList} 
          readerId={readerId}/>
          <EndMessageBtn 
          setMessageList={setMessageList} 
          readerId={readerId}/>
        </div>
      <MessageList 
        setMessageList={setMessageList} 
        readerId={readerId} 
        messageList={messageList}/>
    </section>
  )
}

