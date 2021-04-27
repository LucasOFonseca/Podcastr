import axios from 'axios'

// Define uma URL base que será usada em todas as requisições
export const api = axios.create({
    baseURL: 'http://localhost:3333/'
})