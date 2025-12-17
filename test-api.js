async function testLogin() {
    try {
        console.log('Testing API...');
        
        // Test basic API
        const apiResponse = await fetch('https://sabta-webpages.vercel.app/api');
        console.log('API Status:', apiResponse.status);
        const apiData = await apiResponse.json();
        console.log('API Response:', apiData);
        
        // Test login
        console.log('\nTesting Login...');
        const loginResponse = await fetch('https://sabta-webpages.vercel.app/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'admin@sabta.com',
                password: 'Admin@123'
            })
        });
        
        console.log('Login Status:', loginResponse.status);
        const loginData = await loginResponse.text();
        console.log('Login Response:', loginData);
        
    } catch (error) {
        console.error('Error:', error.message);
    }
    process.exit(0);
}

testLogin();
