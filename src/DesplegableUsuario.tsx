import { useNavigate } from "react-router-dom";
import { useUser } from "./UserAuth/UserContext";
import { useState, useEffect } from "react";

interface Props {
  alCerrarSesion: () => void;
  cambiarDesplegableUsuario: () => void;
}

export default function DesplegableUsuario({ alCerrarSesion, cambiarDesplegableUsuario }: Props) {
  const navigate = useNavigate();
  const { userSession } = useUser();
  const [visible, setVisible] = useState(false);

  // Abrir animación al montar
  useEffect(() => {
    setVisible(true);
  }, []);

  // Cerrar animación
  const handleCerrar = () => {
    setVisible(false);
    setTimeout(() => cambiarDesplegableUsuario(), 300); 
  };

  return (
    <div
      className={`bg-[#444444] text-white text-lg rounded-b-2xl max-md:*:py-8 font-lato shadow-lg transform transition-all duration-300 ease-in-out 
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"} z-50`}
    >
      <button
        onClick={() => {
          handleCerrar();
          navigate("/misDirecciones");
        }}
        className="flex items-center border-b h-12 w-full"
      >
        <svg className="ml-5" width="40" height="50" viewBox="0 0 78 78" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M39 37.375C43.4873 37.375 47.125 33.7373 47.125 29.25C47.125 24.7627 43.4873 21.125 39 21.125C34.5127 21.125 30.875 24.7627 30.875 29.25C30.875 33.7373 34.5127 37.375 39 37.375Z"
            stroke="#FAF8F5"
            strokeWidth="4.875"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M29.2501 55.25L58.5001 19.5M19.5001 39L45.5001 8.12497M22.7501 16.25L32.5001 24.375M39.0326 71.5C37.8821 71.5 37.3459 71.0092 36.7544 69.3582C35.1944 63.8657 32.2759 59.1207 28.7366 54.665C25.5321 50.3847 20.8066 45.513 18.3496 39.962C11.5246 24.8787 22.1034 6.47397 38.9774 6.49997C56.3161 6.45122 66.7421 25.5157 59.3321 40.7712C57.1551 44.6197 54.6092 48.2475 51.7304 51.6035C47.2421 56.9042 43.2089 62.6437 41.2946 69.368C40.8526 70.6647 40.2871 71.5 39.0326 71.5Z"
            stroke="#FAF8F5"
            strokeWidth="4.875"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <label className="hover:cursor-pointer">Mis Direcciones</label>
      </button>

      <button
        onClick={() => {
          handleCerrar();
          navigate("/misOrdenes");
        }}
        className="flex items-center border-b h-12 w-full"
      >
        <svg className="ml-5" width="40" height="30" viewBox="0 0 52 63" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M42.25 4H9.75C6.16015 4 3.25 6.91015 3.25 10.5V52.75C3.25 56.3399 6.16015 59.25 9.75 59.25H42.25C45.8399 59.25 48.75 56.3399 48.75 52.75V10.5C48.75 6.91015 45.8399 4 42.25 4Z" stroke="#FAF8F5" strokeWidth="6.5"/>
          <path d="M16.25 20.25H35.75M16.25 33.25H35.75M16.25 46.25H29.25" stroke="#FAF8F5" strokeWidth="6.5" strokeLinecap="round"/>
        </svg>
        <label className="hover:cursor-pointer">Mis Ordenes</label>
      </button>

      <button
        onClick={() => {
          handleCerrar();
          navigate("/miPerfil");
        }}
        className="flex items-center border-b h-12 w-full"
      >
        <svg className="ml-5" width="40" height="78" viewBox="0 0 78 78" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M39 13C35.9832 13 33.0899 14.1984 30.9567 16.3317C28.8234 18.4649 27.625 21.3582 27.625 24.375C27.625 27.3918 28.8234 30.2851 30.9567 32.4183C33.0899 34.5516 35.9832 35.75 39 35.75C42.0168 35.75 44.9101 34.5516 47.0433 32.4183C49.1766 30.2851 50.375 27.3918 50.375 24.375C50.375 21.3582 49.1766 18.4649 47.0433 16.3317C44.9101 14.1984 42.0168 13 39 13ZM21.125 24.375C21.125 19.6343 23.0083 15.0877 26.3605 11.7355C29.7127 8.38325 34.2593 6.5 39 6.5C43.7407 6.5 48.2873 8.38325 51.6395 11.7355C54.9918 15.0877 56.875 19.6343 56.875 24.375C56.875 29.1157 54.9918 33.6623 51.6395 37.0145C48.2873 40.3667 43.7407 42.25 39 42.25C34.2593 42.25 29.7127 40.3667 26.3605 37.0145C23.0083 33.6623 21.125 29.1157 21.125 24.375ZM9.75 61.75C9.75 57.4402 11.462 53.307 14.5095 50.2595C17.557 47.212 21.6902 45.5 26 45.5H52C56.3098 45.5 60.443 47.212 63.4905 50.2595C66.538 53.307 68.25 57.4402 68.25 61.75V71.5H9.75V61.75ZM26 52C23.4141 52 20.9342 53.0272 19.1057 54.8557C17.2772 56.6842 16.25 59.1641 16.25 61.75V65H61.75V61.75C61.75 59.1641 60.7228 56.6842 58.8943 54.8557C57.0658 53.0272 54.5859 52 52 52H26Z"
            fill="#FAF8F5"
          />
        </svg>
        <label className="hover:cursor-pointer">Mi Perfil</label>
      </button>

      <button className="flex items-center h-12 w-full" 
        onClick={() => {
          alCerrarSesion(); 
          navigate("/inicio"); 
        }} 
        type="button" >
        <svg className="ml-5" width="40" height="78" viewBox="0 0 78 78" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.25 68.25C14.4625 68.25 12.9328 67.6141 11.661 66.3423C10.3892 65.0704 9.75217 63.5397 9.75 61.75V16.25C9.75 14.4625 10.387 12.9328 11.661 11.661C12.935 10.3892 14.4647 9.75217 16.25 9.75H35.75C36.6708 9.75 37.4433 10.062 38.0673 10.686C38.6913 11.31 39.0022 12.0813 39 13C38.9978 13.9187 38.6858 14.6911 38.064 15.3172C37.4422 15.9434 36.6708 16.2543 35.75 16.25H16.25V61.75H35.75C36.6708 61.75 37.4433 62.062 38.0673 62.686C38.6913 63.31 39.0022 64.0813 39 65C38.9978 65.9187 38.6858 66.6911 38.064 67.3172C37.4422 67.9434 36.6708 68.2543 35.75 68.25H16.25ZM55.8187 42.25H32.5C31.5792 42.25 30.8078 41.938 30.186 41.314C29.5642 40.69 29.2522 39.9187 29.25 39C29.2478 38.0813 29.5598 37.31 30.186 36.686C30.8122 36.062 31.5835 35.75 32.5 35.75H55.8187L49.725 29.6562C49.1292 29.0604 48.8312 28.3292 48.8312 27.4625C48.8312 26.5958 49.1292 25.8375 49.725 25.1875C50.3208 24.5375 51.0792 24.1984 52 24.1702C52.9208 24.1421 53.7063 24.4541 54.3563 25.1062L65.975 36.725C66.625 37.375 66.95 38.1333 66.95 39C66.95 39.8667 66.625 40.625 65.975 41.275L54.3563 52.8937C53.7063 53.5437 52.9349 53.8557 52.0423 53.8298C51.1496 53.8037 50.3772 53.4647 49.725 52.8125C49.1292 52.1625 48.8453 51.3912 48.8735 50.4985C48.9017 49.6058 49.2126 48.8605 49.8062 48.2625L55.8187 42.25Z" fill="#FAF8F5"/>
        </svg>
        Cerrar Sesion
      </button>

      {userSession && (
        <div className="px-5 py-3 text-sm border-t border-gray-600">
          <p className="text-gray-300">Usuario: {userSession.username}</p>
          <p className="text-gray-300">Rol: {userSession.role}</p>
        </div>
      )}
    </div>
  );
}
