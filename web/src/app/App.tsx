import { LargeComponent } from "@shared/components/LargeComponent";

function App() {
  return (
    <div
      style={{
        padding: "20px",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <LargeComponent />
    </div>
  );
}

export default App;
