require("dotenv").config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

async function testOTPStorage() {
    try {
        console.log('🔍 Testing OTP Storage...\n');

        // Connect to database
        await mongoose.connect(process.env.MONGO_URL);
        console.log('✅ Connected to MongoDB\n');

        // Find admin
        const admin = await Admin.findOne({ email: 'sandalanithinkumar2@gmail.com' });

        if (!admin) {
            console.error('❌ Admin not found!');
            process.exit(1);
        }

        console.log('📋 Current State:');
        console.log('   Email:', admin.email);
        console.log('   resetOTP:', admin.resetOTP || 'NOT SET');
        console.log('   resetOTPExpires:', admin.resetOTPExpires || 'NOT SET');
        console.log('');

        // Test OTP storage
        const testOTP = '123456';
        const testExpiry = new Date(Date.now() + 10 * 60 * 1000);

        console.log('🔄 Setting test OTP...');
        admin.resetOTP = testOTP;
        admin.resetOTPExpires = testExpiry;

        // Mark as modified (critical for Mongoose 9.x)
        admin.markModified('resetOTP');
        admin.markModified('resetOTPExpires');

        await admin.save();
        console.log('✅ Save operation completed\n');

        // Verify by fetching fresh from database
        const updated = await Admin.findOne({ email: 'sandalanithinkumar2@gmail.com' });

        console.log('📋 Updated State (Fresh from DB):');
        console.log('   Email:', updated.email);
        console.log('   resetOTP:', updated.resetOTP);
        console.log('   resetOTPExpires:', updated.resetOTPExpires);
        console.log('');

        // Validate
        if (updated.resetOTP === testOTP) {
            console.log('✅ SUCCESS: OTP storage works correctly!');
            console.log('   Expected:', testOTP);
            console.log('   Got:', updated.resetOTP);
        } else {
            console.log('❌ FAILURE: OTP storage failed!');
            console.log('   Expected:', testOTP);
            console.log('   Got:', updated.resetOTP || 'NOT SET');
        }

        // Clean up test data
        console.log('\n🧹 Cleaning up test data...');
        updated.resetOTP = undefined;
        updated.resetOTPExpires = undefined;
        updated.markModified('resetOTP');
        updated.markModified('resetOTPExpires');
        await updated.save();
        console.log('✅ Test data cleaned up');

        await mongoose.disconnect();
        console.log('\n✅ Test completed successfully!');

    } catch (error) {
        console.error('❌ Test failed with error:', error);
        await mongoose.disconnect();
        process.exit(1);
    }
}

testOTPStorage();
