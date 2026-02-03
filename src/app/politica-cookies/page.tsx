'use client';

import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { ArrowLeft, Cookie } from 'lucide-react';

export default function PoliticaCookiesPage() {
  const { language } = useLanguage();

  const content = {
    ro: {
      title: 'Politica de Cookies',
      lastUpdated: 'Ultima actualizare: 30 Ianuarie 2026',
      backHome: 'Înapoi la pagina principală',
      sections: [
        {
          title: '1. Ce sunt Cookie-urile?',
          content: `Cookie-urile sunt fișiere text mici care sunt plasate pe dispozitivul dvs. (computer, smartphone, tabletă) când vizitați un site web. Acestea sunt utilizate pe scară largă pentru a face site-urile web să funcționeze mai eficient și pentru a furniza informații către proprietarii site-ului.

Cookie-urile ne ajută să îmbunătățim experiența dvs. pe site, să ne amintim preferințele dvs. și să înțelegem cum interacționați cu conținutul nostru.`
        },
        {
          title: '2. Tipuri de Cookie-uri pe care le Folosim',
          content: `a) Cookie-uri Esențiale (Necesare)
Aceste cookie-uri sunt absolut necesare pentru funcționarea site-ului. Fără ele, anumite funcționalități nu ar putea fi oferite.

Exemple:
- Cookie-uri pentru coșul de cumpărături
- Cookie-uri pentru securitate

b) Cookie-uri de Performanță
Colectează informații despre modul în care vizitatorii folosesc site-ul nostru.

Exemple:
- Numărul de vizitatori
- Paginile cele mai vizitate
- Timpul petrecut pe site
- Surse de trafic

c) Cookie-uri de Funcționalitate
Permit site-ului să memoreze alegerile dvs. (cum ar fi limba sau tema aleasă).

Exemple:
- Preferințe de limbă
- Preferințe de temă (culoare)
- Locație geografică

d) Cookie-uri de Marketing/Targeting
Folosite pentru a urmări vizitatorii pe diferite site-uri și pentru a afișa reclame relevante.

Exemple:
- Cookie-uri Google Ads
- Cookie-uri Facebook Pixel
- Cookie-uri pentru retargeting`
        },
        {
          title: '3. Cookie-uri Specifice Utilizate',
          content: `Pe site-ul nostru folosim următoarele cookie-uri:

Cookie-uri Proprii:
- session_id: Pentru managementul sesiunii utilizatorului (esențial)
- cart_items: Pentru memorarea produselor din coș (esențial)
- theme: Pentru memorarea temei alese (funcționalitate)
- language: Pentru memorarea limbii alese (funcționalitate)
- user_preferences: Pentru memorarea preferințelor (funcționalitate)

Cookie-uri Terțe:
- Google Analytics: _ga, _gid, _gat (performanță)
- Google Ads: Google conversion tracking (marketing)
- Facebook Pixel: _fbp, fr (marketing)

Toate cookie-urile au o durată de viață limitată și sunt șterse automat după expirare.`
        },
        {
          title: '4. Gestionarea Cookie-urilor',
          content: `Aveți posibilitatea de a controla și/sau șterge cookie-urile după preferințe.

Cum să gestionați cookie-urile:

a) Prin Browser
Majoritatea browserelor vă permit să:
- Vedeți ce cookie-uri sunt stocate
- Ștergeți toate sau anumite cookie-uri
- Blocați cookie-urile de la anumite site-uri
- Blocați toate cookie-urile terțe
- Ștergeți toate cookie-urile la închiderea browserului

Pentru instrucțiuni specifice:
- Chrome: Settings > Privacy and Security > Cookies
- Firefox: Options > Privacy & Security > Cookies
- Safari: Preferences > Privacy > Manage Website Data
- Edge: Settings > Privacy > Cookies

b) Prin Setările Site-ului
Puteți gestiona preferințele cookie-urilor direct pe site-ul nostru prin [Banner Cookie-uri] la prima vizită.

Note importante:
- Dezactivarea cookie-urilor esențiale poate afecta funcționalitatea site-ului
- Nu veți putea adăuga produse în coș fără cookie-uri
- Preferințele dvs. nu vor fi memorate`
        },
        {
          title: '5. Cookie-uri de la Terți',
          content: `Site-ul nostru poate conține conținut sau servicii de la terți care pot seta propriile cookie-uri.

Parteneri Terți:
- Google Analytics: Pentru analiză trafic
- Google Ads: Pentru publicitate targetată
- Facebook: Pentru integrare socială și publicitate
- Payment Processors: Pentru procesarea plăților

Nu avem control asupra cookie-urilor setate de terți. Vă recomandăm să consultați politicile de confidențialitate ale acestor servicii.`
        },
        {
          title: '6. Durata de Stocare',
          content: `Cookie-urile sunt stocate pentru perioade diferite:

Cookie-uri de Sesiune:
- Se șterg automat când închideți browserul
- Folosite pentru: autentificare, coș de cumpărături

Cookie-uri Persistente:
- Rămân pe dispozitiv pentru o perioadă stabilită
- Durata variază de la câteva zile la 2 ani
- Folosite pentru: preferințe, analize

Puteți șterge manual toate cookie-urile în orice moment din setările browserului.`
        },
        {
          title: '7. Actualizări ale Politicii',
          content: `Ne rezervăm dreptul de a actualiza această Politică de Cookie-uri pentru a reflecta schimbări în tehnologie, legislație sau practicile noastre comerciale.

Ultima actualizare: 30 Ianuarie 2026

Vă recomandăm să revizuiți periodic această pagină pentru a fi la curent cu modul în care folosim cookie-urile.`
        },
        {
          title: '8. Contact',
          content: `Pentru întrebări despre cookie-uri sau această politică:

Email: simonabuzau2@gmail.com
Telefon: +40 769 141 250

Suntem disponibili să vă oferim informații suplimentare despre utilizarea cookie-urilor pe site-ul nostru.`
        }
      ]
    },
    en: {
      title: 'Cookie Policy',
      lastUpdated: 'Last updated: January 30, 2026',
      backHome: 'Back to home',
      sections: [
        {
          title: '1. What are Cookies?',
          content: `Cookies are small text files that are placed on your device (computer, smartphone, tablet) when you visit a website. They are widely used to make websites work more efficiently and provide information to site owners.

Cookies help us improve your experience on our site, remember your preferences, and understand how you interact with our content.`
        },
        {
          title: '2. Types of Cookies We Use',
          content: `a) Essential Cookies (Necessary)
These cookies are absolutely necessary for the website to function. Without them, certain functionalities could not be provided.

Examples:
- Shopping cart cookies
- Security cookies

b) Performance Cookies
Collect information about how visitors use our website.

Examples:
- Number of visitors
- Most visited pages
- Time spent on site
- Traffic sources

c) Functionality Cookies
Allow the site to remember your choices (such as language or chosen theme).

Examples:
- Language preferences
- Theme preferences (color)
- Geographic location

d) Marketing/Targeting Cookies
Used to track visitors across different sites and display relevant ads.

Examples:
- Google Ads cookies
- Facebook Pixel cookies
- Retargeting cookies`
        },
        {
          title: '3. Specific Cookies Used',
          content: `On our site we use the following cookies:

First-Party Cookies:
- session_id: For user session management (essential)
- cart_items: For storing cart products (essential)
- theme: For storing chosen theme (functionality)
- language: For storing chosen language (functionality)
- user_preferences: For storing preferences (functionality)

Third-Party Cookies:
- Google Analytics: _ga, _gid, _gat (performance)
- Google Ads: Google conversion tracking (marketing)
- Facebook Pixel: _fbp, fr (marketing)

All cookies have a limited lifetime and are automatically deleted after expiration.`
        },
        {
          title: '4. Managing Cookies',
          content: `You have the ability to control and/or delete cookies according to your preferences.

How to manage cookies:

a) Through Browser
Most browsers allow you to:
- See what cookies are stored
- Delete all or certain cookies
- Block cookies from certain sites
- Block all third-party cookies
- Delete all cookies when closing the browser

For specific instructions:
- Chrome: Settings > Privacy and Security > Cookies
- Firefox: Options > Privacy & Security > Cookies
- Safari: Preferences > Privacy > Manage Website Data
- Edge: Settings > Privacy > Cookies

b) Through Site Settings
You can manage cookie preferences directly on our site through [Cookie Banner] on first visit.

Important notes:
- Disabling essential cookies may affect site functionality
- You won't be able to add products to cart without cookies
- Your preferences won't be remembered`
        },
        {
          title: '5. Third-Party Cookies',
          content: `Our site may contain content or services from third parties that may set their own cookies.

Third-Party Partners:
- Google Analytics: For traffic analysis
- Google Ads: For targeted advertising
- Facebook: For social integration and advertising
- Payment Processors: For payment processing

We have no control over cookies set by third parties. We recommend consulting the privacy policies of these services.`
        },
        {
          title: '6. Storage Duration',
          content: `Cookies are stored for different periods:

Session Cookies:
- Automatically deleted when you close the browser
- Used for: authentication, shopping cart

Persistent Cookies:
- Remain on device for a set period
- Duration varies from a few days to 2 years
- Used for: preferences, analytics

You can manually delete all cookies at any time from browser settings.`
        },
        {
          title: '7. Policy Updates',
          content: `We reserve the right to update this Cookie Policy to reflect changes in technology, legislation, or our business practices.

Last update: January 30, 2026

We recommend periodically reviewing this page to stay informed about how we use cookies.`
        },
        {
          title: '8. Contact',
          content: `For questions about cookies or this policy:

Email: simonabuzau2@gmail.com
Phone: +40 769 141 250

We are available to provide additional information about cookie usage on our site.`
        }
      ]
    }
  };

  const t = content[language as keyof typeof content] || content.ro;

  return (
    <div className="min-h-screen pt-20 bg-[var(--primary-background)]">
      {/* Header */}
      <div className="bg-[var(--card)] border-b border-[var(--border)] sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-[var(--primary)] hover:text-[var(--hover-primary)] transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            {t.backHome}
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Cookie className="w-8 h-8 text-[var(--primary)]" />
            <h1 className="text-4xl font-bold text-[var(--foreground)]">
              {t.title}
            </h1>
          </div>
          <p className="text-sm text-[var(--muted-foreground)]">
            {t.lastUpdated}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-[var(--card)] rounded-lg shadow-lg border border-[var(--border)] p-8 space-y-8">
          {t.sections.map((section, index) => (
            <section key={index} className="space-y-4">
              <h2 className="text-2xl font-semibold text-[var(--foreground)]">
                {section.title}
              </h2>
              <div className="text-[var(--muted-foreground)] whitespace-pre-line leading-relaxed">
                {section.content}
              </div>
              {index < t.sections.length - 1 && (
                <div className="border-b border-[var(--border)] pt-4"></div>
              )}
            </section>
          ))}
        </div>

        {/* Footer Links */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center text-sm">
          <Link 
            href="/termeni-conditii"
            className="text-[var(--primary)] hover:text-[var(--hover-primary)] transition-colors"
          >
            Termeni și Condiții
          </Link>
          <span className="text-[var(--muted-foreground)]">•</span>
          <Link 
            href="/gdpr"
            className="text-[var(--primary)] hover:text-[var(--hover-primary)] transition-colors"
          >
            GDPR
          </Link>
          <span className="text-[var(--muted-foreground)]">•</span>
          <Link 
            href="/contact"
            className="text-[var(--primary)] hover:text-[var(--hover-primary)] transition-colors"
          >
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
}
