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
import { fetchCompressedVideoList } from "./api/requests";
import IntroPage from "./page/Intro";

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
        loader: fetchCompressedVideoList,
        children: [
          {
            index: true,
            element: <SettingForm />,
          },
          {
            path: "compressing",
            element: <Progress />,
          },
          {
            path: "complete",
            element: <CompressionResult />,
            loader: fetchCompressedVideoList,
          },
        ],
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        index: true,
        element: <IntroPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default router;
