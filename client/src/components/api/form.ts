import axios from 'axios'

const BASE_URL = 'http://localhost:3030'

export  const axiosform = axios.create({
	baseURL: `${BASE_URL}/sendMails`
})