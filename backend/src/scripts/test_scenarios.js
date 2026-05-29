const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const runTests = async () => {
  console.log('--- 🛡️ Fraud Shield API Test Scenarios ---\n');

  try {
    // 1. Login to get a userId
    console.log('-> SCENARIO 0: User Login');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      phone: '1234567890',
      name: 'Scenario Tester'
    });
    const userId = loginRes.data.data._id;
    console.log(`✅ Logged in successfully. UserID: ${userId}\n`);

    // 2. Safe QR Scan
    console.log('-> SCENARIO 1: Safe QR (Trusted Merchant)');
    const safeScan = await axios.post(`${API_URL}/scan`, {
      upiId: 'payment@amazon',
      merchantName: 'Amazon Retail',
      amount: 500,
      userId
    });
    console.log('Result:', safeScan.data);
    console.log(`🏁 Expected: SAFE | Got: ${safeScan.data.status}\n`);

    // 3. Suspicious QR Scan
    console.log('-> SCENARIO 2: Suspicious QR (New/Unknown UPI + High Amount)');
    const suspiciousScan = await axios.post(`${API_URL}/scan`, {
      upiId: 'randomseller99@ybl',
      merchantName: 'Unknown Shop',
      amount: 8500,
      userId
    });
    console.log('Result:', suspiciousScan.data);
    console.log(`🏁 Expected: SUSPICIOUS | Got: ${suspiciousScan.data.status}\n`);

    // 4. Dangerous QR Scan (Fake Support Name)
    console.log('-> SCENARIO 3: Dangerous QR (Fake Support Keyword)');
    const dangerousScan = await axios.post(`${API_URL}/scan`, {
      upiId: 'customercare-refund@icici',
      merchantName: 'Customer Support',
      amount: 10,
      userId
    });
    console.log('Result:', dangerousScan.data);
    console.log(`🏁 Expected: HIGH RISK | Got: ${dangerousScan.data.status}\n`);

    // 5. Dangerous QR Scan (Blacklisted)
    console.log('-> SCENARIO 4: Dangerous QR (Database Blacklisted UPI)');
    const blacklistedScan = await axios.post(`${API_URL}/scan`, {
      upiId: 'scammer@ybl', // From seed.js
      merchantName: 'Lucky Draw Winner',
      amount: 1000,
      userId
    });
    console.log('Result:', blacklistedScan.data);
    console.log(`🏁 Expected: HIGH RISK | Got: ${blacklistedScan.data.status}\n`);

    console.log('🎉 --- All Scenarios Executed Successfully ---');
  } catch (error) {
    if (error.response) {
      console.error('❌ Test execution failed with status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('❌ Test execution failed with message:', error.message);
    }
  }
};

runTests();
