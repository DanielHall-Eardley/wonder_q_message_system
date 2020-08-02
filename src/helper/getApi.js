import {apiHost} from '../global.js'

//make a api get request
export default async url => {
  const res = await fetch(`${apiHost}/${url}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  
  const response = await res.json()
  return response
}