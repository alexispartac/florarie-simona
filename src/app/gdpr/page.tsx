"use client";
import React from "react";
import PopUp from "../components/PopUp";
import { Footer } from "../components/Footer";

const Content = () => {
  return (
    <main className="relative container mx-auto pt-24 pb-20 px-5 md:px-20">
      <header className="max-w-3xl mx-auto text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-3">
          Politica de confidențialitate
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          Protejăm datele tale personale și îți explicăm în mod clar ce colectăm,
          de ce o facem și cum le protejăm. Ultima actualizare:{" "}
          <strong>27.10.2025</strong>.
        </p>
      </header>

      <section className="max-w-5xl mx-auto bg-white shadow-sm rounded-lg p-6 md:p-8 space-y-6">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="col-span-2">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              1. Operatorul
            </h2>
            <p className="text-gray-600 text-sm">
              Numele operatorului:{" "}
              <strong>BUCHETUL SIMONEI POEZIA FLORILOR SRL</strong>
              <br />
              Adresă: <strong>jud. Neamt sat Tamaseni Str. Unirii 224</strong>
              <br />
              Email contact:{" "}
              <a className="text-pink-600" href="mailto:laurasimona97@yahoo.com">
                laurasimona97@yahoo.com
              </a>
              <br />
              Telefon: <strong>0769141250</strong>
            </p>
          </div>

          <div className="col-span-1">
            <div className="bg-gray-50 border rounded p-4">
              <p className="text-xs text-gray-500">Principii</p>
              <ul className="mt-2 text-sm text-gray-700 space-y-1">
                <li>- Legalitate, corectitudine și transparență</li>
                <li>- Limitare la scop</li>
                <li>- Minimarea datelor</li>
                <li>- Integritate și confidențialitate</li>
              </ul>
            </div>
          </div>
        </div>

        <section>
          <h3 className="text-md font-semibold text-gray-800 mb-2">
            2. Ce date colectăm
          </h3>
          <p className="text-gray-600 text-sm">
            Putem colecta următoarele categorii de date, doar dacă sunt necesare
            și cu respectarea legii:
          </p>
          <ul className="list-disc ml-5 mt-2 text-gray-700 text-sm space-y-1">
            <li>Nume și prenume</li>
            <li>Adresă de email</li>
            <li>Număr de telefon</li>
            <li>Adresa de livrare (dacă este cazul)</li>
            <li>
              Adresă IP și date tehnice (log-uri, cookie-uri pentru funcționare
              și analiză)
            </li>
            <li>
              Informații furnizate în formularele de contact sau comenzi
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-md font-semibold text-gray-800 mb-2">
            3. Scopurile prelucrării
          </h3>
          <p className="text-gray-600 text-sm">Prelucrăm datele pentru:</p>
          <ul className="list-decimal ml-5 mt-2 text-gray-700 text-sm space-y-1">
            <li>
              Procesarea comenzilor și gestionarea relațiilor cu clienții
            </li>
            <li>
              Comunicări legate de servicii, promoții (doar cu consimțământ)
            </li>
            <li>Îmbunătățirea serviciilor și analiza traficului</li>
            <li>
              Respectarea obligațiilor legale și fiscale
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-md font-semibold text-gray-800 mb-2">
            4. Temelia legală
          </h3>
          <p className="text-gray-600 text-sm">
            Temeiuri legale pentru prelucrare pot fi:
          </p>
          <ul className="ml-5 mt-2 text-gray-700 text-sm space-y-1">
            <li>Consimțământul utilizatorului</li>
            <li>Executarea unui contract</li>
            <li>Interes legitim al operatorului</li>
            <li>Îndeplinirea unei obligații legale</li>
          </ul>
        </section>

        <section>
          <h3 className="text-md font-semibold text-gray-800 mb-2">
            5. Divulgarea datelor
          </h3>
          <p className="text-gray-600 text-sm">
            Datele pot fi comunicate strict furnizorilor de servicii care ne
            asistă (livrare, procesare plăți, infrastructură cloud). Nu vindem
            datele personale.
          </p>
        </section>

        <section>
          <h3 className="text-md font-semibold text-gray-800 mb-2">
            6. Transferuri internaționale
          </h3>
          <p className="text-gray-600 text-sm">
            Dacă datele sunt stocate sau procesate în afara UE, o facem numai
            către furnizori care asigură un nivel adecvat de protecție
            (mecanisme aprobate sau clauze contractuale standard).
          </p>
        </section>

        <section>
          <h3 className="text-md font-semibold text-gray-800 mb-2">
            7. Durata păstrării datelor
          </h3>
          <p className="text-gray-600 text-sm">
            Datele sunt păstrate doar atât timp cât este necesar pentru scopul
            pentru care au fost colectate, sau conform obligațiilor legale
            aplicabile. Politicile specifice de retenție pot varia în funcție de
            tipul datelor.
          </p>
        </section>

        <section>
          <h3 className="text-md font-semibold text-gray-800 mb-2">
            8. Securitatea datelor
          </h3>
          <p className="text-gray-600 text-sm">
            Implementăm măsuri tehnice și organizatorice adecvate pentru a proteja
            datele împotriva accesului neautorizat, pierderii sau divulgării
            (ex: criptare, acces controlat, back-up regulat).
          </p>
        </section>

        <section>
          <h3 className="text-md font-semibold text-gray-800 mb-2">
            9. Drepturile persoanelor vizate
          </h3>
          <p className="text-gray-600 text-sm">
            Ai dreptul să soliciți accesul, rectificarea, ștergerea,
            restricționarea prelucrării, portabilitatea datelor și să te opui
            prelucrării. Pentru exercitarea acestor drepturi contactează-ne la:
          </p>
          <p className="mt-3 text-sm">
            <a className="text-pink-600 font-medium" href="mailto:laurasimona97@yahoo.com">
              laurasimona97@yahoo.com
            </a>
          </p>
        </section>

        <section>
          <h3 className="text-md font-semibold text-gray-800 mb-2">
            10. Cookie-uri
          </h3>
          <p className="text-gray-600 text-sm">
            Folosim cookie-uri necesare pentru funcționare, cookie-uri de
            performanță/analiză și, dacă este cazul, cookie-uri pentru marketing.
            Poți gestiona preferințele prin setările cookie-urilor de pe site.
          </p>
        </section>

        <section>
          <h3 className="text-md font-semibold text-gray-800 mb-2">
            11. Modificări ale politicii
          </h3>
          <p className="text-gray-600 text-sm">
            Ne rezervăm dreptul de a actualiza această politică. Orice modificare
            importantă va fi comunicată și va include data ultimei actualizări.
          </p>
        </section>

        <section>
          <h3 className="text-md font-semibold text-gray-800 mb-2">
            12. Contact și reclamații
          </h3>
          <p className="text-gray-600 text-sm">
            Pentru orice întrebări sau pentru a depune o plângere, ne poți
            contacta la:
          </p>
          <dl className="mt-3 text-sm text-gray-700">
            <dt className="font-medium">Email</dt>
            <dd>
              <a className="text-pink-600" href="mailto:laurasimona97@yahoo.com">
                laurasimona97@yahoo.com
              </a>
            </dd>
            <dt className="font-medium mt-2">Adresă</dt>
            <dd>jud. Neamt sat Tamaseni Str. Unirii 224</dd>
          </dl>
          <p className="mt-3 text-xs text-gray-500">
            Ai dreptul să depui și plângere la Autoritatea Națională de
            Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP).
          </p>
        </section>
      </section>
    </main>
  );
};

const Gdpr = () => {
  return (
    <div className="relative w-full var(--background)">
      <PopUp />
      <Content />
      <Footer />
    </div>
  );
};

export default Gdpr;