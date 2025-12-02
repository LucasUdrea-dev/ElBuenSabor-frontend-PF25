import React from "react";

interface LoadingTableProps {
  nombre: string;
}

export const LoadingTable: React.FC<LoadingTableProps> = ({ nombre }) => {
  return (
    <div className="text-base text-center py-20 text-gray-500 font-lato">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D93F21]" />
        <p>Cargando {nombre}...</p>
      </div>
    </div>
  );
};
