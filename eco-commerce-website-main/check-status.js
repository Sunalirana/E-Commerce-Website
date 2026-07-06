const http = require('http');

function checkServer(port, name) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}${port === 5000 ? '/health' : ''}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`✅ ${name} server (port ${port}): Running`);
        if (port === 5000) {
          try {
            const parsed = JSON.parse(data);
            console.log(`   Status: ${parsed.status}, Products: ${parsed.products || 'N/A'}`);
          } catch (e) {
            console.log(`   Response: ${data.substring(0, 100)}`);
          }
        }
        resolve(true);
      });
    });
    
    req.on('error', () => {
      console.log(`❌ ${name} server (port ${port}): Not running`);
      resolve(false);
    });
    
    req.setTimeout(3000, () => {
      console.log(`⏰ ${name} server (port ${port}): Timeout`);
      req.destroy();
      resolve(false);
    });
  });
}

async function checkStatus() {
  console.log('🔍 Checking server status...\n');
  
  const backendRunning = await checkServer(5000, 'Backend');
  const frontendRunning = await checkServer(3000, 'Frontend');
  
  console.log('\n📋 Summary:');
  if (backendRunning && frontendRunning) {
    console.log('🎉 Both servers are running! Visit http://localhost:3000');
  } else if (backendRunning) {
    console.log('⚠️  Backend is running, but frontend needs to be started');
    console.log('   Run: cd client && npm start');
  } else if (frontendRunning) {
    console.log('⚠️  Frontend is running, but backend needs to be started');
    console.log('   Run: cd server && node server.js');
  } else {
    console.log('❌ Both servers need to be started');
    console.log('   Backend: cd server && node server.js');
    console.log('   Frontend: cd client && npm start');
  }
}

checkStatus();
