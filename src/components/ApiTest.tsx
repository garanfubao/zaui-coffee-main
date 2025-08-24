import React, { useState } from 'react';
import { Button, Box, Text } from 'zmp-ui';
import apiService from '../services/api';

const ApiTest: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<string>('');
  const [testResult, setTestResult] = useState<string>('');

  const testHealthCheck = async () => {
    try {
      setHealthStatus('Testing...');
      const response = await apiService.healthCheck();
      setHealthStatus(`✅ Health Check: ${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      setHealthStatus(`❌ Health Check Error: ${error}`);
    }
  };

  const testCreateOrder = async () => {
    try {
      setTestResult('Testing create order...');
      const orderData = {
        orderId: `TEST_${Date.now()}`,
        customerName: 'Test Customer',
        customerPhone: '0123456789',
        address: 'Test Address',
        items: [
          {
            name: 'Test Product',
            quantity: 1,
            price: 50000
          }
        ],
        total: 50000,
        discount: 0,
        voucherCode: null,
        pointsEarned: 500,
        orderDate: new Date().toISOString()
      };

      const response = await apiService.createOrder(orderData);
      setTestResult(`✅ Create Order: ${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      setTestResult(`❌ Create Order Error: ${error}`);
    }
  };

  const testValidateVoucher = async () => {
    try {
      setTestResult('Testing voucher validation...');
      const response = await apiService.validateVoucher('GIAM10', 100000);
      setTestResult(`✅ Validate Voucher: ${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      setTestResult(`❌ Validate Voucher Error: ${error}`);
    }
  };

  const testGetProducts = async () => {
    try {
      setTestResult('Testing get products...');
      const response = await apiService.getProducts();
      setTestResult(`✅ Get Products: ${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      setTestResult(`❌ Get Products Error: ${error}`);
    }
  };

  return (
    <Box className="p-4">
      <Text className="text-lg font-bold mb-4">API Test Component</Text>
      
      <div className="space-y-4">
        <div>
          <Button onClick={testHealthCheck} variant="primary" className="mb-2">
            Test Health Check
          </Button>
          {healthStatus && (
            <div className="bg-gray-100 p-2 rounded text-sm">
              <pre>{healthStatus}</pre>
            </div>
          )}
        </div>

        <div>
          <Button onClick={testCreateOrder} variant="secondary" className="mb-2">
            Test Create Order
          </Button>
          {testResult && (
            <div className="bg-gray-100 p-2 rounded text-sm">
              <pre>{testResult}</pre>
            </div>
          )}
        </div>

        <div>
          <Button onClick={testValidateVoucher} variant="secondary" className="mb-2">
            Test Validate Voucher
          </Button>
        </div>

        <div>
          <Button onClick={testGetProducts} variant="secondary" className="mb-2">
            Test Get Products
          </Button>
        </div>
      </div>
    </Box>
  );
};

export default ApiTest;
