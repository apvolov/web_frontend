const target_tauri = false

export const api_proxy_addr = "http://10.33.0.2:8080"
export const img_proxy_addr = "http://10.33.0.2:9000"

export const dest_api = (target_tauri) ? api_proxy_addr : "/api"; 
export const dest_img = (target_tauri) ? `${img_proxy_addr}/rip` : "/rip"; 
export const dest_root = (target_tauri) ? "" : "/web_frontend/";