// Biểu thức chính quy số điện thoại Việt Nam theo định dạng mới nhất
// Tham khảo: https://unitop.com.vn/bieu-thuc-chinh-quy-so-dien-thoai-vietnam.html/

export const validateVietnamesePhone = (phone: string): boolean => {
  // Loại bỏ khoảng trắng và ký tự đặc biệt
  const cleanPhone = phone.replace(/\s+/g, '').replace(/[^\d]/g, '');
  
  // Chuyển đổi +84 thành 0
  let normalizedPhone = cleanPhone;
  if (cleanPhone.startsWith('84')) {
    normalizedPhone = '0' + cleanPhone.substring(2);
  } else if (cleanPhone.startsWith('+84')) {
    normalizedPhone = '0' + cleanPhone.substring(3);
  }
  
  // Nếu số điện thoại có 9 số và bắt đầu bằng đầu số hợp lệ (không có số 0)
  if (normalizedPhone.length === 9) {
    const nineDigitRegex = /^(32|33|34|35|36|37|38|39|96|97|98|86|83|84|85|81|82|88|91|94|70|79|77|76|78|90|93|89|56|58|92|59|99)[0-9]{7}$/;
    return nineDigitRegex.test(normalizedPhone);
  }
  
  // Nếu số điện thoại có 10 số và bắt đầu bằng 0 + đầu số hợp lệ
  if (normalizedPhone.length === 10) {
    const tenDigitRegex = /^(032|033|034|035|036|037|038|039|096|097|098|086|083|084|085|081|082|088|091|094|070|079|077|076|078|090|093|089|056|058|092|059|099)[0-9]{7}$/;
    return tenDigitRegex.test(normalizedPhone);
  }
  
  return false;
};

export const formatVietnamesePhone = (phone: string): string => {
  // Loại bỏ khoảng trắng và ký tự đặc biệt
  const cleanPhone = phone.replace(/\s+/g, '').replace(/[^\d]/g, '');
  
  // Chuyển đổi +84 thành 0
  let normalizedPhone = cleanPhone;
  if (cleanPhone.startsWith('84')) {
    normalizedPhone = '0' + cleanPhone.substring(2);
  } else if (cleanPhone.startsWith('+84')) {
    normalizedPhone = '0' + cleanPhone.substring(3);
  }
  
  // Nếu số điện thoại có 9 số (không có số 0 ở đầu), thêm số 0 vào đầu
  if (normalizedPhone.length === 9) {
    return '0' + normalizedPhone;
  }
  
  return normalizedPhone;
};

export const getPhoneErrorMessage = (): string => {
  return 'Vui lòng nhập lại đúng số điện thoại.';
};
