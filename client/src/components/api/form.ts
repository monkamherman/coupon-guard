// import { BASE_URI } from './../../../node_modules/mini-css-extract-plugin/types/utils.d';
// Fichier api.ts (ou axiosConfig.ts)
import axios from 'axios';

// const BASE_URL = import.meta.env.VITE_API_URL; 
// const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';// Remplacez par votre URL Render
const BASE_URL = 'https://coupon-guard.onrender.com'


export const axiosform = axios.create({
	baseURL: `${BASE_URL}/api/sendMails`, // Notez le chemin corrigé
	withCredentials: false, // Pour les cookies/sessions
	timeout: 120000,
	headers: {
	  'Content-Type': 'application/json',
	  'Accept': 'application/json'
	},
	
	validateStatus: (status) => status < 500
	
  });
  // Intercepteur pour erreurs réseau
  axiosform.interceptors.response.use(
	  response => response,
	  
	  error => {
		  if (error.message === 'Network Error') {
			  error.message = 'Problème de connexion au serveur';
			}
	  return Promise.reject(error);
	}
  );