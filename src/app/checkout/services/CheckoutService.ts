import axios from 'axios';
import { OrderPropsAdmin, OrderProductProps } from '@/app/types/order';

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

const URL_PLACED_ORDER_EMAIL_API = '/api/send-email/placed-order';

export class CheckoutService {

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
        if (orderData.clientName.length < 5) {
            return {
                isValid: false,
                message: 'Numele trebuie să conțină cel puțin 5 caractere.'
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

        // Verificare produse
        orderData.products.forEach((product: OrderProductProps) => {
            if( typeof product.id !== 'string' ) {
                return {
                    isValid: false,
                    message: 'Eroare la verificarea produselor'
                };
            }
            if( typeof product.title !== 'string' ) {
                return {
                    isValid: false,
                    message: 'Eroare la verificarea produselor'
                };
            }
            if( typeof product.title_category !== 'string' ) {
                return {
                    isValid: false,
                    message: 'Eroare la verificarea produselor'
                };
            }
            if( typeof product.price !== 'number' ) {
                return {
                    isValid: false,
                    message: 'Eroare la verificarea produselor'
                };
            }
            if( typeof product.quantity !== 'number' ) {
                return {
                    isValid: false,
                    message: 'Eroare la verificarea produselor'
                };
            }
        });

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
                    notes: orderData.info,
                    paymentMethod: orderData.paymentMethod,
                }
            });

            return response.status === 200;
        } catch (error) {
            console.error('Error sending confirmation email:', error);
            throw new Error('Eroare la trimiterea email-ului de confirmare.');
        }
    }

    // Salvează datele comenzii temporar pentru webhook (NU în orders până la confirmare)
    static async savePendingOrderData(orderData: OrderPropsAdmin): Promise<boolean> {
        try {
            // 1. Salvează în sessionStorage pentru recovery rapid pe client
            sessionStorage.setItem('pendingOrderData', JSON.stringify({
                orderData,
                timestamp: Date.now()
            }));

            // 2. Salvează în pending-orders pentru webhook
            const response = await axios.post('/api/pending-orders', {
                ...orderData,
                createdAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 20 * 60 * 1000).toISOString() // 20 minute
            });

            return response.status === 200;
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
            
            // Verifică dacă datele nu sunt prea vechi (20 minute)
            if (Date.now() - timestamp > 20 * 60 * 1000) {
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

    // Verifică dacă comanda există în baza de date
    static async checkOrderExists(orderId: string): Promise<boolean> {
        try {
            // Adaugă timestamp pentru a evita cache-ul
            const cacheBust = new Date().getTime();
            const response = await axios.get(`/api/orders/check/${orderId}?_=${cacheBust}`);
            return response.status === 200 && response.data.exists === true;
        } catch (error) {
            console.error('Error checking order existence:', error);
            return false;
        }
    }

    // Procesează comanda după plata cu cardul reușită (fallback manual)
    static async processCardOrderAfterPayment(orderData: OrderPropsAdmin, totalPrice: number, currency: string): Promise<boolean> {
        try {
            // Comanda ar trebui să existe deja din checkout
            // Actualizăm doar paymentStatus la 'paid'
            const response = await axios.put('/api/orders', {
                id: orderData.id,
                paymentStatus: 'paid',
                paymentDetails: {
                    euplatescId: 'manual_confirmation',
                    approval: 'manual',
                    timestamp: new Date().toISOString(),
                    amount: totalPrice.toString(),
                    currency: currency
                },
                updatedAt: new Date().toISOString()
            });

            if (response.status !== 200) {
                throw new Error('Eroare la actualizarea status-ului plății.');
            }

            // Trimite email-ul de confirmare
            await this.sendConfirmationEmail(orderData, totalPrice, currency);

            // Curăță datele temporare
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
                <title>Redirecționare către pagina de plată</title>
                <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
                <style>
                    body { 
                        font-family: 'Roboto', sans-serif;
                        background-color: #f8f5f0;
                        color: #333;
                        margin: 0;
                        padding: 0;
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        line-height: 1.6;
                    }
                    .container {
                        width: 100%;
                        max-width: 600px;
                        background: white;
                        padding: 2.5rem;
                        border: 1px solid #e0d8c9;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                        text-align: center;
                    }
                    h1 {
                        font-family: 'Playfair Display', serif;
                        color: #2c3e50;
                        margin: 0 0 1.5rem 0;
                        font-size: 1.8rem;
                        font-weight: 600;
                    }
                    .icon {
                        font-size: 3rem;
                        margin-bottom: 1.5rem;
                        color: #8b7355;
                    }
                    .message {
                        font-size: 1.25rem;
                        margin-bottom: 1rem;
                        color: #2c3e50;
                    }
                    .sub-message {
                        color: #666;
                        margin-bottom: 2rem;
                        max-width: 450px;
                        margin-left: auto;
                        margin-right: auto;
                    }
                    .divider {
                        height: 1px;
                        background-color: #e0d8c9;
                        margin: 1.5rem 0;
                    }
                    .continue-btn {
                        display: inline-block;
                        background-color: #8b7355;
                        color: white;
                        padding: 0.8rem 2rem;
                        text-decoration: none;
                        border-radius: 2px;
                        font-weight: 500;
                        transition: background-color 0.2s;
                        border: none;
                        cursor: pointer;
                        font-size: 1rem;
                    }
                    .continue-btn:hover {
                        background-color: #6e5d47;
                    }
                    .countdown {
                        margin-top: 1.5rem;
                        color: #7f8c8d;
                        font-size: 0.9rem;
                    }
                    @media (max-width: 480px) {
                        .container {
                            padding: 1.5rem;
                            margin: 1rem;
                        }
                        h1 {
                            font-size: 1.5rem;
                        }
                    }
                </style>
                <script>
                    (function() {
                        let countdown = 3;
                        const countdownElement = document.getElementById('countdown');
                        
                        function updateCountdown() {
                            if (countdownElement) {
                                countdownElement.textContent = 'Redirecționare automată în ' + countdown + ' ' + 
                                    (countdown === 1 ? 'secundă' : 'secunde') + '...';
                            }
                            
                            if (countdown <= 0) {
                                window.location.href = "${redirectUrl}";
                                return;
                            }
                            
                            countdown--;
                            setTimeout(updateCountdown, 1000);
                        }
                        
                        // Start the countdown immediately
                        updateCountdown();
                    })();
                </script>
            </head>
            <body>
                <div class="container">
                    <div class="icon">💳</div>
                    <h1>Se inițializează plata</h1>
                    <div class="sub-message">
                        Sunteți redirecționat către pagina securizată de plată pentru a finaliza comanda.
                    </div>
                    <div class="divider"></div>
                    <a href="${redirectUrl}" class="continue-btn">
                        Continuă către pagina de plată
                    </a>
                    <div id="countdown" class="countdown"></div>
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
                // Pentru plata cu cardul:
                // 1. Salvează temporar în pending-orders (NU în orders!)
                // 2. Inițializează plata EuPlătesc
                // 3. Webhook va crea comanda în orders + va trimite email DOAR după plată reușită
                try {
                    // 1. Salvează temporar (fără email, fără orders)
                    const dataSaved = await this.savePendingOrderData(orderData);
                    if (!dataSaved) {
                        throw new Error('Eroare la salvarea datelor temporare.');
                    }

                    // 2. Inițializează plata cu cardul
                    const redirectUrl = await this.initializeCardPayment(orderData, currency, totalPrice);
                    
                    // 3. Redirecționează către procesatorul de plăți
                    // Webhook-ul va procesa totul după confirmare
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