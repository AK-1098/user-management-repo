// src/App.tsx
import React from "react";
import AppRouter from "./routers/AppRouter";

const App: React.FC = () => {
  return (
    <div className="app-container">
      <AppRouter />
    </div>
  );
};

export default App;
