import { PlotSearch } from "@shared/components/PlotSearch";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function App() {
  return (
    <div
      style={{
        padding: "20px",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <QueryClientProvider client={new QueryClient()}>
        <PlotSearch />
      </QueryClientProvider>
    </div>
  );
}

export default App;
