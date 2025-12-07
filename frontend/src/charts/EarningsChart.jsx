import Card from "../common/Card";
import { getFinancial } from "../../api/uniataxiApi";
import { useEffect, useState } from "react";
import Loader from "../common/Loader";
import Button from "../common/Button";

function EarningsChart() {
  const [data, setData] = useState({ per_taxi: [], company_total: 0 });
  const [loading, setLoading] = useState(false);

  async function loadFinancial() {
    try {
      setLoading(true);
      const res = await getFinancial();
      setData(res);
    } catch (err) {
      console.error(err);
      alert("Error al obtener datos financieros");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFinancial();
  }, []);

  const maxTaxiEarnings =
    data.per_taxi.reduce(
      (max, t) => Math.max(max, t.taxi_earnings || 0),
      0
    ) || 1;

  const companyLabel =
    typeof data.company_total === "number"
      ? data.company_total.toFixed(2)
      : data.company_total;

  return (
    <Card
      title="Ingresos por taxi"
      subtitle={`Ingresos totales empresa: ${companyLabel} €`}
    >
      {loading && <Loader />}
      {!loading && (
        <>
          <div
            style={{
              display: "flex",
              gap: "0.4rem",
              alignItems: "flex-end",
              height: "180px",
              marginBottom: "0.5rem",
            }}
          >
            {data.per_taxi.map((t) => {
              const ratio = (t.taxi_earnings || 0) / maxTaxiEarnings;
              return (
                <div
                  key={t.taxi_id}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.25rem",
                  }}
                >
                  <div
                    style={{
                      width: "70%",
                      height: `${Math.max(ratio * 100, 6)}%`,
                      borderRadius: "0.5rem 0.5rem 0 0",
                      background:
                        "linear-gradient(180deg, #22c55e, #16a34a, #15803d)",
                    }}
                  />
                  <span style={{ fontSize: "0.7rem" }}>Taxi {t.taxi_id}</span>
                </div>
              );
            })}
            {data.per_taxi.length === 0 && (
              <span style={{ fontSize: "0.8rem", opacity: 0.8 }}>
                No hay datos de ingresos todavía.
              </span>
            )}
          </div>
          <Button variant="secondary" onClick={loadFinancial}>
            Actualizar datos financieros
          </Button>
        </>
      )}
    </Card>
  );
}

export default EarningsChart;
