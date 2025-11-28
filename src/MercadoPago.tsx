import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { useEffect, useState } from "react";
import { PreferenceMP, host } from "../ts/Clases";

initMercadoPago("APP_USR-a5c8fea6-c76d-4617-bcb2-a3480c37fb20");

interface Props {
  monto: number;
}

const MercadoPago: React.FC<Props> = ({ monto }) => {
  const [preferenceId, setPreferenceId] = useState<string | null>(null);

  useEffect(() => {
    if (monto <= 0) return;

    const fetchPreference = async () => {
      const res = await fetch(`${host}/api/mp/preference?monto=${monto}`, {
        method: "POST",
      });
      const data: PreferenceMP = await res.json();
      setPreferenceId(data.id);
    };

    fetchPreference();
  }, [monto]);

  return (
    <div style={{ width: 300 }}>
      {preferenceId ? (
        <Wallet initialization={{ preferenceId, redirectMode: "self" }} />
      ) : (
        <p>Cargando botón…</p>
      )}
    </div>
  );
};

export default MercadoPago;
