import { Header } from "@/ui/Header";
import { Footer } from "@/ui/Footer";
import { LargeComponent } from "@shared/components/LargeComponent";

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
      <Header />
      <LargeComponent />
      <Footer showLogo={true} showBot={true} />
    </div>
  );
}

export default App;
