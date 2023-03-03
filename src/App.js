import Navbar from './components/Navbar';
import About from './components/About';
import Home from './components/Home';
import {
  HashRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import NotesState from './context/notes/NotesState';
import Alert from './components/Alert';
import Signup from './components/Signup';
import Login from './components/Login';
import { useState } from 'react';


function App() {
  const [alert, setAlert] = useState(null);
  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type
    })
    setTimeout(() => {
      setAlert(null);
    }, 2000);
  }

  return (
    <>
      <NotesState>
        <Router>
          <Navbar />
          <Alert alert={alert} />
          <div className="container">
            <Routes>

              <Route exact path="/" element={<Home showAlert={showAlert} />}>
              </Route>

              <Route exact path="/about" element={<About />} >
              </Route>

              <Route exact path="/login" element={<Login showAlert={showAlert} />} >
              </Route>


              <Route exact path="/signup" element={<Signup showAlert={showAlert} />} >
              </Route>

            </Routes>


          </div>
        </Router>
      </NotesState>
    </>
  );
}
export default App;
