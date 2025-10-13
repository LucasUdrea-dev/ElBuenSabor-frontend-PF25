import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.tsx";
import Footer from "./Footer.tsx";
import { WebSocketTest } from "./components/WebSocketTest.tsx";

export default function App() {

    return (
        <>
            <div className="w-1/1">
                <div className="m-0">
                    <Navbar />
                </div>
                <div>

                    <Outlet />

                    {/* comentar para producción  */}
                    <WebSocketTest />

                </div>
                <div>
                    <Footer />
                </div>
            </div>
        </>
    )
}


