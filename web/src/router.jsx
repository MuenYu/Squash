import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import LoginPage from "./page/Login";
import HomePage from "./page/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
    ],
  },
]);

export default router;
