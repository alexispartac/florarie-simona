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
};

export default function ShippingPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [savedShippingData, setSavedShippingData] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { cart, getCartItemCount, getCartTotal, getPriceShipping } = useShop();
  const [errors, setErrors] = useState<Partial<ShippingData>>({});

  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);


  const [formData, setFormData] = useState<ShippingData>({
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    country: 'United States',
    state: '',
    postalCode: '',
    phone: '',
    email: '',
  });

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

  const validateForm = (): boolean => {
    const newErrors: Partial<ShippingData> = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    if (!formData.state.trim()) newErrors.state = 'State/Province is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      // Save shipping data to localStorage or context
      localStorage.setItem('shippingData', JSON.stringify(formData));
      setSavedShippingData(true);
      
      
      setTimeout(() => {
        setIsLoading(false);
        toast({
          title: "Shipping information saved",
          description: "Your shipping details have been saved successfully.",
        });
      }, 1500);
    }
  };

  const redirectToPayment = () => {
    if (savedShippingData) {
      router.push('/checkout/payment');
    } else {
      toast({
        title: "Please save shipping information first",
        description: "You need to fill and save your shipping details before proceeding to payment.",
        variant: "destructive",
      });
    }
  };

  const handleResetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      address: '',
      apartment: '',
      city: '',
      country: 'United States',
      state: '',
      postalCode: '',
      phone: '',
      email: '',
    });
    
    setSavedShippingData(false);

    toast({
      title: "Form reset",
      description: "The form has been reset to default values.",
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
            
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    className={`w-full px-4 py-2 border ${
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
                    className={`w-full px-4 py-2 border ${
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
                  className={`w-full px-4 py-2 border ${
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
                  className="w-full px-4 py-2 border border-[var(--border)] rounded-md focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="city" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                    {t('cart.checkout.city')}
                  </label>
                  <Input
                    type="text"
                    id="city"
                    name="city"
                    fullWidth
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${
                      errors.city ? 'border-[var(--destructive)]' : 'border-[var(--border)]'
                    } rounded-md focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent`}
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-[var(--destructive)]">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                    {t('cart.checkout.postalCode')}
                  </label>
                  <Input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    fullWidth
                    required
                    value={formData.postalCode}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${
                      errors.postalCode ? 'border-[var(--destructive)]' : 'border-[var(--border)]'
                    } rounded-md focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent`}
                  />
                  {errors.postalCode && (
                    <p className="mt-1 text-sm text-[var(--destructive)]">{errors.postalCode}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                    {t('cart.checkout.country')}
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    required
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${
                      errors.country ? 'border-[var(--destructive)]' : 'border-[var(--border)]'
                    } rounded-md focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--card)] text-[var(--foreground)]`}
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Romania">Romania</option>
                    {/* Add more countries as needed */}
                  </select>
                  {errors.country && (
                    <p className="mt-1 text-sm text-[var(--destructive)]">{errors.country}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                    {t('cart.checkout.state')}
                  </label>
                  <Input
                    type="text"
                    id="state"
                    name="state"
                    fullWidth
                    required
                    value={formData.state}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${
                      errors.state ? 'border-[var(--destructive)]' : 'border-[var(--border)]'
                    } rounded-md focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent`}
                  />
                  {errors.state && (
                    <p className="mt-1 text-sm text-[var(--destructive)]">{errors.state}</p>
                  )}
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
                    className={`w-full px-4 py-2 border ${
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
                    className={`w-full px-4 py-2 border ${
                      errors.phone ? 'border-[var(--destructive)]' : 'border-[var(--border)]'
                    } rounded-md focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-[var(--destructive)]">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start">
                <div className="ml-3 text-sm">
                  <label htmlFor="saveInfo" className="font-medium text-[var(--foreground)]">
                    {t('cart.checkout.saveInfoInfo')}
                  </label>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                >
                  {isLoading ? 'Saving...' : t('cart.checkout.saveInfo')}
                </Button>
              </div>

              <div className="mt-2 text-center">
                <Button
                  variant='link'
                  onClick={handleResetForm}
                >
                  {t('cart.checkout.resetAllFields')}
                </Button>
              </div>
            </form>
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
              <p className="text-sm font-semibold text-[var(--foreground)] mt-2">{t('cart.checkout.total')}: {(getCartTotal() / 100).toFixed(2)} RON</p>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-[var(--muted-foreground)]">{t('cart.checkout.orderSecure')}</p>
            </div>

            <div className="mt-2 rounded-md text-sm">
              {savedShippingData ? null : (
                <p className="text-[var(--destructive)]">{t('cart.checkout.saveInfoText')}</p>
              )}
             
              {savedShippingData && (
                <div className="mt-2 p-4 bg-[var(--secondary)] rounded-md text-sm border border-[var(--border)]">
                  <p className="text-[var(--foreground)]"><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                  <p className="text-[var(--foreground)]"><strong>Email:</strong> {formData.email}</p>
                  <p className="text-[var(--foreground)]"><strong>Address:</strong> {formData.address}, {formData.apartment ? formData.apartment + ', ' : ''}{formData.city}, {formData.state}, {formData.country} {formData.postalCode}</p>
                  <p className="text-[var(--foreground)]"><strong>Phone:</strong> {formData.phone}</p>
                </div>
              )}
            </div>
            
            {/* info shipping */}
            <div className="mt-4 p-4 bg-[var(--primary)]/10 rounded-md border border-[var(--border)]">
              <h4 className="text-sm font-medium text-[var(--primary)]">{t('cart.checkout.shippingInfo')}</h4>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">{t('cart.checkout.shippingInfoText')}</p>
            </div>

            <div className="pt-4">
              <Button
                onClick={redirectToPayment}
                disabled={isLoading}
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
