import { GiNetworkBars } from "react-icons/gi"; 
import { AiOutlineSkype } from "react-icons/ai"; 
import { AiOutlineTwitter } from "react-icons/ai"; 
import { AiOutlineLinkedin } from "react-icons/ai"; 
import { AiOutlineFacebook } from "react-icons/ai"; 
import { AiOutlineInstagram } from "react-icons/ai"; 
// Footer.tsx


const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white p-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        {/* Colonne 1 : Description */}
        <div className="md:w-1/4">
          <img src="/logo.png" alt="Logo" className="w-32 h-32" />
          
          <h3 className="text-xl font-bold mb-2">couponGuard</h3>
          <p className="text-sm">
            couponGuard est un service de vérification de coupons en ligne. Cette plateforme vous permet de vérifier la validité de vos cartes de manière fiable et sécurisée.
          </p>
        </div>

        {/* Colonne 2 : Services */}
        <div className="md:w-1/4">
          <h3 className="text-xl font-bold mb-2">Services</h3>
          <ul className="list-none">
          <li className="mb-1"><a href="#" className="hover:text-gray-300">Vérifications des coupons Paysafcard</a></li>
            
            <li className="mb-1"><a href="#" className="hover:text-gray-300">Vérifications des coupons Neosurf</a></li>
            <li className="mb-1"><a href="#" className="hover:text-gray-300">Vérifications des coupons PCS</a></li>
            <li className="mb-1"><a href="#" className="hover:text-gray-300">Vérifications des coupons Amazon</a></li>
            <li className="mb-1"><a href="#" className="hover:text-gray-300">Vérifications des coupons GOOGLE PAY</a></li>
            <li className="mb-1"><a href="#" className="hover:text-gray-300">Vérifications des coupons TRANSCASH</a></li>
            <li><a href="#" className="hover:text-gray-300">Bien d'autres</a></li>
          </ul>
        </div>

        {/* Colonne 3 : Réseaux Sociaux */}
        <div className="md:w-1/4">
          <h3 className="text-xl font-bold mb-2">Réseaux</h3>
          <ul className="list-none">
            <li className="mb-1"><a href="#" className="flex items-center hover:text-gray-300"><AiOutlineInstagram /> Instagram</a></li>
            <li className="mb-1"><a href="#" className="flex items-center hover:text-gray-300"> <AiOutlineFacebook /> Facebook</a></li>
            <li className="mb-1"><a href="#" className="flex items-center hover:text-gray-300"><AiOutlineLinkedin /> LinkedIn</a></li>
            <li className="mb-1"><a href="#" className="flex items-center hover:text-gray-300"><AiOutlineTwitter /> Twitter</a></li>
            <li className="mb-1"><a href="#" className="flex items-center hover:text-gray-300"><AiOutlineSkype />  Skype</a></li>
            <li><a href="#" className="flex items-center hover:text-gray-300"><AiOutlineInstagram /> Discord</a></li>
          </ul>
        </div>

        {/* Colonne 4 : Horaires */}
        <div className="md:w-1/4">
          <h3 className="text-xl font-bold mb-2">Horaires</h3>
          <p>Toujours ouverts ! La plateforme est disponible 24h/24 et 7j/7</p>
          <div className="mt-4 flex space-x-4">

          <GiNetworkBars />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;