import { lazy } from "react"
import MainLayout from "@/layouts/MainLayout"

const HomePage = lazy(() => import("@/pages/home/Home"))

export const homeRoute = {
  path: "/",
  element: <MainLayout />,
  children: [
    {
      index: true,
      element: <HomePage />,
    },
  ],
} 