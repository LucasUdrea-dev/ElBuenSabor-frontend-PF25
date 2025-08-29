import { Outlet } from "react-router-dom";
import NavbarAdmin from "./NavbaryDashboard/NavbarAdmin";

export default function App() {

  return (
    <>
        <div className="w-1/1">
            <div className="m-0">
                <NavbarAdmin/>
            </div>
            <div>

              <Outlet/>

            </div>
            
        </div>
    </>
  )
}


