import axios from 'axios';
import { OrderPropsAdmin } from '@/app/types/order';

interface ProcessOrderParams {
    orderData: OrderPropsAdmin;
    paymentMethod: 'ramburs' | 'card';
    currency: 'RON' | 'EUR';
    totalPrice: number;
    onSuccess: (message: string) => void;
    onError: (error: string) => void;
    onCardPaymentRedirect: (redirectUrl: string) => void;
}

interface OrderValidation {
    isValid: boolean;
    message: string;
}

interface ProcessResult {
    success: boolean;
    message: string;
    redirectUrl?: string;
}

const URL_ORDER_NUMBER_API = '/api/orders/number';
const URL_PLACED_ORDER_EMAIL_API = '/api/send-email/placed-order';

export class CheckoutService {
    
    static async fetchOrderNumber(): Promise<number> {
        try {
            const response = await axios.get(URL_ORDER_NUMBER_API, { withCredentials: true });
            const orders: OrderPropsAdmin[] = response.data;
            return orders.length;
        } catch (error) {
            console.error('Error fetching order number:', error);
            return 0;
        }
    }

    static validateOrder(orderData: OrderPropsAdmin): OrderValidation {
        // Validare număr de telefon
        const phoneRegex = /^\+?[0-9]{10,15}$/;
        if (!phoneRegex.test(orderData.clientPhone)) {
            return {
                isValid: false,
                message: 'Numărul de telefon este invalid. Te rugăm să introduci un număr valid (minim 10 cifre).'
            };
        }

        // Validare adresă
        if (orderData.clientAddress.length < 8) {
            return {
                isValid: false,
                message: 'Adresa trebuie să conțină cel puțin 8 caractere și să fie completă.'
            };
        }

        // Validare nume
        if (orderData.clientName.length < 2) {
            return {
                isValid: false,
                message: 'Numele trebuie să conțină cel puțin 2 caractere.'
            };
        }

        // Validare email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(orderData.clientEmail)) {
            return {
                isValid: false,
                message: 'Adresa de email nu este validă.'
            };
        }

        // Validare produse
        if (!orderData.products || orderData.products.length === 0) {
            return {
                isValid: false,
                message: 'Coșul de cumpărături este gol.'
            };
        }

        return {
            isValid: true,
            message: 'Validare reușită'
        };
    }

    static async createOrder(orderData: OrderPropsAdmin): Promise<boolean> {
        try {
            const response = await axios.post('/api/orders', orderData);
            return response.status === 200;
        } catch (error) {
            console.error('Error creating order:', error);
            throw new Error('Eroare la crearea comenzii în baza de date.');
        }
    }

    static async sendConfirmationEmail(orderData: OrderPropsAdmin, totalPrice: number, currency: string = 'RON'): Promise<boolean> {
        try {
            const response = await axios.post(URL_PLACED_ORDER_EMAIL_API, {
                clientEmail: orderData.clientEmail,
                clientName: orderData.clientName,
                orderDetails: orderData.products,
                totalPrice: totalPrice,
                currency: currency,
                orderNumber: orderData.orderNumber,
                deliveryInfo: {
                    address: orderData.clientAddress,
                    phone: orderData.clientPhone,
                    notes: orderData.info
                }
            });

            return response.status === 200;
        } catch (error) {
            console.error('Error sending confirmation email:', error);
            throw new Error('Eroare la trimiterea email-ului de confirmare.');
        }
    }

    // Salvează doar datele temporare pentru plata cu cardul
    static async savePendingOrderData(orderData: OrderPropsAdmin): Promise<boolean> {
        try {
            // Salvează datele comenzii în sessionStorage pentru a fi recuperate după plată
            sessionStorage.setItem('pendingOrderData', JSON.stringify({
                orderData,
                timestamp: Date.now()
            }));
            return true;
        } catch (error) {
            console.error('Error saving pending order data:', error);
            return false;
        }
    }

    // Recuperează datele comenzii după plată
    static getPendingOrderData(): OrderPropsAdmin | null {
        try {
            const saved = sessionStorage.getItem('pendingOrderData');
            if (!saved) return null;
            
            const { orderData, timestamp } = JSON.parse(saved);
            
            // Verifică dacă datele nu sunt prea vechi (30 minute)
            if (Date.now() - timestamp > 30 * 60 * 1000) {
                sessionStorage.removeItem('pendingOrderData');
                return null;
            }
            
            return orderData;
        } catch (error) {
            console.error('Error getting pending order data:', error);
            return null;
        }
    }

    // Curăță datele temporare
    static clearPendingOrderData(): void {
        sessionStorage.removeItem('pendingOrderData');
    }

    static async initializeCardPayment(orderData: OrderPropsAdmin, currency: string, totalPrice: number): Promise<string> {
        try {
            const response = await axios.post('/api/payment-card', {
                items: orderData.products.map((product) => ({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    quantity: product.quantity,
                    title_category: product.title_category,
                })),
                customerInfo: {
                    name: orderData.clientName,
                    email: orderData.clientEmail,
                    phone: orderData.clientPhone,
                    address: orderData.clientAddress,
                },
                orderDetails: {
                    orderId: orderData.id,
                    orderNumber: orderData.orderNumber,
                    totalPrice: totalPrice,
                    currency: currency,
                    paymentMethod: orderData.paymentMethod,
                    deliveryDate: orderData.deliveryDate,
                    info: orderData.info,
                    orderDate: orderData.orderDate,
                },
                urls: {
                    returnUrl: `${window.location.origin}/checkout/success`,
                    cancelUrl: `${window.location.origin}/checkout/cancel`,
                }
            }, { withCredentials: true });

            return response.data;
        } catch (error) {
            console.error('Error initializing card payment:', error);
            throw new Error('Eroare la inițializarea plății cu cardul.');
        }
    }

    // Procesează comanda după plata cu cardul reușită
    static async processCardOrderAfterPayment(orderData: OrderPropsAdmin, totalPrice: number, currency: string): Promise<boolean> {
        try {
            // 1. Salvează comanda în baza de date
            const orderCreated = await this.createOrder(orderData);
            if (!orderCreated) {
                throw new Error('Eroare la salvarea comenzii în baza de date.');
            }

            // 2. Trimite email-ul de confirmare
            await this.sendConfirmationEmail(orderData, totalPrice, currency);

            // 3. Curăță datele temporare
            this.clearPendingOrderData();

            return true;
        } catch (error) {
            console.error('Error processing card order after payment:', error);
            throw error;
        }
    }

    static redirectToPayment(redirectUrl: string): void {
        document.body.innerHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Redirecționare către EuPlătesc</title>
                <style>
                    body { 
                        font-family: 'Arial', sans-serif; 
                        text-align: center; 
                        padding: 50px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        margin: 0;
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .container {
                        max-width: 500px;
                        background: white;
                        padding: 40px;
                        border-radius: 20px;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                        position: relative;
                        overflow: hidden;
                    }
                    .container::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        height: 5px;
                        background: linear-gradient(90deg, #b756a6, #667eea);
                    }
                    .icon {
                        font-size: 48px;
                        margin-bottom: 20px;
                        animation: pulse 2s infinite;
                    }
                    @keyframes pulse {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.1); }
                    }
                    .message {
                        color: #333;
                        font-size: 20px;
                        margin-bottom: 15px;
                        font-weight: 600;
                    }
                    .sub-message {
                        color: #666;
                        font-size: 16px;
                        margin-bottom: 30px;
                        line-height: 1.5;
                    }
                    .continue-btn {
                        background: linear-gradient(45deg, #b756a6, #667eea);
                        color: white;
                        padding: 15px 30px;
                        border: none;
                        border-radius: 25px;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                        text-decoration: none;
                        display: inline-block;
                        transition: transform 0.3s ease;
                        box-shadow: 0 5px 15px rgba(183, 86, 166, 0.4);
                    }
                    .continue-btn:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 7px 20px rgba(183, 86, 166, 0.6);
                    }
                    .progress-bar {
                        width: 100%;
                        height: 4px;
                        background-color: #f0f0f0;
                        border-radius: 2px;
                        margin: 20px 0;
                        overflow: hidden;
                    }
                    .progress-fill {
                        height: 100%;
                        background: linear-gradient(90deg, #b756a6, #667eea);
                        border-radius: 2px;
                        animation: loading 2s ease-in-out;
                    }
                    @keyframes loading {
                        0% { width: 0%; }
                        100% { width: 100%; }
                    }
                </style>
                <script>
                    let countdown = 3;
                    const countdownElement = document.createElement('div');
                    countdownElement.style.cssText = 'color: #666; font-size: 14px; margin-top: 15px;';
                    document.querySelector('.container').appendChild(countdownElement);
                    
                    const updateCountdown = () => {
                        countdownElement.textContent = \`Redirecționare automată în \${countdown} secunde...\`;
                        countdown--;
                        if (countdown < 0) {
                            window.location.href = "${redirectUrl}";
                        }
                    };
                    
                    updateCountdown();
                    setInterval(updateCountdown, 1000);
                </script>
            </head>
            <body>
                <div class="container">
                    <div class="icon">💳</div>
                    <div class="message">Se inițializează plata...</div>
                    <div class="sub-message">
                        Te redirecționăm către platforma de plăți securizată EuPlătesc pentru a finaliza comanda.
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                    <a href="${redirectUrl}" class="continue-btn">
                        🚀 Continuă către EuPlătesc
                    </a>
                </div>
            </body>
            </html>
        `;
    }

    static async processOrder(params: ProcessOrderParams): Promise<ProcessResult> {
        const { orderData, paymentMethod, currency, totalPrice, onSuccess, onError, onCardPaymentRedirect } = params;

        try {
            // Procesare în funcție de metoda de plată
            if (paymentMethod === 'card') {
                // Pentru plata cu cardul - DOAR salvează datele temporar și inițializează plata
                try {
                    // 1. Salvează datele comenzii temporar
                    const dataSaved = await this.savePendingOrderData(orderData);
                    if (!dataSaved) {
                        throw new Error('Eroare la salvarea datelor temporare.');
                    }

                    // 2. Inițializează plata cu cardul
                    const redirectUrl = await this.initializeCardPayment(orderData, currency, totalPrice);
                    
                    // 3. Redirecționează către procesatorul de plăți
                    onCardPaymentRedirect(redirectUrl);
                    
                    return {
                        success: true,
                        message: 'Redirecționare către procesatorul de plăți...',
                        redirectUrl
                    };
                } catch (error) {
                    throw new Error('Eroare la inițializarea plății cu cardul.', error instanceof Error ? { cause: error } : undefined);
                }
            } else {
                // Pentru ramburs - procesează complet comanda
                try {
                    // 1. Creează comanda în baza de date
                    const orderCreated = await this.createOrder(orderData);
                    if (!orderCreated) {
                        throw new Error('Eroare la crearea comenzii în baza de date.');
                    }

                    // 2. Trimite email-ul de confirmare
                    await this.sendConfirmationEmail(orderData, totalPrice, currency);

                    // 3. Finalizează procesul
                    onSuccess('🎉 Comanda ta a fost plasată cu succes! Vei primi un email de confirmare în scurt timp. Mulțumim pentru achiziție!');
                    
                    return {
                        success: true,
                        message: 'Comanda plasată cu succes pentru plata ramburs.'
                    };
                } catch (error) {
                    throw new Error('Eroare la procesarea comenzii cu plata ramburs.', error instanceof Error ? { cause: error } : undefined);
                }
            }

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'A apărut o eroare neașteptată la procesarea comenzii.';
            onError(errorMessage);
            return {
                success: false,
                message: errorMessage
            };
        }
    }
}