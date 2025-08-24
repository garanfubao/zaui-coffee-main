# Phone Validation Guide

## Tổng quan
Hệ thống validation số điện thoại Việt Nam được xây dựng dựa trên tài liệu từ [Unitop](https://unitop.com.vn/bieu-thuc-chinh-quy-so-dien-thoai-vietnam.html/).

## Định dạng số điện thoại Việt Nam mới nhất

### Đầu số di động các nhà mạng:
- **Viettel**: 032, 033, 034, 035, 036, 037, 038, 039, 096, 097, 098, 086
- **Vinaphone**: 083, 084, 085, 081, 082, 088, 091, 094
- **Mobifone**: 070, 079, 077, 076, 078, 090, 093, 089
- **Vietnamobile**: 056, 058, 092
- **Gmobile**: 059, 099

### Quy tắc:
- Chấp nhận cả 9 số và 10 số
- Nếu 9 số: tự động thêm số 0 vào đầu và kiểm tra đầu số hợp lệ
- Nếu 10 số: kiểm tra trực tiếp với đầu số hợp lệ
- Tự động chuyển đổi +84 thành 0
- Format kết quả luôn về dạng 10 số với số 0 ở đầu

## Cách sử dụng

### 1. Import utilities
```typescript
import { validateVietnamesePhone, formatVietnamesePhone, getPhoneErrorMessage } from "../utils/phone";
```

### 2. Validate số điện thoại
```typescript
const phone = "0988859692";
if (!validateVietnamesePhone(phone)) {
  // Hiển thị thông báo lỗi
  alert(getPhoneErrorMessage());
}
```

### 3. Format số điện thoại
```typescript
const phone1 = "+84988859692";
const formattedPhone1 = formatVietnamesePhone(phone1); // "0988859692"

const phone2 = "378670121";
const formattedPhone2 = formatVietnamesePhone(phone2); // "0378670121"

const phone3 = "0378670121";
const formattedPhone3 = formatVietnamesePhone(phone3); // "0378670121"
```

### 4. Sử dụng hook
```typescript
import { usePhoneValidation } from "../hooks/usePhoneValidation";

const { validatePhone, formatPhone, showPhoneErrorModal, closePhoneErrorModal } = usePhoneValidation();

const handleSubmit = () => {
  if (!validatePhone(form.phone)) {
    return; // Modal sẽ tự động hiển thị
  }
  
  const formattedPhone = formatPhone(form.phone);
  // Lưu dữ liệu
};
```

### 5. Sử dụng component modal
```typescript
import PhoneValidationModal from "../components/PhoneValidationModal";

<PhoneValidationModal 
  visible={showPhoneErrorModal} 
  onClose={closePhoneErrorModal} 
/>
```

## Ví dụ thực tế

### Form validation:
```typescript
const onSubmit = () => {
  if (!validateVietnamesePhone(form.phone)) {
    setShowPhoneErrorModal(true);
    return;
  }

  const formattedPhone = formatVietnamesePhone(form.phone);
  // Lưu dữ liệu với số điện thoại đã format
};
```

### Input với real-time validation:
```typescript
const handlePhoneChange = (value: string) => {
  setPhone(value);
  
  // Validate khi người dùng nhập xong
  if (value.length >= 10) {
    if (!validateVietnamesePhone(value)) {
      setPhoneError(true);
    } else {
      setPhoneError(false);
    }
  }
};
```

## Lưu ý
- Hệ thống tự động chuyển đổi +84 thành 0
- Loại bỏ khoảng trắng và ký tự đặc biệt
- Chấp nhận cả 9 số và 10 số với đầu số hợp lệ
- Tự động thêm số 0 vào đầu nếu cần
- Format kết quả luôn về dạng 10 số chuẩn
- Thông báo lỗi: "Vui lòng nhập lại đúng số điện thoại."

## Ví dụ số điện thoại hợp lệ:
- `0378670121` (10 số)
- `378670121` (9 số - tự động thêm 0)
- `0988859692` (10 số)
- `988859692` (9 số - tự động thêm 0)
- `+84988859692` (tự động chuyển +84 thành 0)
