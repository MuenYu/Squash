import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import LoginPage from "./page/Login";
import HomePage from "./page/Home";
import NotFoundPage from "./page/NotFound";
import SettingForm from "./components/SettingForm";
import Progress from "./components/Progress";
import CompressionResult from "./components/CompressionResult";
import { fetchVideoList } from "./api/requests";
import IntroPage from "./page/Intro";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "panel",
        element: <HomePage />,
        loader: fetchVideoList,
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
            loader: fetchVideoList,
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
