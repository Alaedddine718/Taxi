import { useState } from "react";

export function useForm(initialValues) {
  const [values, setValues] = useState(initialValues || {});

  function handleChange(event) {
    const { name, value, type } = event.target;
    let newValue = value;

    if (type === "number") {
      newValue = value === "" ? "" : Number(value);
    }

    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  }

  function resetForm() {
    setValues(initialValues || {});
  }

  return { values, handleChange, resetForm, setValues };
}
