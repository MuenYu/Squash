import ThemeToggle from "./components/ThemeToggle";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div>
      <Outlet />
      <ThemeToggle />
    </div>
  );
}

export default App;
