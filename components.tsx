
import React, { useState, useEffect } from 'react';
import { Room, Event, League } from './types';

// --- Header ---
export const Header = ({ title, onAdminClick }: { title: string, onAdminClick?: () => void }) => (
  <header className="bg-white/95 backdrop-blur-md shadow-lg py-5 px-8 flex justify-between items-center z-40 sticky top-0 border-b border-blue-900/10">
    <div className="flex items-center space-x-5">
      {/* Mocking the city logo style */}
      <div className="w-14 h-14 bg-blue-900 rounded-lg flex items-center justify-center text-white text-2xl shadow-md border-2 border-white relative group">
        <i className="fa-solid fa-building-columns"></i>
        {/* Hidden Admin Trigger */}
        {onAdminClick && (
            <button 
                onClick={onAdminClick}
                className="absolute inset-0 w-full h-full opacity-0 hover:opacity-10 bg-white/20 rounded-lg cursor-default"
                title="Admin"
            ></button>
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Ville de Vandœuvre</span>
        <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight leading-none">{title}</h1>
      </div>
    </div>
    <div className="flex flex-col items-end text-sm font-medium text-gray-500 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100" onClick={onAdminClick}>
      <div className="flex items-center text-blue-900 font-bold">
        <i className="fa-regular fa-clock mr-2"></i>
        <span>08:00 - 22:30</span>
      </div>
      <span className="text-xs">Ouvert aujourd'hui</span>
    </div>
  </header>
);

// --- Navigation ---
export const Navigation = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => {
  const tabs = [
    { id: 'home', label: 'Accueil', icon: 'fa-house' },
    { id: 'agenda', label: 'Agenda', icon: 'fa-calendar-days' },
    { id: 'rooms', label: 'Infrastructures', icon: 'fa-layer-group' },
    { id: 'leagues', label: 'Clubs', icon: 'fa-users-line' },
    { id: 'info', label: 'Infos', icon: 'fa-circle-info' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 pb-8 pt-4 px-6 z-50 shadow-[0_-5px_25px_rgba(0,0,0,0.15)]">
      <div className="flex justify-around items-center max-w-4xl mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center space-y-2 p-3 rounded-2xl transition-all duration-300 w-24 h-20 ${
              activeTab === tab.id
                ? 'bg-blue-900 text-white transform -translate-y-4 shadow-xl shadow-blue-900/30'
                : 'text-gray-400 hover:text-blue-800 hover:bg-blue-50'
            }`}
          >
            <i className={`fa-solid ${tab.icon} text-2xl`}></i>
            <span className="text-[10px] font-bold uppercase tracking-wide">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

// --- Screensaver ---
export const Screensaver = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 6000); // Rotate every 6 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="fixed inset-0 z-[100] bg-black cursor-none animate-fade-in">
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={img}
            alt={`Screensaver ${index}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-transparent to-blue-900/20"></div>
        </div>
      ))}
      
      {/* Overlay content */}
      <div className="absolute bottom-20 left-0 w-full text-center text-white z-10 p-10">
        <h1 className="text-6xl font-extrabold mb-4 drop-shadow-lg">Parc des Sports</h1>
        <p className="text-2xl font-light opacity-90 mb-12 tracking-wide">Vandœuvre-lès-Nancy</p>
        
        <div className="inline-flex items-center bg-white/20 backdrop-blur-md border border-white/30 px-8 py-4 rounded-full animate-bounce">
          <i className="fa-solid fa-hand-pointer text-2xl mr-4"></i>
          <span className="text-lg font-bold uppercase tracking-widest">Touchez l'écran pour commencer</span>
        </div>
      </div>
    </div>
  );
};

// --- Cards ---
export const EventCard = ({ evt }: { evt: Event }) => (
  <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex h-36 border border-gray-100 mb-4">
    <div className="w-36 h-full relative shrink-0">
      <img src={evt.image} alt={evt.title} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
      <div className="absolute bottom-2 left-2 text-white">
        <span className="block text-2xl font-bold leading-none">{evt.date.split(' ')[0]}</span>
        <span className="block text-xs uppercase font-medium opacity-90">{evt.date.split(' ')[1]}</span>
      </div>
    </div>
    <div className="p-4 flex-1 flex flex-col justify-center">
      <div className="flex justify-between items-start mb-1">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
          evt.category === 'Compétition' ? 'bg-red-100 text-red-700' :
          evt.category === 'Santé' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
        }`}>
          {evt.category}
        </span>
        <span className="text-xs text-gray-400 font-mono">{evt.time}</span>
      </div>
      <h4 className="text-lg font-bold text-gray-800 leading-tight mb-1 line-clamp-1">{evt.title}</h4>
      <p className="text-xs text-gray-500 line-clamp-2 mb-2">{evt.description}</p>
      <div className="flex items-center text-xs text-blue-800 font-medium">
        <i className="fa-solid fa-location-arrow mr-1.5"></i> {evt.location}
      </div>
    </div>
  </div>
);

export const RoomCard = ({ room }: { room: Room }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group h-full flex flex-col">
    <div className="h-48 overflow-hidden relative">
      <img src={room.image} alt={room.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-blue-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
        {room.type}
      </div>
    </div>
    <div className="p-5 flex-1 flex flex-col">
      <h3 className="text-lg font-bold text-gray-900 mb-1">{room.name}</h3>
      <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
        <span className="flex items-center"><i className="fa-solid fa-ruler-combined mr-1"></i> {room.area}</span>
        <span className="flex items-center"><i className="fa-solid fa-users mr-1"></i> Max {room.capacity}</span>
      </div>
      <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">{room.description}</p>
      <button className="w-full py-2.5 bg-gray-50 hover:bg-blue-50 text-blue-900 font-semibold rounded-lg text-sm transition-colors border border-gray-200">
        Voir les disponibilités
      </button>
    </div>
  </div>
);

export const LeagueCard = ({ league }: { league: League }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 hover:border-blue-300 transition-colors">
    <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center text-blue-700 text-2xl shrink-0">
      <i className={`fa-solid ${league.logo}`}></i>
    </div>
    <div>
      <h4 className="font-bold text-gray-900 text-sm">{league.name}</h4>
      <span className="inline-block text-[10px] font-bold text-gray-400 uppercase mt-0.5">{league.category}</span>
    </div>
  </div>
);
