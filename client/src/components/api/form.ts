// Fichier api.ts (ou axiosConfig.ts)
import axios from 'axios';

const BASE_URL = 'https://coupon-guard.onrender.com'; // Remplacez par votre URL Render


export const axiosform = axios.create({
	baseURL: `${BASE_URL}/api/users/sendMails`, // Notez le chemin corrigé
	withCredentials: true, // Pour les cookies/sessions
	timeout: 10000,
	headers: {
	  'Content-Type': 'application/json',
	  'Accept': 'application/json'
	}
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