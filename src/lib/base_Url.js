export const BASE_URL = process.env.NODE_ENVI === 'production' 
  ? process.env.API_URL 
  : 'http://localhost:3001/api';
//  console.log(process.env.NODE_ENVI);
//  console.log(process.env.API_URL);
 