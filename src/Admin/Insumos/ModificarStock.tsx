import { useEffect, useState } from "react";
import { ArticuloInsumo, host } from "../../../ts/Clases";
import axios from "axios";

interface Props {
  modificar: {
    articulo: ArticuloInsumo;
    operacion: string;
  };
  cerrarModal: () => void;
}

export default function ModificarStock({ modificar, cerrarModal }: Props) {
  const [input, setInput] = useState("");

  // Obtener token del localStorage
  const getToken = () => localStorage.getItem("token");

  // Configurar axios con el token
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
  };

  const titulo = {
    quitar: `Quitar ${modificar.articulo?.nombre}`,
    agregar: `Agregar ${modificar.articulo?.nombre}`,
    minimo: `Stock minimo de ${modificar.articulo?.nombre}`,
  }[modificar.operacion];

  useEffect(() => {
    setInput(() => {
      if (modificar.operacion == "minimo") {
        return String(modificar.articulo?.stockArticuloInsumo.minStock);
      } else {
        return "";
      }
    });
  }, [modificar.operacion]);

  const guardar = async () => {
    switch (modificar.operacion) {
      case "quitar":
        if (
          modificar.articulo?.stockArticuloInsumo?.cantidad ||
          0 < Number(input)
        ) {
          alert("La cantidad quitada no puede ser mayor a la disponible");
          return;
        } else {
          modificar.articulo.stockArticuloInsumo.cantidad -= Number(input);
        }
        break;

      case "agregar":
        modificar.articulo.stockArticuloInsumo.cantidad += Number(input);
        break;

      case "minimo":
        modificar.articulo.stockArticuloInsumo.minStock = Number(input);
        break;

      default:
        break;
    }

    try {
      let guardadoExitoso = await guardarArticuloInsumo(modificar.articulo);

      if (guardadoExitoso) {
        cerrarModal();
      }
    } catch (error) {
      alert("Error al intentar actualizar el stock");
    }
  };

  const guardarArticuloInsumo = async (form: ArticuloInsumo) => {
    const URL = form.id
      ? `${host}/api/insumos/actualizar/${form.id}`
      : `${host}/api/insumos/crear`;

    // Transform data to match API structure
    const dataToSend = {
      id: form.id || null,
      nombre: form.nombre,
      descripcion: form.descripcion,
      precio: form.precio,
      existe: form.existe,
      esParaElaborar: form.esParaElaborar,
      imagenArticulo: form.imagenArticulo,
      subcategoria: {
        id: form.subcategoria.id,
        denominacion: form.subcategoria.denominacion || "",
        categoria: form.subcategoria.categoria
          ? {
              id: form.subcategoria.categoria.id,
              denominacion: form.subcategoria.categoria.denominacion || "",
              esParaElaborar:
                form.subcategoria.categoria.esParaElaborar || false,
              imagen: form.subcategoria.categoria.imagen || "",
            }
          : null,
      },
      unidadMedida: {
        id: form.unidadMedida.id,
        unidad: form.unidadMedida.unidad || "",
      },
      precioCompra: form.precioCompra,
      stockArticuloInsumo: {
        id: form.stockArticuloInsumo.id || null,
        minStock: form.stockArticuloInsumo.minStock,
        cantidad: form.stockArticuloInsumo.cantidad,
        sucursalId: form.stockArticuloInsumo.sucursal?.id || 1,
      },
    };

    try {
      if (form.id) {
        const response = await axios.put(URL, dataToSend, axiosConfig);

        console.log("Se actualizo el articulo: ", response.status);
        return true;
      } else {
        const response = await axios.post(URL, dataToSend, axiosConfig);

        console.log("Se guardo el articulo", response.status);
        return true;
      }
    } catch (error) {
      console.error("ERROR", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
        // Opcional: redirigir al login
        // window.location.href = "/login";
      } else {
        alert("Error al guardar el insumo. Por favor, intenta de nuevo.");
      }
      return false;
    }
  };

  if (!modificar.operacion) return null;

  return (
    <>
      {/**Fondo oscurecido */}
      <div
        onClick={() => {
          cerrarModal();
        }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        {/**Modal */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl w-1/2 max-w-lg"
        >
          <div className="flex flex-col gap-5 items-center px-5 py-10">
            <div className="text-2xl font-bold text-center py-2">
              <h1>{titulo}</h1>
            </div>

            <div className="w-1/2">
              <h1 className="max-full">
                {modificar.operacion == "minimo"
                  ? "Stock minimo:"
                  : `Stock actual: ${
                      modificar.articulo?.stockArticuloInsumo?.cantidad || 0
                    } ${modificar.articulo?.unidadMedida?.unidad}${
                      modificar.articulo?.unidadMedida?.unidad == "unidad" &&
                      modificar.articulo?.stockArticuloInsumo?.cantidad != 1
                        ? "es"
                        : ""
                    }`}
              </h1>
              <input
                value={input}
                onBlur={() => {
                  const entero = Math.floor(Number(input));
                  setInput(entero > 0 ? String(entero) : "");
                }}
                onChange={(e) =>
                  setInput(Number(e.target.value) > 0 ? e.target.value : "")
                }
                className="border rounded-xl p-2 w-full"
                type="number"
                step={1}
                min={0}
              />
              {!input && (
                <h4 className="text-red-600">Debe completar el campo!</h4>
              )}
            </div>

            <div className="w-2/3 m-auto flex flex-col gap-2 items-center justify-center">
              <button
                onClick={() => {
                  input ? guardar() : () => {};
                }}
                className="bg-[#0A76E1] text-white w-2/3 py-4 text-xl rounded-4xl"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
