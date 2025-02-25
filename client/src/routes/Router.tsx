import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from '@/pages/Home'
import Layout from '@/components/Layout'
import ErrorPage from '@/pages/ErrorPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />
      },
      // Ajoutez d'autres routes ici
      // {
      //   path: '/about',
      //   element: <About />
      // },
    ]
  }
])

export default function Router() {
  return <RouterProvider router={router} />
} 