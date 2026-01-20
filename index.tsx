
import React, { useEffect, useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import {
  seedDatabase,
  getPresentation,
  getRentalConfig,
  getRooms,
  getEvents,
  getLeagues
} from './db';
import { Presentation, RentalConfig, Room, Event, League } from './types';
import { Header, Navigation, Screensaver } from './components';
import { HomeScreen, AgendaScreen, SpacesScreen, PartnersScreen, InfoScreen } from './screens';
import { ContentModal } from './ContentModal';

const INACTIVITY_TIMEOUT_MS = 60000; // 60 seconds

const App = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [isIdle, setIsIdle] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false); // Admin modal state
  const idleTimerRef = useRef<number | null>(null);

  const [data, setData] = useState<{
    presentation?: Presentation;
    config?: RentalConfig;
    rooms: Room[];
    events: Event[];
    leagues: League[];
  }>({ rooms: [], events: [], leagues: [] });

  // Idle Timer Logic
  const resetIdleTimer = () => {
    setIsIdle(false);
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    // Only start idle timer if admin is NOT open
    if (!showAdmin) {
        idleTimerRef.current = setTimeout(() => {
        setIsIdle(true);
        }, INACTIVITY_TIMEOUT_MS);
    }
  };

  useEffect(() => {
    resetIdleTimer();

    const activityEvents = ['mousedown', 'mousemove', 'touchstart', 'scroll', 'click', 'keypress'];
    const handleActivity = () => resetIdleTimer();

    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [showAdmin]); // Dependency on showAdmin to prevent screensaver while editing

  const loadData = async () => {
    try {
      await seedDatabase();
      const [presentation, config, rooms, events, leagues] = await Promise.all([
        getPresentation(),
        getRentalConfig(),
        getRooms(),
        getEvents(),
        getLeagues()
      ]);
      
      setData({ presentation, config, rooms, events, leagues });
    } catch (e) {
      console.error("Failed to load DB", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading || !data.presentation || !data.config) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-950 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background visual elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
             <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[100px]"></div>
             <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-400/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="z-10 flex flex-col items-center animate-fade-in">
           {/* Logo Animation */}
           <div className="relative mb-10">
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
              <div className="w-28 h-28 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl flex items-center justify-center shadow-2xl">
                 <div className="text-white text-5xl drop-shadow-lg">
                    <i className="fa-solid fa-building-columns"></i>
                 </div>
              </div>
           </div>

           {/* Typography */}
           <div className="text-center mb-12 space-y-2">
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Parc des Sports</h1>
              <p className="text-blue-300 font-medium tracking-[0.2em] text-sm uppercase">Vandœuvre-lès-Nancy</p>
           </div>

           {/* Progress Indicator */}
           <div className="w-64 h-1 bg-blue-900/50 rounded-full overflow-hidden relative">
              <div className="absolute top-0 left-0 h-full w-1/3 bg-white rounded-full" style={{ animation: 'loading 1.5s ease-in-out infinite' }}></div>
           </div>
        </div>
        
        {/* Inject CSS for custom loading animation */}
        <style>{`
          @keyframes loading {
            0% { left: -35%; }
            100% { left: 100%; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans selection:bg-blue-100 pb-10">
      
      {/* Screensaver Overlay */}
      {isIdle && !showAdmin && data.presentation.screensaver && data.presentation.screensaver.length > 0 && (
        <Screensaver images={data.presentation.screensaver} />
      )}

      {/* Admin Modal */}
      <ContentModal 
        isOpen={showAdmin} 
        onClose={() => setShowAdmin(false)} 
        onDataUpdate={loadData}
      />

      <Header title={data.presentation.title} onAdminClick={() => setShowAdmin(true)} />

      <main className="max-w-4xl mx-auto">
        {activeTab === 'home' && (
          <HomeScreen 
            data={data as any} 
            onChangeTab={setActiveTab} 
          />
        )}
        
        {activeTab === 'agenda' && (
          <AgendaScreen events={data.events} />
        )}

        {activeTab === 'rooms' && (
          <SpacesScreen rooms={data.rooms} />
        )}

        {activeTab === 'leagues' && (
          <PartnersScreen leagues={data.leagues} />
        )}

        {activeTab === 'info' && (
          <InfoScreen config={data.config} />
        )}
      </main>

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-gray-50">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-green-50/50 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
