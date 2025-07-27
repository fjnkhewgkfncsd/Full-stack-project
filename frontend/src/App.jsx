import Login from './pages/login.jsx'
import Signup from './pages/signup.jsx'
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Layout from './layout/layout.jsx';
import Home from './pages/home.jsx'
import './app.css'
import Product from './pages/product.jsx'
import TeamProducts from './pages/teamProduct.jsx';
import LeagueProduct from './pages/leagueproduct.jsx' 
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route  element={<Layout />}>
          <Route path='/' index element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/product/:id' element={<Product />} />
          <Route path='/team/:team' element={<TeamProducts />} />
          <Route path='/league/:league' element={<LeagueProduct />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
export default App;
