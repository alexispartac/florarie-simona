'use client';

import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermeniConditiiPage() {
  const { language } = useLanguage();

  const content = {
    ro: {
      title: 'Termeni și Condiții',
      lastUpdated: 'Ultima actualizare: 30 Ianuarie 2026',
      backHome: 'Înapoi la pagina principală',
      sections: [
        {
          title: '1. Informații Generale',
          content: `Bine ați venit pe Buchetul Simonei! Prin accesarea și utilizarea acestui site web, acceptați să respectați acești Termeni și Condiții. Vă rugăm să îi citiți cu atenție înainte de a utiliza serviciile noastre.

Buchetul Simonei este un magazin online specializat în vânzarea de flori proaspete, buchete și aranjamente florale pentru diverse evenimente și ocazii speciale.`
        },
        {
          title: '2. Utilizarea Site-ului',
          content: `Prin utilizarea acestui site, vă angajați să:
- Furnizați informații corecte și actualizate
- Nu folosiți site-ul în scopuri ilegale sau frauduloase
- Nu încercați să accesați zone neautorizate ale site-ului
- Nu distribuiți conținut ilegal sau ofensator
- Respectați drepturile de proprietate intelectuală`
        },
        {
          title: '3. Comenzi și Prețuri',
          content: `Toate prețurile afișate pe site sunt în Lei (RON) și includ TVA.

Ne rezervăm dreptul de a:
- Modifica prețurile fără notificare prealabilă
- Refuza sau anula orice comandă din motive justificate
- Limita cantitățile disponibile pentru anumite produse

Confirmarea comenzii se face prin email. Contractul se consideră încheiat în momentul în care primiți confirmarea comenzii.`
        },
        {
          title: '4. Livrare',
          content: `Livrăm flori proaspete în zonele desemnate, în funcție de disponibilitate.

Detalii importante despre livrare:
- Livrare în aceeași zi pentru comenzile in functie de ora
- Costurile de livrare variază în funcție de zonă și sunt afișate la finalizarea comenzii
- Pentru evenimente speciale (nunți, botezuri), contactați-ne direct pentru programare
- Nu suntem responsabili pentru întârzieri cauzate de evenimente în afara controlului nostru`
        },
        {
          title: '5. Returnări și Rambursări',
          content: `Datorită naturii perisabile a produselor noastre (flori proaspete), nu acceptăm returnări standard.

Însă, dacă:
- Produsul livrat diferă semnificativ de cel comandat
- Florile sosesc deteriorate sau nu sunt proaspete
- Există o eroare din partea noastră

Vă rugăm să ne contactați în termen de 24 de ore de la livrare. Vom analiza fiecare caz și vom oferi o soluție potrivită (înlocuire sau rambursare).`
        },
        {
          title: '6. Proprietate Intelectuală',
          content: `Tot conținutul acestui site (text, imagini, logo-uri, design) este protejat de drepturi de autor și aparține Buchetul Simonei.

Este interzis:
- Copierea, reproducerea sau distribuirea conținutului fără acordul nostru scris
- Utilizarea logo-ului sau mărcii noastre fără permisiune
- Preluarea imaginilor produselor pentru uz comercial`
        },
        {
          title: '7. Limitarea Răspunderii',
          content: `În limita permisă de lege, nu suntem răspunzători pentru:
- Daune indirecte, accidentale sau consecutive
- Pierderi de profit sau date
- Întreruperi ale serviciului
- Erori sau omisiuni în conținutul site-ului

Răspunderea noastră maximă este limitată la valoarea produsului achiziționat.`
        },
        {
          title: '8. Protecția Datelor',
          content: `Ne angajăm să protejăm confidențialitatea datelor dumneavoastră personale conform GDPR și legislației în vigoare.

Pentru detalii complete despre cum colectăm, procesăm și protejăm datele dvs., consultați Politica de Confidențialitate și secțiunea GDPR.`
        },
        {
          title: '9. Modificări ale Termenilor',
          content: `Ne rezervăm dreptul de a modifica acești Termeni și Condiții în orice moment. Modificările vor fi publicate pe această pagină cu data actualizării.

Continuarea utilizării site-ului după modificări înseamnă acceptarea noilor termeni.`
        },
        {
          title: '10. Contact',
          content: `Pentru întrebări sau clarificări despre acești Termeni și Condiții, vă rugăm să ne contactați:

Email: simonabuzau2@gmail.com
Telefon: +40 769 141 250
Adresă: Str. Unirii 240, Târmșeni, Neamț, România`
        }
      ]
    },
    en: {
      title: 'Terms and Conditions',
      lastUpdated: 'Last updated: January 30, 2026',
      backHome: 'Back to home',
      sections: [
        {
          title: '1. General Information',
          content: `Welcome to Buchetul Simonei! By accessing and using this website, you agree to comply with these Terms and Conditions. Please read them carefully before using our services.

Buchetul Simonei is an online store specializing in the sale of fresh flowers, bouquets, and floral arrangements for various events and special occasions.`
        },
        {
          title: '2. Website Usage',
          content: `By using this website, you agree to:
- Provide accurate and up-to-date information
- Not use the site for illegal or fraudulent purposes
- Not attempt to access unauthorized areas of the site
- Not distribute illegal or offensive content
- Respect intellectual property rights`
        },
        {
          title: '3. Orders and Pricing',
          content: `All prices displayed on the site are in Lei (RON) and include VAT.

We reserve the right to:
- Modify prices without prior notice
- Refuse or cancel any order for justified reasons
- Limit quantities available for certain products

Order confirmation is sent via email. The contract is considered concluded when you receive order confirmation.`
        },
        {
          title: '4. Delivery',
          content: `We deliver fresh flowers in designated areas, subject to availability.

Important delivery details:
- Same-day delivery for orders in function of the time
- Delivery costs vary by area and are displayed at checkout
- For special events (weddings, baptisms), contact us directly for scheduling
- We are not responsible for delays caused by events beyond our control`
        },
        {
          title: '5. Returns and Refunds',
          content: `Due to the perishable nature of our products (fresh flowers), we do not accept standard returns.

However, if:
- The delivered product significantly differs from what was ordered
- Flowers arrive damaged or not fresh
- There is an error on our part

Please contact us within 24 hours of delivery. We will analyze each case and offer an appropriate solution (replacement or refund).`
        },
        {
          title: '6. Intellectual Property',
          content: `All content on this site (text, images, logos, design) is copyright protected and belongs to Buchetul Simonei.

It is prohibited to:
- Copy, reproduce or distribute content without our written consent
- Use our logo or brand without permission
- Take product images for commercial use`
        },
        {
          title: '7. Limitation of Liability',
          content: `To the extent permitted by law, we are not liable for:
- Indirect, incidental or consequential damages
- Loss of profit or data
- Service interruptions
- Errors or omissions in site content

Our maximum liability is limited to the value of the purchased product.`
        },
        {
          title: '8. Data Protection',
          content: `We are committed to protecting the confidentiality of your personal data in accordance with GDPR and current legislation.

For complete details on how we collect, process and protect your data, please refer to our Privacy Policy and GDPR section.`
        },
        {
          title: '9. Changes to Terms',
          content: `We reserve the right to modify these Terms and Conditions at any time. Changes will be posted on this page with the update date.

Continued use of the site after changes means acceptance of the new terms.`
        },
        {
          title: '10. Contact',
          content: `For questions or clarifications about these Terms and Conditions, please contact us:

Email: simonabuzau2@gmail.com
Phone: +40 769 141 250
Address: Str. Unirii 240, Târmșeni, Neamț, România`
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
          <h1 className="text-4xl font-bold text-[var(--foreground)] mb-2">
            {t.title}
          </h1>
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
            href="/politica-cookies"
            className="text-[var(--primary)] hover:text-[var(--hover-primary)] transition-colors"
          >
            Politica de Cookies
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
