'use client';

import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye, FileText, UserCheck } from 'lucide-react';

export default function GDPRPage() {
  const { language } = useLanguage();

  const content = {
    ro: {
      title: 'Protecția Datelor (GDPR)',
      subtitle: 'Politica de Confidențialitate',
      lastUpdated: 'Ultima actualizare: 30 Ianuarie 2026',
      backHome: 'Înapoi la pagina principală',
      intro: 'Buchetul Simonei respectă dreptul dumneavoastră la confidențialitate și se angajează să protejeze datele personale în conformitate cu Regulamentul General privind Protecția Datelor (GDPR - EU 2016/679) și legislația română aplicabilă.',
      sections: [
        {
          icon: 'shield',
          title: '1. Operator de Date',
          content: `Operator de date: Buchetul Simonei
Email: contact@buchetulsimonei.ro
Telefon: +40 XXX XXX XXX
Adresă: [Adresa completă]

Suntem responsabili pentru modul în care colectăm, procesăm și protejăm datele dumneavoastră personale.`
        },
        {
          icon: 'file',
          title: '2. Ce Date Colectăm',
          content: `a) Date de Identificare:
- Nume și prenume
- Adresă de email
- Număr de telefon
- Adresă de livrare și facturare

b) Date de Comandă:
- Istoric comenzi
- Preferințe produse
- Coșul de cumpărături

c) Date Tehnice:
- Adresă IP
- Tip browser și dispozitiv
- Sistem de operare
- Informații despre vizită (pagini vizitate, durata)

d) Date de Plată:
- Informații despre tranzacții
- Metodă de plată preferată
- (NU stocăm date complete ale cardului)

e) Date de Marketing:
- Consimțământ pentru newsletter
- Preferințe de comunicare
- Istoric interacțiuni marketing`
        },
        {
          icon: 'lock',
          title: '3. Cum Colectăm Datele',
          content: `Colectăm date prin:

a) Direct de la Dumneavoastră:
- La crearea contului
- La plasarea comenzilor
- Prin formulare de contact
- La abonarea la newsletter
- Când ne contactați

b) Automat:
- Cookie-uri și tehnologii similare
- Google Analytics
- Pixeli de tracking pentru marketing

c) Din Surse Terțe:
- Platforme de social media (dacă vă conectați prin acestea)
- Furnizori de servicii de plată
- Servicii de livrare`
        },
        {
          icon: 'eye',
          title: '4. Scopul Prelucrării Datelor',
          content: `Folosim datele dumneavoastră pentru:

a) Executarea Contractului:
- Procesarea și livrarea comenzilor
- Comunicare despre comenzi
- Facturare
- Gestionarea returnărilor

b) Interese Legitime:
- Îmbunătățirea serviciilor
- Analize statistice
- Prevenirea fraudelor
- Securitatea site-ului

c) Obligații Legale:
- Păstrarea evidenței financiare
- Conformitate fiscală
- Răspuns la solicitări legale

d) Consimțământ:
- Marketing prin email/SMS
- Newsletter
- Personalizare experiență
- Publicitate targetată

Puteți retrage consimțământul oricând.`
        },
        {
          icon: 'users',
          title: '5. Cui Divulgăm Datele',
          content: `Putem partaja datele cu:

a) Furnizori de Servicii:
- Servicii de livrare (curier)
- Procesatori de plăți (bănci, procesatori card)
- Servicii de hosting web
- Servicii de email marketing
- Servicii de analiză (Google Analytics)

b) Parteneri de Marketing:
- Google Ads
- Facebook Ads
- (Doar dacă ați consimțit)

c) Autorități:
- Când este cerut legal
- Pentru prevenirea fraudelor
- Pentru protejarea drepturilor noastre

Toți partenerii sunt obligați contractual să protejeze datele și să le folosească doar în scopurile specificate.

NU VINDEM datele dumneavoastră personale nimănui!`
        },
        {
          icon: 'lock',
          title: '6. Securitatea Datelor',
          content: `Măsuri de securitate implementate:

Tehnice:
- Criptare SSL/TLS pentru toate transmisiile
- Firewall și sisteme de detectare intruziuni
- Backup regulat
- Acces restricționat la date

Organizaționale:
- Personal instruit în protecția datelor
- Politici stricte de confidențialitate
- Audit regulat de securitate
- Proceduri de răspuns la incidente

În cazul unei breșe de securitate, vă vom notifica în termen de 72 de ore, conform GDPR.`
        },
        {
          icon: 'clock',
          title: '7. Cât Timp Păstrăm Datele',
          content: `Perioada de stocare:

- Date cont activ: Până la ștergerea contului
- Istoric comenzi: 5 ani (obligație legală contabilă)
- Date marketing: Până la retragerea consimțământului
- Cookie-uri: Conform Politicii de Cookie-uri
- Date de securitate (logs): 6 luni

După expirarea perioadei, datele sunt șterse sau anonimizate.

Puteți solicita ștergerea datelor oricând (cu excepția celor păstrate din obligații legale).`
        },
        {
          icon: 'user-check',
          title: '8. Drepturile Dumneavoastră GDPR',
          content: `Conform GDPR, aveți următoarele drepturi:

a) Dreptul de Acces:
- Să știți ce date procesăm despre dumneavoastră
- Să primiți o copie a datelor

b) Dreptul de Rectificare:
- Să corectați date inexacte
- Să completați date incomplete

c) Dreptul de Ștergere ("Dreptul de a fi Uitat"):
- Să solicitați ștergerea datelor
- (Cu excepția obligațiilor legale)

d) Dreptul de Restricționare:
- Să limitați procesarea în anumite condiții

e) Dreptul la Portabilitate:
- Să primiți datele într-un format structurat
- Să transferați datele către alt operator

f) Dreptul de Opoziție:
- Să vă opuneți procesării pentru marketing
- Să vă opuneți profilării automate

g) Dreptul de a Retrage Consimțământul:
- Oricând, fără consecințe

h) Dreptul de a Depune Plângere:
- La Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP)

Pentru exercitarea drepturilor, contactați-ne la: contact@buchetulsimonei.ro`
        },
        {
          icon: 'globe',
          title: '9. Transfer Internațional de Date',
          content: `Datele dumneavoastră pot fi transferate și procesate în afara României/UE prin:

- Servicii cloud (AWS, Google Cloud)
- Servicii de marketing (Google, Facebook)

Pentru transferuri în afara UE, ne asigurăm că:
- Țara destinație asigură protecție adecvată
- Folosim clauze contractuale standard UE
- Există mecanisme de protecție aprobate de Comisia Europeană`
        },
        {
          icon: 'baby',
          title: '10. Protecția Minorilor',
          content: `Site-ul nostru nu este destinat persoanelor sub 16 ani.

Nu colectăm cu bună știință date de la copii sub 16 ani fără consimțământul părinților.

Dacă descoperim că am colectat date de la un copil sub 16 ani fără consimțământ, vom șterge imediat aceste date.

Părinții pot contacta-ne pentru a verifica, corecta sau șterge datele copilului lor.`
        },
        {
          icon: 'update',
          title: '11. Modificări ale Politicii',
          content: `Ne rezervăm dreptul de a actualiza această Politică de Confidențialitate.

Modificări semnificative:
- Vă vom notifica prin email
- Vom afișa un banner pe site
- Data actualizării va fi modificată

Modificări minore:
- Vor fi publicate pe această pagină
- Vă recomandăm verificări periodice

Ultima actualizare: 30 Ianuarie 2026`
        },
        {
          icon: 'phone',
          title: '12. Contact și DPO',
          content: `Pentru întrebări despre protecția datelor sau exercitarea drepturilor:

Responsabil Protecția Datelor (DPO):
Email: dpo@buchetulsimonei.ro
Email general: contact@buchetulsimonei.ro
Telefon: +40 XXX XXX XXX
Adresă: [Adresa completă]

Program răspuns: 1-3 zile lucrătoare

Autoritate de Supraveghere:
ANSPDCP (Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal)
Website: www.dataprotection.ro
Email: anspdcp@dataprotection.ro`
        }
      ]
    },
    en: {
      title: 'Data Protection (GDPR)',
      subtitle: 'Privacy Policy',
      lastUpdated: 'Last updated: January 30, 2026',
      backHome: 'Back to home',
      intro: 'Buchetul Simonei respects your right to privacy and is committed to protecting personal data in accordance with the General Data Protection Regulation (GDPR - EU 2016/679) and applicable Romanian legislation.',
      sections: [
        {
          icon: 'shield',
          title: '1. Data Controller',
          content: `Data Controller: Buchetul Simonei
Email: contact@buchetulsimonei.ro
Phone: +40 XXX XXX XXX
Address: [Complete address]

We are responsible for how we collect, process, and protect your personal data.`
        },
        {
          icon: 'file',
          title: '2. What Data We Collect',
          content: `a) Identification Data:
- First and last name
- Email address
- Phone number
- Delivery and billing address

b) Order Data:
- Order history
- Product preferences
- Shopping cart

c) Technical Data:
- IP address
- Browser type and device
- Operating system
- Visit information (pages visited, duration)

d) Payment Data:
- Transaction information
- Preferred payment method
- (We do NOT store complete card data)

e) Marketing Data:
- Newsletter consent
- Communication preferences
- Marketing interaction history`
        },
        {
          icon: 'lock',
          title: '3. How We Collect Data',
          content: `We collect data through:

a) Directly from You:
- When creating an account
- When placing orders
- Through contact forms
- When subscribing to newsletter
- When you contact us

b) Automatically:
- Cookies and similar technologies
- Google Analytics
- Tracking pixels for marketing

c) From Third-Party Sources:
- Social media platforms (if you connect through them)
- Payment service providers
- Delivery services`
        },
        {
          icon: 'eye',
          title: '4. Purpose of Data Processing',
          content: `We use your data for:

a) Contract Execution:
- Processing and delivering orders
- Communication about orders
- Billing
- Returns management

b) Legitimate Interests:
- Service improvement
- Statistical analysis
- Fraud prevention
- Site security

c) Legal Obligations:
- Maintaining financial records
- Tax compliance
- Response to legal requests

d) Consent:
- Email/SMS marketing
- Newsletter
- Experience personalization
- Targeted advertising

You can withdraw consent at any time.`
        },
        {
          icon: 'users',
          title: '5. Who We Share Data With',
          content: `We may share data with:

a) Service Providers:
- Delivery services (courier)
- Payment processors (banks, card processors)
- Web hosting services
- Email marketing services
- Analytics services (Google Analytics)

b) Marketing Partners:
- Google Ads
- Facebook Ads
- (Only if you consented)

c) Authorities:
- When legally required
- For fraud prevention
- To protect our rights

All partners are contractually obligated to protect data and use it only for specified purposes.

We do NOT SELL your personal data to anyone!`
        },
        {
          icon: 'lock',
          title: '6. Data Security',
          content: `Security measures implemented:

Technical:
- SSL/TLS encryption for all transmissions
- Firewall and intrusion detection systems
- Regular backup
- Restricted data access

Organizational:
- Staff trained in data protection
- Strict confidentiality policies
- Regular security audit
- Incident response procedures

In case of a security breach, we will notify you within 72 hours, as per GDPR.`
        },
        {
          icon: 'clock',
          title: '7. How Long We Keep Data',
          content: `Storage period:

- Active account data: Until account deletion
- Order history: 5 years (legal accounting obligation)
- Marketing data: Until consent withdrawal
- Cookies: According to Cookie Policy
- Security data (logs): 6 months

After the period expires, data is deleted or anonymized.

You can request data deletion at any time (except those kept for legal obligations).`
        },
        {
          icon: 'user-check',
          title: '8. Your GDPR Rights',
          content: `Under GDPR, you have the following rights:

a) Right of Access:
- To know what data we process about you
- To receive a copy of the data

b) Right to Rectification:
- To correct inaccurate data
- To complete incomplete data

c) Right to Erasure ("Right to be Forgotten"):
- To request data deletion
- (Except for legal obligations)

d) Right to Restriction:
- To limit processing under certain conditions

e) Right to Portability:
- To receive data in a structured format
- To transfer data to another controller

f) Right to Object:
- To object to processing for marketing
- To object to automated profiling

g) Right to Withdraw Consent:
- At any time, without consequences

h) Right to Lodge a Complaint:
- With the National Supervisory Authority for Personal Data Processing (ANSPDCP)

To exercise your rights, contact us at: contact@buchetulsimonei.ro`
        },
        {
          icon: 'globe',
          title: '9. International Data Transfer',
          content: `Your data may be transferred and processed outside Romania/EU through:

- Cloud services (AWS, Google Cloud)
- Marketing services (Google, Facebook)

For transfers outside the EU, we ensure that:
- The destination country ensures adequate protection
- We use EU standard contractual clauses
- There are protection mechanisms approved by the European Commission`
        },
        {
          icon: 'baby',
          title: '10. Protection of Minors',
          content: `Our site is not intended for persons under 16 years old.

We do not knowingly collect data from children under 16 without parental consent.

If we discover that we have collected data from a child under 16 without consent, we will immediately delete such data.

Parents can contact us to verify, correct, or delete their child's data.`
        },
        {
          icon: 'update',
          title: '11. Policy Changes',
          content: `We reserve the right to update this Privacy Policy.

Significant changes:
- We will notify you by email
- We will display a banner on the site
- The update date will be modified

Minor changes:
- Will be published on this page
- We recommend periodic checks

Last update: January 30, 2026`
        },
        {
          icon: 'phone',
          title: '12. Contact and DPO',
          content: `For questions about data protection or exercising rights:

Data Protection Officer (DPO):
Email: dpo@buchetulsimonei.ro
General email: contact@buchetulsimonei.ro
Phone: +40 XXX XXX XXX
Address: [Complete address]

Response time: 1-3 business days

Supervisory Authority:
ANSPDCP (National Supervisory Authority for Personal Data Processing)
Website: www.dataprotection.ro
Email: anspdcp@dataprotection.ro`
        }
      ]
    }
  };

  const t = content[language as keyof typeof content] || content.ro;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'shield': return <Shield className="w-6 h-6" />;
      case 'file': return <FileText className="w-6 h-6" />;
      case 'lock': return <Lock className="w-6 h-6" />;
      case 'eye': return <Eye className="w-6 h-6" />;
      case 'user-check': return <UserCheck className="w-6 h-6" />;
      default: return <Shield className="w-6 h-6" />;
    }
  };

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
            <Shield className="w-8 h-8 text-[var(--primary)]" />
            <div>
              <h1 className="text-4xl font-bold text-[var(--foreground)]">
                {t.title}
              </h1>
              <p className="text-lg text-[var(--muted-foreground)]">
                {t.subtitle}
              </p>
            </div>
          </div>
          <p className="text-sm text-[var(--muted-foreground)]">
            {t.lastUpdated}
          </p>
        </div>
      </div>

      {/* Intro */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-[var(--primary)]/10 border-l-4 border-[var(--primary)] p-6 rounded-r-lg">
          <p className="text-[var(--foreground)] leading-relaxed">
            {t.intro}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 pb-12 max-w-4xl">
        <div className="bg-[var(--card)] rounded-lg shadow-lg border border-[var(--border)] p-8 space-y-8">
          {t.sections.map((section, index) => (
            <section key={index} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="text-[var(--primary)]">
                  {getIcon(section.icon)}
                </div>
                <h2 className="text-2xl font-semibold text-[var(--foreground)]">
                  {section.title}
                </h2>
              </div>
              <div className="text-[var(--muted-foreground)] whitespace-pre-line leading-relaxed pl-9">
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
            href="/politica-cookies"
            className="text-[var(--primary)] hover:text-[var(--hover-primary)] transition-colors"
          >
            Politica de Cookies
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
