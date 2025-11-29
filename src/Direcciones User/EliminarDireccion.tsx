import React from "react";

type EliminarDireccionProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const EliminarDireccion: React.FC<EliminarDireccionProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-3xl max-md:w-xs max-md:p-5 shadow-lg w-full max-w-md">

        <p className="text-black text-center mb-2 font-lato text-lg">¿Estás seguro de eliminar la dirección?</p>
        <p className="text-gray-600 text-center mb-13 font-lato mt-5">No podrás revertir esto</p>

        <div className="flex justify-end gap-8 mb-2 mr-12">
          <button
            onClick={onClose}
              className="bg-white text-[#0A76E1] py-2 px-2 rounded-full hover:bg-gray-200 border border-[#0A76E1] w-32"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="bg-[#0A76E1] text-white py-2 px-2 rounded-full hover:bg-[#0A5BBE] w-32"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EliminarDireccion;
