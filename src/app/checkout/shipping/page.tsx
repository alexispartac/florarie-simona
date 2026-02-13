'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';
import { Spinner } from '@/components/ui/Spinner';
import { Input } from '@/components/ui';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/translations';
import { neamtLocalities } from '@/data/neamt-localities';
import { FaWhatsapp } from 'react-icons/fa';

type ShippingData = {
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: string;
  country: string;
  state: string;
  postalCode: string;
  phone: string;
  email: string;
  additionalInfo?: string;
};

type BillingData = {
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: string;
  country: string;
  state: string;
  postalCode: string;
  phone: string;
  email: string;
  company?: string;
  taxId?: string;
};

export default function ShippingPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  
  // Initialize saved flags from localStorage
  const [savedShippingData, setSavedShippingData] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('shippingData') !== null;
    }
    return false;
  });
  
  const [savedBillingData, setSavedBillingData] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('billingData') !== null;
    }
    return false;
  });
  
  const [isLoadingShipping, setIsLoadingShipping] = useState<boolean>(false);
  const [isLoadingBilling, setIsLoadingBilling] = useState<boolean>(false);
  const { cart, getCartItemCount, getCartTotal, getPriceShipping, appliedDiscount, getDiscountedTotal } = useShop();
  const [errors, setErrors] = useState<Partial<ShippingData>>({});
  const [billingErrors, setBillingErrors] = useState<Partial<BillingData>>({});
  
  // Initialize sameAsShipping flag
  const [sameAsShipping, setSameAsShipping] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedShipping = localStorage.getItem('shippingData');
      const savedBilling = localStorage.getItem('billingData');
      
      if (savedShipping && savedBilling) {
        try {
          const parsedBilling = JSON.parse(savedBilling);
          const parsedShipping = JSON.parse(savedShipping);
          
          return parsedBilling.firstName === parsedShipping.firstName &&
            parsedBilling.lastName === parsedShipping.lastName &&
            parsedBilling.address === parsedShipping.address &&
            parsedBilling.city === parsedShipping.city &&
            parsedBilling.email === parsedShipping.email;
        } catch (error) {
          console.error('Error comparing billing data:', error);
        }
      }
    }
    return false;
  });

  const { toast } = useToast();
  const { language } = useLanguage();
  const t = useTranslation(language);

  // Initialize form data from localStorage if available
  const [formData, setFormData] = useState<ShippingData>(() => {
    if (typeof window !== 'undefined') {
      const savedShipping = localStorage.getItem('shippingData');
      if (savedShipping) {
        try {
          return JSON.parse(savedShipping);
        } catch (error) {
          console.error('Error parsing saved shipping data:', error);
        }
      }
    }
    return {
      firstName: '',
      lastName: '',
      address: '',
      apartment: '',
      city: '',
      country: 'România',
      state: 'Neamț',
      postalCode: '',
      phone: '',
      email: '',
      additionalInfo: '',
    };
  });

  // Initialize billing data from localStorage if available
  const [billingData, setBillingData] = useState<BillingData>(() => {
    if (typeof window !== 'undefined') {
      const savedBilling = localStorage.getItem('billingData');
      if (savedBilling) {
        try {
          return JSON.parse(savedBilling);
        } catch (error) {
          console.error('Error parsing saved billing data:', error);
        }
      }
    }
    return {
      firstName: '',
      lastName: '',
      address: '',
      apartment: '',
      city: '',
      country: 'România',
      state: 'Neamț',
      postalCode: '',
      phone: '',
      email: '',
      company: '',
      taxId: '',
    };
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Show loading state during hydration
  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <Spinner className="w-12 h-12" />
          <p className="text-[var(--muted-foreground)]">Loading shipping information...</p>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof ShippingData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    
    setBillingData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (billingErrors[name as keyof BillingData]) {
      setBillingErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSameAsShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setSameAsShipping(checked);
    
    // Nu mai copiem automat datele - utilizatorul trebuie să le completeze manual
    if (!checked) {
      // Resetăm doar dacă bifăm că NU e aceeași adresă
      setBillingData({
        firstName: '',
        lastName: '',
        address: '',
        apartment: '',
        city: '',
        country: 'România',
        state: 'Neamț',
        postalCode: '',
        phone: '',
        email: '',
        company: '',
        taxId: '',
      });
      setBillingErrors({});
    }
  };

  const validateShippingForm = (): boolean => {
    const newErrors: Partial<ShippingData> = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'Prenumele este obligatoriu';
    if (!formData.lastName.trim()) newErrors.lastName = 'Numele este obligatoriu';
    if (!formData.address.trim()) newErrors.address = 'Adresa este obligatorie';
    if (!formData.city.trim()) newErrors.city = 'Localitatea este obligatorie';
    if (!formData.country.trim()) newErrors.country = 'Țara este obligatorie';
    if (!formData.state.trim()) newErrors.state = 'Județul este obligatoriu';
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Numărul de telefon este obligatoriu';
    } else if (!/^\+?[0-9\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Vă rugăm introduceți un număr de telefon valid';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email-ul este obligatoriu';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Vă rugăm introduceți o adresă de email validă';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateBillingForm = (): boolean => {
    if (sameAsShipping) {
      return true; // No need to validate if using shipping address
    }

    const newBillingErrors: Partial<BillingData> = {};
    
    if (!billingData.firstName.trim()) newBillingErrors.firstName = 'Prenumele este obligatoriu';
    if (!billingData.lastName.trim()) newBillingErrors.lastName = 'Numele este obligatoriu';
    if (!billingData.address.trim()) newBillingErrors.address = 'Adresa este obligatorie';
    if (!billingData.city.trim()) newBillingErrors.city = 'Localitatea este obligatorie';
    if (!billingData.country.trim()) newBillingErrors.country = 'Țara este obligatorie';
    if (!billingData.state.trim()) newBillingErrors.state = 'Județul este obligatoriu';
    
    if (!billingData.phone.trim()) {
      newBillingErrors.phone = 'Numărul de telefon este obligatoriu';
    } else if (!/^\+?[0-9\s-()]+$/.test(billingData.phone)) {
      newBillingErrors.phone = 'Vă rugăm introduceți un număr de telefon valid';
    }
    
    if (!billingData.email.trim()) {
      newBillingErrors.email = 'Email-ul este obligatoriu';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billingData.email)) {
      newBillingErrors.email = 'Vă rugăm introduceți o adresă de email validă';
    }
    
    setBillingErrors(newBillingErrors);
    return Object.keys(newBillingErrors).length === 0;
  };

  const handleSaveShipping = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (validateShippingForm()) {
      setIsLoadingShipping(true);
      // Save shipping data to localStorage
      localStorage.setItem('shippingData', JSON.stringify(formData));
      setSavedShippingData(true);
      
      setTimeout(() => {
        setIsLoadingShipping(false);
        toast({
          title: t('cart.checkout.shippingInfoSaved'),
          description: t('cart.checkout.shippingInfoSavedDesc'),
        });
      }, 1000);
    }
  };

  const handleSaveBilling = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (validateBillingForm()) {
      setIsLoadingBilling(true);
      
      // Save billing data - dacă e aceeași ca shipping, copiem datele acum
      const finalBillingData = sameAsShipping ? {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        apartment: formData.apartment,
        city: formData.city,
        country: formData.country,
        state: formData.state,
        postalCode: formData.postalCode,
        phone: formData.phone,
        email: formData.email,
        company: '',
        taxId: '',
      } : billingData; // Altfel folosim datele separate introduse de utilizator
      
      localStorage.setItem('billingData', JSON.stringify(finalBillingData));
      setSavedBillingData(true);
      
      setTimeout(() => {
        setIsLoadingBilling(false);
        toast({
          title: t('cart.checkout.billingInfoSaved'),
          description: t('cart.checkout.billingInfoSavedDesc'),
        });
      }, 1000);
    }
  };

  const redirectToPayment = () => {
    if (!savedShippingData) {
      toast({
        title: t('cart.checkout.pleaseSaveShippingInfoFirst'),
        description: t('cart.checkout.youNeedToFillAndSaveYourShippingDetailsBeforeProceedingToPayment'),
        variant: "destructive",
      });
      return;
    }

    if (!savedBillingData) {
      toast({
        title: "Te rugăm salvează informațiile de facturare",
        description: "Trebuie să salvezi informațiile de facturare înainte de a continua la plată.",
        variant: "destructive",
      });
      return;
    }

    router.push('/checkout/payment');
  };

  const handleResetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      address: '',
      apartment: '',
      city: '',
      country: 'România',
      state: 'Neamț',
      postalCode: '',
      phone: '',
      email: '',
      additionalInfo: '',
    });
    
    setBillingData({
      firstName: '',
      lastName: '',
      address: '',
      apartment: '',
      city: '',
      country: 'România',
      state: 'Neamț',
      postalCode: '',
      phone: '',
      email: '',
      company: '',
      taxId: '',
    });
    
    setSameAsShipping(true);
    setSavedShippingData(false);
    setSavedBillingData(false);

    toast({
      title: "Formular resetat",
      description: "Formularul a fost resetat la valorile implicite.",
    });
  };

  if (getCartItemCount() === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">Your cart is empty</h2>
        <p className="text-[var(--muted-foreground)] mb-6">There&apos;s nothing in your cart to check out.</p>
        <Link 
          href="/shop"
          className="inline-flex cursor-pointer items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-[var(--primary-foreground)] bg-[var(--primary)] hover:bg-[var(--hover-primary)]"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="lg:grid lg:grid-cols-12 lg:gap-12">
        {/* Shipping Form */}
        <div className="lg:col-span-8">
          <div className="bg-[var(--card)] shadow overflow-hidden sm:rounded-lg p-6 mb-8 border border-[var(--border)]">
            <h2 className="text-2xl font-bold text-[var(--foreground)] my-6">{t('cart.checkout.shippingInfo')}</h2>
            <div className="flex flex-col items-center gap-2 mb-6 bg-[var(--secondary)] p-4 rounded-md border border-[var(--border)]">
              <p> Daca nu ai adresa de email, te rugam sa continui cu contactarea noastra pe WhatsApp pentru a finaliza comanda.
              </p>
              <Link href="https://wa.me/40769141250" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-[var(--primary)] hover:text-[var(--hover-primary)] flex items-center justify-center hover:underline cursor-pointer">
                <FaWhatsapp className="w-4 h-4 text-[var(--primary)]" />
                <span>Continuă cu WhatsApp</span>
              </Link>
            </div>
            <form onSubmit={handleSaveShipping} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                    {t('cart.checkout.firstName')}
                  </label>
                  <Input
                    type="text"
                    id="firstName"
                    name="firstName"
                    fullWidth
                    value={formData.firstName}
                    required
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border bg-[var(--card)] text-[var(--foreground)] ${
                      errors.firstName ? 'border-[var(--destructive)]' : 'border-[var(--border)]'
                    } rounded-md focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent`}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-[var(--destructive)]">{errors.firstName}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                    {t('cart.checkout.lastName')}
                  </label>
                  <Input
                    type="text"
                    id="lastName"
                    name="lastName"
                    fullWidth
                    value={formData.lastName}
                    required
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border bg-[var(--card)] text-[var(--foreground)] ${
                      errors.lastName ? 'border-[var(--destructive)]' : 'border-[var(--border)]'
                    } rounded-md focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent`}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-[var(--destructive)]">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                  {t('cart.checkout.address')}
                </label>
                <Input
                  type="text"
                  id="address"
                  name="address"
                  fullWidth
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border bg-[var(--card)] text-[var(--foreground)] ${
                    errors.address ? 'border-[var(--destructive)]' : 'border-[var(--border)]'
                  } rounded-md focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent`}
                  placeholder="Street address"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-[var(--destructive)]">{errors.address}</p>
                )}
              </div>

              <div>
                <label htmlFor="apartment" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                  {t('cart.checkout.apartment')}
                </label>
                <Input
                  type="text"
                  id="apartment"
                  name="apartment"
                  fullWidth
                  value={formData.apartment}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border bg-[var(--card)] text-[var(--foreground)] border-[var(--border)] rounded-md focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="city" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                    Localitatea <span className="text-[var(--destructive)]">*</span>
                  </label>
                  <select
                    id="city"
                    name="city"
                    value={formData.city}
                    required
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${
                      errors.city ? 'border-[var(--destructive)]' : 'border-[var(--border)]'
                    } rounded-md focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--card)] text-[var(--foreground)]`}
                  >
                    <option value="">Selectează localitatea</option>
                    {neamtLocalities.map((locality) => (
                      <option key={locality} value={locality}>
                        {locality}
                      </option>
                    ))}
                  </select>
                  {errors.city && (
                    <p className="mt-1 text-sm text-[var(--destructive)]">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                    Cod poștal
                  </label>
                  <Input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    fullWidth
                    value={formData.postalCode}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border bg-[var(--card)] text-[var(--foreground)] ${
                      errors.postalCode ? 'border-[var(--destructive)]' : 'border-[var(--border)]'
                    } rounded-md focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent`}
                    placeholder="610xxx"
                  />
                  {errors.postalCode && (
                    <p className="mt-1 text-sm text-[var(--destructive)]">{errors.postalCode}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                    Țara <span className="text-[var(--destructive)]">*</span>
                  </label>
                  <Input
                    type="text"
                    id="country"
                    name="country"
                    fullWidth
                    value="România"
                    disabled
                    readOnly
                    className="w-full px-4 py-2 border bg-[var(--card)] text-[var(--foreground)] border-[var(--border)] rounded-md bg-[var(--muted)] text-[var(--muted-foreground)] cursor-not-allowed"
                  />
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                    Județul <span className="text-[var(--destructive)]">*</span>
                  </label>
                  <Input
                    type="text"
                    id="state"
                    name="state"
                    fullWidth
                    value="Neamț"
                    disabled
                    readOnly
                    className="w-full px-4 py-2 border bg-[var(--card)] text-[var(--foreground)] border-[var(--border)] rounded-md bg-[var(--muted)] text-[var(--muted-foreground)] cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                    {t('cart.checkout.email')}
                  </label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    fullWidth
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border bg-[var(--card)] text-[var(--foreground)] ${
                      errors.email ? 'border-[var(--destructive)]' : 'border-[var(--border)]'
                    } rounded-md focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-[var(--destructive)]">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                    {t('cart.checkout.phone')}
                  </label>
                  <Input
                    type="tel"
                    id="phone"
                    name="phone"
                    fullWidth
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border bg-[var(--card)] text-[var(--foreground)] ${
                      errors.phone ? 'border-[var(--destructive)]' : 'border-[var(--border)]'
                    } rounded-md focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-[var(--destructive)]">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="additionalInfo" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                  Informații suplimentare (opțional)
                </label>
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-[var(--border)] rounded-md focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--card)] text-[var(--foreground)] resize-none"
                  placeholder="Adaugă orice detalii suplimentare despre livrare (ex: instrucțiuni speciale, puncte de reper, etc.)"
                />
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isLoadingShipping}
                >
                  {isLoadingShipping ? 'Salvare...' : savedShippingData ? '✓ Salvat - ' + t('cart.checkout.saveInfo') : t('cart.checkout.saveInfo')}
                </Button>
              </div>
            </form>
          </div>

          {/* Billing Information Section */}
          <div className="bg-[var(--card)] shadow overflow-hidden sm:rounded-lg p-6 mb-8 border border-[var(--border)]">
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">{t('cart.checkout.billingInfo')}</h2>
            
            <form onSubmit={handleSaveBilling} className="space-y-6">
              <div className="mb-6 flex items-start">
                <input
                  type="checkbox"
                  id="sameAsShipping"
                  checked={sameAsShipping}
                  onChange={handleSameAsShippingChange}
                  className="mt-1 mr-2 h-4 w-4 text-[var(--primary)] border-[var(--border)] rounded focus:ring-[var(--primary)]"
                />
                <label htmlFor="sameAsShipping" className="text-sm text-[var(--foreground)]">
                  {t('cart.checkout.sameAsShipping')}
                </label>
              </div>

              {!sameAsShipping && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="billing-firstName" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                      {t('cart.checkout.firstName')}
                    </label>
                    <Input
                      type="text"
                      id="billing-firstName"
                      name="firstName"
                      fullWidth
                      value={billingData.firstName}
                      required
                      onChange={handleBillingChange}
                      className={`w-full px-4 py-2 border bg-[var(--card)] text-[var(--foreground)] ${
                        billingErrors.firstName ? 'border-[var(--destructive)]' : 'border-[var(--border)]'
                      } rounded-md focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent`}
                    />
                    {billingErrors.firstName && (
                      <p className="mt-1 text-sm text-[var(--destructive)]">{billingErrors.firstName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="billing-lastName" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                      {t('cart.checkout.lastName')}
                    </label>
                    <Input
                      type="text"
                      id="billing-lastName"
                      name="lastName"
                      fullWidth
                      value={billingData.lastName}
                      required
                      onChange={handleBillingChange}
                      className={`w-full px-4 py-2 border bg-[var(--card)] text-[var(--foreground)] ${
                        billingErrors.lastName ? 'border-[var(--destructive)]' : 'border-[var(--border)]'
                      } rounded-md focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent`}
                    />
                    {billingErrors.lastName && (
                      <p className="mt-1 text-sm text-[var(--destructive)]">{billingErrors.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="billing-company" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                      {t('cart.checkout.company')}
                    </label>
                    <Input
                      type="text"
                      id="billing-company"
                      name="company"
                      fullWidth
                      value={billingData.company}
                      onChange={handleBillingChange}
                      className="w-full px-4 py-2 border bg-[var(--card)] text-[var(--foreground)] border-[var(--border)] rounded-md focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="billing-taxId" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                      {t('cart.checkout.taxId')}
                    </label>
                    <Input
                      type="text"
                      id="billing-taxId"
                      name="taxId"
                      fullWidth
                      value={billingData.taxId}
                      onChange={handleBillingChange}
                      className="w-full px-4 py-2 border bg-[var(--card)] text-[var(--foreground)] border-[var(--border)] rounded-md focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="billing-address" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                    {t('cart.checkout.address')}
                  </label>
                  <Input
                    type="text"
                    id="billing-address"
                    name="address"
                    fullWidth
                    required
                    value={billingData.address}
                    onChange={handleBillingChange}
                    className={`w-full px-4 py-2 border bg-[var(--card)] text-[var(--foreground)] ${
                      billingErrors.address ? 'border-[var(--destructive)]' : 'border-[var(--border)]'
                    } rounded-md focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent`}
                    placeholder="Street address"
                  />
                  {billingErrors.address && (
                    <p className="mt-1 text-sm text-[var(--destructive)]">{billingErrors.address}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="billing-apartment" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                    {t('cart.checkout.apartment')}
                  </label>
                  <Input
                    type="text"
                    id="billing-apartment"
                    name="apartment"
                    fullWidth
                    value={billingData.apartment}
                    onChange={handleBillingChange}
                    className="w-full px-4 py-2 border bg-[var(--card)] text-[var(--foreground)] border-[var(--border)] rounded-md focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label htmlFor="billing-city" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                      Localitatea <span className="text-[var(--destructive)]">*</span>
                    </label>
                    <Input
                      type="text"
                      id="billing-city"
                      name="city"
                      fullWidth
                      value={billingData.city}
                      required
                      onChange={handleBillingChange}
                      placeholder="Introdu localitatea"
                      className={`w-full px-4 py-2 border bg-[var(--card)] text-[var(--foreground)] ${
                        billingErrors.city ? 'border-[var(--destructive)]' : 'border-[var(--border)]'
                      } rounded-md focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent`}
                    />
                    {billingErrors.city && (
                      <p className="mt-1 text-sm text-[var(--destructive)]">{billingErrors.city}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="billing-postalCode" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                      Cod poștal
                    </label>
                    <Input
                      type="text"
                      id="billing-postalCode"
                      name="postalCode"
                      fullWidth
                      value={billingData.postalCode}
                      onChange={handleBillingChange}
                      className={`w-full px-4 py-2 border bg-[var(--card)] text-[var(--foreground)] ${
                        billingErrors.postalCode ? 'border-[var(--destructive)]' : 'border-[var(--border)]'
                      } rounded-md focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent`}
                      placeholder="610xxx"
                    />
                    {billingErrors.postalCode && (
                      <p className="mt-1 text-sm text-[var(--destructive)]">{billingErrors.postalCode}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="billing-country" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                      Țara <span className="text-[var(--destructive)]">*</span>
                    </label>
                    <Input
                      type="text"
                      id="billing-country"
                      name="country"
                      fullWidth
                      value={billingData.country}
                      required
                      onChange={handleBillingChange}
                      className={`w-full px-4 py-2 border bg-[var(--card)] text-[var(--foreground)] ${
                        billingErrors.country ? 'border-[var(--destructive)]' : 'border-[var(--border)]'
                      } rounded-md focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent`}
                    />
                    {billingErrors.country && (
                      <p className="mt-1 text-sm text-[var(--destructive)]">{billingErrors.country}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="billing-state" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                      Județul <span className="text-[var(--destructive)]">*</span>
                    </label>
                    <Input
                      type="text"
                      id="billing-state"
                      name="state"
                      fullWidth
                      value={billingData.state}
                      required
                      onChange={handleBillingChange}
                      className={`w-full px-4 py-2 border bg-[var(--card)] text-[var(--foreground)] ${
                        billingErrors.state ? 'border-[var(--destructive)]' : 'border-[var(--border)]'
                      } rounded-md focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent`}
                    />
                    {billingErrors.state && (
                      <p className="mt-1 text-sm text-[var(--destructive)]">{billingErrors.state}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="billing-email" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                      {t('cart.checkout.email')}
                    </label>
                    <Input
                      type="email"
                      id="billing-email"
                      name="email"
                      fullWidth
                      required
                      value={billingData.email}
                      onChange={handleBillingChange}
                      className={`w-full px-4 py-2 border bg-[var(--card)] text-[var(--foreground)] ${
                        billingErrors.email ? 'border-[var(--destructive)]' : 'border-[var(--border)]'
                      } rounded-md focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent`}
                    />
                    {billingErrors.email && (
                      <p className="mt-1 text-sm text-[var(--destructive)]">{billingErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="billing-phone" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                      {t('cart.checkout.phone')}
                    </label>
                    <Input
                      type="tel"
                      id="billing-phone"
                      name="phone"
                      fullWidth
                      required
                      value={billingData.phone}
                      onChange={handleBillingChange}
                      className={`w-full px-4 py-2 border bg-[var(--card)] text-[var(--foreground)] ${
                        billingErrors.phone ? 'border-[var(--destructive)]' : 'border-[var(--border)]'
                      } rounded-md focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent`}
                    />
                    {billingErrors.phone && (
                      <p className="mt-1 text-sm text-[var(--destructive)]">{billingErrors.phone}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isLoadingBilling}
                >
                  {isLoadingBilling ? 'Salvare...' : savedBillingData ? '✓ Salvat - Salvează Informații Facturare' : 'Salvează Informații Facturare'}
                </Button>
              </div>
            </form>
              </div>

          <div className="text-center mb-8">
                <Button
                  variant='link'
                  onClick={handleResetForm}
                >
                  {t('cart.checkout.resetAllFields')}
                </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4 mt-10 lg:mt-0">
          <div className="bg-[var(--card)] shadow overflow-hidden sm:rounded-lg p-6 border border-[var(--border)]">
            <h2 className="text-lg font-medium text-[var(--foreground)] mb-4">{t('cart.checkout.orderSummary')}</h2>
            {/* Order summary content would go here */}
            <p className="text-sm text-[var(--muted-foreground)]">{t('cart.checkout.reviewOrderDetails')}</p>

            <div className="mt-4">
              <h3 className="text-sm font-medium text-[var(--foreground)]">{t('cart.checkout.itemsInCart')}</h3>
              <div className="mt-2 space-y-2">
                {cart.map((item, index) => (
                  <div key={`${item.productId}-${index}`} className="flex justify-between text-sm">
                    <span className="text-[var(--muted-foreground)]">
                      {item.name}
                      {item.customMessage && ` 💌`}
                      {` x ${item.quantity}`}
                    </span>
                    <span className="text-[var(--foreground)]">{(item.price * item.quantity / 100).toFixed(2)} RON</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 p-4 bg-[var(--secondary)] rounded-md border border-[var(--border)]">
              <p className="text-sm text-[var(--muted-foreground)]">{t('cart.checkout.totalItems')}: {getCartItemCount()}</p>
              <p className="text-sm text-[var(--muted-foreground)]">{t('cart.checkout.shipping')}: {(getPriceShipping() / 100).toFixed(2)} RON</p>
              {appliedDiscount && (
                <p className="text-sm text-[var(--primary)] font-medium">{t('discount.discount')} ({appliedDiscount.code}): -{(appliedDiscount.amount / 100).toFixed(2)} RON</p>
              )}
              <p className="text-sm font-semibold text-[var(--foreground)] mt-2">{t('cart.checkout.total')}: {((getDiscountedTotal() + getPriceShipping()) / 100).toFixed(2)} RON</p>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-[var(--muted-foreground)]">{t('cart.checkout.orderSecure')}</p>
            </div>

            <div className="mt-2 rounded-md text-sm">
              {(!savedShippingData || !savedBillingData) && (
                <div className="mb-4">
                  {!savedShippingData && (
                    <p className="text-[var(--destructive)] mb-2">❌ {t('cart.checkout.saveInfoText')}</p>
                  )}
                  {!savedBillingData && (
                    <p className="text-[var(--destructive)]">❌ Informațiile de facturare trebuie salvate</p>
                  )}
                </div>
              )}
             
              {savedBillingData && (
                <>
                <div className="mt-2 p-4 bg-[var(--secondary)] rounded-md text-sm border border-[var(--border)]">
                    <h4 className="font-semibold text-[var(--foreground)] mb-2">📦 Informații de livrare</h4>
                  <p className="text-[var(--foreground)]"><strong>Nume:</strong> {formData.firstName} {formData.lastName}</p>
                  <p className="text-[var(--foreground)]"><strong>Email:</strong> {formData.email}</p>
                  <p className="text-[var(--foreground)]"><strong>Telefon:</strong> {formData.phone}</p>
                  <p className="text-[var(--foreground)]"><strong>Adresă:</strong> {formData.address}{formData.apartment ? `, ${formData.apartment}` : ''}, {formData.city}, {formData.state}, {formData.country}{formData.postalCode ? ` ${formData.postalCode}` : ''}</p>
                  {formData.additionalInfo && (
                    <p className="text-[var(--foreground)] mt-2"><strong>Informații suplimentare:</strong> {formData.additionalInfo}</p>
                  )}
                </div>
                  
                  <div className="mt-2 p-4 bg-[var(--secondary)] rounded-md text-sm border border-[var(--border)]">
                    <h4 className="font-semibold text-[var(--foreground)] mb-2">💳 Informații de facturare</h4>
                    {sameAsShipping ? (
                      <p className="text-[var(--muted-foreground)] italic">Aceeași ca adresa de livrare</p>
                    ) : (
                      <>
                        {billingData.firstName && billingData.lastName ? (
                          <>
                            <p className="text-[var(--foreground)]"><strong>Nume:</strong> {billingData.firstName} {billingData.lastName}</p>
                            {billingData.company && (
                              <p className="text-[var(--foreground)]"><strong>Firmă:</strong> {billingData.company}</p>
                            )}
                            {billingData.taxId && (
                              <p className="text-[var(--foreground)]"><strong>CUI:</strong> {billingData.taxId}</p>
                            )}
                            <p className="text-[var(--foreground)]"><strong>Email:</strong> {billingData.email}</p>
                            <p className="text-[var(--foreground)]"><strong>Telefon:</strong> {billingData.phone}</p>
                            <p className="text-[var(--foreground)]"><strong>Adresă:</strong> {billingData.address}{billingData.apartment ? `, ${billingData.apartment}` : ''}, {billingData.city}, {billingData.state}, {billingData.country}{billingData.postalCode ? ` ${billingData.postalCode}` : ''}</p>
                          </>
                        ) : (
                          <p className="text-[var(--muted-foreground)] italic">Completează formularul de facturare mai sus</p>
                        )}
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
            
            {/* info shipping */}
            <div className="mt-4 p-4 bg-[var(--primary)]/10 rounded-md border border-[var(--border)]">
              <h4 className="text-sm font-medium text-[var(--primary)]">{t('cart.checkout.shippingInfo')}</h4>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">{t('cart.checkout.shippingInfoText')}</p>
              <div className="mt-3 pt-3 border-t border-[var(--primary)]/20">
                <p className="text-xs font-semibold text-[var(--primary)]">🚚 Livrare gratuită pentru Tămășeni și Adjudeni!</p>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">Cost livrare pentru alte localități: 20 RON</p>
              </div>
            </div>

            <div className="pt-4">
              <Button
                onClick={redirectToPayment}
                disabled={!savedShippingData || !savedBillingData}
              >
                {t('cart.checkout.continueToPayment')}
              </Button>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link 
              href="/checkout/cart" 
              className="text-sm font-medium text-[var(--primary)] hover:text-[var(--hover-primary)] flex items-center justify-center hover:underline cursor-pointer"
            >
              <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t('cart.checkout.returnToCart')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
