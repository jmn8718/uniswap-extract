import axios, { AxiosRequestConfig } from 'axios';

export const request = (args: AxiosRequestConfig) => axios({ 
  ...args,
  headers: {
    Authorization: process.env.API_SECRET_KEY ?? ''
  },
  baseURL: process.env.API_HOST
});