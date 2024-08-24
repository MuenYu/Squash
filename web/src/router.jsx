import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import LoginPage from "./page/Login";
import HomePage from "./page/Home";
import NotFoundPage from "./page/NotFound";
import { Navigate } from "react-router-dom";
import { authKey } from "./api/const";
import SettingForm from "./components/SettingForm";
import Progress from "./components/Progress";
import CompressionResult from "./components/CompressionResult";

const ProtectedRoute = ({ Component }) => {
  const token = localStorage.getItem(authKey);
  return token ? <Component /> : <Navigate to="/login" />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "panel",
        element: <ProtectedRoute Component={HomePage} />,
        children: [
          {
            index: true,
            element: <SettingForm />
          },
          {
            path: 'compressing',
            element: <Progress />
          },
          {
            path: 'complete',
            element: <CompressionResult />
          }
        ]
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        index: true,
        element: <NotFoundPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default router;
