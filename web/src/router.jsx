import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import LoginPage from "./page/Login";
import HomePage from "./page/Home";
import NotFoundPage from "./page/NotFound";
import { homeLoader, loginLoader } from "./api/loader";
import { loginAction, initTaskAction } from "./api/action";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
        loader: homeLoader,
        action: initTaskAction,
      },
      {
        path: "login",
        element: <LoginPage />,
        loader: loginLoader,
        action: loginAction,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default router;
