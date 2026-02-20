# euPlatesc Payment Gateway Setup & Testing Guide

## Overview

This document provides comprehensive instructions for setting up and testing the euPlatesc payment gateway integration in the Buchetul Simonei flower shop application.

## ⚠️ IMPORTANT: Order Creation Flow

### Previous Implementation (Deprecated)
The old implementation created orders **BEFORE** payment was confirmed, which caused issues:
- Orders were created even if payment failed
- Email confirmations were sent for failed payments
- Database contained incomplete/failed orders

### Current Implementation ✅
The new implementation follows best practices:
- For credit card payments: Orders are created **ONLY AFTER** successful payment
- For other payment methods (bank transfer, cash): Orders are created immediately (as intended)
- Email confirmations are sent **ONLY** for successful payments
- Failed payments do not create database entries

### How It Works

**Credit Card Payment Flow:**
1. User selects "Credit Card" payment method
2. System generates a temporary tracking number (format: `TEMP-{timestamp}-{random}`)
3. Order data is stored temporarily in `pending_orders` collection
4. User is redirected to euPlatesc payment gateway
5. After payment:
   - **If successful**: Order is created with real tracking number, email is sent
   - **If failed**: Temporary data is cleaned up, no order is created

**Other Payment Methods Flow:**
1. User selects "Bank Transfer" or "Cash on Delivery"
2. Order is created immediately with real tracking number
3. Email confirmation is sent
4. User is redirected to success page

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Getting Merchant Credentials](#getting-merchant-credentials)
3. [Environment Configuration](#environment-configuration)
4. [Callback URL Configuration](#callback-url-configuration)
5. [Testing the Integration](#testing-the-integration)
6. [Test Card Numbers](#test-card-numbers)
7. [Troubleshooting](#troubleshooting)
8. [Production Deployment](#production-deployment)
9. [Security Considerations](#security-considerations)

## Prerequisites

Before setting up euPlatesc integration, ensure you have:

- A registered business in Romania
- Access to the euPlatesc merchant dashboard
- Node.js 18+ and Next.js 14+ installed
- MongoDB database configured
- SSL certificate for your domain (required for production)

## Getting Merchant Credentials

### Step 1: Sign Contract with euPlatesc

1. Visit [euPlatesc.ro](https://euplatesc.ro) and click "Devino Partener" (Become a Partner)
2. Fill out the merchant application form
3. Submit required business documents:
   - CUI (Tax Identification Number)
   - Certificate de Înregistrare (Registration Certificate)
   - Bank account details
4. Wait for approval (typically 2-5 business days)

### Step 2: Access Merchant Dashboard

1. Once approved, you'll receive login credentials via email
2. Access the dashboard at: https://manager.euplatesc.ro/v3/
3. Log in with your credentials

### Step 3: Retrieve Integration Parameters

1. Navigate to **Settings** → **Integration Parameters**
2. You'll find two critical values:
   - **Merchant ID (MID)**: A unique identifier for your account (e.g., `ABC123456`)
   - **Secret KEY**: A hexadecimal string used for HMAC signature (e.g., `0123456789ABCDEF...`)

**Important:** Keep these credentials secure and never commit them to version control!

## Environment Configuration

### Step 1: Create Environment File

Create a `.env.local` file in your project root (copy from `.env.example`):

```bash
cp .env.example .env.local
```

### Step 2: Add euPlatesc Credentials

Edit `.env.local` and add your credentials:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/buchetul-simonei?retryWrites=true&w=majority

# euPlatesc Payment Gateway Configuration
EUPLATESC_MERCHANT_ID=your_actual_merchant_id_here
EUPLATESC_SECRET_KEY=your_actual_secret_key_hex_here

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
EMAIL_FROM=noreply@buchetulsimonei.ro

# Application Configuration
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Step 3: Verify Configuration

Restart your development server:

```bash
npm run dev
```

Check the console for any configuration errors.

## Callback URL Configuration

euPlatesc needs to know where to send payment notifications. Configure these URLs in the merchant dashboard.

### Step 1: Configure in Dashboard

1. Log into https://manager.euplatesc.ro/v3/
2. Navigate to **Settings** → **Integration Settings**
3. Set the following URLs:

**For Local Development (Testing with ngrok):**
```
Confirmation URL: https://your-ngrok-url.ngrok.io/api/euplatesc/callback
Return URL: https://your-ngrok-url.ngrok.io/api/euplatesc/callback
```

**For Production:**
```
Confirmation URL: https://www.buchetulsimonei.ro/api/euplatesc/callback
Return URL: https://www.buchetulsimonei.ro/api/euplatesc/callback
```

### Step 2: Understanding Callback Types

- **Confirmation URL (Server-to-Server)**: euPlatesc sends a POST request to notify payment status
- **Return URL (User Redirect)**: User is redirected here after completing payment

Both URLs point to the same endpoint but are handled differently based on request type.

## Testing the Integration

### Local Testing with ngrok

Since euPlatesc needs to send callbacks to your server, you need a public URL for local testing.

#### Step 1: Install ngrok

```bash
# macOS
brew install ngrok

# Windows/Linux
# Download from https://ngrok.com/download
```

#### Step 2: Start ngrok Tunnel

```bash
ngrok http 3000
```

Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

#### Step 3: Update Callback URLs

Update the callback URLs in the euPlatesc dashboard with your ngrok URL.

#### Step 4: Test Payment Flow

1. Start your Next.js app: `npm run dev`
2. Navigate to the checkout page
3. Add items to cart
4. Proceed to payment
5. Select "Credit Card" payment method
6. Click "Proceed to Payment"
7. You'll be redirected to euPlatesc payment page
8. Use test card numbers (see below)
9. Complete the payment
10. You should be redirected back to success/failure page

### Testing Checklist

- [ ] Payment initialization works (no errors in console)
- [ ] Redirect to euPlatesc works
- [ ] Test successful payment (card 4111111111111111)
- [ ] Test failed payment (card 4000000000000002)
- [ ] Callback receives POST notification
- [ ] Callback receives GET redirect
- [ ] Order status updates in database
- [ ] Payment confirmation email sent
- [ ] Success page displays correctly
- [ ] Failure page displays with error message

## Test Card Numbers

Use these test card numbers in the euPlatesc sandbox:

### Successful Transactions

```
Card Number: 4111111111111111
Expiry: Any future date (e.g., 12/25)
CVV: Any 3 digits (e.g., 123)
Name: Any name
```

### Failed Transactions

```
Card Number: 4000000000000002
Expiry: Any future date
CVV: Any 3 digits
Name: Any name
```

### Test Amount Limits

For testing in development mode, use amounts **≤ 1.00 RON** to avoid actual charges.

## Troubleshooting

### Issue: "Payment gateway not configured" Error

**Cause:** Environment variables not set or incorrect

**Solution:**
1. Check `.env.local` file exists
2. Verify `EUPLATESC_MERCHANT_ID` and `EUPLATESC_SECRET_KEY` are set
3. Restart your development server

### Issue: "Invalid signature" Error

**Cause:** Secret key doesn't match or incorrect format

**Solution:**
1. Verify secret key is exactly as shown in dashboard (hexadecimal string)
2. No spaces or extra characters
3. Check that the key hasn't expired or been regenerated

### Issue: Callback Not Received

**Cause:** Callback URL not accessible or incorrect

**Solution:**
1. Verify ngrok is running (for local dev)
2. Check callback URL in dashboard matches your ngrok URL
3. Check firewall/security settings
4. Review server logs for incoming requests

### Issue: Order Not Updated After Payment

**Cause:** Database connection issue or callback processing error

**Solution:**
1. Check MongoDB connection string
2. Review API logs: `console.log` statements in `callback/route.ts`
3. Verify tracking number matches between payment and order
4. Check database directly for order status

### Issue: Email Not Sent

**Cause:** Email configuration incorrect

**Solution:**
1. Verify email credentials in `.env.local`
2. For Gmail, use App-Specific Password (not regular password)
3. Check email service allows SMTP connections
4. Review email API logs for errors

### Debugging Tips

1. **Enable Verbose Logging:**
   - Check console logs in callback handler
   - All payment steps have logging statements

2. **Inspect Network Requests:**
   - Use browser DevTools Network tab
   - Check POST request to `/api/euplatesc/init-payment`
   - Verify all required fields are sent

3. **Check Database:**
   - Connect to MongoDB directly
   - Verify order exists with correct tracking number
   - Check payment status and euplatescData fields

4. **Test Signature Generation:**
   - Add logging to `generateHmacSignature` function
   - Compare generated hash with expected format

## Production Deployment

### Pre-Deployment Checklist

- [ ] Update callback URLs to production domain
- [ ] Set `NODE_ENV=production` in production environment
- [ ] Use production euPlatesc credentials (not test)
- [ ] SSL certificate installed and working
- [ ] Test with real small amount (1 RON) first
- [ ] Email notifications tested and working
- [ ] Error handling tested
- [ ] Database backups configured

### Step 1: Update Environment Variables

In your production environment (Vercel, Netlify, AWS, etc.), set:

```env
NODE_ENV=production
EUPLATESC_MERCHANT_ID=production_merchant_id
EUPLATESC_SECRET_KEY=production_secret_key
MONGODB_URI=production_mongodb_uri
# ... other production variables
```

### Step 2: Update Callback URLs

In euPlatesc dashboard, set production URLs:

```
Confirmation URL: https://www.buchetulsimonei.ro/api/euplatesc/callback
Return URL: https://www.buchetulsimonei.ro/api/euplatesc/callback
```

### Step 3: Test in Production

1. Make a small test purchase (1-5 RON)
2. Verify entire flow works
3. Check email notifications
4. Verify database updates
5. Test admin panel displays transaction details

### Step 4: Monitor

- Set up error logging (Sentry, LogRocket, etc.)
- Monitor payment success/failure rates
- Track callback response times
- Review customer feedback

## Security Considerations

### 1. Environment Variables

- Never commit `.env` files to version control
- Use different credentials for development and production
- Rotate secret keys periodically

### 2. HTTPS Required

- euPlatesc requires HTTPS for all callbacks
- Use valid SSL certificate (Let's Encrypt, CloudFlare, etc.)
- Test SSL configuration with SSL Labs

### 3. Signature Verification

- Always verify callback signatures
- Reject requests with invalid signatures
- Log suspicious callback attempts

### 4. Rate Limiting

- Payment initialization limited to 5 requests/minute
- Order creation limited to 3 requests/minute
- Protects against abuse and DoS attacks

### 5. PCI DSS Compliance

- Never store credit card details
- All card processing handled by euPlatesc
- No card data touches your servers

### 6. Data Privacy (GDPR)

- Store only necessary payment data
- Implement data retention policies
- Allow users to request data deletion
- Provide clear privacy policy

## API Endpoints Reference

### Initialize Payment

```
POST /api/euplatesc/init-payment
```

**Request Body:**
```json
{
  "amount": 10000,
  "curr": "RON",
  "invoice_id": "TRACK-12345",
  "order_desc": "Order description",
  "customerInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "0712345678",
    "address": "Str. Example 1",
    "city": "Bucharest",
    "zip": "012345",
    "country": "RO"
  }
}
```

**Response:**
```json
{
  "success": true,
  "paymentParams": {
    "amount": "100.00",
    "curr": "RON",
    "invoice_id": "TRACK-12345",
    "merch_id": "MERCHANT123",
    "fp_hash": "abcdef123456...",
    "timestamp": "20260219120000",
    "nonce": "abc123...",
    ...
  },
  "paymentUrl": "https://secure.euplatesc.ro/tdsprocess/tranzactd.php"
}
```

### Payment Callback

```
POST/GET /api/euplatesc/callback
```

Handles payment notifications from euPlatesc. No manual calls needed.

## Support

### euPlatesc Support

- Email: support@euplatesc.ro
- Phone: +40 21 310 27 82
- Hours: Monday-Friday, 9:00-18:00 EET

### Application Support

- Email: simonabuzau2@gmail.com
- Phone: 0769 141 250

## Additional Resources

- [euPlatesc Official Documentation](https://euplatesc.ro/docs/) (Romanian)
- [Payment Integration Guide](https://euplatesc.ro/ghid-integrare.pdf)
- [euPlatesc FAQ](https://euplatesc.ro/intrebari-frecvente)
- [PCI DSS Compliance](https://www.pcisecuritystandards.org/)

## Conclusion

This guide covers the complete setup and testing process for euPlatesc integration. Follow each step carefully and test thoroughly before going to production. If you encounter issues not covered here, contact euPlatesc support or the application developer.

---

**Last Updated:** February 19, 2026  
**Version:** 1.0  
**Maintainer:** Development Team
