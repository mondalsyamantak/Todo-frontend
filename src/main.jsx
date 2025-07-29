import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import Dashboard from './pages/Dashboard/Dashboard.jsx'
import LoginPage from './pages/Login/Login.jsx'
import Account from './pages/Account/Account.jsx'
import SignUpPage from './pages/SignUp/SignUp.jsx'

import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import { UserProvider } from './contextApis/UserContext'
import AllTasks from './pages/Dashboard/TaskPages/AllTasks'
// import Today from './pages/Dashboard/TaskPages/Today'
// import Tomorrow from './pages/Dashboard/TaskPages/Tomorrow'
// import ThisWeek from './pages/Dashboard/TaskPages/ThisWeek'
import Pomodoro from './pages/Utilities/Pomodoro'
import { PomoProvider } from './contextApis/PomoContext'
import AudioPlayer from './pages/Utilities/Music'
import Music from './pages/Utilities/Music'


const router = createBrowserRouter ([
    {
      path: "/",
      element: <App/>,
      children : [
        {
          path: "",
          element: <Dashboard/>,
          children: [
            {
              path: "",
              element: <AllTasks/>
            },
            {
              path: "today",
              element: <AllTasks/>
            },
            {
              path: "tomorrow",
              element: <AllTasks/>
            },
            {
              path: "this-month",
              element: <AllTasks/>
            },

            {
              path: "pomodoro",
              element: <Pomodoro/>
            },
            {
              path: "account",
              element: <Account/>
            },
            {
              path: "music",
              element: <Music/>
            }
          ]
        },
        {
          path: "login",
          element: <LoginPage/>
        },

        {
          path: "signup",
          element: <SignUpPage/>
        }
      ]
    }
  ])

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <UserProvider>
      <PomoProvider>
        <RouterProvider router = {router} />
      </PomoProvider>
    </UserProvider>
    
  // </StrictMode>,
)
