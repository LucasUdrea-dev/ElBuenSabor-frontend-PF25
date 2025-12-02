import { useEffect, useState } from "react";
import { Promocion } from "../../ts/Clases.ts";
import DetallePromocion from "./DetallePromocion.tsx";

interface Props {
  promos: Promocion[];
  loading?: boolean;
}

export default function SliderPromociones({ promos, loading }: Props) {
  const [indexActual, setIndexActual] = useState(0);
  const [detallePromocion, setDetallePromocion] = useState<Promocion | null>(
    null
  );

  useEffect(() => {
    if (promos.length === 0) {
      return;
    }

    const intervalId = setInterval(() => {
      setIndexActual((prev) => (prev + 1) % promos.length);
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [promos.length, promos, indexActual]);

  const cerrarDetalle = () => {
    setDetallePromocion(null);
  };

  if (loading) {
    return (
      <div className="bg-[#444444] rounded-4xl relative w-full flex items-center h-[400px] animate-pulse">
        <div className="grid grid-cols-[40%_60%] max-lg:flex max-lg:flex-col-reverse w-full h-full">
          <div className="p-10 max-lg:p-5 flex flex-col gap-10 justify-center">
            <div className="h-12 bg-gray-600 rounded-xl w-3/4 mx-auto"></div>
            <div className="h-8 bg-gray-600 rounded-xl w-1/2 mx-auto"></div>
          </div>
          <div className="h-full w-full bg-gray-500 rounded-r-4xl max-lg:rounded-t-4xl max-lg:rounded-b-none"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#444444] rounded-4xl relative w-full flex items-center">
        {promos.length > 0 ? (
          <div className="grid grid-cols-[40%_60%] max-lg:flex max-lg:flex-col-reverse max-lg:pb-20 w-1/1">
            <div className="p-10 max-lg:p-5 flex flex-col gap-10">
              <h1 className="text-6xl max-md:text-center max-md:text-5xl">
                {promos[indexActual].denominacion}
              </h1>
              <h2 className="text-4xl text-center max-md:text-3xl">
                {promos[indexActual].descripcion}
              </h2>
            </div>

            <button onClick={() => setDetallePromocion(promos[indexActual])}>
              <img
                className="m-auto h-[400px] w-full top-1/2 
                        object-cover rounded-r-4xl max-lg:rounded-4xl"
                src={promos[indexActual].imagen}
                alt="No se pudo recuperar la imagen"
              />
            </button>
          </div>
        ) : (
          <div className="w-full h-[400px] flex items-center justify-center">
            <p className="text-xl text-gray-300">
              No hay promociones disponibles
            </p>
          </div>
        )}
        <div className="absolute flex justify-center gap-5 bottom-2 max-lg:bottom-0 max-lg:w-full text-xl h-1/10 w-[40%] rounded-r-4xl">
          {/**Se crean los botones para cambiar de promocion */}
          {promos.length > 0 &&
            promos.map((_, index) => (
              <button
                key={index}
                className={`${
                  indexActual == index
                    ? "bg-[#D93F21] border-black"
                    : "bg-black"
                } rounded-4xl w-7 h-7 border-2`}
                onClick={() => {
                  setIndexActual(index);
                }}
              ></button>
            ))}
        </div>
      </div>

      <DetallePromocion promocion={detallePromocion} onClose={cerrarDetalle} />
    </>
  );
}
