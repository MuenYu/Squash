import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import LoginPage from "./page/Login";
import HomePage from "./page/Home";
import NotFoundPage from "./page/NotFound";
import SettingForm from "./components/SettingForm";
import Progress from "./components/Progress";
import CompressionResult from "./components/CompressionResult";
import { fetchHistory, fetchUploadVideo } from "./api/requests";
import IntroPage from "./page/Intro";
import MFASetupPage from "./page/MFASetup";
import GoogleOAuthCallback from './page/GoogleOAuthCallback';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "panel",
        element: <HomePage />,
        loader: fetchHistory,
        children: [
          {
            index: true,
            element: <SettingForm />,
            loader: fetchUploadVideo,
          },
          {
            path: "compressing",
            element: <Progress />,
          },
          {
            path: "complete",
            element: <CompressionResult />,
            loader: fetchHistory,
          },
        ],
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "mfa-setup",
        element: <MFASetupPage />,
      },
      {
        path: "googlecallback",
        element: <GoogleOAuthCallback />,
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
