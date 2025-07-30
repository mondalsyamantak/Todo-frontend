import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import { Outlet } from 'react-router-dom'
import { ThemeProvider } from './components/theme-provider'
import { DndContext } from '@dnd-kit/core'

function App() {
  //const [count, setCount] = useState(0)

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <DndContext>
      <Outlet/>
      </DndContext>
    </ThemeProvider>
  )
}

export default App
