import { CheckoutSDK } from 'zmp-sdk/apis/payment';

export type PaymentMethod = 'zalopay' | 'cod' | string;

export async function payWithCheckout(params: {
  amount: number;
  desc: string;
  allowed?: PaymentMethod[];
  createOrder?: (amount: number, desc: string) => Promise<{ transId?: string; mac?: string }>;
}) {
  const { amount, desc, allowed = ['zalopay', 'cod'], createOrder } = params;

  const { method } = await CheckoutSDK.selectPaymentMethod({
    channels: allowed.map((m) => ({ method: m })),
  });

  let transId: string | undefined;
  let mac: string | undefined;
  if (createOrder) {
    const r = await createOrder(amount, desc);
    transId = r?.transId;
    mac = r?.mac;
  }

  const result = await CheckoutSDK.purchase({ amount, desc, method, transId, mac });
  return { method, result };
}
