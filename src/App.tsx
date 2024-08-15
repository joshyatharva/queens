import "./App.css";
import { QueenProvider } from "./context/queen";
import { Queens } from "./Queens";

function App() {
  return (
    <QueenProvider>
      <Queens />
    </QueenProvider>
  );
}

export default App;
