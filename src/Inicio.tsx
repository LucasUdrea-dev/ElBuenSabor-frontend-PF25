import { useEffect, useState } from "react";
import SliderImagenes from "./SliderImagenes";
import { Link } from "react-router-dom";
import axios from "axios";
import { host, Promocion } from "../ts/Clases";

export default function Inicio() {
  const [promos, setPromos] = useState<Promocion[]>([]);

  //Cambiar por fetch de promociones del backend
  const cargarPromos = async () => {
    const URL = host + "/api/promociones/existente";

    try {
      const response = await axios.get(URL);

      const promocionesObtenidas: Promocion[] = response.data;

      setPromos(promocionesObtenidas);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    cargarPromos();
  }, []);

  return (
    <>
      <div className="bg-[#333333] min-h-screen w-full text-white font-[Playfair_Display]">
        {/* Hero Section - Carrusel de promociones */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col justify-center items-center text-center space-y-6">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
                Ordena tus comidas desde la comodidad de tu casa
              </h1>
              <Link
                className="bg-[#D93F21] hover:bg-[#C13519] transition-colors duration-300 rounded-lg text-lg md:text-xl font-semibold px-8 py-4 inline-flex items-center justify-center shadow-lg hover:shadow-xl w-fit"
                to="/catalogo"
              >
                <span>Catálogo</span>
              </Link>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-full max-w-md h-64">
                <SliderImagenes data={promos} />
              </div>
            </div>
          </div>
        </div>

        {/* Como funciona */}
        <div id="comoFunciona" className="max-w-6xl mx-auto px-6 py-16">
          <div className="bg-[#F2B28C80] backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              ¿Cómo funciona?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-40 h-40 overflow-hidden rounded-2xl shadow-lg">
                  <img 
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" 
                    src="/img/elegiTuComida.jpg"
                    alt="Elegí tu comida"
                  />
                </div>
                <h3 className="text-xl font-semibold">1. Elegí tu comida</h3>
                <p className="text-base leading-relaxed">
                  Busca en nuestro catálogo y ordena por la app
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-40 h-40 overflow-hidden rounded-2xl shadow-lg">
                  <img 
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" 
                    src="/img/haceTuOrden.jpg"
                    alt="Hacé tu orden"
                  />
                </div>
                <h3 className="text-xl font-semibold">2. Hacé tu orden</h3>
                <p className="text-base leading-relaxed">
                  ¡Fácil y rápido! Podés pagar online o en la entrega
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-40 h-40 overflow-hidden rounded-2xl shadow-lg">
                  <img 
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" 
                    src="/img/recibiTuPedido.jpg"
                    alt="Recibí el pedido"
                  />
                </div>
                <h3 className="text-xl font-semibold">3. Recibí el pedido</h3>
                <p className="text-base leading-relaxed">
                  Recibí tu pedido en tu domicilio o pasa a retirarlo al local
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sobre nosotros */}
        <div id="sobreNosotros" className="max-w-6xl mx-auto px-6 py-16">
          <div className="bg-[#F2B28C80] backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12">
            <div className="grid md:grid-cols-[3fr_2fr] gap-8 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold">Sobre Nosotros</h2>
                <p className="text-lg md:text-xl leading-relaxed">
                  Bienvenido a El Buen Sabor, un lugar donde la pasión por la
                  buena comida y el buen servicio nos define. Desde nuestros
                  inicios, nos hemos dedicado a ofrecer productos de calidad y
                  con el mejor sabor.
                </p>
              </div>
              <div className="flex justify-center">
                <img
                  className="w-full max-w-xs h-80 rounded-2xl object-cover shadow-lg hover:shadow-2xl transition-shadow duration-300"
                  src="/img/imgSobreNosotros.jpg"
                  alt="El Buen Sabor"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contactanos */}
        <div id="contacto" className="max-w-6xl mx-auto px-6 py-16 pb-20">
          <div className="bg-[#F2B28C80] backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Contáctanos</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-center space-x-4 group">
                <img src="/svg/instagram.svg" alt="Instagram" className="w-8 h-8" />
                <span className="text-lg md:text-xl group-hover:text-[#D93F21] transition-colors">@ElBuenSaborOk</span>
              </div>
              <div className="flex items-center space-x-4 group">
                <img src="/svg/facebook.svg" alt="Facebook" className="w-8 h-8" />
                <span className="text-lg md:text-xl group-hover:text-[#D93F21] transition-colors">@ElBuenSaborOk</span>
              </div>
              <div className="flex items-center space-x-4 group">
                <img src="/svg/whatsapp.svg" alt="WhatsApp" className="w-8 h-8" />
                <a 
                  href="callto:+5492615874398" 
                  className="text-lg md:text-xl hover:text-[#D93F21] transition-colors"
                >
                  +54 9 2615874398
                </a>
              </div>
              <div className="flex items-center space-x-4 group">
                <img src="/svg/gmail.svg" alt="Email" className="w-8 h-8" />
                <a 
                  href="mailto:ElBuenSabor@gmail.com" 
                  className="text-lg md:text-xl hover:text-[#D93F21] transition-colors"
                >
                  ElBuenSabor@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
