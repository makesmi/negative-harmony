import React, { useState, useEffect, useCallback } from 'react'
import { production } from './Environment'
import axios from 'axios'

const TOKEN_HEADER = 'negativeharmony_token'

const setToken = (token:string|null) => 
  axios.defaults.headers.common[TOKEN_HEADER] = token

const Login:React.FC<LoginProps> = ({ user, setUser, displayMessage }) => {
  const [ loading, setLoading ] = useState(true)
  const [ hover, setHover ] = useState(false)

  const checkFBLoginStatus = useCallback((status:fb.StatusResponse) => {
    if(status.status === 'connected'){
      setToken(status.authResponse.accessToken)
      axios.post('/login')
        .then(() => {
          setLoading(false)
          setUser(status.authResponse.userID)
        })
        .catch(error => displayMessage(`Error: ${error.response?.status}`, true ))
    }else{
      setLoading(false)
    }
  }, [setUser, displayMessage])

  useEffect(() => {
    if(production()){
      whenFacebookReady(() => {
        FB.getLoginStatus(checkFBLoginStatus)
      })
    }else{
      setTimeout(() => {
        setLoading(false)
        setToken('token')
        axios.post('/login').then(() => setUser('user'))
      }, 0)
    }
  }, [setUser, checkFBLoginStatus])
  
  const loginWithFacebook = () => FB.login(checkFBLoginStatus, { scope: '' })

  const logout = () => {
    FB.logout()
    setUser('')
    axios.post('/logout')
    setToken(null)
  }

  if(user){
    return <button className="facebookButton" onClick={logout}
              onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
        {hover ? 'Log out' : 'Logged in'}
      </button>
  }else if(loading){
    return <button className="facebookButton">loading...</button>
  }else{
    return <button onClick={loginWithFacebook} className="facebookButton">Login with Facebook</button>
  }
} 

const whenFacebookReady = (callback:()=>void) => {
  if(window.FB){
    callback()
  }else{
    setTimeout(() => whenFacebookReady(callback), 800)
  }
}

type LoginProps = {
  user: string,
  setUser: (user:string)=>void,
  displayMessage: (message:string, error:boolean)=>void
}

export default Login