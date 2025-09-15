"use client";
import { Footer } from "../components/Footer";
import PopUp from "../components/PopUp";
import React from "react";

const Content = () => {
    

    return (
        <div className="relative container mx-auto pt-24">
            <div className="flex flex-col justify-center py-3 md:px-20 px-5">
                <p className="font-extrabold text-gray-500 px-3 text-center">
                    Termenii si conditiile
                </p>
                <br />
                <p>
                    Data ultimei actualizări: 15.09.2025
                    Bine ați venit pe site-ul Poezia Florilor! Vă rugăm să citiți cu atenție termenii și condițiile de mai jos înainte de a utiliza acest site. Accesarea și utilizarea acestui website implică acceptarea integrală a termenilor și condițiilor prezentate.
                </p>
                <p className="font-extrabold text-gray-500 px-3 ">
                    Informații generale
                </p>
                <p>
                    Site-ul www.buchtul-simonei.com este deținut și administrat de BUCHETUL SIMONEI POEZIA FLORILOR SRL , cu sediul în jud. Neamt sat Tamaseni Str. Unirii 224 Cod 617465 , înregistrată la Registrul Comerțului cu nr. J27/802/2016, CUI 36497181.
                </p>
                <p className="font-extrabold text-gray-500 px-3 ">
                    Obiectul site-ului
                </p>
                <p>
                    Site-ul are ca scop comerțul cu amănuntul al florilor, plantelor și semințelor; comerțul cu amănuntul al animalelor de companie și a hranei pentru acestea, în magazine specializate. Serviciile pot include comenzi online, livrare la domiciliu și consultanță personalizată.
                </p>
                <p className="font-extrabold text-gray-500 px-3 ">
                    Comenzi
                </p>
                <p>
                    Comenzile pot fi plasate online, 24/7.
                    Comenzile sunt procesate în intervalul orar 09:00–20:00, de luni până sâmbătă.
                    Confirmarea comenzii se face prin e-mail sau telefon.
                    În cazuri excepționale (ex: lipsa stocului, condiții meteorologice), ne rezervăm dreptul de a modifica sau anula comanda, cu informarea prealabilă a clientului.
                </p>
                <p className="font-extrabold text-gray-500 px-3 ">
                    Livrare
                </p>
                <p>
                    Livrările se efectuează în judetul Neamt - gratuit in comuna Tamaseni, iar contra cost in afara acesteia.
                    Timpul estimat de livrare este de 24 de ore / 2 zile lucrătoare.
                    Costul livrării este in functie de distanță.
                    Clientul este responsabil pentru furnizarea unor informații corecte privind adresa de livrare.
                </p>
                <p className="font-extrabold text-gray-500 px-3 ">
                    Plată
                </p>
                <p>
                    Metodele de plată disponibile:
                    Ramburs la livrare.
                    Plata online prin card bancar (dacă este disponibil).
                    Plata în numerar la sediul nostru.
                    Toate prețurile sunt exprimate în RON și EUR și includ TVA.
                </p>
                <p className="font-extrabold text-gray-500 px-3 ">
                    Politica de retur   
                </p>
                <p>
                    Produsele florale sunt perisabile și nu pot fi returnate, cu excepția cazurilor de livrare greșită sau produs deteriorat.
                    Reclamațiile pot fi trimise în termen de 24 de ore de la livrare, însoțite de dovezi foto.
                    În cazul în care reclamația este validă, oferim înlocuirea produsului sau returnarea contravalorii.
                </p>
                <p className="font-extrabold text-gray-500 px-3 ">
                    Drepturi de autor
                </p>
                <p>
                    Toate materialele de pe acest site (texte, imagini, logo-uri, design) sunt proprietatea BUCHETUL SIMONEI POEZIA FLORILOR SRL și sunt protejate de Legea drepturilor de autor. Utilizarea neautorizată este strict interzisă.
                </p>
                <p className="font-extrabold text-gray-500 px-3 ">
                    Modificarea termenilor
                </p>
                <p>
                    Ne rezervăm dreptul de a modifica acești termeni și condiții fără notificare prealabilă. Orice modificare va fi afișată pe această pagină și va intra în vigoare de la data publicării.
                </p>
            </div>
        </div>
    );
};

const Bouquets = () => {
    return (
        <div className={`relative w-full var(--background)`}>
            <PopUp />
            <Content />
            <Footer />
        </div>
    );
};

export default Bouquets;