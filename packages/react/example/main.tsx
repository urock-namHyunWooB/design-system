import React from "react";
import ReactDOM from "react-dom/client";
import { Button } from "../generated/button";

function App() {
  return (
    <div style={{ padding: "40px" }}>
      <h1
        style={{ marginBottom: "20px", fontSize: "24px", fontWeight: "bold" }}
      >
        Button 컴포넌트 미리보기
      </h1>

      <div style={{ display: "flex", gap: "30px", flexDirection: "column" }}>
        <div>
          <h3
            style={{
              marginBottom: "10px",
              fontSize: "18px",
              fontWeight: "600",
            }}
          >
            Sizes
          </h3>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <Button size="S">Small</Button>
            <Button size="M">Medium</Button>
            <Button size="L">Large</Button>
          </div>
        </div>

        <div>
          <h3
            style={{
              marginBottom: "10px",
              fontSize: "18px",
              fontWeight: "600",
            }}
          >
            Variants
          </h3>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Button variant="filled">Filled</Button>
            <Button variant="outlined-black">Outlined Black</Button>
            <Button variant="outlined-blue">Outlined Blue</Button>
            <Button variant="outlined-red">Outlined Red</Button>
            <Button variant="text-blue">Text Blue</Button>
            <Button variant="text-black">Text Black</Button>
            <Button variant="filled-red">Filled Red</Button>
          </div>
        </div>

        <div>
          <h3
            style={{
              marginBottom: "10px",
              fontSize: "18px",
              fontWeight: "600",
            }}
          >
            With Icons
          </h3>
          <div style={{ display: "flex", gap: "10px" }}>
            <Button leftIcon={<span>👈</span>}>Left Icon</Button>
            <Button rightIcon={<span>👉</span>}>Right Icon</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
