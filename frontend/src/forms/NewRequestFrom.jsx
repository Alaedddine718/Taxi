import Card from "../common.Card";
import Button from "../common/Button";
import { useForm } from "../../hooks/useForm";
import { requestTaxi } from "../../api/uniataxiApi";
import { useSistema } from "../../context/SistemaContext";

function NewRequestForm() {
  const { reload } = useSistema();
  const { values, handleChange, resetForm } = useForm({
    name: "Cliente 1",
    origin_x: 0,
    origin_y: 0,
    dest_x: 5,
    dest_y: 5,
  });

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await requestTaxi(values);
      reload();
      alert("Solicitud de taxi creada");
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Error al crear la solicitud");
    }
  }

  return (
    <Card
      title="Nueva solicitud de taxi"
      subtitle="Simula que un cliente pide un taxi con origen y destino"
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "0.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: "0.85rem",
          }}
        >
          Nombre del cliente
          <input
            type="text"
            name="name"
            value={values.name}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        <div />

        <FormNumberInput
          label="Origen X"
          name="origin_x"
          value={values.origin_x}
          onChange={handleChange}
        />
        <FormNumberInput
          label="Origen Y"
          name="origin_y"
          value={values.origin_y}
          onChange={handleChange}
        />
        <FormNumberInput
          label="Destino X"
          name="dest_x"
          value={values.dest_x}
          onChange={handleChange}
        />
        <FormNumberInput
          label="Destino Y"
          name="dest_y"
          value={values.dest_y}
          onChange={handleChange}
        />

        <div style={{ gridColumn: "1 / -1", marginTop: "0.3rem" }}>
          <Button type="submit">Crear solicitud</Button>
        </div>
      </form>
    </Card>
  );
}

const inputStyle = {
  marginTop: "0.2rem",
  padding: "0.25rem 0.4rem",
  borderRadius: "0.4rem",
  border: "1px solid rgba(148,163,184,0.7)",
  background: "rgba(15,23,42,0.9)",
  color: "#e5e7eb",
  fontSize: "0.85rem",
};

function FormNumberInput({ label, name, value, onChange }) {
  return (
    <label
      style={{
        display: "flex",
        flexDirection: "column",
        fontSize: "0.85rem",
      }}
    >
      {label}
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        style={inputStyle}
      />
    </label>
  );
}

export default NewRequestForm;
