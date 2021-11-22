import { BrowserRouter as Router } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import './App.css';
import Routing from './components/Routing'

function App() {
  return (
    <Router>
      <SnackbarProvider maxSnack={3}>
        <div className="App">
          <Routing />
        </div>
      </SnackbarProvider>
    </Router>
  );
}

export default App;
