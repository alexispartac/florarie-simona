'use client';

import { useState } from 'react';
import { MapPin, Mail, Phone, Clock } from 'lucide-react';
import { Input } from '@/components/ui';
import axios from 'axios';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/translations';

type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type FormErrors = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

export default function ContactPage() {
  const { language } = useLanguage();
  const t = useTranslation(language);
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ success?: boolean; message: string } | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t('contact.nameRequired');
    }
    
    if (!formData.email) {
      newErrors.email = t('contact.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('contact.emailInvalid');
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = t('contact.subjectRequired');
    }
    
    if (!formData.message.trim()) {
      newErrors.message = t('contact.messageRequired');
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t('contact.messageMinLength');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Replace with actual API call
      const response = await axios.post('/api/contact', formData);
      const data = response.data;
      
      setSubmitStatus({
        success: true,
        message: data.message || t('contact.successMessage')
      });
      
      // Reset form on success
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({
        success: false,
        message: t('contact.errorMessage')
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      {/* Hero Section */}
      <div className="relative bg-[var(--secondary)] text-[var(--foreground)] py-20"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=1200&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--primary)]/25 via-[var(--primary)]/15 to-[var(--primary)]/30" />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="serif-font text-4xl md:text-5xl font-bold my-4 text-[var(--primary-foreground)] drop-shadow-lg">{t("contact.title")}</h1>
          <p className="serif-light text-xl text-[var(--primary-foreground)]/95 max-w-2xl mx-auto drop-shadow-md">
            {t("contact.subtitle")}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-[var(--card)] rounded-lg shadow-lg p-8 border border-[var(--border)]">
            <h2 className="serif-font text-2xl font-bold mb-6 text-[var(--foreground)]">{t("contact.formTitle")}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {submitStatus && (
                  <div
                    className={`mt-4 p-4 rounded-md ${
                      submitStatus.success
                        ? 'bg-green-50 text-green-800 border border-green-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    {submitStatus.message}
                  </div>
                )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                    {t("contact.nameLabel")} *
                  </label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    fullWidth
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${
                      errors.name ? 'border-red-500' : 'border-[var(--border)]'
                    } rounded-md focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--card)] text-[var(--foreground)]`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                    {t("contact.emailLabel")} *
                  </label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    fullWidth
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${
                      errors.email ? 'border-red-500' : 'border-[var(--border)]'
                    } rounded-md focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--card)] text-[var(--foreground)]`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                  {t("contact.subjectLabel")} *
                </label>
                <Input
                  type="text"
                  id="subject"
                  name="subject"
                  fullWidth
                  value={formData.subject}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${
                    errors.subject ? 'border-red-500' : 'border-[var(--border)]'
                  } rounded-md focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--card)] text-[var(--foreground)]`}
                />
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
                )}
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                  {t("contact.messageLabel")} *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${
                    errors.message ? 'border-red-500' : 'border-[var(--border)]'
                  } rounded-md focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--card)] text-[var(--foreground)]`}
                ></textarea>
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                )}
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-[var(--primary)] hover:bg-[var(--hover-primary)] text-[var(--primary-foreground)] font-medium py-3 px-6 rounded-md transition duration-200 ${
                    isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? t("contact.sending") : t("contact.sendButton")}
                </button>
              </div>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-[var(--card)] rounded-lg shadow-lg p-8 border border-[var(--border)]">
              <h2 className="serif-font text-2xl font-bold mb-6 text-[var(--foreground)]">{t("contact.contactInfo")}</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="shrink-0 bg-[var(--primary)]/10 p-3 rounded-full text-[var(--primary)]">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-[var(--foreground)]">{t("contact.locationTitle")}</h3>
                    <p className="mt-1 text-[var(--muted-foreground)] serif-light">Str. Unirii 240</p>
                    <p className="text-[var(--muted-foreground)] serif-light">Târmșeni, Neamț, România</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="shrink-0 bg-[var(--primary)]/10 p-3 rounded-full text-[var(--primary)]">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-[var(--foreground)]">{t("contact.emailTitle")}</h3>
                    <p className="mt-1 text-[var(--primary)] hover:underline">
                      <a href="mailto:laurasimona97@yahoo.com">laurasimona97@yahoo.com</a>
                    </p>
                    <p className="mt-1 text-[var(--primary)] hover:underline">
                      <a href="mailto:simonabuzau2@gmail.com">simonabuzau2@gmail.com</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="shrink-0 bg-[var(--primary)]/10 p-3 rounded-full text-[var(--primary)]">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-[var(--foreground)]">{t("contact.phoneTitle")}</h3>
                    <p className="mt-1 text-[var(--muted-foreground)] serif-light">0769141250</p>
                    <p className="text-[var(--muted-foreground)] serif-light">{t("contact.phoneSchedule")}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="shrink-0 bg-[var(--primary)]/10 p-3 rounded-full text-[var(--primary)]">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-[var(--foreground)]">{t("contact.scheduleTitle")}</h3>
                    <p className="mt-1 text-[var(--muted-foreground)] serif-light">{t("contact.scheduleMon")}</p>
                    <p className="text-[var(--muted-foreground)] serif-light">{t("contact.scheduleSun")}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps */}
            <div className="bg-[var(--card)] rounded-lg shadow-lg overflow-hidden border border-[var(--border)]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d2723.4448476744797!2d26.952465776893473!3d47.00269067115149!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNDfCsDAwJzA5LjciTiAyNsKwNTcnMTYuOCJF!5e0!3m2!1sen!2sro!4v1737748800000!5m2!1sen!2sro"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
