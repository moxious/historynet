import './App.css'
import Header from '@components/Header'
import MainLayout from '@components/MainLayout'
import ErrorBoundary from '@components/ErrorBoundary'

function App() {
  return (
    <div className="app">
      <Header />
      {/* REACT: Error boundary prevents render errors from crashing the app (R6) */}
      <ErrorBoundary>
        <MainLayout />
      </ErrorBoundary>
    </div>
  )
}

export default App
