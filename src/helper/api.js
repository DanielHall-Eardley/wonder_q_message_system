import {apiHost} from '../global.js'

//Make any api request which requires a body
export default async (url, body, method) => {
  const res = await fetch(`${apiHost}/${url}`, {
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body),
    method
  })

  const response = await res.json()
  return response
}