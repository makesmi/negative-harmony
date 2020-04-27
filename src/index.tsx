import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { configure } from './Environment'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom' 
import PrivacyPolicy from './PrivacyPolicy'

configure()

const app = (
  <Router>
    <Switch>
      <Route path="/privacy">
        <PrivacyPolicy />
      </Route>
      <Route path="/">
        <App />
      </Route>
    </Switch>
  </Router>
)

ReactDOM.render(app, document.getElementById('root'))
