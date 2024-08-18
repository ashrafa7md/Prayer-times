import { Container } from '@mui/material';
import './App.css'
import MainContent from './components/MainContent';
function App() {
  
  return (
    <>
      <div className="app-container">
        <Container maxWidth="xl">
          <MainContent />
          
        </Container>
      </div>
    </>
  )
}

export default App
