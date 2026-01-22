const axios = require('axios');

async function testForgotPassword() {
    console.log('🧪 Testing Forgot Password Endpoint...\n');

    try {
        const response = await axios.post('http://localhost:5000/api/admin/forgot-password', {
            email: 'sandalanithinkumar2@gmail.com'
        });

        console.log('✅ API Response:');
        console.log('   Status:', response.status);
        console.log('   Success:', response.data.success);
        console.log('   Message:', response.data.message);
        console.log('\n📬 Check your email inbox at: sandalanithinkumar2@gmail.com');
        console.log('   (Also check spam/junk folder)');

    } catch (error) {
        console.error('❌ API Request Failed:');
        console.error('   Error:', error.message);
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', error.response.data);
        }
    }
}

testForgotPassword();
