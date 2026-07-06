const axios = require('axios');

async function testBackend() {
  console.log('🧪 Testing Backend Server...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get('http://localhost:5000/health');
    console.log('✅ Health check passed:', healthResponse.data);

    // Test products endpoint
    console.log('\n2. Testing products endpoint...');
    const productsResponse = await axios.get('http://localhost:5000/api/products');
    console.log(`✅ Products endpoint working: ${productsResponse.data.length} products loaded`);
    console.log('First product:', productsResponse.data[0]?.name);

    // Test orders endpoint
    console.log('\n3. Testing orders endpoint...');
    const ordersResponse = await axios.get('http://localhost:5000/api/orders/sold-products');
    console.log(`✅ Orders endpoint working: ${ordersResponse.data.length} sold products`);

    console.log('\n🎉 All backend tests passed! The server is working correctly.');
    
  } catch (error) {
    console.error('\n❌ Backend test failed:');
    if (error.code === 'ECONNREFUSED') {
      console.error('- Server is not running or not accessible on port 5000');
      console.error('- Make sure to start the server: cd server && node server.js');
    } else if (error.response) {
      console.error(`- HTTP ${error.response.status}: ${error.response.statusText}`);
      console.error('- Response:', error.response.data);
    } else {
      console.error('- Error:', error.message);
    }
  }
}

testBackend();
