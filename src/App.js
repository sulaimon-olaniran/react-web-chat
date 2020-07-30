import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import './styles/Styles.scss'
import FetchDataContextProvider from './context/FetchDataContext'
import Components from './components/Components'
import ProfileContextProvider from './context/ProfileContext'


function App() {

  return (
    <Router>
          <FetchDataContextProvider >
            <ProfileContextProvider>
            <div className="App">
              <Components  />
            </div>
            </ProfileContextProvider>
          </FetchDataContextProvider>
    </Router>
  )
}

export default App
