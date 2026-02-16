const SERVER_IP = '192.168.x.x'; 

export const API_URL = import.meta.env.DEV 
  ? '/api'
  : `http://${SERVER_IP}:8080/api`;

export const MINIO_URL = import.meta.env.DEV
  ? '/rip'
  : `http://${SERVER_IP}:9000/browser/my-bucket`;