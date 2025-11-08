'use client';
import React from 'react';
import { IconCalendar, IconHeart, IconUsers, IconFlower, IconMail, IconPhone, IconMapPin, IconStar } from '@tabler/icons-react';
import { Footer } from '../components/Footer';
import { useRouter } from 'next/navigation';

const EventPlanning = () => {
  const router = useRouter();

  const services = [
    {
      icon: <IconHeart size={48} className="text-rose-500" />,
      title: "Nunta, botez, majorat, se anunta party?",
      description: "Transformăm cea mai importantă zi din viața voastră într-un poveste florală. De la buchetul miresei la decorarea sălii, de la lumanarea de botez pana la aranjamentul masinii, fiecare detaliu este asezat cu dragoste.",
      features: ["Buchet mireasă personalizat", "Decoruri florale pentru sală", "Lumanari, cocarde, bratari, aranjament masina, etc.", "Corsaje pentru nași"],
      moreInfo: "Hai sa stabilim o sedinta de consultanta sa-ti cream evenimentul perfect!"
    },
    {
      icon: <IconUsers size={48} className="text-purple-500" />,
      title: "Livrare la domiciliu",
      description: "Aducem eleganța și prospețimea florilor în casele voastre. Doresti sa faci o surpriza persoanei dragi si nu esti in zona sau emotiile te coplesesc? Nicio problema, de asta suntem noi aici!",
      features: ["Stabilim ce cadou o/il/ii reprezinta", "Tu ne transmiti adresa noi facem magia", "Ai prea multe cuvinte adunate dar nu stii cum sa le transmiti, nu-i problema te ajutam cu textul, ba chiar cream si poezii personalizate.", "Versuri unice create pe baza detaliilor date de tine!"],
      moreInfo: "Da-ne un semn la 0769 141 250 sau trimi-mi un email la laurasimona97@yahoo.com. Poti si pe pagina de Facebook gasiti link-ul pe pagina principală, si facem!"
    },
    {
      icon: <IconCalendar size={48} className="text-blue-500" />,
      title: "Sărbători speciale cu flori si baloane",
      description: "De la aniversări la botezuri, de la logodne la petreceri tematice - fiecare sărbătoare merită să fie înfrumusețată decorul perfect!",
      features: ["Decoruri tematice", "Photo corner din baloane", "Decoruri flori artificiale, welcome board, seat list, etc."],
      moreInfo: "Hai sa stabilim o sedinta de consultanta sa-ti cream evenimentul perfect!"
    },
    {
      icon: <IconFlower size={48} className="text-green-500" />,
      title: "Consultanță Florală",
      description: "Vă ghidăm pas cu pas în alegerea perfectă a decorului pentru evenimentul vostru, respectând bugetul și preferințele voastre.",
      features: ["Consultații personalizate", "Planuri florale detaliate", "Estimări de buget", "Suport pe tot parcursul planificării"],
      moreInfo: "Hai sa stabilim o sedinta de consultanta sa-ti cream evenimentul perfect!"
    }
  ];

  const portfolio = [
    {
      title: "Nuntă de vis",
      description: "Decoruri florale naturale pentru o ceremonie de neuitat",
      image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&h=300&fit=crop",
    },
    {
      title: "Eveniment Corporate",
      description: "Aranjamente elegante pentru lansarea unui produs",
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500&h=300&fit=crop",
    },
    {
      title: "Aniversare de Lux",
      description: "Centrepieces spectaculoase pentru o petrecere memorabilă",
      image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500&h=300&fit=crop",
    }
  ];

  const testimonials = [
    {
      name: "Maria & Alexandru",
      event: "Nuntă",
      rating: 5,
      text: "Echipa Buchetul Simonei a făcut nunta noastră de vis să devină realitate! Fiecare detaliu floral a fost perfect, de la buchetul miresei la decorurile sălii."
    },
    {
      name: "Ana Popescu",
      event: "Botez",
      rating: 5,
      text: "Profesionalism și creativitate la cel mai înalt nivel. Decorurile pentru botezul fiicei mele au fost absolut superbe. Recomand cu încredere!"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute mt-35 inset-0 bg-cover bg-center blur-xs bg-no-repeat"
          style={{
            backgroundImage: `url('https://res.cloudinary.com/dm7ttgpta/image/upload/v1760899394/afcde8a2295b5cbb1ab8b781c1be831f_jfu4nb.jpg')`,
          }}
        >
          <div className="absolute inset-0 bg-opacity-50"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-light mb-6 tracking-tight">
            Planificare <span className="italic">Evenimente</span>
          </h1>
          <p className="text-xl md:text-2xl font-light mb-8 opacity-90">
            Transformăm visele voastre în realitate prin magia florilor
          </p>
          <p className="text-lg mb-12 opacity-80 max-w-3xl mx-auto">
            De la nunți de poveste la evenimente corporate elegante, creăm decoruri florale care lasă o impresie de neuitat. 
            Fiecare eveniment este o operă de artă florală unică.
          </p>
          <button
            onClick={() => router.push('/contact')}
            className="bg-white text-gray-900 hover:bg-gray-100 font-medium px-8 py-4 text-lg"
          >
            Planifică Evenimentul Tău
          </button>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
              Serviciile Noastre
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Oferim servicii complete de decorare florală pentru toate tipurile de evenimente, 
              de la cele mai intime până la cele mai grandiose celebrări.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center mb-6">
                  <div className="mr-4">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-medium text-gray-900">
                    {service.title}
                  </h3>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-rose-400 rounded-full mr-3 flex-shrink-0"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <p className="text-gray-600 mt-6 text-center leading-relaxed">
                  {service.moreInfo}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Portfolio Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
              Portofoliul Nostru
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Descoperiți câteva dintre cele mai frumoase evenimente pe care le-am decorat cu pasiune și creativitate.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {portfolio.map((item, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl mb-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
              Ce Spun Clienții Noștri
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Fiecare eveniment este o poveste de succes. Iată câteva dintre experiențele clienților noștri fericiți.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <IconStar key={i} size={20} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed">
                  {testimonial.text}
                </p>
                <div>
                  <p className="font-medium text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
              Cum Lucrăm
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Procesul nostru simplu și transparent vă ghidează pas cu pas către evenimentul perfect.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Consultația", description: "Discutăm despre viziunea voastră și detaliile evenimentului" },
              { step: "02", title: "Planificarea", description: "Creăm un plan detaliat și vă prezentăm conceptele florale" },
              { step: "03", title: "Confirmarea", description: "Finalizăm detaliile și confirmăm toate aranjamentele" },
              { step: "04", title: "Implementarea", description: "Realizăm și instalăm decorurile în ziua evenimentului" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-rose-600 font-medium text-lg">{item.step}</span>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
            Gata să Începem?
          </h2>
          <p className="text-xl text-gray-600 mb-12 font-light">
            Contactați-ne astăzi pentru o consultație gratuită și să discutăm despre cum putem face evenimentul vostru cu adevărat special.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="flex flex-col items-center">
              <IconPhone size={32} className="text-rose-500 mb-3" />
              <p className="text-gray-900 font-medium">Telefon</p>
              <p className="text-gray-600">0769 141 250</p>
            </div>
            <div className="flex flex-col items-center">
              <IconMail size={32} className="text-rose-500 mb-3" />
              <p className="text-gray-900 font-medium">Email</p>
              <p className="text-gray-600"> laurasimona97@gmail.com </p>
            </div>
            <div className="flex flex-col items-center">
              <IconMapPin size={32} className="text-rose-500 mb-3" />
              <p className="text-gray-900 font-medium">Locație</p>
              <p className="text-gray-600">Tamaseni, Neamt </p>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EventPlanning;