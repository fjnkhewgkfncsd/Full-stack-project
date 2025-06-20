import Login from './pages/login.jsx'
import Signup from './pages/signup.jsx'
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Layout from './layout/layout.jsx';
import Home from './pages/home.jsx'
import './app.css'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route  element={<Layout />}>
          <Route path='/' index element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
export default App;
