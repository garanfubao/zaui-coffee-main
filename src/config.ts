export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Ga Ran FKT';
export const OA_ID = (import.meta.env.VITE_OA_ID || '').trim();
export const API_BASE = import.meta.env.VITE_API_BASE || '/api';

// TODO: Thay thế OA_ID_HERE bằng OA ID thực tế từ Zalo
// Có thể lấy từ: https://developers.zalo.me/docs/social/follow
export const ZALO_OA_ID = import.meta.env.VITE_ZALO_OA_ID || 'YOUR_OA_ID_HERE';