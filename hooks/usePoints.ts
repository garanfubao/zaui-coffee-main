import { useRecoilState } from "recoil";
import { pointsState } from "../state/index";

export const usePoints = () => {
  const [points, setPoints] = useRecoilState(pointsState);

  const addPointsFromOrder = (orderTotal: number) => {
    // Tích điểm tự động 1% giá trị đơn hàng
    const earnedPoints = Math.floor(orderTotal * 0.01);
    setPoints(prev => prev + earnedPoints);
    return earnedPoints;
  };

  const spendPoints = (amount: number) => {
    if (points >= amount) {
      setPoints(prev => prev - amount);
      return true;
    }
    return false;
  };

  const getPoints = () => points;

  return {
    points,
    addPointsFromOrder,
    spendPoints,
    getPoints,
  };
};
