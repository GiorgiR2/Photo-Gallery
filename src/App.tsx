import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import HistoryPage from './pages/History/history';
import MainPage from './pages/Main/main';

import './App.sass';


const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
  },
  {
    path: "/history",
    element: <HistoryPage />,
  },
]);

const App = () => {
  let queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient} >
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;