export const BASE_URL = process.env.NEXT_PUBLIC_NODE_ENVI === 'production' 
  ? process.env.NEXT_PUBLIC_API_URL 
  : 'http://localhost:5000/api';
//  console.log(process.env.NODE_ENVI);
//  console.log(process.env.API_URL);
    