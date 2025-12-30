import nodemailer from 'nodemailer';
import { Order } from '@/types/orders';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

function formatShippingAddress(shipping: Order['shipping']): string {
  return `${shipping.name}\n${shipping.address}\n${shipping.city}, ${shipping.state} ${shipping.postalCode}\n${shipping.country}`;
}

export async function sendContactFormEmail(formData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const mailOptions = {
    from: `"Vintage Custom Clothes" <${process.env.EMAIL_USER}>`,
    to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER, // Fallback to main email if contact email not set
    subject: `New Contact Form: ${formData.subject}`,
    replyTo: formData.email,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
        <h2 style="color: #2c3e50;">New Contact Form Submission</h2>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #3498db;">
          <p><strong>From:</strong> ${formData.name} &lt;${formData.email}&gt;</p>
          <p><strong>Subject:</strong> ${formData.subject}</p>
          <p><strong>Received:</strong> ${new Date().toLocaleString()}</p>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; border: 1px solid #eee; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #2c3e50;">Message:</h3>
          <p style="white-space: pre-line;">${formData.message}</p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #7f8c8d; font-size: 0.9em;">
          <p>This is an automated message. Please do not reply directly to this email.</p>
          <p>You can respond to ${formData.name} by replying to this email or by emailing ${formData.email} directly.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending contact form email:', error);
    throw new Error('Failed to send contact form email');
  }
}

export async function sendOrderConfirmationEmail(order: Order) {
  const itemsHtml = order.items
    .map((item) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">
          ${item.name}<br>
          <small>Size: ${item.size} | Color: ${item.color}</small>
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${formatPrice(item.price / 100)}</td>
      </tr>
    `).join('');

  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + order.shippingCost;

  const mailOptions = {
    from: `"Vintage Custom Clothes" <${process.env.EMAIL_USER}>`,
    to: order.shipping.email,
    subject: `Order Confirmation - #${order.orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #2c3e50;">Thank you for your order, ${order.shipping.name.split(' ')[0]}!</h2>
        <p>Your order has been received and is being processed. Here are your order details:</p>
        
        <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
          <h3 style="margin-top: 0; color: #2c3e50;">Order #${order.orderId}</h3>
          <p><strong>Order Date:</strong> ${new Date(order.date).toLocaleDateString()}</p>
          <p><strong>Status:</strong> ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
          <p><strong>Order Tracking Number  #:</strong> ${order.trackingNumber || 'Will be provided when shipped'}</p> 
          
          <p style="margin: 15px 0;">You can track your order status and view details by visiting your account page.</p>
          
          <a href="https://vintageclothes.com/orders" style="display: inline-block; padding: 12px 25px; background-color: #2c3e50; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
            View Your Order
          </a>
        </div>
        
        <h3 style="margin-top: 24px; color: #2c3e50; border-bottom: 2px solid #eee; padding-bottom: 8px;">Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 12px 0 20px;">
          <thead>
            <tr>
              <th style="text-align: left; padding: 10px; border-bottom: 2px solid #2c3e50;">Item</th>
              <th style="text-align: center; padding: 10px; border-bottom: 2px solid #2c3e50;">Qty</th>
              <th style="text-align: right; padding: 10px; border-bottom: 2px solid #2c3e50;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
            <tr>
              <td colspan="2" style="text-align: right; padding: 12px 10px; font-weight: bold; border-top: 2px solid #eee;">Subtotal:</td>
              <td style="text-align: right; padding: 12px 10px; border-top: 2px solid #eee;">${formatPrice(subtotal / 100)}</td>
            </tr>
            <tr>
              <td colspan="2" style="text-align: right; padding: 5px 10px; font-weight: bold;">Shipping:</td>
              <td style="text-align: right; padding: 5px 10px;">${formatPrice(order.shippingCost / 100)}</td>
            </tr>
            <tr>
              <td colspan="2" style="text-align: right; padding: 12px 10px; font-weight: bold; border-top: 1px solid #eee; border-bottom: 2px solid #2c3e50;">Total:</td>
              <td style="text-align: right; padding: 12px 10px; font-weight: bold; border-top: 1px solid #eee; border-bottom: 2px solid #2c3e50;">${formatPrice(total / 100)}</td>
            </tr>
          </tbody>
        </table>
        
        <div style="display: flex; gap: 20px; margin: 25px 0;">
          <div style="flex: 1;">
            <h3 style="margin-top: 0; color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 8px;">Shipping Address</h3>
            <p>${formatShippingAddress(order.shipping).replace(/\n/g, '<br>')}</p>
            <p><strong>Phone:</strong> ${order.shipping.phone}</p>
          </div>
          <div style="flex: 1;">
            <h3 style="margin-top: 0; color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 8px;">Payment Method</h3>
            <p>${order.payment.method === 'credit-card' ? 'Credit Card' : 
                order.payment.method === 'bank-transfer' ? 'Bank Transfer' : 'Cash on Delivery'}</p>
            <p><strong>Status:</strong> ${order.payment.status.charAt(0).toUpperCase() + order.payment.status.slice(1)}</p>
          </div>
        </div>
        
        <div style="margin: 30px 0; padding: 15px; background-color: #e8f4fd; border-radius: 5px; border-left: 4px solid #3498db;">
          <p style="margin: 0;">
            <strong>Next Steps:</strong> We're processing your order and will send a shipping confirmation email with order information as soon as it's on its way.
          </p>
        </div>
        
        <p style="margin: 25px 0 15px;">If you have any questions about your order, please reply to this email or contact our customer service at support@vintageclothes.com.</p>
        
        <p style="margin: 30px 0 15px; text-align: center;">
          <a href="https://vintageclothes.com/orders" style="display: inline-block; padding: 12px 25px; background-color: #2c3e50; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
            View Your Order
          </a>
        </p>
        
        <p style="margin: 30px 0 15px; text-align: center; color: #7f8c8d; font-size: 0.9em;">
          Thank you for shopping with Vintage Custom Clothes!
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send order confirmation email');
  }
}

export async function sendDeliveryConfirmationEmail(order: Order) {
  const itemsHtml = order.items
    .map((item) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">
          ${item.name}<br>
          <small>Size: ${item.size} | Color: ${item.color}</small>
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      </tr>
    `).join('');

  const mailOptions = {
    from: `"Vintage Custom Clothes" <${process.env.EMAIL_USER}>`,
    to: order.shipping.email,
    subject: `🎉 Your Order #${order.orderId} Has Been Delivered!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #2c3e50;">Your order has been delivered, ${order.shipping.name.split(' ')[0]}! 🎉</h2>
        <p>We're excited to let you know that your order has been successfully delivered. We hope you love your new items!</p>
        
        <div style="margin: 20px 0; padding: 15px; background-color: #f0f8ff; border-radius: 5px; border-left: 4px solid #3498db;">
          <h3 style="margin-top: 0; color: #2c3e50;">Order #${order.orderId}</h3>
          <p><strong>Delivered on:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Tracking #:</strong> ${order.trackingNumber || 'N/A'}</p>
          
          <p style="margin: 15px 0;">Your order was delivered to:</p>
          <p>${formatShippingAddress(order.shipping).replace(/\n/g, '<br>')}</p>
          
          <p style="margin: 15px 0 0;">
            <a href="https://vintageclothes.com/orders" style="display: inline-block; padding: 10px 20px; background-color: #2c3e50; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 10px;">
              View Order Details
            </a>
          </p>
        </div>
        
        <h3 style="margin-top: 24px; color: #2c3e50; border-bottom: 2px solid #eee; padding-bottom: 8px;">Delivered Items</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 12px 0 20px;">
          <thead>
            <tr>
              <th style="text-align: left; padding: 10px; border-bottom: 2px solid #2c3e50;">Item</th>
              <th style="text-align: center; padding: 10px; border-bottom: 2px solid #2c3e50;">Qty</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="display: flex; gap: 20px; margin: 25px 0;">
          <div style="flex: 1;">
            <h3 style="margin-top: 0; color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 8px;">Shipping Address</h3>
            <p>${formatShippingAddress(order.shipping).replace(/\n/g, '<br>')}</p>
            <p><strong>Phone:</strong> ${order.shipping.phone}</p>
          </div>
          <div style="flex: 1;">
            <h3 style="margin-top: 0; color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 8px;">Payment Method</h3>
            <p>${order.payment.method === 'credit-card' ? 'Credit Card' : 
                order.payment.method === 'bank-transfer' ? 'Bank Transfer' : 'Cash on Delivery'}</p>
            <p><strong>Status:</strong> ${order.payment.status.charAt(0).toUpperCase() + order.payment.status.slice(1)}</p>
          </div>
        </div>
        
        <div style="margin: 30px 0; padding: 15px; background-color: #f9f9f9; border-radius: 5px; border-left: 4px solid #4CAF50;">
          <h3 style="margin-top: 0; color: #2c3e50;">We'd Love Your Feedback</h3>
          <p>We hope you're happy with your purchase. Your feedback helps us improve our products and services.</p>
          <p style="margin: 15px 0 0;">
            <a href="https://vintageclothes.com/orders/${order.orderId}/review" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Leave a Review
            </a>
          </p>
        </div>
        
        <div style="margin: 30px 0; padding: 15px; background-color: #e8f4fd; border-radius: 5px;">
          <h3 style="margin-top: 0; color: #2c3e50;">Need Help?</h3>
          <p>If you have any questions about your order or need to initiate a return, please visit our <a href="https://vintageclothes.com/help" style="color: #3498db; text-decoration: none;">Help Center</a> or reply to this email.</p>
        </div>
        
        <p style="margin: 30px 0 15px; text-align: center; color: #7f8c8d; font-size: 0.9em;">
          Thank you for shopping with Vintage Custom Clothes!
        </p>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; color: #95a5a6; font-size: 0.8em;">
          <p>© ${new Date().getFullYear()} Vintage Custom Clothes. All rights reserved.</p>
          <p>
            <a href="https://vintageclothes.com" style="color: #7f8c8d; text-decoration: none; margin: 0 10px;">Our Website</a> | 
            <a href="https://vintageclothes.com/contact" style="color: #7f8c8d; text-decoration: none; margin: 0 10px;">Contact Us</a> | 
            <a href="https://vintageclothes.com/privacy" style="color: #7f8c8d; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending delivery confirmation email:', error);
    throw new Error('Failed to send delivery confirmation email');
  }
}

export async function sendOrderProcessedEmail(order: Order) {
  const itemsHtml = order.items
    .map((item) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">
          ${item.name}<br>
          <small>Size: ${item.size} | Color: ${item.color}</small>
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${formatPrice(item.price / 100)}</td>
      </tr>
    `).join('');

  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + order.shippingCost;

  const mailOptions = {
    from: `"Vintage Custom Clothes" <${process.env.EMAIL_USER}>`,
    to: order.shipping.email,
    subject: `🚀 Your Order #${order.orderId} is Being Processed!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #2c3e50;">We're on it, ${order.shipping.name.split(' ')[0]}! 🛠️</h2>
        <p>Your order is now being processed by our team. We're getting everything ready for shipment.</p>
        
        <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 5px; border-left: 4px solid #3498db;">
          <h3 style="margin-top: 0; color: #2c3e50;">Order #${order.orderId}</h3>
          <p><strong>Order Date:</strong> ${new Date(order.date).toLocaleDateString()}</p>
          <p><strong>Status:</strong> Processing</p>
          <p><strong>Estimated Delivery:</strong> 3-5 business days</p>
        </div>
        
        <h3 style="margin-top: 24px; color: #2c3e50; border-bottom: 2px solid #eee; padding-bottom: 8px;">Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 12px 0 20px;">
          <thead>
            <tr>
              <th style="text-align: left; padding: 10px; border-bottom: 2px solid #2c3e50;">Item</th>
              <th style="text-align: center; padding: 10px; border-bottom: 2px solid #2c3e50;">Qty</th>
              <th style="text-align: right; padding: 10px; border-bottom: 2px solid #2c3e50;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        <div style="margin: 30px 0; padding: 15px; background-color: #e8f4fd; border-radius: 5px; border-left: 4px solid #3498db;">
          <h3 style="margin-top: 0; color: #2c3e50;">Order Total</h3>
          <p><strong>Subtotal:</strong> ${formatPrice(subtotal / 100)}</p>
          <p><strong>Shipping:</strong> ${formatPrice(order.shippingCost / 100)}</p>
          <p><strong>Total:</strong> ${formatPrice(total / 100)}</p>
        </div>

        <div style="display: flex; gap: 20px; margin: 25px 0;">
          <div style="flex: 1;">
            <h3 style="margin-top: 0; color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 8px;">Shipping Address</h3>
            <p>${formatShippingAddress(order.shipping).replace(/\n/g, '<br>')}</p>
            <p><strong>Phone:</strong> ${order.shipping.phone}</p>
          </div>
          <div style="flex: 1;">
            <h3 style="margin-top: 0; color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 8px;">Payment Method</h3>
            <p>${order.payment.method === 'credit-card' ? 'Credit Card' : 
                order.payment.method === 'bank-transfer' ? 'Bank Transfer' : 'Cash on Delivery'}</p>
            <p><strong>Status:</strong> ${order.payment.status.charAt(0).toUpperCase() + order.payment.status.slice(1)}</p>
          </div>
        </div>
        
        <div style="margin: 30px 0; padding: 15px; background-color: #e8f4fd; border-radius: 5px; border-left: 4px solid #3498db;">
          <h3 style="margin-top: 0; color: #2c3e50;">What's Next?</h3>
          <p>We'll send you a shipping confirmation email with tracking information as soon as your order is on its way.</p>
          <p>In the meantime, you can check the status of your order anytime by visiting <a href="https://vintageclothes.com/orders" style="color: #3498db; text-decoration: none;">your account</a>.</p>
        </div>
        
        <p style="margin: 30px 0 15px; text-align: center;">
          <a href="https://vintageclothes.com/orders" style="display: inline-block; padding: 12px 25px; background-color: #2c3e50; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
            View Your Order
          </a>
        </p>
        
        <p style="margin: 30px 0 15px; text-align: center; color: #7f8c8d; font-size: 0.9em;">
          Thank you for shopping with Vintage Custom Clothes!
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending order processed email:', error);
    throw new Error('Failed to send order processed email');
  }
}