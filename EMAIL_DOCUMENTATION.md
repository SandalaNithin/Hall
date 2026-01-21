# Email System Documentation - Lakshmi Function Hall

## Overview

This document describes all email notifications sent to users when admin performs actions in the Lakshmi Function Hall system. All emails are sent using **SendGrid** for reliable delivery.

---

## 📧 Email Types

### 1. **Booking Confirmation Email** ✅

**Trigger:** When admin confirms a pending booking request

**Recipient:** User who made the booking request

**Subject:** `🎉 Your Booking is Confirmed - Lakshmi Function Hall`

**Email Content:**
- **Header:** Purple gradient with "🎉 Booking Confirmed!" message
- **Greeting:** Personalized with user's name
- **Booking Details Table:**
  - Event Type
  - From Date (formatted as: "Monday, January 20, 2026")
  - To Date (formatted as: "Tuesday, January 21, 2026")
  - Check-In Time
  - Check-Out Time
  - Number of Guests
  - Contact Phone
- **User's Message:** Displayed if user provided a message during booking
- **Contact Information:** Phone number (9866701255) for changes
- **Footer:** Automated email notice and copyright

**Code Location:** `controllers/bookingController.js` - `confirmBooking()` function (lines 176-253)

**Design Features:**
- Professional gradient header (#667eea to #764ba2)
- Green-themed booking details section (#f0fdf4 background)
- Yellow-themed message section (if applicable)
- Blue-themed contact section
- Responsive design with proper spacing

---

### 2. **Booking Rejection Email** ❌

**Trigger:** When admin rejects a pending booking request

**Recipient:** User who made the booking request

**Subject:** `Booking Request - Unable to Confirm`

**Email Content:**
- **Header:** Red-themed with "Booking Request - Unable to Confirm"
- **Greeting:** Personalized with user's name
- **Rejection Reason:** Highlighted in red box (customizable by admin)
- **Booking Details:** Shows the original booking request details
  - From Date
  - To Date
  - Event Type
  - Guests
  - Phone
- **Alternative Options:** Encourages user to contact for alternative dates
- **Contact Information:** Phone number (9866701255)

**Code Location:** `controllers/bookingController.js` - `rejectBooking()` function (lines 327-352)

**Design Features:**
- Red-themed rejection reason section (#fee2e2 background)
- Gray-themed booking details section
- Professional and apologetic tone
- Encourages rebooking

---

### 3. **Password Reset OTP Email** 🔐

**Trigger:** When admin requests password reset (forgot password)

**Recipient:** Admin email address

**Subject:** `🔐 Password Reset OTP - Lakshmi Function Hall`

**Email Content:**
- **Header:** Purple gradient with "🔐 Password Reset Request"
- **Greeting:** "Hello Admin"
- **OTP Code Display:**
  - Large, bold 6-digit code
  - 36px font size
  - Monospace font (Courier New)
  - Letter spacing: 8px
  - Green-themed background (#f0fdf4)
- **Expiration Warning:** "⏰ Valid for 10 minutes" in red
- **Security Notice:**
  - Do not share OTP
  - Ignore if not requested
  - Password remains unchanged if not used
- **Footer:** Team signature

**Code Location:** `controllers/adminController.js` - `forgotPassword()` function (lines 147-181)

**Design Features:**
- Prominent OTP display for easy reading
- Security warnings in red (#fef2f2 background)
- Professional security-focused design
- Clear expiration notice

**Important Notes:**
- Email is sent asynchronously (non-blocking) to prevent timeout
- OTP is saved to database before email is sent
- Response is sent immediately to user, email follows
- Email failure doesn't block the OTP process

---

## 🔧 Email Service Configuration

### SendGrid Service
**File:** `utils/sendgridService.js`

**Key Features:**
- Uses SendGrid API for email delivery
- Supports both user and admin recipients
- Automatic reply-to configuration
- Detailed logging for debugging
- Error handling with status codes

**Environment Variables Required:**
```env
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=your_verified_sender_email
SENDGRID_FROM_NAME=Lakshmi Function Hall
ADMIN_EMAIL=admin_email_address
```

### Email Service (Legacy)
**File:** `utils/emailService.js`

This is the older Nodemailer-based service. The system now uses SendGrid (`sendgridService.js`) for all email operations.

---

## 📊 Email Sending Flow

### Booking Confirmation Flow
```
1. Admin clicks "Confirm" in admin panel
2. Backend validates booking and checks for conflicts
3. Booking status updated to "confirmed" in database
4. Confirmation email sent to user via SendGrid
5. Response sent to admin panel with success/failure status
```

### Booking Rejection Flow
```
1. Admin clicks "Reject" and provides reason
2. Backend updates booking status to "rejected"
3. Rejection email sent to user with custom reason
4. Response sent to admin panel with success/failure status
```

### Password Reset Flow
```
1. Admin enters email on forgot password page
2. Backend generates 6-digit OTP
3. OTP saved to database with 10-minute expiration
4. Response sent immediately to frontend
5. OTP email sent asynchronously in background
6. Admin receives email and enters OTP
7. Admin creates new password
```

---

## 🎨 Email Design Guidelines

### Color Scheme
- **Primary Purple:** `#667eea` to `#764ba2` (gradient)
- **Success Green:** `#10b981`, `#f0fdf4` (background)
- **Warning Yellow:** `#f59e0b`, `#fef3c7` (background)
- **Error Red:** `#dc2626`, `#fef2f2` (background)
- **Info Blue:** `#3b82f6`, `#eff6ff` (background)
- **Text Colors:** `#374151` (body), `#6b7280` (secondary), `#111827` (bold)

### Typography
- **Headings:** 28px, bold, white (on gradient)
- **Body Text:** 16px, regular, #374151
- **Labels:** 14px, semi-bold, #6b7280
- **Values:** 14px, bold, #111827
- **OTP Code:** 36px, bold, monospace

### Layout
- **Max Width:** 600px
- **Padding:** 20px outer, 30px inner
- **Border Radius:** 10px (cards), 5px (sections)
- **Box Shadow:** `0 2px 4px rgba(0,0,0,0.1)`

---

## 🧪 Testing Emails

### Test Booking Confirmation
1. Create a test booking from the frontend
2. Login to admin panel
3. Navigate to pending bookings
4. Click "Confirm" on the test booking
5. Check the user's email inbox

### Test Booking Rejection
1. Create a test booking from the frontend
2. Login to admin panel
3. Navigate to pending bookings
4. Click "Reject" and provide a reason
5. Check the user's email inbox

### Test OTP Email
1. Go to admin login page
2. Click "Forgot Password"
3. Enter admin email
4. Check admin email inbox for OTP
5. Verify OTP code is readable and valid

---

## 🐛 Troubleshooting

### Email Not Received
1. Check SendGrid API key is valid
2. Verify sender email is verified in SendGrid
3. Check spam/junk folder
4. Review server logs for email sending errors
5. Verify recipient email is correct

### Email Formatting Issues
1. Test in multiple email clients (Gmail, Outlook, Yahoo)
2. Verify HTML is properly escaped
3. Check inline CSS is applied correctly
4. Test on mobile and desktop

### OTP Email Timeout
- OTP email is sent asynchronously to prevent timeout
- User receives success response before email is sent
- Check logs for email sending status
- OTP is valid in database even if email fails

---

## 📝 Future Enhancements

### Potential Additions
1. **Password Reset Success Email** - Notify admin after successful password change
2. **Booking Reminder Email** - Send reminder 24 hours before event
3. **Booking Modification Email** - Notify when admin modifies booking details
4. **Welcome Email** - Send when new admin account is created
5. **Email Templates** - Move inline HTML to separate template files

### Recommended Improvements
1. Add email preview functionality in admin panel
2. Implement email tracking (open rates, click rates)
3. Add unsubscribe functionality for marketing emails
4. Create email template builder for admins
5. Add multi-language support for emails

---

## 📞 Support

For issues with email delivery or configuration:
- Contact SendGrid support for API issues
- Check server logs in `error.log` file
- Review console output for detailed error messages
- Verify environment variables are set correctly

---

**Last Updated:** January 20, 2026  
**Version:** 1.0  
**Maintained By:** Lakshmi Function Hall Development Team
