import { useState } from 'react';

interface AgregarTelefonoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgregar: (numero: string) => void;
}

export default function AgregarTelefonoModal({
  isOpen,
  onClose,
  onAgregar,
}: AgregarTelefonoModalProps) {
  const [numero, setNumero] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (!numero.trim()) {
      setError('El teléfono es obligatorio');
      return;
    }
    
    if (!/^[0-9]+$/.test(numero)) {
      setError('Solo se permiten números');
      return;
    }
    
    if (numero.length !== 10) {
      setError('El teléfono debe tener 10 dígitos');
      return;
    }

    onAgregar(numero);
    handleClose();
  };

  const handleClose = () => {
    setNumero('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#444444] rounded-xl max-w-md w-full shadow-2xl">
        <div className="bg-[#333333]/40 px-6 py-4 border-b border-white/10">
          <h3 className="text-xl font-semibold text-white">Agregar teléfono</h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Número de teléfono
            </label>
            <input
              type="text"
              value={numero}
              onChange={(e) => {
                setNumero(e.target.value);
                setError('');
              }}
              maxLength={10}
              placeholder="Ej: 2615874398"
              className="w-full px-4 py-2.5 rounded-lg bg-[#999999]/35 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D93F21] transition-all"
              autoFocus
            />
            {error && (
              <p className="text-red-400 text-sm mt-2">{error}</p>
            )}
            <p className="text-gray-400 text-xs mt-2">
              Ingrese un número de 10 dígitos sin espacios ni guiones
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={handleClose}
              className="bg-[#999999]/35 hover:bg-[#999999]/50 px-6 py-2.5 rounded-lg text-white font-medium shadow-md hover:shadow-lg transition-all duration-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-[#D93F21] hover:bg-[#C13519] px-6 py-2.5 rounded-lg text-white font-medium shadow-md hover:shadow-lg transition-all duration-300"
            >
              Agregar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
