'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';
import { Spinner } from '@/components/ui/Spinner';
import { Input } from '@/components/ui';

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
          <p className="text-gray-600">Loading shipping information...</p>
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
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">There&apos;s nothing in your cart to check out.</p>
        <Link 
          href="/shop"
          className="inline-flex cursor-pointer items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90"
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
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 my-6">Shipping Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <Input
                    type="text"
                    id="firstName"
                    name="firstName"
                    fullWidth
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:ring-2 focus:ring-primary focus:border-transparent`}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <Input
                    type="text"
                    id="lastName"
                    name="lastName"
                    fullWidth
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:ring-2 focus:ring-primary focus:border-transparent`}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Address *
                </label>
                <Input
                  type="text"
                  id="address"
                  name="address"
                  fullWidth
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:ring-2 focus:ring-primary focus:border-transparent`}
                  placeholder="Street address"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                )}
              </div>

              <div>
                <label htmlFor="apartment" className="block text-sm font-medium text-gray-700 mb-1">
                  Apartment, suite, etc. (optional)
                </label>
                <Input
                  type="text"
                  id="apartment"
                  name="apartment"
                  fullWidth
                  value={formData.apartment}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <Input
                    type="text"
                    id="city"
                    name="city"
                    fullWidth
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:ring-2 focus:ring-primary focus:border-transparent`}
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code *
                  </label>
                  <Input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    fullWidth
                    value={formData.postalCode}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${
                      errors.postalCode ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:ring-2 focus:ring-primary focus:border-transparent`}
                  />
                  {errors.postalCode && (
                    <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    Country *
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${
                      errors.country ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:ring-2 focus:ring-primary focus:border-transparent`}
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Romania">Romania</option>
                    {/* Add more countries as needed */}
                  </select>
                  {errors.country && (
                    <p className="mt-1 text-sm text-red-600">{errors.country}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    State/Province *
                  </label>
                  <Input
                    type="text"
                    id="state"
                    name="state"
                    fullWidth
                    value={formData.state}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${
                      errors.state ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:ring-2 focus:ring-primary focus:border-transparent`}
                  />
                  {errors.state && (
                    <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    fullWidth
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:ring-2 focus:ring-primary focus:border-transparent`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <Input
                    type="tel"
                    id="phone"
                    name="phone"
                    fullWidth
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:ring-2 focus:ring-primary focus:border-transparent`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start">
                <div className="ml-3 text-sm">
                  <label htmlFor="saveInfo" className="font-medium text-gray-700">
                    We do not save this information for next time (for security reasons)
                  </label>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full flex cursor-pointer justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  {isLoading ? 'Saving...' : 'Save information'}
                </Button>
              </div>

              <div className="mt-2 text-center">
                <Button
                  variant='link'
                  className="text-primary hover:text-primary/80 hover:underline cursor-pointer"
                  onClick={handleResetForm}
                >
                  Reset all fields
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4 mt-10 lg:mt-0">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
            {/* Order summary content would go here */}
            <p className="text-sm text-gray-600">Review your order details before proceeding to payment.</p>

            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-900">Items in your cart</h3>
              <div className="mt-2 space-y-2">
                {cart.map((item) => (
                  <div key={`${item.productId}-${item.variant.variantId}-${item.variant.color}`} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.name} ({item.variant.size}, {item.variant.color}) x {item.quantity}</span>
                    <span className="text-gray-900">${(item.price * item.quantity / 100).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600">Total items: {getCartItemCount()}</p>
              <p className="text-sm text-gray-600">Shipping: ${(getPriceShipping() / 100).toFixed(2)}</p>
              <p className="text-sm font-semibold text-gray-900 mt-2">Total: ${(getCartTotal() / 100).toFixed(2)}</p>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-gray-600">Your order is secure. We use industry-standard encryption to protect your information.</p>
            </div>

            <div className="mt-2 rounded-md text-sm">
              {savedShippingData ? null : (
                <p className="text-red-500">Please complete and save your shipping information to proceed.</p>
              )}
             
              {savedShippingData && (
                <div className="mt-2 p-4 bg-gray-50 rounded-md text-sm">
                  <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                  <p><strong>Email:</strong> {formData.email}</p>
                  <p><strong>Address:</strong> {formData.address}, {formData.apartment ? formData.apartment + ', ' : ''}{formData.city}, {formData.state}, {formData.country} {formData.postalCode}</p>
                  <p><strong>Phone:</strong> {formData.phone}</p>
                </div>
              )}
            </div>
            
            {/* info shipping */}
            <div className="mt-4 p-4 bg-primary/50 rounded-md">
              <h4 className="text-sm font-medium text-primary-800">Shipping Information</h4>
              <p className="text-xs text-primary-600 mt-1">Standard shipping: 10-15 business days (Free shipping on orders over $150)</p>
            </div>

            <div className="pt-4">
              <Button
                className={`w-full flex ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'} justify-center px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
                onClick={redirectToPayment}
                disabled={isLoading}
              >
                Continue to Payment
              </Button>
            </div>

          </div>

          <div className="text-center mt-8">
            <Link 
              href="/checkout/cart" 
              className="text-sm font-medium text-primary hover:text-primary/80 flex items-center justify-center hover:underline cursor-pointer"
            >
              <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Return to Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
