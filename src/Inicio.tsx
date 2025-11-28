import { useEffect, useState } from "react";
import SliderImagenes from "./SliderImagenes";
import { Link } from "react-router-dom";


interface Ejemplo{
    nombre: string
    imagen: string
}

export default function Inicio() {
    
    const [promos, setPromos] = useState<any[]>([])

    //Cambiar por fetch de promociones del backend
    useEffect(()=>{
        let objetos: Ejemplo[] = [
            {nombre: "uno", imagen: "pizza.jpg"},
            {nombre: "2", imagen: "logoCarrito.jpg"},
            {nombre: "3", imagen: "miniUsuario.jpg"}

        ]

        setPromos(objetos)

    }, [])

    //Estilos
    //General
    const titulos = "text-6xl"
    //Como funciona
    const secciones = "bg-[#F2B28C80] mx-auto h-auto w-2/3 rounded-4xl text-center mt-15 p-[5%]"
    const imgComoFunciona = "rounded-[20rem] w-75 h-75 m-auto object-cover"
    const subtitulos = "m-3 text-4xl"
    const parrafo = "m-3 text-2xl"

    return(

        <>
        
        <div className="bg-[#333333] h-full w-1/1 text-white font-[Playfair_Display] py-10">

            {/* Carrusel de promociones */}
            <div className="grid grid-cols-[2fr_2fr] p-10 gap-5">

                <div className="flex flex-col text-center">

                    <h1 className="text-5xl ">Ordena tus comidas desde la comodidad de tu casa</h1>
                    <Link className="bg-[#D93F21] rounded-lg m-auto text-4xl flex items-center p-5" to="/catalogo">
                        <h2 className="text-center">Catalogo</h2>
                    </Link>

                </div>
                <div className="flex items-center w-3/4 m-auto h-[300px]">
                    <SliderImagenes data={promos}/>
                </div>
                

            </div>

            {/* Como funciona*/}
            <div id="comoFunciona" className={secciones}>

                <div>
                    <h1 className={titulos}>¿Como funciona?</h1>
                </div>
                <div className="grid grid-cols-3 mt-10 gap-10">
                    <div>
                        <img className={imgComoFunciona} src="/img/elegiTuComida.jpg"/>
                        <h2 className={subtitulos}>1. Elegí tu comida</h2>
                        <p className={parrafo}>Busca en nuestro catalogo y ordena por la app</p>
                    </div>
                    <div>
                        <img className={imgComoFunciona} src="/img/haceTuOrden.jpg"/>
                        <h2 className={subtitulos}>2. Hacé tu orden</h2>
                        <p className={parrafo}>¡Facil y rapido! Podes pagar online o en la entrega</p>
                    </div>
                    <div>
                        <img className={imgComoFunciona} src="/img/recibiTuPedido.jpg"/>
                        <h2 className={subtitulos}>3. Recibí el pedido</h2>
                        <p className={parrafo}>Recibi tu pedido en tu domicilio o pasa a retirarlo al local</p>
                    </div>
                </div>
            </div>

            {/*Sobre nosotros */}
            <div id="sobreNosotros" className={secciones}>
                
                <div className="grid grid-cols-[3fr_2fr] gap-5">

                    <div className="grid grid-rows-[1fr_3fr] text-left gap-5">
                        <div>
                            <h1 className={titulos}>Sobre Nosotros</h1>
                        </div>
                        
                        <div className="flex">
                            <p className="text-4xl">
                                Bienvenido a El Buen sabor, un lugar 
                                donde la pasión por la buena comida y el 
                                buen servicio nos define. 
                                Desde nuestros inicios, nos hemos dedicado 
                                a ofrecer productos de calidad y con el mejor sabor.
                            </p>
                        </div>

                    </div>

                    
                    <img className="m-auto h-[35rem] rounded-4xl object-cover" src="/img/imgSobreNosotros.jpg" alt="" />
                    

                </div>

            </div>

            
            {/**Contactanos */}
            <div id="contacto" className={secciones}>
                <div className="text-left grid grid-rows-[1fr_5fr] gap-10">
                    <div>
                        <h1 className={titulos}>Contactanos</h1>
                    </div>
                    <div className="grid grid-rows-4 gap-8">
                        <div className="flex items-center">
                            <img src="/svg/instagram.svg" alt="" />
                            <h2 className={subtitulos}>@ElBuenSaborOk</h2>
                        </div>
                        <div className="flex items-center">
                            <img src="/svg/facebook.svg" alt="" />
                            <h2 className={subtitulos}>@ElBuenSaborOk</h2>
                        </div>
                        <div className="flex items-center">
                            <img src="/svg/whatsapp.svg" alt="" />
                            <a href="callto:+5492615874398" className={subtitulos}>+54 9 2615874398</a>
                        </div>
                        <div className="flex items-center">
                            <img src="/svg/gmail.svg" alt="" />
                            <a href="mailto:ElBuenSabor@gmail.com" className={subtitulos}>ElBuenSabor@gmail.com</a>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        </>
        
    )

}