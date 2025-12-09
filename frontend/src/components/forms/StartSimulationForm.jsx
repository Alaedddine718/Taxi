// frontend/src/components/forms/StartSimulationForm.jsx
import { useState } from "react";
import Card from "../common/Card";
import Button from "../common/Button";
import { startSystem } from "../../api/uniataxiApi";
import { useSistema } from "../../context/SistemaContext";

function StartSimulationForm() {
  const { reload } = useSistema();
  const [numTaxis, setNumTaxis] = useState(5);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    try {
      await startSystem(Number(numTaxis)); // llama a POST /start
      alert("Sistema iniciado correctamente");
      reload(); // recarga /status
    } catch (err) {
      console.error("Error al iniciar sistema", err);
      setError("No se pudo iniciar el sistema");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Card title="Iniciar simulación">
      <p style={{ fontSize: "0.85rem", marginBottom: "0.75rem" }}>
        Define el número de taxis iniciales y arranca el sistema.
      </p>
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: "0.8rem" }}>Nº de taxis</label>
          <input
            type="number"
            min="1"
            value={numTaxis}
            onChange={(e) => setNumTaxis(e.target.value)}
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

        <Button type="submit" disabled={enviando}>
          {enviando ? "Iniciando..." : "Iniciar sistema"}
        </Button>
      </form>
      {error && (
        <div style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "#ff6b6b" }}>
          {error}
        </div>
      )}
    </Card>
  );
}

export default StartSimulationForm;

