import React, { useState, useEffect } from 'react';
import { Page, List, Button, Modal, Box } from 'zmp-ui';
import { formatVND } from '../utils/price';
import { Voucher, getVouchers, createVoucher, toggleVoucherStatus, deleteVoucher } from '../services/voucher';
import { initializeSampleVouchers } from '../utils/initVouchers';

const AdminVoucherPage: React.FC = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discountPercent: 0,
    minOrderAmount: 0,
    maxDiscountAmount: 0,
    expiryDate: ''
  });

  // Load vouchers from localStorage
  useEffect(() => {
    initializeSampleVouchers(); // Khởi tạo voucher mẫu nếu cần
    setVouchers(getVouchers());
  }, []);

  const handleCreateVoucher = () => {
    if (!formData.code || formData.discountPercent <= 0 || formData.minOrderAmount <= 0) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const newVoucher = createVoucher({
      code: formData.code.toUpperCase(),
      discountPercent: formData.discountPercent,
      minOrderAmount: formData.minOrderAmount,
      maxDiscountAmount: formData.maxDiscountAmount,
      expiryDate: formData.expiryDate,
      isActive: true
    });

    setVouchers(getVouchers());
    
    // Reset form
    setFormData({
      code: '',
      discountPercent: 0,
      minOrderAmount: 0,
      maxDiscountAmount: 0,
      expiryDate: ''
    });
    setShowCreateModal(false);
  };

  const handleToggleVoucherStatus = (voucherId: string) => {
    toggleVoucherStatus(voucherId);
    setVouchers(getVouchers());
  };

  const handleDeleteVoucher = (voucherId: string) => {
    if (confirm('Bạn có chắc muốn xóa voucher này?')) {
      deleteVoucher(voucherId);
      setVouchers(getVouchers());
    }
  };

  const isExpired = (expiryDate: string) => {
    return new Date(expiryDate) < new Date();
  };

  return (
    <Page>
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <h1 className="text-lg font-semibold text-gray-900">Quản lý Voucher</h1>
      </div>
      
      <Box className="p-4">
        <div className="flex gap-2 mb-4">
          <Button 
            flex={1}
            variant="primary" 
            onClick={() => setShowCreateModal(true)}
          >
            + Tạo Voucher Mới
          </Button>
          <Button 
            variant="secondary"
            onClick={() => {
              initializeSampleVouchers();
              setVouchers(getVouchers());
            }}
          >
            Tạo Mẫu
          </Button>
        </div>

        <List>
          {vouchers.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Chưa có voucher nào
            </div>
          ) : (
            vouchers.map(voucher => (
              <div key={voucher.id} className="border-b border-gray-200 p-4">
                <div className="w-full">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold text-lg">{voucher.code}</div>
                      <div className="text-sm text-gray-600">
                        Giảm {voucher.discountPercent}% - Tối đa {formatVND(voucher.maxDiscountAmount)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`px-2 py-1 rounded text-xs ${
                        isExpired(voucher.expiryDate) 
                          ? 'bg-red-100 text-red-600' 
                          : voucher.isActive 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-gray-100 text-gray-600'
                      }`}>
                        {isExpired(voucher.expiryDate) 
                          ? 'Hết hạn' 
                          : voucher.isActive 
                            ? 'Hoạt động' 
                            : 'Tạm khóa'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500 mb-2">
                    <div>Đơn tối thiểu: {formatVND(voucher.minOrderAmount)}</div>
                    <div>Hạn sử dụng: {new Date(voucher.expiryDate).toLocaleDateString('vi-VN')}</div>
                  </div>

                  <div className="flex gap-2">
                    <div>
                      <Button 
                        size="small" 
                        variant={voucher.isActive ? "secondary" : "primary"}
                        onClick={() => handleToggleVoucherStatus(voucher.id)}
                        disabled={isExpired(voucher.expiryDate)}
                      >
                        {voucher.isActive ? 'Tạm khóa' : 'Kích hoạt'}
                      </Button>
                    </div>
                    <div>
                      <Button 
                        size="small" 
                        variant="destructive"
                        onClick={() => handleDeleteVoucher(voucher.id)}
                      >
                        Xóa
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </List>
      </Box>

      {/* Create Voucher Modal */}
      <Modal
        visible={showCreateModal}
        title="Tạo Voucher Mới"
        onClose={() => setShowCreateModal(false)}
        actions={[
          {
            text: 'Hủy',
            close: true,
            highLight: false,
          },
          {
            text: 'Tạo',
            close: false,
            highLight: true,
            onClick: handleCreateVoucher,
          },
        ]}
      >
        <Box className="p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Mã Voucher *</label>
              <input
                type="text"
                placeholder="Nhập mã voucher"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">% Giảm giá *</label>
              <input
                type="number"
                placeholder="Nhập % giảm"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.discountPercent}
                onChange={(e) => setFormData({...formData, discountPercent: parseInt(e.target.value) || 0})}
                min={1}
                max={100}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Đơn tối thiểu *</label>
              <input
                type="number"
                placeholder="Nhập số tiền tối thiểu"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.minOrderAmount}
                onChange={(e) => setFormData({...formData, minOrderAmount: parseInt(e.target.value) || 0})}
                min={0}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Giảm tối đa</label>
              <input
                type="number"
                placeholder="Nhập số tiền giảm tối đa"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.maxDiscountAmount}
                onChange={(e) => setFormData({...formData, maxDiscountAmount: parseInt(e.target.value) || 0})}
                min={0}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Hạn sử dụng *</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.expiryDate}
                onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
        </Box>
      </Modal>
    </Page>
  );
};

export default AdminVoucherPage;
