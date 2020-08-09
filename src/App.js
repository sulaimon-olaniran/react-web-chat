import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import './styles/Styles.scss'
import FetchDataContextProvider from './context/FetchDataContext'
import Components from './components/Components'
import ProfileContextProvider from './context/ProfileContext'
import ErrorBoundary from './ErrorHandler'


function App() {

  return (
    <ErrorBoundary>
      <Router>
        <FetchDataContextProvider >
          <ProfileContextProvider>
            <div className="App">
              <Components />
            </div>
          </ProfileContextProvider>
        </FetchDataContextProvider>
      </Router>
    </ErrorBoundary>
  )
}

export default App
