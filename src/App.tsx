import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.tsx";
import Footer from "./Footer.tsx";

export default function App() {

  return (
    <>
        <div className="w-1/1">
            <div className="m-0">
                <Navbar/>
            </div>
            <div>

              <Outlet/>

            </div>
            <div>
              <Footer/>
            </div>
        </div>
    </>
  )
}


