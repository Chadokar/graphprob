import "./App.css";
import Graph from "./Graph";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <Graph />
        {/* <Chart /> */}
      </div>
    </QueryClientProvider>
  );
}

export default App;
