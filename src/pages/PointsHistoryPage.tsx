import React from "react";
import { Page, Text, Box } from "zmp-ui";
import { useRecoilValue } from "recoil";
import { pointsState } from "../state/index";

interface PointsTransaction {
  id: string;
  type: 'earn' | 'spend';
  amount: number;
  description: string;
  date: string;
  orderId?: string;
}

const PointsHistoryPage: React.FC = () => {
  const points = useRecoilValue(pointsState);

  const transactions: PointsTransaction[] = [
    {
      id: "1",
      type: 'earn',
      amount: 6500,
      description: "Đơn hàng #ORD001 - Bột Chiên Gà 10kg",
      date: "15/12/2024",
      orderId: "ORD001"
    },
    {
      id: "2",
      type: 'earn', 
      amount: 1550,
      description: "Đơn hàng #ORD002 - Combo Siu Hót 1",
      date: "14/12/2024",
      orderId: "ORD002"
    },
    {
      id: "3",
      type: 'spend',
      amount: -1000,
      description: "Đổi thưởng - Voucher giảm 10K",
      date: "13/12/2024"
    },
    {
      id: "4",
      type: 'earn',
      amount: 4200,
      description: "Đơn hàng #ORD003 - Bột Chiên Gà 5kg",
      date: "12/12/2024", 
      orderId: "ORD003"
    }
  ];

  return (
    <Page>
      {/* Header */}
      <div className="fkt-header">
        <Text className="fkt-username">Lịch sử tích điểm</Text>
      </div>

      <div className="p-4">
        {/* Points Summary */}
        <div className="fkt-card text-center mb-6">
          <Text className="text-2xl font-bold mb-2">Điểm tích lũy hiện tại</Text>
          <Text className="text-4xl font-bold text-red-500 mb-4">{points.toLocaleString()}</Text>
          <Text className="text-gray-600">
            Tích điểm tự động 1% giá trị đơn hàng
          </Text>
        </div>

        {/* Points Rules */}
        <div className="fkt-card mb-6">
          <Text className="font-bold text-lg mb-3">Quy tắc tích điểm</Text>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <Text>Tích điểm tự động 1% giá trị đơn hàng</Text>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <Text>Điểm có thể dùng để đổi thưởng</Text>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <Text>Điểm không có hạn sử dụng</Text>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <Text className="font-bold text-lg mb-4">Lịch sử giao dịch</Text>
        
        {transactions.map((transaction) => (
          <div key={transaction.id} className="fkt-card mb-3">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <Text className="font-medium mb-1">{transaction.description}</Text>
                <Text className="text-sm text-gray-500">{transaction.date}</Text>
                {transaction.orderId && (
                  <Text className="text-xs text-blue-500">#{transaction.orderId}</Text>
                )}
              </div>
              <div className="text-right">
                <Text 
                  className={`text-lg font-bold ${
                    transaction.type === 'earn' ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {transaction.type === 'earn' ? '+' : ''}{transaction.amount.toLocaleString()}
                </Text>
                <Text className="text-sm text-gray-500">điểm</Text>
              </div>
            </div>
          </div>
        ))}

        {transactions.length === 0 && (
          <div className="text-center py-8">
            <Text className="text-gray-500">Chưa có giao dịch nào</Text>
          </div>
        )}
      </div>
    </Page>
  );
};

export default PointsHistoryPage;
