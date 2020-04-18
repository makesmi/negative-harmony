import React, { useState } from 'react'
import { production } from './Environment'

const Login:React.FC<LoginProps> = ({ user, setUser }) => {
  const [ update, setUpdate] = useState(0)
  const [ loading, setLoading ] = useState(true)
  const [ hover, setHover ] = useState(false)

  const checkFBLoginStatus = (status:fb.StatusResponse) => {
    setLoading(false)
    if(status.status === 'connected'){
      setUser(status.authResponse.userID)
    }
  }

  if(loading){
    if(!production()){
      setTimeout(() => {
        setLoading(false)
        setUser('kayttaja')
      }, 0)
    }else if(window.FB){
      FB.getLoginStatus(checkFBLoginStatus)
    }else{
      setTimeout(() => setUpdate(update + 1), 1000)
    }
  }
  
  const loginWithFacebook = () => FB.login(checkFBLoginStatus)

  const logout = () => {
    FB.logout()
    setUser('')
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

type LoginProps = {
  user: string,
  setUser: (user:string)=>void
}

export default Login