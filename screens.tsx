import React from 'react';
import { Presentation, RentalConfig, Room, Event, League } from './types';
import { EventCard, RoomCard, LeagueCard } from './components';

export const HomeScreen = ({ data, onChangeTab }: { 
  data: { presentation: Presentation; events: Event[]; rooms: Room[] };
  onChangeTab: (tab: string) => void;
}) => (
  <div className="animate-fade-in pb-32">
    {/* Hero */}
    <div className="relative h-[550px] w-full overflow-hidden rounded-b-[3rem] shadow-2xl mb-10 -mt-6">
      <img
        src={data.presentation.heroImage}
        alt="Hero"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/95 via-blue-900/40 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-8 w-full text-white">
        <div className="flex items-center space-x-2 mb-4 opacity-80">
          <span className="h-1 w-10 bg-green-400 rounded-full"></span>
          <span className="text-xs uppercase tracking-widest font-semibold">Bienvenue</span>
        </div>
        <h2 className="text-5xl font-extrabold mb-6 leading-tight max-w-xl">{data.presentation.subtitle}</h2>
        <p className="text-lg text-blue-100 max-w-2xl leading-relaxed mb-8 border-l-4 border-green-400 pl-4">
          {data.presentation.introText}
        </p>
        
        {/* Quick Stats in Hero */}
        <div className="grid grid-cols-3 gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
          {data.presentation.stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <i className={`fa-solid ${stat.icon} text-green-400 text-xl mb-1`}></i>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-[10px] uppercase text-blue-200">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Quick Links */}
    <div className="px-6 grid grid-cols-2 gap-4 mb-8">
      <button onClick={() => onChangeTab('agenda')} className="bg-blue-900 text-white p-6 rounded-2xl shadow-lg shadow-blue-900/20 text-left relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-500">
          <i className="fa-solid fa-calendar-days text-6xl"></i>
        </div>
        <h3 className="text-xl font-bold mb-1">Agenda</h3>
        <p className="text-blue-200 text-sm">Prochains matchs & événements</p>
      </button>
      <button onClick={() => onChangeTab('rooms')} className="bg-white text-blue-900 border border-blue-100 p-6 rounded-2xl shadow-lg shadow-gray-200/50 text-left relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 text-blue-50 opacity-50 group-hover:scale-150 transition-transform duration-500">
          <i className="fa-solid fa-map-location-dot text-6xl"></i>
        </div>
        <h3 className="text-xl font-bold mb-1">Plan & Salles</h3>
        <p className="text-gray-500 text-sm">Se repérer dans le complexe</p>
      </button>
    </div>

    {/* Featured News */}
    <div className="px-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="w-2 h-8 bg-blue-600 rounded-full mr-3"></span>
        Actualités du Parc
      </h3>
      {data.events.slice(0, 2).map(evt => (
        <React.Fragment key={evt.id}>
          <EventCard evt={evt} />
        </React.Fragment>
      ))}
    </div>
  </div>
);

export const AgendaScreen = ({ events }: { events: Event[] }) => (
  <div className="animate-fade-in p-6 pb-32">
    <div className="bg-blue-50 rounded-2xl p-6 mb-8 border border-blue-100">
      <h2 className="text-2xl font-bold text-blue-900 mb-2">Calendrier Sportif</h2>
      <p className="text-gray-600">Retrouvez toutes les compétitions, les matchs du week-end et les événements municipaux.</p>
    </div>
    
    <div className="space-y-2">
      {events.map((evt) => (
        <React.Fragment key={evt.id}>
           <EventCard evt={evt} />
        </React.Fragment>
      ))}
    </div>
  </div>
);

export const SpacesScreen = ({ rooms }: { rooms: Room[] }) => (
  <div className="animate-fade-in p-6 pb-32">
     <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Nos Installations</h2>
        <p className="text-gray-500">Découvrez les équipements du Parc des Sports</p>
     </div>
    <div className="grid grid-cols-2 gap-5">
      {rooms.map((room) => (
        <React.Fragment key={room.id}>
           <RoomCard room={room} />
        </React.Fragment>
      ))}
    </div>
  </div>
);

export const PartnersScreen = ({ leagues }: { leagues: League[] }) => (
  <div className="animate-fade-in p-6 pb-32">
    <div className="mb-6">
       <h2 className="text-2xl font-bold text-gray-900">Clubs Résidents</h2>
       <p className="text-gray-500">Les associations qui font vivre le Parc</p>
    </div>
    <div className="grid grid-cols-1 gap-4">
      {leagues.map((league) => (
        <React.Fragment key={league.id}>
          <LeagueCard league={league} />
        </React.Fragment>
      ))}
    </div>
  </div>
);

export const InfoScreen = ({ config }: { config: RentalConfig }) => (
  <div className="animate-fade-in p-6 pb-32">
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
      <div className="bg-blue-900 p-8 text-center text-white">
        <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center text-blue-900 text-3xl mb-4 shadow-lg">
          <i className="fa-solid fa-headset"></i>
        </div>
        <h2 className="text-2xl font-bold">Informations Pratiques</h2>
        <p className="text-blue-200 mt-2">Nous sommes à votre disposition</p>
      </div>
      
      <div className="p-8 space-y-6">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
             <i className="fa-solid fa-location-dot"></i>
          </div>
          <div>
            <h4 className="font-bold text-gray-900">Adresse</h4>
            <p className="text-gray-600 leading-relaxed">{config.address}</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
             <i className="fa-solid fa-phone"></i>
          </div>
          <div>
            <h4 className="font-bold text-gray-900">Téléphone</h4>
            <p className="text-gray-600 font-mono text-lg">{config.contactPhone}</p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
             <i className="fa-regular fa-clock"></i>
          </div>
          <div>
            <h4 className="font-bold text-gray-900">Horaires d'ouverture</h4>
            <p className="text-gray-600">{config.openingHours}</p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 text-center">
          <p className="text-sm text-gray-500 mb-4 uppercase tracking-wider font-bold">Scanner pour le plan interactif</p>
          <img src={config.qrCodeImage} alt="QR Code" className="w-40 h-40 mx-auto" />
        </div>
      </div>
    </div>
  </div>
);