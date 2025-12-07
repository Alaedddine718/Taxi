import AppRouter from "./router/router";
import { SistemaProvider } from "./context/SistemaContext";

function App() {
  return (
    <SistemaProvider>
      <AppRouter />
    </SistemaProvider>
  );
}

export default App;

