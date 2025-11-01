"use client";
import React from "react";
import { Footer } from "../components/Footer";
import PopUp from "../components/PopUp";

const Content = () => {
  return (
    <main className="relative container mx-auto pt-24 pb-20 px-5 md:px-20">
      <header className="max-w-3xl mx-auto text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2">
          Termeni și condiții
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          Vă rugăm să citiți cu atenție acești termeni și condiții înainte de a
          utiliza site-ul nostru. Data ultimei actualizări:{" "}
          <strong>27.10.2025</strong>
        </p>
      </header>

      <section className="max-w-4xl mx-auto bg-white shadow-sm rounded-lg p-6 md:p-8 space-y-6 text-gray-700">
        <article>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">1. Operatorul</h2>
          <p className="text-sm">
            Site-ul www.buchetul-simonei.com este deținut și operat de
            BUCHETUL SIMONEI POEZIA FLORILOR SRL, cu sediul în județul Neamț,
            sat Tămășeni, Str. Unirii 224, Cod 617465. Înregistrare la Registrul
            Comerțului: J27/802/2016, CUI: 36497181.
          </p>
          <p className="text-sm mt-2">
            Contact pentru suport clienți:{" "}
            <strong>laurasimona97@yahoo.com</strong> — Tel:{" "}
            <strong>0769141250</strong>
          </p>
        </article>

        <article>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">2. Domeniul de aplicare</h2>
          <p className="text-sm">
            Acești termeni reglementează utilizarea site-ului, plasarea comenzilor,
            modalitățile de plată, livrare și relația contractuală dintre operator
            și client pentru produsele florale și serviciile asociate.
          </p>
        </article>

        <article>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">3. Definiții</h2>
          <ul className="list-disc ml-5 mt-2 text-sm space-y-1">
            <li><strong>Client</strong> — persoana fizică sau juridică care plasează o comandă.</li>
            <li><strong>Comandă</strong> — solicitarea de livrare/achiziţie a unui produs prin site.</li>
            <li><strong>Produse</strong> — aranjamente florale, buchete și alte bunuri afișate în magazin.</li>
            <li><strong>Data solicitată</strong> — data pentru care clientul cere livrarea; în lipsa ei se aplică livrarea standard.</li>
          </ul>
        </article>

        <article>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">4. Plasarea comenzilor</h2>
          <p className="text-sm">
            Comenzile se pot plasa online 24/7. După plasare, clientul primește o confirmare prin e‑mail sau telefon.
            Contractul se consideră încheiat la confirmarea comenzii de către operator.
          </p>
          <p className="text-sm mt-2">
            Dacă clientul specifică o dată anume pentru livrare, operatorul va respecta acea dată în măsura posibilului.
            În cazul în care clientul nu specifică o dată, livrarea se efectuează la domiciliu sau la sediul firmei în
            maxim o zi de la plasarea comenzii (în funcţie de zonă și de disponibilitatea produsului).
          </p>
        </article>

        <article>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">5. Prețuri și plată</h2>
          <p className="text-sm">
            Toate prețurile afișate sunt exprimate în RON/EURO și includ TVA, dacă este cazul. Costurile de livrare, când există,
            sunt afișate separat la finalizarea comenzii.
          </p>
          <p className="text-sm mt-2">
            Metode de plată acceptate: ramburs la livrare, plata online cu cardul (procesată prin procesator extern securizat)
            și plata în numerar la sediu. Plata online este efectuată prin servicii terțe — operatorul nu stochează datele sensibile
            ale cardului. Facturarea se face conform informațiilor oferite de client în momentul comenzii.
          </p>
        </article>

        <article>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">6. Livrare</h2>
          <p className="text-sm">
            Livrările se efectuează la domiciliu sau la sediul firmei, în funcție de opțiunea selectată de client. Dacă clientul nu
            specifică o dată de livrare, operatorul va livra în maxim o zi de la plasarea comenzii, sub rezerva disponibilității produsului.
          </p>
          <p className="text-sm mt-2">
            Pentru comenzi cu dată solicitată, livrarea se realizează în ziua indicată de client. Operatorul va confirma posibilitatea
            livrării la data solicitată în momentul procesării comenzii.
          </p>
          <p className="text-sm mt-2">
            Operatorul poate stabili un interval orar estimativ pentru livrare; întârzieri pot apărea din motive independente de operator
            (trafic, condiții meteo etc.). Clientul este responsabil să furnizeze adresa corectă și informații de contact valide.
          </p>
        </article>

        <article>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">7. Politica de retur și reclamații</h2>
          <p className="text-sm">
            Produsele florale sunt perisabile; retururile standard nu sunt aplicabile. Se pot accepta reclamații pentru produse livrate
            greșit sau deteriorate, în termen de 24 de ore de la primire, însoțite de fotografii clare ale produsului și ambalajului.
          </p>
          <p className="text-sm mt-2">
            În urma analizei, soluțiile posibile includ reexpediere, înlocuire sau rambursare (parțială sau totală), în funcție de
            natura reclamației și probele furnizate.
          </p>
        </article>

        <article>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">8. Anularea comenzii</h2>
          <p className="text-sm">
            Clientul poate solicita anularea comenzii înainte ca produsul să fie pregătit pentru expediere. Dacă produsul a fost deja
            pregătit sau predat curierului, anularea poate fi refuzată și se vor aplica procedurile de retur/reclamare prevăzute mai sus.
          </p>
        </article>

        <article>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">9. Răspundere</h2>
          <p className="text-sm">
            Operatorul răspunde pentru conformitatea produselor cu descrierea în limita prevăzută de lege. Operatorul nu va fi răspunzător
            pentru pierderi indirecte (ex: pierdere de profit). Răspunderea totală este, în mod obișnuit, limitată la valoarea comenzii,
            cu excepția situațiilor în care legea prevede altfel.
          </p>
        </article>

        <article>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">10. Proprietate intelectuală</h2>
          <p className="text-sm">
            Toate materialele publicate pe site (texte, imagini, logo-uri) sunt proprietatea BUCHETUL SIMONEI POEZIA FLORILOR SRL sau sunt
            folosite cu permisiune. Orice reproducere sau utilizare neautorizată este interzisă.
          </p>
        </article>

        <article>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">11. Date cu caracter personal</h2>
          <p className="text-sm">
            Datele colectate sunt procesate conform Politicii de confidențialitate. Clientul are dreptul de a solicita accesul, rectificarea,
            ștergerea, restricționarea prelucrării, portabilitatea datelor și opoziția față de prelucrare. Pentru exercitarea acestor drepturi
            contactați: <a className="text-pink-600" href="mailto:laurasimona97@yahoo.com">laurasimona97@yahoo.com</a>.
          </p>
        </article>

        <article>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">12. Cookie-uri</h2>
          <p className="text-sm">
            Site-ul folosește cookie-uri esențiale pentru funcționare, cookie-uri de analiză și, dacă este cazul, cookie-uri pentru marketing.
            Utilizatorii pot gestiona consimțământul pentru cookie-uri din setările site-ului sau din browser.
          </p>
        </article>

        <article>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">13. Modificări ale termenilor</h2>
          <p className="text-sm">
            Ne rezervăm dreptul de a actualiza acești termeni. Modificările vor fi publicate pe această pagină și vor include data ultimei
            actualizări. Continuarea utilizării site-ului după publicarea modificărilor constituie acceptul față de noii termeni.
          </p>
        </article>

        <article>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">14. Legislație aplicabilă și soluționarea litigiilor</h2>
          <p className="text-sm">
            Prezentul acord este guvernat de legislația din România. În cazul unui litigiu, părțile vor încerca rezolvarea amiabilă, iar dacă
            acest lucru nu este posibil, litigiul va fi soluționat de instanțele competente din România.
          </p>
        </article>

        <article>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">15. Date de contact</h2>
          <dl className="text-sm">
            <dt className="font-medium">Operator</dt>
            <dd>BUCHETUL SIMONEI POEZIA FLORILOR SRL</dd>
            <dt className="font-medium mt-2">Adresă</dt>
            <dd>jud. Neamț, sat Tămășeni, Str. Unirii 224, Cod 617465</dd>
            <dt className="font-medium mt-2">Email</dt>
            <dd><a className="text-pink-600" href="mailto:laurasimona97@yahoo.com">laurasimona97@yahoo.com</a></dd>
            <dt className="font-medium mt-2">Telefon</dt>
            <dd>0769141250</dd>
          </dl>
        </article>
      </section>
    </main>
  );
};

const TermsAndConditions = () => {
  return (
    <div className="relative w-full var(--background)">
      <PopUp />
      <Content />
      <Footer />
    </div>
  );
};

export default TermsAndConditions;