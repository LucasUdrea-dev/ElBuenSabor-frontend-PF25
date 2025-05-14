import { Link, useLocation } from "react-router-dom"

export default function Footer() {

    const location = useLocation()
    
    return(
        <>
        
            <div className="text-white">
                <div className="bg-[#D93F21] h-15 w-full ">
                    {location.pathname === "/inicio" ? (
                        <div className="h-full w-2/5 m-auto flex items-center justify-between">
                            <a href="#comoFunciona">Como Funciona</a>
                            <a href="#sobreNosotros">Sobre Nosotros</a>
                            <a href="#contacto">Contacto</a>
                        </div>
                    ) : (
                        <div className="h-full w-2/5 m-auto flex items-center justify-between">
                            <Link to="/inicio">Como Funciona</Link>
                            <Link to="/inicio">Sobre Nosotros</Link>
                            <Link to="/inicio">Contacto</Link>
                        </div>
                    )}
                </div>
                <div className="bg-[#333333] flex items-center">
                    <Link className="text-1xl m-auto" to="/inicio">2025 elbuensabor.com.ar</Link>
                </div>
            </div>
        
        </>
    )

}