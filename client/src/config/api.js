const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://hearingclinic-admin-bck.onrender.com'  // Replace with your actual backend URL
  : 'http://localhost:5000';

export default API_BASE_URL;
