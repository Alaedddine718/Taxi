import Card from "../common/Card";
import Button from "../common/Button";
import { useForm } from "../../hooks/useForm";

function NewClientForm() {
  const { values, handleChange, resetForm } = useForm({
    name: "",
    hasBackground: false,
  });

  function handleSubmit(e) {
    e.preventDefault();
    alert(
      `Cliente "${values.name || "sin nombre"}" creado (demo, sin backend todavía)`
    );
    resetForm();
  }

  return (
    <Card
      title="Registrar cliente (opcional)"
      subtitle="Ejemplo de formulario de alta de cliente"
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
          Nombre del cliente
          <input
            type="text"
            name="name"
            value={values.name}
            onChange={handleChange}
            style={inputStyle}
          />
        </label>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: "0.8rem",
            gap: "0.35rem",
            marginBottom: "0.6rem",
          }}
        >
          <input
            type="checkbox"
            checked={!!values.hasBackground}
            onChange={(e) =>
              handleChange({
                target: {
                  name: "hasBackground",
                  value: e.target.checked,
                  type: "text",
                },
              })
            }
          />
          Tiene antecedentes (simulado)
        </label>

        <Button type="submit" variant="secondary">
          Registrar (demo)
        </Button>
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

export default NewClientForm;
