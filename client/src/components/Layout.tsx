import { Outlet } from 'react-router-dom'
import { WarpBackground } from './magicui/warp-background';
import Footer from './Footer';
export default function Layout() {
  return (
    <div className="min-h-screen">
      {/* Ajoutez votre header ici */}
      <main>
        <WarpBackground>
          <Outlet />
        </WarpBackground>
      </main>
      {/* Ajoutez votre footer ici */}
      <Footer />
    </div>
  )
} 