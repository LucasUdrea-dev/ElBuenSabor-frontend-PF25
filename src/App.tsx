import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.tsx";
import Footer from "./Footer.tsx";

export default function App() {

  return (
    <>
        <div className="w-full min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
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


