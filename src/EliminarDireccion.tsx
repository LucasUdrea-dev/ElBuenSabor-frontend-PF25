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
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-black text-2xl font-lato mb-10 text-center-left">Confirmar</h2>

        <p className="text-black text-center mb-2 font-lato text-lg">¿Estás seguro?</p>
        <p className="text-gray-600 text-center mb-13 font-lato">No podrás revertir esto</p>

        <div className="flex justify-end gap-13 mb-2">
          <button
            onClick={onClose}
              className="bg-white text-[#0A76E1] py-3 px-3 rounded-full hover:bg-gray-200 border border-[#0A76E1] w-40"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="bg-[#0A76E1] text-white py-3 px-3 rounded-full hover:bg-[#0A5BBE] w-40"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EliminarDireccion;
