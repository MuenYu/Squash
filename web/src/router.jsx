import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import LoginPage from "./page/Login";
import HomePage from "./page/Home";
import NotFoundPage from "./page/NotFound";
import { Navigate } from "react-router-dom";
import { authKey } from "./api/const";

const ProtectedRoute = ({ Component }) => {
  const token = localStorage.getItem(authKey);
  return token ? <Component /> : <Navigate to="/login" />;
};

const PublicRoute = ({ Component }) => {
  const token = localStorage.getItem(authKey);
  return token ? <Navigate to="/" /> : <Component />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <ProtectedRoute Component={HomePage} />,
      },
      {
        path: "login",
        element: <PublicRoute Component={LoginPage} />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default router;
