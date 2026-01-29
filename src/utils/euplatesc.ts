import crypto from 'crypto';

/**
 * euPlatesc Payment Gateway Integration Utility
 * Documentation: https://euplatesc.ro/docs/
 * Manager Dashboard: https://manager.euplatesc.ro/v3/
 * 
 * Based on official euPlatesc Node.js implementation
 */

export interface EuPlatescConfig {
  mid: string; // Merchant ID
  key: string; // Secret Key (hex string)
  testMode?: boolean;
}

export interface PaymentData {
  amount: string; // Amount in RON (e.g., "150.00")
  curr: string; // Currency "RON"
  invoice_id: string; // Unique order/invoice ID
  order_desc: string; // Order description
  fname: string; // First name
  lname: string; // Last name
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

export interface EuPlatescPaymentParams {
  amount: string;
  curr: string;
  invoice_id: string;
  order_desc: string;
  merch_id: string; // Merchant ID
  timestamp: string;
  nonce: string;
  fp_hash: string; // HMAC signature
  fname: string;
  lname: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

/**
 * Generate HMAC signature for euPlatesc payment
 * Based on official euPlatesc algorithm:
 * For each parameter: if empty add '-', else add 'LENGTH + VALUE'
 * Then HMAC-MD5 with binary key
 */
export function generateHmacSignature(
  amount: string,
  curr: string,
  invoice_id: string,
  order_desc: string,
  merch_id: string,
  timestamp: string,
  nonce: string,
  keyHex: string
): string {
  // Build data object in the correct order
  const data: Record<string, string> = {
    amount,
    curr,
    invoice_id,
    order_desc,
    merch_id,
    timestamp,
    nonce,
  };

  // Build HMAC string according to euPlatesc specification
  let hmacString = '';
  const dataKeys = Object.keys(data);
  
  for (let i = 0; i < dataKeys.length; i++) {
    const value = data[dataKeys[i]];
    if (!value || value.length === 0) {
      hmacString += '-';
    } else {
      hmacString += value.length.toString() + value;
    }
  }

  console.log('=== euPlatesc Hash Debug (Official Algorithm) ===');
  console.log('HMAC string:', hmacString);
  console.log('Amount:', amount, '→', amount.length + amount);
  console.log('Curr:', curr, '→', curr.length + curr);
  console.log('Invoice ID:', invoice_id, '→', invoice_id.length + invoice_id);
  console.log('Order desc:', order_desc, '→', order_desc.length + order_desc);
  console.log('Merch ID:', merch_id, '→', merch_id.length + merch_id);
  console.log('Timestamp:', timestamp, '→', timestamp.length + timestamp);
  console.log('Nonce:', nonce, '→', nonce.length + nonce);
  console.log('Key (hex):', keyHex);

  // Convert hex key to binary buffer
  const binKey = Buffer.from(keyHex, 'hex');
  console.log('Binary key length:', binKey.length);

  // Generate HMAC-MD5 with binary key
  const hmac = crypto.createHmac('md5', binKey);
  hmac.update(hmacString);
  const fp_hash = hmac.digest('hex');

  console.log('Generated fp_hash:', fp_hash);
  console.log('================================================');

  return fp_hash;
}

/**
 * Generate nonce (random string for security)
 * Must be 16-64 characters in hexadecimal format
 */
export function generateNonce(): string {
  // Generate 16 bytes = 32 hex characters
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Get current timestamp in euPlatesc format (YYYYMMDDHHmmss)
 */
export function getTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

/**
 * Prepare payment parameters for euPlatesc redirect
 */
export function preparePaymentParams(
  paymentData: PaymentData,
  config: EuPlatescConfig
): EuPlatescPaymentParams {
  const timestamp = getTimestamp();
  const nonce = generateNonce();
  
  const fp_hash = generateHmacSignature(
    paymentData.amount,
    paymentData.curr,
    paymentData.invoice_id,
    paymentData.order_desc,
    config.mid,
    timestamp,
    nonce,
    config.key
  );

  return {
    amount: paymentData.amount,
    curr: paymentData.curr,
    invoice_id: paymentData.invoice_id,
    order_desc: paymentData.order_desc,
    merch_id: config.mid,
    timestamp,
    nonce,
    fp_hash,
    fname: paymentData.fname,
    lname: paymentData.lname,
    email: paymentData.email,
    phone: paymentData.phone,
    address: paymentData.address,
    city: paymentData.city,
    state: paymentData.state,
    zip: paymentData.zip,
    country: paymentData.country,
  };
}

/**
 * Verify callback signature from euPlatesc
 * Uses the same algorithm as payment hash generation
 */
export function verifyCallbackSignature(
  callbackData: Record<string, string>,
  keyHex: string
): boolean {
  const receivedHash = callbackData.fp_hash;
  
  if (!receivedHash) {
    console.error('No fp_hash in callback data');
    return false;
  }

  // Build data object in the correct order for callback
  const data: Record<string, string> = {
    amount: callbackData.amount || '',
    curr: callbackData.curr || '',
    invoice_id: callbackData.invoice_id || '',
    ep_id: callbackData.ep_id || '',
    merch_id: callbackData.merch_id || '',
    action: callbackData.action || '',
    message: callbackData.message || '',
    approval: callbackData.approval || '',
    timestamp: callbackData.timestamp || '',
    nonce: callbackData.nonce || '',
  };

  // Build HMAC string
  let hmacString = '';
  const dataKeys = Object.keys(data);
  
  for (let i = 0; i < dataKeys.length; i++) {
    const value = data[dataKeys[i]];
    if (!value || value.length === 0) {
      hmacString += '-';
    } else {
      hmacString += value.length.toString() + value;
    }
  }

  console.log('=== Callback Verification Debug ===');
  console.log('HMAC string:', hmacString);
  console.log('Received hash:', receivedHash);

  // Convert hex key to binary buffer
  const binKey = Buffer.from(keyHex, 'hex');

  // Generate HMAC-MD5
  const hmac = crypto.createHmac('md5', binKey);
  hmac.update(hmacString);
  const calculatedHash = hmac.digest('hex');

  console.log('Calculated hash:', calculatedHash);
  
  // Compare case-insensitively (convert both to uppercase)
  const match = calculatedHash.toUpperCase() === receivedHash.toUpperCase();
  console.log('Match:', match);
  console.log('==================================');

  return match;
}

/**
 * Get euPlatesc payment gateway URL
 */
export function getPaymentUrl(testMode: boolean = false): string {
  return 'https://secure.euplatesc.ro/tdsprocess/tranzactd.php';
}

/**
 * Parse euPlatesc response action/status
 */
export function parsePaymentStatus(action: string): {
  success: boolean;
  status: 'paid' | 'pending' | 'failed';
  message: string;
} {
  switch (action) {
    case '0':
      return {
        success: true,
        status: 'paid',
        message: 'Payment successful',
      };
    case '1':
      return {
        success: false,
        status: 'failed',
        message: 'Payment failed',
      };
    case '2':
      return {
        success: false,
        status: 'pending',
        message: 'Payment pending - waiting for bank confirmation',
      };
    case '3':
      return {
        success: false,
        status: 'failed',
        message: 'Payment cancelled by user',
      };
    default:
      return {
        success: false,
        status: 'failed',
        message: 'Unknown payment status',
      };
  }
}

/**
 * Format amount to euPlatesc format (2 decimal places)
 */
export function formatAmount(amountInCents: number): string {
  const amountInRON = amountInCents / 100;
  return amountInRON.toFixed(2);
}
