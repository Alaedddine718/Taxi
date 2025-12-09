// frontend/src/components/forms/NewRequestForm.jsx
import { useState } from "react";
import Card from "../common/Card";
import Button from "../common/Button";
import { requestTaxi } from "../../api/uniataxiApi";
import { useSistema } from "../../context/SistemaContext";

function NewRequestForm() {
  const { reload } = useSistema();

  const [name, setName] = useState("Cliente 1");
  const [originX, setOriginX] = useState(0);
  const [originY, setOriginY] = useState(0);
  const [destX, setDestX] = useState(5);
  const [destY, setDestY] = useState(5);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    try {
      await requestTaxi({
        name,
        originX: Number(originX),
        originY: Number(originY),
        destX: Number(destX),
        destY: Number(destY),
      });
      alert("Solicitud de taxi creada correctamente");
      reload(); // vuelve a pedir /status
    } catch (err) {
      console.error("Error al crear solicitud", err);
      setError("No se pudo crear la solicitud");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Card title="Nueva solicitud de taxi">
      <p style={{ fontSize: "0.85rem", marginBottom: "0.75rem" }}>
        Simula que un cliente pide un taxi con origen y destino.
      </p>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
      >
        <div>
          <label style={{ fontSize: "0.8rem" }}>Nombre del cliente</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              padding: "0.4rem 0.6rem",
              borderRadius: "0.4rem",
              border: "1px solid #333",
              background: "#050b1a",
              color: "white",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "0.8rem" }}>Origen X</label>
            <input
              type="number"
              value={originX}
              onChange={(e) => setOriginX(e.target.value)}
              style={{
                width: "100%",
                padding: "0.4rem 0.6rem",
                borderRadius: "0.4rem",
                border: "1px solid #333",
                background: "#050b1a",
                color: "white",
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "0.8rem" }}>Origen Y</label>
            <input
              type="number"
              value={originY}
              onChange={(e) => setOriginY(e.target.value)}
              style={{
                width: "100%",
                padding: "0.4rem 0.6rem",
                borderRadius: "0.4rem",
                border: "1px solid #333",
                background: "#050b1a",
                color: "white",
              }}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "0.8rem" }}>Destino X</label>
            <input
              type="number"
              value={destX}
              onChange={(e) => setDestX(e.target.value)}
              style={{
                width: "100%",
                padding: "0.4rem 0.6rem",
                borderRadius: "0.4rem",
                border: "1px solid #333",
                background: "#050b1a",
                color: "white",
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "0.8rem" }}>Destino Y</label>
            <input
              type="number"
              value={destY}
              onChange={(e) => setDestY(e.target.value)}
              style={{
                width: "100%",
                padding: "0.4rem 0.6rem",
                borderRadius: "0.4rem",
                border: "1px solid #333",
                background: "#050b1a",
                color: "white",
              }}
            />
          </div>
        </div>

        <Button type="submit" disabled={enviando}>
          {enviando ? "Creando..." : "Crear solicitud"}
        </Button>

        {error && (
          <div style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "#ff6b6b" }}>
            {error}
          </div>
        )}
      </form>
    </Card>
  );
}

export default NewRequestForm;


