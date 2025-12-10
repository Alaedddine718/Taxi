import React, { useState } from "react";
import Card from "../common/Card";
import Button from "../common/Button";
import { startSystem } from "../../api/uniataxiApi";

function StartSimulationForm({ onSuccess }) {
  const [numTaxis, setNumTaxis] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await startSystem(numTaxis);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      setError("Error al iniciar el sistema");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Iniciar simulación">
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
      >
        <label>
          Nº de taxis
          <input
            type="number"
            min="1"
            value={numTaxis}
            onChange={(e) =>
              setNumTaxis(parseInt(e.target.value || "1", 10))
            }
            style={{
              width: "100%",
              padding: "0.4rem",
              borderRadius: 6,
              border: "1px solid #333",
              background: "#020617",
              color: "white",
              marginTop: "0.25rem",
            }}
          />
        </label>

        {error && (
          <p style={{ color: "#f97316", fontSize: "0.8rem" }}>{error}</p>
        )}

        <Button type="submit" disabled={loading}>
          {loading ? "Iniciando..." : "Iniciar sistema"}
        </Button>
      </form>
    </Card>
  );
}

export default StartSimulationForm;


