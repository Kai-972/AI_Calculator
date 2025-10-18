import dotenv from 'dotenv'
dotenv.config()

export const SERVER_URL = 'localhost'
export const PORT = '8900'
export const ENV = 'development'
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
