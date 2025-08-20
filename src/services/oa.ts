import { followOA, openChat, showOAWidget, getUserID } from 'zmp-sdk/apis';
import { API_BASE, OA_ID } from '../config';

export function mountOAFollowWidget(containerId: string, guidingText?: string) {
  if (!OA_ID) return;
  showOAWidget({ id: containerId, guidingText, color: '#E53935' });
}

export async function requestFollowOA() {
  if (!OA_ID) throw new Error('Missing OA_ID');
  return followOA({ id: OA_ID });
}

export async function openOAChat(message?: string) {
  if (!OA_ID) throw new Error('Missing OA_ID');
  return openChat({ id: OA_ID, type: 'oa', message });
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
