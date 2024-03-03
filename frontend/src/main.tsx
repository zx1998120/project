import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { enableMapSet } from 'immer'
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import LoginPage from "./page/login/LoginPage.tsx";
import {searchFlightQueryLoader} from "./api/SearchFlightAPI.ts";

// require to set map
enableMapSet()
const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        loader : searchFlightQueryLoader
    },
    {
        path: "/login",
        element: <LoginPage/>,
    },
]);
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>,
)
