'use client';

import { useState } from 'react';
import { 
  HelpCircle, 
  Package, 
  Truck, 
  CreditCard, 
  ShoppingCart, 
  Heart, 
  Flower2, 
  MessageCircle,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  Search
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/translations';
import Link from 'next/link';

type FAQItem = {
  question: string;
  answer: string;
};

type FAQCategory = {
  icon: React.ReactNode;
  title: string;
  items: FAQItem[];
};

export default function HelpPage() {
  const { language } = useLanguage();
  const t = useTranslation(language);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<string | null>(null);

  const toggleAccordion = (categoryIndex: number, itemIndex: number) => {
    const key = `${categoryIndex}-${itemIndex}`;
    setExpandedIndex(expandedIndex === key ? null : key);
  };

  const faqCategories: FAQCategory[] = [
    {
      icon: <ShoppingCart className="h-6 w-6" />,
      title: t('help.ordering.title'),
      items: [
        {
          question: t('help.ordering.howToOrder'),
          answer: t('help.ordering.howToOrderAnswer')
        },
        {
          question: t('help.ordering.modifyOrder'),
          answer: t('help.ordering.modifyOrderAnswer')
        },
        {
          question: t('help.ordering.cancelOrder'),
          answer: t('help.ordering.cancelOrderAnswer')
        },
        {
          question: t('help.ordering.trackOrder'),
          answer: t('help.ordering.trackOrderAnswer')
        }
      ]
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: t('help.delivery.title'),
      items: [
        {
          question: t('help.delivery.deliveryTime'),
          answer: t('help.delivery.deliveryTimeAnswer')
        },
        {
          question: t('help.delivery.sameDayDelivery'),
          answer: t('help.delivery.sameDayDeliveryAnswer')
        },
        {
          question: t('help.delivery.deliveryAreas'),
          answer: t('help.delivery.deliveryAreasAnswer')
        },
        {
          question: t('help.delivery.notHome'),
          answer: t('help.delivery.notHomeAnswer')
        }
      ]
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: t('help.payment.title'),
      items: [
        {
          question: t('help.payment.paymentMethods'),
          answer: t('help.payment.paymentMethodsAnswer')
        },
        {
          question: t('help.payment.securePayment'),
          answer: t('help.payment.securePaymentAnswer')
        },
        {
          question: t('help.payment.cashOnDelivery'),
          answer: t('help.payment.cashOnDeliveryAnswer')
        }
      ]
    },
    {
      icon: <Flower2 className="h-6 w-6" />,
      title: t('help.flowers.title'),
      items: [
        {
          question: t('help.flowers.flowerCare'),
          answer: t('help.flowers.flowerCareAnswer')
        },
        {
          question: t('help.flowers.howLong'),
          answer: t('help.flowers.howLongAnswer')
        },
        {
          question: t('help.flowers.customBouquet'),
          answer: t('help.flowers.customBouquetAnswer')
        },
        {
          question: t('help.flowers.freshness'),
          answer: t('help.flowers.freshnessAnswer')
        }
      ]
    },
    {
      icon: <Package className="h-6 w-6" />,
      title: t('help.products.title'),
      items: [
        {
          question: t('help.products.outOfStock'),
          answer: t('help.products.outOfStockAnswer')
        },
        {
          question: t('help.products.addOns'),
          answer: t('help.products.addOnsAnswer')
        }
      ]
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: t('help.account.title'),
      items: [
        {
          question: t('help.account.wishlist'),
          answer: t('help.account.wishlistAnswer')
        },
        {
          question: t('help.account.orderHistory'),
          answer: t('help.account.orderHistoryAnswer')
        }
      ]
    }
  ];

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    items: category.items.filter(item => 
      searchQuery === '' ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      {/* Hero Section */}
      <div className="relative bg-[var(--secondary)] text-[var(--foreground)] py-20"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--primary)]/30 via-[var(--primary)]/20 to-[var(--primary)]/35" />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-[var(--primary)]/20 backdrop-blur-sm p-4 rounded-full">
              <HelpCircle className="h-12 w-12 text-[var(--primary-foreground)]" />
            </div>
          </div>
          <h1 className="serif-font text-4xl md:text-5xl font-bold my-4 text-[var(--primary-foreground)] drop-shadow-lg">
            {t('help.title')}
          </h1>
          <p className="serif-light text-xl text-[var(--primary-foreground)]/95 max-w-2xl mx-auto drop-shadow-md">
            {t('help.subtitle')}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="container mx-auto px-4 -mt-8 relative z-20">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--muted-foreground)] h-5 w-5" />
            <input
              type="text"
              placeholder={t('help.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-lg border-2 border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Link href="/orders" className="bg-[var(--card)] rounded-lg shadow-md p-6 border border-[var(--border)] hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="bg-[var(--primary)]/10 p-3 rounded-full text-[var(--primary)]">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--foreground)]">{t('help.quickLinks.trackOrder')}</h3>
                <p className="text-sm text-[var(--muted-foreground)]">{t('help.quickLinks.trackOrderDesc')}</p>
              </div>
            </div>
          </Link>

          <Link href="/contact" className="bg-[var(--card)] rounded-lg shadow-md p-6 border border-[var(--border)] hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="bg-[var(--primary)]/10 p-3 rounded-full text-[var(--primary)]">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--foreground)]">{t('help.quickLinks.contactUs')}</h3>
                <p className="text-sm text-[var(--muted-foreground)]">{t('help.quickLinks.contactUsDesc')}</p>
              </div>
            </div>
          </Link>

          <Link href="/shop" className="bg-[var(--card)] rounded-lg shadow-md p-6 border border-[var(--border)] hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="bg-[var(--primary)]/10 p-3 rounded-full text-[var(--primary)]">
                <Flower2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--foreground)]">{t('help.quickLinks.browseFlowers')}</h3>
                <p className="text-sm text-[var(--muted-foreground)]">{t('help.quickLinks.browseFlowersDesc')}</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="serif-font text-3xl font-bold text-center mb-12 text-[var(--foreground)]">
          {t('help.faq.title')}
        </h2>

        {filteredCategories.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <p className="text-[var(--muted-foreground)] text-lg">{t('help.noResults')}</p>
          </div>
        )}

        <div className="max-w-4xl mx-auto space-y-8">
          {filteredCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-[var(--card)] rounded-lg shadow-md border border-[var(--border)] overflow-hidden">
              <div className="bg-[var(--primary)]/5 px-6 py-4 border-b border-[var(--border)]">
                <div className="flex items-center space-x-3">
                  <div className="text-[var(--primary)]">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--foreground)]">
                    {category.title}
                  </h3>
                </div>
              </div>
              
              <div className="divide-y divide-[var(--border)]">
                {category.items.map((item, itemIndex) => {
                  const key = `${categoryIndex}-${itemIndex}`;
                  const isExpanded = expandedIndex === key;
                  
                  return (
                    <div key={itemIndex}>
                      <button
                        onClick={() => toggleAccordion(categoryIndex, itemIndex)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-[var(--primary)]/5 transition-colors"
                      >
                        <span className="text-left font-medium text-[var(--foreground)]">
                          {item.question}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-[var(--muted-foreground)] flex-shrink-0" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-[var(--muted-foreground)] flex-shrink-0" />
                        )}
                      </button>
                      
                      {isExpanded && (
                        <div className="px-6 py-4 text-[var(--muted-foreground)] bg-[var(--card)]">
                          <p className="whitespace-pre-line">{item.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-[var(--primary)]/5 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="serif-font text-3xl font-bold mb-4 text-[var(--foreground)]">
              {t('help.stillNeedHelp.title')}
            </h2>
            <p className="text-[var(--muted-foreground)] mb-8 text-lg">
              {t('help.stillNeedHelp.subtitle')}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-[var(--card)] rounded-lg p-6 border border-[var(--border)]">
                <div className="flex justify-center mb-4">
                  <div className="bg-[var(--primary)]/10 p-3 rounded-full text-[var(--primary)]">
                    <Phone className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="font-semibold text-[var(--foreground)] mb-2">{t('help.contact.phone')}</h3>
                <p className="text-[var(--muted-foreground)] text-sm mb-2">0769141250</p>
                <p className="text-[var(--muted-foreground)] text-xs">{t('contact.phoneSchedule')}</p>
              </div>

              <div className="bg-[var(--card)] rounded-lg p-6 border border-[var(--border)]">
                <div className="flex justify-center mb-4">
                  <div className="bg-[var(--primary)]/10 p-3 rounded-full text-[var(--primary)]">
                    <Mail className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="font-semibold text-[var(--foreground)] mb-2">{t('help.contact.email')}</h3>
                <a href="mailto:laurasimona97@yahoo.com" className="text-[var(--primary)] hover:underline text-sm block">
                  laurasimona97@yahoo.com
                </a>
                <a href="mailto:simonabuzau2@gmail.com" className="text-[var(--primary)] hover:underline text-sm block mt-1">
                  simonabuzau2@gmail.com
                </a>
              </div>

              <div className="bg-[var(--card)] rounded-lg p-6 border border-[var(--border)]">
                <div className="flex justify-center mb-4">
                  <div className="bg-[var(--primary)]/10 p-3 rounded-full text-[var(--primary)]">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="font-semibold text-[var(--foreground)] mb-2">{t('help.contact.message')}</h3>
                <Link href="/contact" className="inline-block bg-[var(--primary)] hover:bg-[var(--hover-primary)] text-[var(--primary-foreground)] px-6 py-2 rounded-md transition-colors text-sm">
                  {t('help.contact.sendMessage')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
