'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Button from '@/components/ui/Button';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import { Spinner } from '@/components/ui/Spinner';

export default function CreateDiscountPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    code: '',
    amount: '',
    expiresAt: '',
    isActive: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code || !formData.amount || !formData.expiresAt) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const amountInCents = Math.round(parseFloat(formData.amount) * 100);
      
      await axios.post('/api/discounts', {
        code: formData.code.toUpperCase().trim(),
        amount: amountInCents,
        expiresAt: new Date(formData.expiresAt).toISOString(),
        isActive: formData.isActive,
      });

      router.push('/admin/discounts');
    } catch (err: unknown) {
      console.error('Error creating discount:', err);
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to create discount code');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError(null);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => router.push('/admin/discounts')}
          className="flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors mb-4"
        >
          <FiArrowLeft className="h-4 w-4" />
          Back to Discounts
        </button>
        <h1 className="text-3xl font-bold text-[var(--foreground)]">Create Discount Code</h1>
        <p className="text-[var(--muted-foreground)] mt-1">Add a new discount code to your store</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[var(--card)] rounded-lg border border-[var(--border)] p-6 space-y-6">
        {error && (
          <div className="bg-[var(--destructive)]/10 border border-[var(--destructive)]/30 rounded-lg p-4">
            <p className="text-[var(--destructive)] text-sm">{error}</p>
          </div>
        )}

        <div>
          <label htmlFor="code" className="block text-sm font-medium text-[var(--foreground)] mb-2">
            Discount Code <span className="text-[var(--destructive)]">*</span>
          </label>
          <input
            type="text"
            id="code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            placeholder="e.g., WELCOME20"
            required
            className="w-full px-4 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] uppercase"
            style={{ textTransform: 'uppercase' }}
          />
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            Enter a unique code (letters and numbers only, no spaces)
          </p>
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-[var(--foreground)] mb-2">
            Discount Amount (RON) <span className="text-[var(--destructive)]">*</span>
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="20.00"
            step="0.01"
            min="0.01"
            required
            className="w-full px-4 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]"
          />
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            Fixed amount to discount in RON (e.g., 20 for 20 RON off)
          </p>
        </div>

        <div>
          <label htmlFor="expiresAt" className="block text-sm font-medium text-[var(--foreground)] mb-2">
            Expiration Date <span className="text-[var(--destructive)]">*</span>
          </label>
          <input
            type="date"
            id="expiresAt"
            name="expiresAt"
            value={formData.expiresAt}
            onChange={handleChange}
            required
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--foreground)]"
          />
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            The discount code will expire at the end of this date
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4 text-[var(--primary)] border-[var(--border)] rounded focus:ring-[var(--primary)]"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-[var(--foreground)]">
            Active (discount code is enabled)
          </label>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-[var(--border)]">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner className="h-4 w-4" />
                Creating...
              </>
            ) : (
              <>
                <FiSave className="h-4 w-4" />
                Create Discount
              </>
            )}
          </Button>
          <button
            type="button"
            onClick={() => router.push('/admin/discounts')}
            disabled={isSubmitting}
            className="px-4 py-2 border border-[var(--border)] rounded-md text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
