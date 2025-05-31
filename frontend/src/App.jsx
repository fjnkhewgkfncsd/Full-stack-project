import Login from './pages/login.jsx'
import Signup from './pages/signup.jsx'
import {BrowserRouter,Routes,Route} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
            <Route path='/login' index element={<Login />} />
            <Route path='/signup' element={<Signup />} />
        </Routes>
    </BrowserRouter>
    
  )

}
export default App;
