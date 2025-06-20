import { Outlet } from "react-router-dom";
import Header from "./header.jsx";
import Footer from "./footer.jsx";

const Layout = () => {
    return (
        <div>
            <Header/>
            <Outlet />
            <Footer />
        </div>
    )
}
export default Layout;