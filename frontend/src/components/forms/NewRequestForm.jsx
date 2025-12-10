import React, { useState } from "react";
import Card from "../common/Card";
import Button from "../common/Button";
import { createRequest } from "../../api/uniataxiApi";

function NewRequestForm({ onSuccess }) {
  const [form, setForm] = useState({
    clientName: "Cliente 1",
    originX: 0,
    originY: 0,
    destX: 5,
    destY: 5,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "clientName" ? value : Number(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createRequest(form);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      setError("Error al crear solicitud");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Nueva solicitud de taxi">
      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0.75rem 1rem",
        }}
      >
        <div style={{ gridColumn: "1 / -1" }}>
          <label>
            Nombre del cliente
            <input
              name="clientName"
              value={form.clientName}
              onChange={handleChange}
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
        </div>

        {[
          ["originX", "Origen X"],
          ["originY", "Origen Y"],
          ["destX", "Destino X"],
          ["destY", "Destino Y"],
        ].map(([name, label]) => (
          <div key={name}>
            <label>
              {label}
              <input
                type="number"
                name={name}
                value={form[name]}
                onChange={handleChange}
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
          </div>
        ))}

        <div style={{ gridColumn: "1 / -1" }}>
          {error && (
            <p style={{ color: "#f97316", fontSize: "0.8rem" }}>{error}</p>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? "Creando..." : "Crear solicitud"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default NewRequestForm;



