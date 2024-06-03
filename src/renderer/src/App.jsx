import React from 'react'
import { Route, MemoryRouter as Router, Routes } from 'react-router-dom'
import { Login } from './components/Auth'
import Layout from './components/Layout'
import { AuthProvider } from './contexts/authContext'
import Administrator from './pages/Administrator'
import Archive from './pages/Archive'
import Packs from './pages/Packs'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/home"
            element={
              <Layout>
                <Packs />
              </Layout>
            }
          />
          <Route
            path="/archive"
            element={
              <Layout>
                <Archive />
              </Layout>
            }
          />
          <Route
            path="/admin"
            element={
              <Layout>
                <Administrator />
              </Layout>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
