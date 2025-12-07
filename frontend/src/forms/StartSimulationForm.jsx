import Card from "../common/Card";
import Button from "../common/Button";
import { useForm } from "../../hooks/useForm";
import { startSystem } from "../../api/uniataxiApi";
import { useSistema } from "../../context/SistemaContext";

function StartSimulationForm() {
  const { reload } = useSistema();
  const { values, handleChange } = useForm({
    numTaxis: 5,
  });

  async function handleSubmit(e) {
    e.preventDefault();
    const numTaxis = Number(values.numTaxis || 0);
    if (numTaxis <= 0) {
      alert("Introduce un número de taxis mayor que 0");
      return;
    }

    try {
      await startSystem({ numTaxis });
      reload();
      alert(`Sistema inicializado con ${numTaxis} taxis`);
    } catch (err) {
      console.error(err);
      alert("Error al inicializar el sistema");
    }
  }

  return (
    <Card
      title="Iniciar simulación"
      subtitle="Define el número de taxis iniciales y arranca el sistema"
    >
      <form onSubmit={handleSubmit}>
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: "0.85rem",
            marginBottom: "0.5rem",
          }}
        >
          Nº de taxis
          <input
            type="number"
            name="numTaxis"
            min={1}
            value={values.numTaxis}
            onChange={handleChange}
            style={{
              marginTop: "0.2rem",
              padding: "0.25rem 0.4rem",
              borderRadius: "0.4rem",
              border: "1px solid rgba(148,163,184,0.7)",
              background: "rgba(15,23,42,0.9)",
              color: "#e5e7eb",
              fontSize: "0.85rem",
            }}
          />
        </label>
        <Button type="submit">Iniciar sistema</Button>
      </form>
    </Card>
  );
}

export default StartSimulationForm;
