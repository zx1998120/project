import React, {useState} from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {enableMapSet} from 'immer'
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import LoginPage from "./page/Login/LoginPage.tsx";
import {searchFlightQueryLoader} from "./api/SearchFlightAPI.ts";
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import {Switch} from "@mui/material";
import {searchFlightQueryLoader_test} from "./api/TestQueryClient.ts";
// require to set map
enableMapSet()

function Toplevel() {
    const [isTesting, setIsTesting] = useState(true)
    const queryClient = new QueryClient()
    const router = createBrowserRouter([
        {
            path: "/",
            element: <App />,
            loader : isTesting ?  searchFlightQueryLoader_test : searchFlightQueryLoader
        },
        {
            path: "/login",
            element: <LoginPage/>,
        },
    ]);

    return <>
        <Switch   checked={isTesting}
                  onChange={()=>setIsTesting(!isTesting)} />
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    </>
}
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <Toplevel/>
  </React.StrictMode>,
)
