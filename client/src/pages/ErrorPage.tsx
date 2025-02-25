import { useRouteError } from 'react-router-dom'

export default function ErrorPage() {
  const error = useRouteError() as Error

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">Oops!</h1>
      <p className="text-xl mt-4">Une erreur est survenue.</p>
      <p className="text-gray-600 mt-2">
        {error?.message || "Page non trouvée"}
      </p>
    </div>
  )
} 