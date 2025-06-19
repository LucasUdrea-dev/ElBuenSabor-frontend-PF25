import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DesplegableUsuario from "./DesplegableAdmin.tsx";
import Dashboard from "./Dashboard.tsx";
import { obtenerImagen } from "../../../ts/Imagen.ts";
import LoginEmpleados from "../LoginEmpleados/LoginEmpleados.tsx";

export default function NavbarAdmin() {
  const [estaLogeado, setEstaLogeado] = useState(false);
  const [mostrarDesplegableUsuario, setMostrarDesplegableUsuario] =
    useState(false);
  const [mostrarDashboard, setMostrarDashboard] = useState(false);
  const [isLoginEmpleadosOpen, setLoginEmpleadosOpen] = useState(false);

  // Función para verificar si hay una sesión activa
  const verificarSesion = () => {
    const token = localStorage.getItem("employeeToken");
    const userRole = localStorage.getItem("userRole");
    return !!token && userRole === "employee";
  };

  useEffect(() => {
    // Verificar si hay una sesión activa al cargar el componente
    setEstaLogeado(verificarSesion());

    // Escuchar cambios en localStorage para detectar login/logout
    const handleStorageChange = () => {
      setEstaLogeado(verificarSesion());
    };

    // Agregar listener para cambios en localStorage
    window.addEventListener("storage", handleStorageChange);

    // Limpiar el listener al desmontar el componente
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const cambiarDesplegableUsuario = () => {
    setMostrarDesplegableUsuario(!mostrarDesplegableUsuario);
  };

  const cerrarSesion = () => {
    // Limpiar localStorage
    localStorage.removeItem("employeeToken");
    localStorage.removeItem("userRole");

    // Actualizar estado
    setEstaLogeado(false);
    setMostrarDesplegableUsuario(false);
    setMostrarDashboard(false);
  };

  const toggleDashboard = () => {
    setMostrarDashboard(!mostrarDashboard);
    // Cerrar otros desplegables si están abiertos
    if (mostrarDesplegableUsuario) {
      setMostrarDesplegableUsuario(false);
    }
  };

  const handleDashboardSelection = (seccion: string) => {
    console.log(`Sección seleccionada: ${seccion}`);
    setMostrarDashboard(false);
  };

  //modales de registro (Apertura y cierre)
  const abrirLoginEmpleados = () => {
    setLoginEmpleadosOpen(true);
  };

  const cerrarLoginEmpleados = () => {
    setLoginEmpleadosOpen(false);
    // Verificar sesión después de cerrar el modal (por si se logueó)
    setEstaLogeado(verificarSesion());
  };

  return (
    <>
      <div className="bg-[#D93F21] h-15 flex justify-between items-center relative z-40">
        <div className="flex items-center">
          {estaLogeado && (
            <button
              onClick={toggleDashboard}
              className="h-12 w-12 flex items-center justify-center text-white hover:bg-red-600 transition-colors duration-200 ml-2 rounded"
              type="button"
              aria-label="Abrir dashboard"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          )}

          <Link
            className="h-15 flex items-center text-2xl text-white"
            key={"catalogo"}
            to={"/catalogo"}
          >
            <svg
              className="h-12 p-0 ml-4"
              width="50"
              viewBox="0 0 70 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <mask
                id="mask0_10_65"
                maskUnits="userSpaceOnUse"
                x="0"
                y="27"
                width="70"
                height="72"
              >
                <path d="M0 27.6633H70V98.4738H0V27.6633Z" fill="white" />
              </mask>
              <g mask="url(#mask0_10_65)">
                <path
                  d="M34.9787 28.8063C33.9331 28.8063 32.8928 28.8533 31.8526 28.942C30.8176 29.0359 29.7826 29.1716 28.7581 29.3595C27.7284 29.5422 26.7145 29.7718 25.7112 30.0432C24.7026 30.3146 23.7098 30.6329 22.7329 30.993C21.756 31.3584 20.8002 31.7602 19.8603 32.2091C18.9203 32.6527 18.0015 33.138 17.1038 33.6651C16.2061 34.1975 15.34 34.7611 14.4951 35.3665C13.6502 35.9719 12.8317 36.6138 12.0449 37.2871C11.2581 37.9655 10.503 38.6753 9.77954 39.4216C9.06138 40.1627 8.36961 40.9351 7.7201 41.744C7.07058 42.5478 6.45275 43.3776 5.87716 44.2387C5.30157 45.0946 4.76295 45.9818 4.26657 46.8847C3.77019 47.7928 3.31605 48.7217 2.90417 49.6664C2.49228 50.611 2.12263 51.5765 1.79523 52.5577C1.47311 53.5336 1.19324 54.5252 0.955613 55.5325C0.717985 56.5345 0.533163 57.547 0.385305 58.5699C0.242729 59.5928 0.147676 60.6157 0.0948695 61.649C0.0473442 62.6772 0.0420645 63.7053 0.0843095 64.7386C0.126555 65.7668 0.216325 66.7949 0.353622 67.8126C0.490917 68.8355 0.670459 69.8532 0.897525 70.8552C1.12987 71.8625 1.39919 72.8593 1.72131 73.8405C2.03814 74.8216 2.39722 75.7871 2.80383 76.737C3.21044 77.6868 3.65929 78.6158 4.15039 79.5239C4.63621 80.4372 5.16955 81.3244 5.73986 82.1855C6.31017 83.0467 6.91744 83.8869 7.56168 84.6958C8.2112 85.5048 8.8924 86.2824 9.60528 87.0339C10.3234 87.7802 11.0733 88.4952 11.8548 89.1789C12.6364 89.8626 13.4496 90.5097 14.2892 91.1203C15.1288 91.7309 15.9948 92.2998 16.8873 92.8374C17.7797 93.3697 18.6932 93.8655 19.6332 94.3143C20.5679 94.7684 21.5237 95.1807 22.5006 95.546C23.4722 95.9165 24.4597 96.2401 25.4683 96.5219C24.9349 88.6674 25.9911 81.0217 28.6314 73.5952C27.9819 73.3655 27.3799 73.0472 26.8148 72.6558C26.2551 72.2591 25.7587 71.7946 25.3257 71.2623C24.8927 70.73 24.5389 70.1507 24.2696 69.5244C23.995 68.8981 23.8155 68.2458 23.7257 67.5725C23.3824 64.8221 23.7468 62.1657 24.8082 59.6032C25.9647 56.3675 27.5383 53.3457 29.5344 50.5379C29.8195 50.1204 30.242 49.6716 30.7331 49.776C31.4301 49.9221 31.4301 50.8928 31.2347 51.5661C30.2737 55.0523 28.7053 58.4551 28.6314 62.0718C28.5522 62.6511 28.7053 63.1625 29.1014 63.6009C29.904 64.2637 31.0922 63.413 31.6677 62.531C34.3556 58.5855 34.9048 53.4501 37.8936 49.7186C38.0679 49.4472 38.3108 49.2541 38.6118 49.1393C38.8916 49.1079 39.1451 49.1758 39.3775 49.3376C39.6045 49.5046 39.7524 49.7186 39.8105 49.9899C39.9108 50.5536 39.858 51.1016 39.6573 51.6391C38.8547 54.6035 38.0573 57.5417 37.2546 60.4591C36.8956 61.7534 36.8005 63.5539 38.0731 64.0132C39.0342 64.3472 39.99 63.5748 40.6976 62.8285C43.2059 60.3182 47.2878 54.0555 48.2331 55.2924C48.9037 56.4771 47.9585 58.2672 47.61 59.7598C45.5822 68.3293 40.856 72.16 34.8572 73.783C34.2447 73.9501 33.6585 73.8561 33.4526 74.1536C33.2467 74.4406 33.1252 74.759 33.0935 75.1139C31.6889 82.5352 34.2922 90.6402 36.9431 97.7693C38.0626 97.7014 39.1768 97.5814 40.2857 97.4144C41.3947 97.2421 42.493 97.0177 43.5756 96.7411C44.6634 96.4697 45.7353 96.1409 46.7915 95.7652C47.8423 95.3894 48.8773 94.9615 49.8912 94.4865C50.9051 94.0064 51.8925 93.4845 52.8536 92.9156C53.8147 92.3468 54.7441 91.7309 55.6471 91.0734C56.5501 90.4158 57.4161 89.7164 58.2504 88.9754C59.0848 88.2343 59.8821 87.4514 60.6373 86.6373C61.3977 85.8179 62.1158 84.9672 62.7865 84.0852C63.4624 83.198 64.0961 82.2847 64.6769 81.3401C65.2631 80.3902 65.8017 79.4195 66.2928 78.4279C66.7839 77.4311 67.2275 76.4134 67.6183 75.3748C68.009 74.3363 68.3523 73.282 68.6374 72.2069C68.9278 71.1371 69.1655 70.0567 69.3503 68.9608C69.5298 67.87 69.6619 66.7688 69.7358 65.6624C69.815 64.556 69.8361 63.4496 69.8044 62.3432C69.7728 61.2367 69.6883 60.1303 69.551 59.0291C69.4084 57.9332 69.2183 56.8424 68.9701 55.7621C68.7272 54.6765 68.4262 53.6119 68.0777 52.5577C67.7291 51.5034 67.3278 50.4701 66.879 49.4576C66.4301 48.4399 65.9285 47.4483 65.3846 46.4828C64.8354 45.5121 64.2439 44.5727 63.605 43.6646C62.966 42.7513 62.2848 41.8745 61.5614 41.029C60.8379 40.1836 60.0722 39.3694 59.2696 38.597C58.4669 37.8246 57.6273 37.094 56.7507 36.3999C55.8794 35.7057 54.9711 35.0534 54.0312 34.448C53.0965 33.8374 52.1302 33.2789 51.1374 32.7623C50.1447 32.2456 49.1255 31.7811 48.0905 31.3636C47.0502 30.9409 45.9941 30.5755 44.9221 30.2572C43.8449 29.9388 42.7571 29.6727 41.6587 29.4587C40.5603 29.2447 39.4514 29.0829 38.3319 28.9733C37.2177 28.8637 36.0982 28.8063 34.9787 28.8063Z"
                  fill="#FAF8F5"
                />
              </g>
              <path
                d="M25.4683 96.522C25.4683 96.522 29.4235 116.083 37.0434 119.308C44.1089 122.293 49.2311 114.919 44.864 110.582C40.4969 106.245 36.98 97.7693 36.98 97.7693C28.7423 98.239 25.4683 96.522 25.4683 96.522Z"
                fill="#FAF8F5"
              />
              <path
                d="M35.8925 23.4361C35.8925 23.4361 41.3844 21.2911 41.1573 15.6129C40.9302 9.93471 36.5368 7.95152 38.1315 3.05616C39.0081 0.378849 41.4794 -0.617967 38.4589 0.378849C34.7625 1.56355 32.5657 6.05704 35.0371 10.8219C37.5084 15.5868 40.7507 17.9092 35.8925 23.4361Z"
                fill="#FAF8F5"
              />
              <path
                d="M50.7625 20.3048C50.5935 15.9887 47.2351 14.4857 48.4602 10.822C49.1202 8.76049 51.0054 8.01418 48.6872 8.76049C45.8832 9.68424 44.2145 13.0974 46.0839 16.7141C47.9585 20.3309 50.451 22.1053 46.744 26.317C46.744 26.2596 50.9315 24.6208 50.7625 20.3048Z"
                fill="#FAF8F5"
              />
              <path
                d="M24.9614 26.2596C24.9614 26.2596 29.1384 24.6209 28.9694 20.3309C28.8004 16.0357 25.4683 14.5066 26.667 10.8429C27.3377 8.7814 29.2229 8.0351 26.9152 8.7814C24.0637 9.62687 22.4214 13.04 24.3119 16.6568C26.2076 20.2683 28.6684 22.0479 24.9614 26.2596Z"
                fill="#FAF8F5"
              />
            </svg>
            El Buen Sabor
          </Link>
        </div>

        <div>
          {estaLogeado ? (
            <div className="m-0 grid gap-0 items-center">
              <div className="relative">
                <button
                  className="m-auto"
                  onClick={cambiarDesplegableUsuario}
                  type="button"
                >
                  <div
                    className={`grid grid-cols-[3rem_10rem] items-center m-auto px-4 border-l-white border-x-1 ${
                      mostrarDesplegableUsuario &&
                      "border-y-1 border-y-gray-700"
                    }`}
                  >
                    <img
                      className="rounded-4xl"
                      src={obtenerImagen("miniUsuario.jpg")}
                      alt="foto usuario"
                    />
                    <label className="flex items-center hover:cursor-pointer text-white h-15 m-auto">
                      Nombre Apellido
                      <svg
                        className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                          mostrarDesplegableUsuario ? "rotate-180" : "rotate-0"
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </label>
                  </div>
                </button>
                {mostrarDesplegableUsuario && (
                  <div className="absolute z-50 mt-0 w-1/1">
                    <DesplegableUsuario alCerrarSesion={cerrarSesion} />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <button
                onClick={abrirLoginEmpleados}
                className="bg-white rounded-lg m-5 p-1"
                type="button"
              >
                Iniciar Sesion
              </button>
            </div>
          )}
        </div>

        {estaLogeado && (
          <>
            <Dashboard
              onSeleccionar={handleDashboardSelection}
              isCollapsed={!mostrarDashboard}
              onToggleCollapse={() => setMostrarDashboard(false)}
            />
            {mostrarDashboard && (
              <div
                className="fixed inset-0 bg-black/25 backdrop-blur-[2px] z-30"
                onClick={() => setMostrarDashboard(false)}
                style={{ pointerEvents: "auto" }}
              />
            )}
          </>
        )}

        <LoginEmpleados
          isOpen={isLoginEmpleadosOpen}
          onClose={cerrarLoginEmpleados}
        />
      </div>
    </>
  );
}
