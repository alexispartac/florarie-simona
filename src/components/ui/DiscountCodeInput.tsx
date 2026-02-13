'use client';

import { useState } from 'react';
import { useShop } from '@/context/ShopContext';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/translations';
import axios from 'axios';
import { FiTag, FiX } from 'react-icons/fi';

export default function DiscountCodeInput() {
  const [code, setCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { appliedDiscount, applyDiscount, removeDiscount } = useShop();
  const { language } = useLanguage();
  const t = useTranslation(language);

  const handleApplyDiscount = async () => {
    if (!code.trim()) {
      setError(t('discount.invalid'));
      return;
    }

    setIsValidating(true);
    setError(null);

    try {
      const response = await axios.post('/api/discounts/validate', {
        code: code.trim(),
      });

      if (response.data.valid && response.data.discount) {
        applyDiscount(response.data.discount.code, response.data.discount.amount);
        setCode('');
        setError(null);
      } else {
        setError(response.data.error || t('discount.invalid'));
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError(t('discount.error'));
      }
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveDiscount = () => {
    removeDiscount();
    setCode('');
    setError(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label htmlFor="discount-code" className="text-sm font-medium text-[var(--foreground)]">
          {t('discount.label')}
        </label>
        {appliedDiscount && (
          <button
            onClick={handleRemoveDiscount}
            className="text-xs text-[var(--destructive)] hover:underline flex items-center gap-1"
          >
            <FiX className="h-3 w-3" />
            {t('discount.remove')}
          </button>
        )}
      </div>

      {appliedDiscount ? (
        <div className="bg-[var(--accent)] border border-[var(--border)] rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiTag className="h-4 w-4 text-[var(--primary)]" />
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">{appliedDiscount.code}</p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  -{(appliedDiscount.amount / 100).toFixed(2)} RON
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                id="discount-code"
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  setError(null);
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleApplyDiscount();
                  }
                }}
                placeholder={t('discount.placeholder')}
                disabled={isValidating}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <button
              onClick={handleApplyDiscount}
              disabled={isValidating || !code.trim()}
              className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md hover:bg-[var(--hover-primary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm whitespace-nowrap"
            >
              {isValidating ? t('discount.validating') : t('discount.apply')}
            </button>
          </div>

          {error && (
            <p className="text-xs text-[var(--destructive)] flex items-center gap-1">
              <FiX className="h-3 w-3" />
              {error}
            </p>
          )}
        </>
      )}
    </div>
  );
}
