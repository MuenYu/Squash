import ThemeToggle from "./components/ThemeToggle";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="bg-base-200">
      <Outlet />
      <ThemeToggle />
    </div>
  );
}

export default App;
