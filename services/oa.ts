import { followOA, openChat, showOAWidget, getUserID } from 'zmp-sdk/apis';
import { API_BASE, ZALO_OA_ID } from '../config';

export function mountOAFollowWidget(containerId: string, guidingText?: string) {
  if (!ZALO_OA_ID || ZALO_OA_ID === 'YOUR_OA_ID_HERE') {
    console.warn('OA ID chưa được cấu hình. Vui lòng thêm OA ID vào config.');
    return;
  }
  showOAWidget({ id: containerId, guidingText, color: '#E53935' });
}

export async function requestFollowOA() {
  if (!ZALO_OA_ID || ZALO_OA_ID === 'YOUR_OA_ID_HERE') {
    throw new Error('OA ID chưa được cấu hình. Vui lòng thêm OA ID vào config.');
  }
  return followOA({ id: ZALO_OA_ID });
}

export async function openOAChat(message?: string) {
  if (!ZALO_OA_ID || ZALO_OA_ID === 'YOUR_OA_ID_HERE') {
    throw new Error('OA ID chưa được cấu hình. Vui lòng thêm OA ID vào config.');
  }
  return openChat({ id: ZALO_OA_ID, type: 'oa', message });
}

export async function getCurrentUserId() {
  const res = await getUserID();
  return (res as any)?.userID || (res as any)?.userId || '';
}

export async function sendMessageFromOA(text: string) {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('Không lấy được user_id');
  const r = await fetch(`${API_BASE}/oa/send-message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, text }),
  });
  if (!r.ok) throw new Error('Gửi tin nhắn thất bại');
  return r.json();
}
