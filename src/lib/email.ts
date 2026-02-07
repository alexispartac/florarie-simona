import nodemailer from 'nodemailer';
import { Order } from '@/types/orders';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const ORDER_URL = `${BASE_URL}/orders`;
const HELP_URL = `${BASE_URL}/help`;
const PRIVACY_URL = `${BASE_URL}/termeni-conditii`;
const CONTACT_URL = `${BASE_URL}/contact`;
const SHOP_URL = `${BASE_URL}/shop`;


function formatPrice(price: number): string {
  return new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency: 'RON',
  }).format(price);
}

function formatShippingAddress(shipping: Order['shipping']): string {
  let address = `${shipping.name}\n${shipping.address}\n${shipping.city}, ${shipping.state} ${shipping.postalCode}\n${shipping.country}`;
  
  if (shipping.deliveryInstructions) {
    address += `\n\nInformații suplimentare:\n${shipping.deliveryInstructions}`;
  }
  
  return address;
}

function formatBillingAddress(billing: Order['billing']): string {
  if (!billing) return 'N/A';
  
  let address = `${billing.name}`;
  
  if (billing.company) {
    address += `\n${billing.company}`;
  }
  
  if (billing.taxId) {
    address += `\nCUI: ${billing.taxId}`;
  }
  
  address += `\n${billing.address}\n${billing.city}, ${billing.state} ${billing.postalCode}\n${billing.country}`;
  
  return address;
}

export async function sendContactFormEmail(formData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {

  const mailOptions = {
    from: `"Buchetul Simonei" <${process.env.EMAIL_USER}>`,
    to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER, // Fallback to main email if contact email not set
    subject: `Formular Nou de Contact: ${formData.subject}`,
    replyTo: formData.email,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
        <h2 style="color: #2c3e50;">Trimitere Formular Nou de Contact</h2>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #3498db;">
          <p><strong>De la:</strong> ${formData.name} &lt;${formData.email}&gt;</p>
          <p><strong>Subiect:</strong> ${formData.subject}</p>
          <p><strong>Primit:</strong> ${new Date().toLocaleString()}</p>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; border: 1px solid #eee; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #2c3e50;">Mesaj:</h3>
          <p style="white-space: pre-line;">${formData.message}</p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #7f8c8d; font-size: 0.9em;">
          <p>Acesta este un mesaj automat. Te rugam sa nu raspunzi direct la acest email.</p>
          <p>Poti raspunde la ${formData.name} prin a raspunde la acest email sau prin a trimite un email la ${formData.email} direct.</p>
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
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${formatPrice(item.price / 100)}</td>
      </tr>
    `).join('');

  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + order.shippingCost;

  const mailOptions = {
    from: `"Buchetul Simonei" <${process.env.EMAIL_USER}>`,
    to: order.shipping.email,
    subject: `Confirmare Comanda - #${order.orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #2c3e50;">Multumim pentru comanda ta, ${order.shipping.name.split(' ')[0]}!</h2>
        <p>Comanda ta a fost primita si este in curs de procesare. Aici sunt detaliile comenzii tale:</p>
        
        <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
          <h3 style="margin-top: 0; color: #2c3e50;">Comanda #${order.orderId}</h3>
          <p><strong>Data Comenzii:</strong> ${new Date(order.date).toLocaleDateString()}</p>
          <p><strong>Status:</strong> ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
          <p><strong>Numar de Urmarire a Comenzii:</strong> ${order.trackingNumber || 'Va fi furnizat cand este livrat'}</p> 
          
          <p style="margin: 15px 0;">Poti urmari statutul comenzii si sa vezi detaliile prin a vizita pagina ta de cont.</p>
          
          <a href="${ORDER_URL}" style="display: inline-block; padding: 12px 25px; background-color: #2c3e50; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Vezi Comanda Ta
          </a>
        </div>
        
        <h3 style="margin-top: 24px; color: #2c3e50; border-bottom: 2px solid #eee; padding-bottom: 8px;">Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 12px 0 20px;">
          <thead>
            <tr>
              <th style="text-align: left; padding: 10px; border-bottom: 2px solid #2c3e50;">Articol</th>
              <th style="text-align: center; padding: 10px; border-bottom: 2px solid #2c3e50;">Cantitate</th>
              <th style="text-align: right; padding: 10px; border-bottom: 2px solid #2c3e50;">Pret</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
            <tr>
              <td colspan="2" style="text-align: right; padding: 12px 10px; font-weight: bold; border-top: 2px solid #eee;">Subtotal:</td>
              <td style="text-align: right; padding: 12px 10px; border-top: 2px solid #eee;">${formatPrice(subtotal / 100)}</td>
            </tr>
            <tr>
              <td colspan="2" style="text-align: right; padding: 5px 10px; font-weight: bold;">Livrare:</td>
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
            <h3 style="margin-top: 0; color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 8px;">Adresa de Livrare</h3>
            <p>${formatShippingAddress(order.shipping).replace(/\n/g, '<br>')}</p>
            <p><strong>Telefon:</strong> ${order.shipping.phone}</p>
          </div>
          <div style="flex: 1;">
            <h3 style="margin-top: 0; color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 8px;">Adresa de Facturare</h3>
            <p>${formatBillingAddress(order.billing).replace(/\n/g, '<br>')}</p>
            ${order.billing?.phone ? `<p><strong>Telefon:</strong> ${order.billing.phone}</p>` : ''}
          </div>
        </div>
        
        <div style="margin: 25px 0;">
          <h3 style="margin-top: 0; color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 8px;">Metoda de Plata</h3>
          <p>${order.payment.method === 'credit-card' ? 'Credit Card' : 
              order.payment.method === 'bank-transfer' ? 'Transfer Bancar' : 'Plata la Livrare'}</p>
          <p><strong>Status:</strong> ${order.payment.status.charAt(0).toUpperCase() + order.payment.status.slice(1)}</p>
        </div>
        
        <div style="margin: 30px 0; padding: 15px; background-color: #e8f4fd; border-radius: 5px; border-left: 4px solid #3498db;">
          <p style="margin: 0;">
            <strong>Pasii urmatori:</strong> Procesam comanda ta si vom trimite un email de confirmare de livrare cu informatiile comenzii cat mai curand.
          </p>
        </div>
        
        <p style="margin: 25px 0 15px;">Daca ai intrebari despre comanda ta, te rugam sa raspunzi la acest email sau sa contactezi serviciul nostru de asistenta la simonabuzau2@gmail.com.</p>
        
        <p style="margin: 30px 0 15px; text-align: center;">
          <a href="${ORDER_URL}" style="display: inline-block; padding: 12px 25px; background-color: #2c3e50; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Vezi Comanda Ta
          </a>
        </p>
        
        <p style="margin: 30px 0 15px; text-align: center; color: #7f8c8d; font-size: 0.9em;">
          Multumim pentru ca ai cumparat de la Buchetul Simonei!
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
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      </tr>
    `).join('');

  const mailOptions = {
    from: `"Buchetul Simonei" <${process.env.EMAIL_USER}>`,
    to: order.shipping.email,
    subject: `🎉 Comanda Ta #${order.orderId} A Sosit!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #2c3e50;">Comanda ta a sosit, ${order.shipping.name.split(' ')[0]}! 🎉</h2>
        <p>Suntem fericiti sa iti anuntam ca comanda ta a fost livrata cu succes. Speram ca iti va placem produsele noi!</p>
        
        <div style="margin: 20px 0; padding: 15px; background-color: #f0f8ff; border-radius: 5px; border-left: 4px solid #3498db;">
          <h3 style="margin-top: 0; color: #2c3e50;">Comanda #${order.orderId}</h3>
          <p><strong>Livrat pe:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Numar de Urmarire:</strong> ${order.trackingNumber || 'N/A'}</p>
          
          <p style="margin: 15px 0;">Comanda ta a fost livrata la:</p>
          <p>${formatShippingAddress(order.shipping).replace(/\n/g, '<br>')}</p>
          
          <p style="margin: 15px 0 0;">
            <a href="${ORDER_URL}" style="display: inline-block; padding: 10px 20px; background-color: #2c3e50; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 10px;">
              Vezi Detalii Comanda
            </a>
          </p>
        </div>
        
        <h3 style="margin-top: 24px; color: #2c3e50; border-bottom: 2px solid #eee; padding-bottom: 8px;">Produse Livrate</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 12px 0 20px;">
          <thead>
            <tr>
              <th style="text-align: left; padding: 10px; border-bottom: 2px solid #2c3e50;">Articol</th>
              <th style="text-align: center; padding: 10px; border-bottom: 2px solid #2c3e50;">Cantitate</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="display: flex; gap: 20px; margin: 25px 0;">
          <div style="flex: 1;">
            <h3 style="margin-top: 0; color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 8px;">Adresa de Livrare</h3>
            <p>${formatShippingAddress(order.shipping).replace(/\n/g, '<br>')}</p>
            <p><strong>Telefon:</strong> ${order.shipping.phone}</p>
          </div>
          <div style="flex: 1;">
            <h3 style="margin-top: 0; color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 8px;">Metoda de Plata</h3>
            <p>${order.payment.method === 'credit-card' ? 'Credit Card' : 
                order.payment.method === 'bank-transfer' ? 'Transfer Bancar' : 'Plata la Livrare'}</p>
            <p><strong>Status:</strong> ${order.payment.status.charAt(0).toUpperCase() + order.payment.status.slice(1)}</p>
          </div>
        </div>
        
        <div style="margin: 30px 0; padding: 15px; background-color: #f9f9f9; border-radius: 5px; border-left: 4px solid #4CAF50;">
          <h3 style="margin-top: 0; color: #2c3e50;">Vrem sa audem parerea ta</h3>
          <p>Speram ca iti va placem produsele noi. Parerea ta ne ajuta sa imbunatatim produsele si serviciile noastre.</p>
          <p style="margin: 15px 0 0;">
            <a href="${ORDER_URL}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Lasă un Review
            </a>
          </p>
        </div>
        
        <div style="margin: 30px 0; padding: 15px; background-color: #e8f4fd; border-radius: 5px;">
          <h3 style="margin-top: 0; color: #2c3e50;">Ai nevoie de ajutor?</h3>
          <p>Daca ai intrebari despre comanda ta sau ai nevoie de a incepe un return, te rugam sa vizitezi <a href="${ORDER_URL}" style="color: #3498db; text-decoration: none;">Centrul nostru de ajutor</a> sau sa raspunzi la acest email.</p>
        </div>
        
        <p style="margin: 30px 0 15px; text-align: center; color: #7f8c8d; font-size: 0.9em;">
          Multumim pentru ca ai cumparat de la Buchetul Simonei!
        </p>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; color: #95a5a6; font-size: 0.8em;">
          <p>© ${new Date().getFullYear()} Buchetul Simonei. Toate drepturile rezervate.</p>
          <p>
            <a href="${BASE_URL}" style="color: #7f8c8d; text-decoration: none; margin: 0 10px;">Website-ul nostru</a> | 
            <a href="${CONTACT_URL}" style="color: #7f8c8d; text-decoration: none; margin: 0 10px;">Contacteaza-ne</a> | 
            <a href="${PRIVACY_URL}" style="color: #7f8c8d; text-decoration: none; margin: 0 10px;">Politica de Confidentialitate</a>
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
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${formatPrice(item.price / 100)}</td>
      </tr>
    `).join('');

  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + order.shippingCost;

  const mailOptions = {
    from: `"Buchetul Simonei" <${process.env.EMAIL_USER}>`,
    to: order.shipping.email,
    subject: `🚀 Comanda Ta #${order.orderId} Este in Curs de Procesare!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #2c3e50;">Suntem pe calea, ${order.shipping.name.split(' ')[0]}! 🛠️</h2>
        <p>Comanda ta este in curs de procesare de catre echipa noastra. Suntem pregatiti sa livram produsele.</p>
        
        <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 5px; border-left: 4px solid #3498db;">
          <h3 style="margin-top: 0; color: #2c3e50;">Comanda #${order.orderId}</h3>
          <p><strong>Data Comenzii:</strong> ${new Date(order.date).toLocaleDateString()}</p>
          <p><strong>Status:</strong> In Curs de Procesare</p>
        </div>
        
        <h3 style="margin-top: 24px; color: #2c3e50; border-bottom: 2px solid #eee; padding-bottom: 8px;">Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 12px 0 20px;">
          <thead>
            <tr>
              <th style="text-align: left; padding: 10px; border-bottom: 2px solid #2c3e50;">Articol</th>
              <th style="text-align: center; padding: 10px; border-bottom: 2px solid #2c3e50;">Cantitate</th>
              <th style="text-align: right; padding: 10px; border-bottom: 2px solid #2c3e50;">Pret</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        <div style="margin: 30px 0; padding: 15px; background-color: #e8f4fd; border-radius: 5px; border-left: 4px solid #3498db;">
          <h3 style="margin-top: 0; color: #2c3e50;">Total Comanda</h3>
          <p><strong>Subtotal:</strong> ${formatPrice(subtotal / 100)}</p>
          <p><strong>Livrare:</strong> ${formatPrice(order.shippingCost / 100)}</p>
          <p><strong>Total:</strong> ${formatPrice(total / 100)}</p>
        </div>

        <div style="display: flex; gap: 20px; margin: 25px 0;">
          <div style="flex: 1;">
            <h3 style="margin-top: 0; color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 8px;">Adresa de Livrare</h3>
            <p>${formatShippingAddress(order.shipping).replace(/\n/g, '<br>')}</p>
            <p><strong>Telefon:</strong> ${order.shipping.phone}</p>
          </div>
          <div style="flex: 1;">
            <h3 style="margin-top: 0; color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 8px;">Metoda de Plata</h3>
            <p>${order.payment.method === 'credit-card' ? 'Credit Card' : 
                order.payment.method === 'bank-transfer' ? 'Transfer Bancar' : 'Plata la Livrare'}</p>
            <p><strong>Status:</strong> ${order.payment.status.charAt(0).toUpperCase() + order.payment.status.slice(1)}</p>
          </div>
        </div>
        
        <div style="margin: 30px 0; padding: 15px; background-color: #e8f4fd; border-radius: 5px; border-left: 4px solid #3498db;">
          <h3 style="margin-top: 0; color: #2c3e50;">Ce urmeaza?</h3>  
          <p>Vom trimite un email de confirmare de livrare cu informatiile comenzii cat mai curand.</p>
          <p>Poti verifica statusul comenzii oricand prin vizitarea <a href="${ORDER_URL}" style="color: #3498db; text-decoration: none;">contul tau</a>.</p>
        </div>
        
        <p style="margin: 30px 0 15px; text-align: center;">
          <a href="${ORDER_URL}" style="display: inline-block; padding: 12px 25px; background-color: #2c3e50; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Vezi Comanda Ta
          </a>
        </p>
        
        <p style="margin: 30px 0 15px; text-align: center; color: #7f8c8d; font-size: 0.9em;">
          Multumim pentru ca ai cumparat de la Buchetul Simonei!
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

// Email pentru comanda confirmată (similar cu placed-order dar poate fi folosit separat)
export async function sendOrderConfirmedEmail(order: Order) {
  return sendOrderConfirmationEmail(order);
}

// Email pentru comanda în livrare (out-for-delivery)
export async function sendOrderOutForDeliveryEmail(order: Order) {
  const itemsHtml = order.items
    .map((item) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">
          ${item.name}<br>
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      </tr>
    `).join('');

  const mailOptions = {
    from: `"Buchetul Simonei" <${process.env.EMAIL_USER}>`,
    to: order.shipping.email,
    subject: `🚚 Comanda Ta #${order.orderId} Este În Drum Spre Tine!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #2c3e50;">Bună ${order.shipping.name.split(' ')[0]}! Comanda ta este pe drum! 🚚</h2>
        <p>Veștile bune! Comanda ta a plecat de la atelier și este în drum spre tine. Curierul nostru va ajunge în curând la adresa indicată.</p>
        
        <div style="margin: 20px 0; padding: 15px; background-color: #fff3cd; border-radius: 5px; border-left: 4px solid #ffc107;">
          <h3 style="margin-top: 0; color: #2c3e50;">📦 Detalii Livrare</h3>
          <p><strong>Comandă #:</strong> ${order.orderId}</p>
          <p><strong>Număr de Urmărire:</strong> ${order.trackingNumber || 'N/A'}</p>
          <p><strong>Status:</strong> În Livrare</p>
          
          <p style="margin: 15px 0 0;">
            <a href="${ORDER_URL}" style="display: inline-block; padding: 10px 20px; background-color: #ffc107; color: #000; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Urmărește Comanda
            </a>
          </p>
        </div>
        
        <div style="margin: 20px 0; padding: 15px; background-color: #d4edda; border-radius: 5px; border-left: 4px solid #28a745;">
          <h3 style="margin-top: 0; color: #2c3e50;">📍 Adresa de Livrare</h3>
          <p>${formatShippingAddress(order.shipping).replace(/\n/g, '<br>')}</p>
          <p><strong>Telefon:</strong> ${order.shipping.phone}</p>
          <p style="margin-top: 10px; font-size: 0.9em; color: #666;">
            <strong>Important:</strong> Curierul te va contacta înainte de livrare. Te rugăm să fii disponibil(ă) la numărul de telefon indicat.
          </p>
        </div>
        
        <h3 style="margin-top: 24px; color: #2c3e50; border-bottom: 2px solid #eee; padding-bottom: 8px;">Produse în Livrare</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 12px 0 20px;">
          <thead>
            <tr>
              <th style="text-align: left; padding: 10px; border-bottom: 2px solid #2c3e50;">Articol</th>
              <th style="text-align: center; padding: 10px; border-bottom: 2px solid #2c3e50;">Cantitate</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        <div style="margin: 30px 0; padding: 15px; background-color: #e8f4fd; border-radius: 5px;">
          <h3 style="margin-top: 0; color: #2c3e50;">💡 Sfaturi pentru Primirea Florilor</h3>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li>Pregătește o vază cu apă proaspătă</li>
            <li>Taie tulpinile la un unghi de 45° imediat după primire</li>
            <li>Plasează florile într-un loc răcoros, departe de lumina directă a soarelui</li>
            <li>Schimbă apa zilnic pentru a păstra florile proaspete mai mult timp</li>
          </ul>
        </div>
        
        <div style="margin: 30px 0; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
          <h3 style="margin-top: 0; color: #2c3e50;">Ai nevoie de ajutor?</h3>
          <p>Dacă ai întrebări despre comanda ta sau livrare, te rugăm să vizitezi <a href="${HELP_URL}" style="color: #3498db; text-decoration: none;">Centrul nostru de ajutor</a> sau să ne contactezi la <a href="tel:0769141250" style="color: #3498db; text-decoration: none;">0769141250</a>.</p>
        </div>
        
        <p style="margin: 30px 0 15px; text-align: center; color: #7f8c8d; font-size: 0.9em;">
          Mulțumim pentru că ai cumpărat de la Buchetul Simonei!
        </p>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; color: #95a5a6; font-size: 0.8em;">
          <p>© ${new Date().getFullYear()} Buchetul Simonei. Toate drepturile rezervate.</p>
          <p>
            <a href="${BASE_URL}" style="color: #7f8c8d; text-decoration: none; margin: 0 10px;">Website-ul nostru</a> | 
            <a href="${CONTACT_URL}" style="color: #7f8c8d; text-decoration: none; margin: 0 10px;">Contactează-ne</a>
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending out-for-delivery email:', error);
    throw new Error('Failed to send out-for-delivery email');
  }
}

// Email pentru comanda anulată (cancelled)
export async function sendOrderCancelledEmail(order: Order, cancellationReason?: string) {
  const itemsHtml = order.items
    .map((item) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">
          ${item.name}
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${formatPrice(item.price / 100)}</td>
      </tr>
    `).join('');

  const mailOptions = {
    from: `"Buchetul Simonei" <${process.env.EMAIL_USER}>`,
    to: order.shipping.email,
    subject: `❌ Comanda Ta #${order.orderId} A Fost Anulată`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #dc3545;">Comanda Ta A Fost Anulată</h2>
        <p>Bună ${order.shipping.name.split(' ')[0]},</p>
        <p>Ne pare rău să te informăm că comanda ta #${order.orderId} a fost anulată.</p>
        
        ${cancellationReason ? `
          <div style="margin: 20px 0; padding: 15px; background-color: #f8d7da; border-radius: 5px; border-left: 4px solid #dc3545;">
            <h3 style="margin-top: 0; color: #721c24;">Motiv Anulare:</h3>
            <p>${cancellationReason}</p>
          </div>
        ` : ''}
        
        <div style="margin: 20px 0; padding: 15px; background-color: #fff3cd; border-radius: 5px; border-left: 4px solid #ffc107;">
          <h3 style="margin-top: 0; color: #2c3e50;">Detalii Comandă Anulată</h3>
          <p><strong>Comandă #:</strong> ${order.orderId}</p>
          <p><strong>Data Plasării:</strong> ${new Date(order.date).toLocaleDateString('ro-RO')}</p>
          <p><strong>Data Anulării:</strong> ${new Date().toLocaleDateString('ro-RO')}</p>
          ${order.trackingNumber ? `<p><strong>Număr de Urmărire:</strong> ${order.trackingNumber}</p>` : ''}
        </div>
        
        <h3 style="margin-top: 24px; color: #2c3e50; border-bottom: 2px solid #eee; padding-bottom: 8px;">Produse Anulate</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 12px 0 20px;">
          <thead>
            <tr>
              <th style="text-align: left; padding: 10px; border-bottom: 2px solid #2c3e50;">Articol</th>
              <th style="text-align: center; padding: 10px; border-bottom: 2px solid #2c3e50;">Cantitate</th>
              <th style="text-align: right; padding: 10px; border-bottom: 2px solid #2c3e50;">Preț</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <table style="width: 100%;">
            <tr>
              <td style="padding: 5px;"><strong>Subtotal:</strong></td>
              <td style="text-align: right; padding: 5px;">${formatPrice((order.total - order.shippingCost) / 100)}</td>
            </tr>
            <tr>
              <td style="padding: 5px;"><strong>Transport:</strong></td>
              <td style="text-align: right; padding: 5px;">${formatPrice(order.shippingCost / 100)}</td>
            </tr>
            <tr style="border-top: 2px solid #2c3e50;">
              <td style="padding: 10px 5px 5px;"><strong>Total:</strong></td>
              <td style="text-align: right; padding: 10px 5px 5px;"><strong>${formatPrice(order.total / 100)}</strong></td>
            </tr>
          </table>
        </div>
        
        ${order.payment.status === 'paid' ? `
          <div style="margin: 30px 0; padding: 15px; background-color: #d1ecf1; border-radius: 5px; border-left: 4px solid #17a2b8;">
            <h3 style="margin-top: 0; color: #0c5460;">💰 Rambursare</h3>
            <p>Deoarece comanda ta a fost plătită, vom procesa o rambursare completă. Suma de <strong>${formatPrice(order.total / 100)}</strong> va fi returnată în contul tău în <strong>5-10 zile lucrătoare</strong>, în funcție de banca ta.</p>
            ${order.payment.method === 'credit-card' ? '<p><em>Rambursarea va fi procesată pe cardul folosit la achiziție.</em></p>' : ''}
            ${order.payment.method === 'bank-transfer' ? '<p><em>Te vom contacta pentru detaliile contului bancar pentru rambursare.</em></p>' : ''}
          </div>
        ` : ''}
        
        <div style="margin: 30px 0; padding: 15px; background-color: #d4edda; border-radius: 5px; border-left: 4px solid #28a745;">
          <h3 style="margin-top: 0; color: #155724;">🌸 Comandă Din Nou?</h3>
          <p>Ne pare rău pentru neplăcere! Dacă dorești să plasezi o nouă comandă, suntem aici pentru tine cu flori proaspete și buchete minunate.</p>
          <p style="margin: 15px 0 0;">
            <a href="${SHOP_URL}" style="display: inline-block; padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Explorează Magazinul
            </a>
          </p>
        </div>
        
        <div style="margin: 30px 0; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
          <h3 style="margin-top: 0; color: #2c3e50;">Ai întrebări?</h3>
          <p>Dacă ai întrebări despre anularea comenzii sau procesul de rambursare, te rugăm să ne contactezi:</p>
          <ul style="list-style: none; padding: 0;">
            <li>📞 Telefon: <a href="tel:0769141250" style="color: #3498db; text-decoration: none;">0769141250</a></li>
            <li>✉️ Email: <a href="mailto:simonabuzau2@gmail.com" style="color: #3498db; text-decoration: none;">simonabuzau2@gmail.com</a></li>
            <li>🌐 <a href="${HELP_URL}" style="color: #3498db; text-decoration: none;">Centrul de Ajutor</a></li>
          </ul>
        </div>
        
        <p style="margin: 30px 0 15px; text-align: center; color: #7f8c8d; font-size: 0.9em;">
          Ne pare rău pentru inconveniență. Sperăm să te revedem curând!
        </p>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; color: #95a5a6; font-size: 0.8em;">
          <p>© ${new Date().getFullYear()} Buchetul Simonei. Toate drepturile rezervate.</p>
          <p>
            <a href="${BASE_URL}" style="color: #7f8c8d; text-decoration: none; margin: 0 10px;">Website-ul nostru</a> | 
            <a href="${CONTACT_URL}" style="color: #7f8c8d; text-decoration: none; margin: 0 10px;">Contactează-ne</a>
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending order cancelled email:', error);
    throw new Error('Failed to send order cancelled email');
  }
}

// Email pentru livrare eșuată (failed-delivery)
export async function sendOrderFailedDeliveryEmail(order: Order, failureReason?: string) {
  const itemsHtml = order.items
    .map((item) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">
          ${item.name}
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      </tr>
    `).join('');

  const mailOptions = {
    from: `"Buchetul Simonei" <${process.env.EMAIL_USER}>`,
    to: order.shipping.email,
    subject: `⚠️ Problemă cu Livrarea Comenzii #${order.orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #ff6b6b;">Problemă cu Livrarea Comenzii Tale</h2>
        <p>Bună ${order.shipping.name.split(' ')[0]},</p>
        <p>Din păcate, curierul nostru nu a reușit să livreze comanda ta #${order.orderId}.</p>
        
        ${failureReason ? `
          <div style="margin: 20px 0; padding: 15px; background-color: #fff3cd; border-radius: 5px; border-left: 4px solid #ffc107;">
            <h3 style="margin-top: 0; color: #856404;">Motiv:</h3>
            <p>${failureReason}</p>
          </div>
        ` : ''}
        
        <div style="margin: 20px 0; padding: 15px; background-color: #f8d7da; border-radius: 5px; border-left: 4px solid #dc3545;">
          <h3 style="margin-top: 0; color: #721c24;">⚠️ Ce s-a întâmplat?</h3>
          <p>Curierul a încercat să livreze comanda ta, dar din următoarele motive livrarea nu a fost posibilă:</p>
          <ul>
            <li>Destinatarul nu a fost găsit la adresa indicată</li>
            <li>Adresa nu a putut fi localizată</li>
            <li>Nu a răspuns nimeni la ușă sau telefon</li>
            <li>Alte circumstanțe neașteptate</li>
          </ul>
        </div>
        
        <div style="margin: 20px 0; padding: 15px; background-color: #d1ecf1; border-radius: 5px; border-left: 4px solid #17a2b8;">
          <h3 style="margin-top: 0; color: #0c5460;">📦 Detalii Comandă</h3>
          <p><strong>Comandă #:</strong> ${order.orderId}</p>
          <p><strong>Număr de Urmărire:</strong> ${order.trackingNumber || 'N/A'}</p>
          <p><strong>Data Încercării de Livrare:</strong> ${new Date().toLocaleDateString('ro-RO')}</p>
          <p><strong>Status:</strong> Livrare Eșuată</p>
        </div>
        
        <h3 style="margin-top: 24px; color: #2c3e50; border-bottom: 2px solid #eee; padding-bottom: 8px;">Produse în Comandă</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 12px 0 20px;">
          <thead>
            <tr>
              <th style="text-align: left; padding: 10px; border-bottom: 2px solid #2c3e50;">Articol</th>
              <th style="text-align: center; padding: 10px; border-bottom: 2px solid #2c3e50;">Cantitate</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        <div style="margin: 30px 0; padding: 15px; background-color: #d4edda; border-radius: 5px; border-left: 4px solid #28a745;">
          <h3 style="margin-top: 0; color: #155724;">✅ Ce Poți Face?</h3>
          <p><strong>Contactează-ne urgent</strong> pentru a reprograma livrarea sau pentru a actualiza adresa de livrare:</p>
          <ul style="list-style: none; padding: 0; margin: 15px 0;">
            <li style="margin: 8px 0;">📞 <strong>Telefon:</strong> <a href="tel:0769141250" style="color: #28a745; text-decoration: none; font-weight: bold;">0769141250</a></li>
            <li style="margin: 8px 0;">✉️ <strong>Email:</strong> <a href="mailto:simonabuzau2@gmail.com" style="color: #28a745; text-decoration: none; font-weight: bold;">simonabuzau2@gmail.com</a></li>
          </ul>
          <p style="margin-top: 15px;">
            <a href="${CONTACT_URL}" style="display: inline-block; padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Contactează-ne Acum
            </a>
          </p>
        </div>
        
        <div style="margin: 20px 0; padding: 15px; background-color: #e8f4fd; border-radius: 5px;">
          <h3 style="margin-top: 0; color: #2c3e50;">📍 Adresa de Livrare Actuală</h3>
          <p>${formatShippingAddress(order.shipping).replace(/\n/g, '<br>')}</p>
          <p><strong>Telefon:</strong> ${order.shipping.phone}</p>
          <p style="margin-top: 10px; font-size: 0.9em; color: #666;">
            Dacă adresa sau numărul de telefon nu sunt corecte, te rugăm să ne contactezi imediat pentru a le actualiza.
          </p>
        </div>
        
        <div style="margin: 30px 0; padding: 15px; background-color: #fff3cd; border-radius: 5px;">
          <h3 style="margin-top: 0; color: #856404;">⏰ Timp Limitat</h3>
          <p><strong>Important:</strong> Florile sunt produse perisabile. Te rugăm să ne contactezi <strong>în maximum 24 de ore</strong> pentru a reprograma livrarea. După acest termen, s-ar putea să fie nevoie să plasezi o comandă nouă pentru a asigura prospețimea florilor.</p>
        </div>
        
        <div style="margin: 30px 0; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
          <h3 style="margin-top: 0; color: #2c3e50;">Program Contact</h3>
          <p>Echipa noastră este disponibilă:</p>
          <p><strong>Luni - Sâmbătă:</strong> 09:00 - 20:00</p>
          <p><strong>Duminică:</strong> Închis</p>
        </div>
        
        <p style="margin: 30px 0 15px; text-align: center; color: #7f8c8d; font-size: 0.9em;">
          Ne cerem scuze pentru inconveniență și așteptăm să rezolvăm situația cât mai curând!
        </p>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; color: #95a5a6; font-size: 0.8em;">
          <p>© ${new Date().getFullYear()} Buchetul Simonei. Toate drepturile rezervate.</p>
          <p>
            <a href="${BASE_URL}" style="color: #7f8c8d; text-decoration: none; margin: 0 10px;">Website-ul nostru</a> | 
            <a href="${CONTACT_URL}" style="color: #7f8c8d; text-decoration: none; margin: 0 10px;">Contactează-ne</a>
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending failed delivery email:', error);
    throw new Error('Failed to send failed delivery email');
  }
}