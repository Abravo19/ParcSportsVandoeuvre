
import React, { useState, useEffect } from 'react';
import { Presentation, RentalConfig, Room, Event, League } from './types';
import { 
  savePresentation, saveEvent, deleteEvent, 
  saveLeague, deleteLeague, saveRoom, deleteRoom,
  getPresentation, getEvents, getLeagues, getRooms 
} from './db';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataUpdate: () => void; // Trigger to reload data in main app
}

const PIN_CODE = "123456"; // Updated to 6 digits

// --- Sub-components for Form Elements ---

const ImageInputWithDrop = ({ 
  currentImage, 
  onChange 
}: { 
  currentImage: string, 
  onChange: (base64: string) => void 
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onChange(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-gray-700">Image / Logo</label>
      <div className="flex gap-4 items-start">
        <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-300 shrink-0">
          {currentImage ? (
            <img src={currentImage} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <i className="fa-solid fa-image text-2xl"></i>
            </div>
          )}
        </div>
        <div className="flex-1 space-y-3">
          {/* URL Input */}
          <input
            type="text"
            placeholder="Coller une URL d'image..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={currentImage}
            onChange={(e) => onChange(e.target.value)}
          />
          <div className="text-center text-xs text-gray-400 font-bold uppercase">OU</div>
          {/* File Upload Button */}
          <label className="flex items-center justify-center w-full p-3 bg-white border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors text-blue-700 font-bold">
            <i className="fa-solid fa-cloud-arrow-up mr-2"></i>
            Choisir un fichier (PC)
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>
        </div>
      </div>
    </div>
  );
};

// --- Main Admin Component ---

export const ContentModal = ({ isOpen, onClose, onDataUpdate }: AdminModalProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [activeTab, setActiveTab] = useState<'presentation' | 'agenda' | 'leagues' | 'rooms'>('agenda');
  const [editingItem, setEditingItem] = useState<any>(null); // Holds the item currently being edited/created
  
  // Local Data State (for list views)
  const [events, setEvents] = useState<Event[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [presentation, setPresentation] = useState<Presentation | null>(null);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadAllData();
    } else if (!isOpen) {
        // Reset state on close
        setPin("");
        setIsAuthenticated(false);
        setEditingItem(null);
    }
  }, [isOpen, isAuthenticated]);

  const loadAllData = async () => {
    const [p, e, l, r] = await Promise.all([
      getPresentation(), getEvents(), getLeagues(), getRooms()
    ]);
    setPresentation(p || null);
    setEvents(e);
    setLeagues(l);
    setRooms(r);
  };

  const handlePinSubmit = () => {
    if (pin === PIN_CODE) {
      setIsAuthenticated(true);
    } else {
      alert("Code PIN incorrect");
      setPin("");
    }
  };

  // --- Generic Save/Delete Handlers ---

  const handleSave = async (data: any) => {
    try {
      if (activeTab === 'agenda') {
        const item = { ...data, id: data.id || `evt-${Date.now()}` };
        await saveEvent(item);
      } else if (activeTab === 'leagues') {
        const item = { ...data, id: data.id || `lg-${Date.now()}` };
        await saveLeague(item);
      } else if (activeTab === 'rooms') {
        await saveRoom(data); // Rooms usually pre-exist, but we can update
      } else if (activeTab === 'presentation') {
        await savePresentation(data);
      }
      
      await loadAllData(); // Refresh local list
      onDataUpdate(); // Refresh main app
      setEditingItem(null); // Close form
    } catch (e) {
      console.error("Error saving", e);
      alert("Erreur lors de l'enregistrement");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) return;
    
    if (activeTab === 'agenda') await deleteEvent(id);
    if (activeTab === 'leagues') await deleteLeague(id);
    if (activeTab === 'rooms') await deleteRoom(id);
    
    await loadAllData();
    onDataUpdate();
  };

  // --- Views ---

  const renderPinScreen = () => (
    <div className="flex flex-col items-center justify-center h-full space-y-8 animate-fade-in">
      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-900 text-3xl">
        <i className="fa-solid fa-lock"></i>
      </div>
      <h2 className="text-2xl font-bold text-gray-800">Accès Administrateur</h2>
      <div className="w-full max-w-xs">
        <input 
          type="password" 
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="w-full text-center text-4xl tracking-[0.5em] p-4 border-2 border-blue-200 rounded-2xl focus:border-blue-600 outline-none font-mono mb-6"
          placeholder="••••••"
          maxLength={6}
        />
        <div className="grid grid-cols-3 gap-4 mb-6">
           {[1,2,3,4,5,6,7,8,9].map(n => (
               <button key={n} onClick={() => setPin(prev => (prev.length < 6 ? prev + n : prev))} className="h-16 rounded-xl bg-gray-100 text-2xl font-bold text-gray-700 active:bg-blue-200">
                   {n}
               </button>
           ))}
           <button onClick={() => setPin("")} className="h-16 rounded-xl bg-red-100 text-red-600 text-xl font-bold flex items-center justify-center"><i className="fa-solid fa-trash"></i></button>
           <button onClick={() => setPin(prev => (prev.length < 6 ? prev + "0" : prev))} className="h-16 rounded-xl bg-gray-100 text-2xl font-bold text-gray-700 active:bg-blue-200">0</button>
           <button onClick={handlePinSubmit} className="h-16 rounded-xl bg-blue-600 text-white text-xl font-bold flex items-center justify-center"><i className="fa-solid fa-arrow-right"></i></button>
        </div>
      </div>
    </div>
  );

  const renderSidebar = () => (
    <div className="w-24 bg-blue-900 flex flex-col items-center py-8 space-y-4 shadow-xl z-20">
      {[
        { id: 'agenda', icon: 'fa-calendar-days', label: 'Agenda' },
        { id: 'leagues', icon: 'fa-users', label: 'Clubs' },
        { id: 'rooms', icon: 'fa-building', label: 'Salles' },
        { id: 'presentation', icon: 'fa-tv', label: 'Écran' },
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => { setActiveTab(tab.id as any); setEditingItem(null); }}
          className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center transition-all ${
            activeTab === tab.id 
            ? 'bg-white text-blue-900 shadow-lg translate-x-2' 
            : 'text-blue-300 hover:bg-blue-800'
          }`}
        >
          <i className={`fa-solid ${tab.icon} text-xl mb-1`}></i>
          <span className="text-[9px] font-bold uppercase">{tab.label}</span>
        </button>
      ))}
      <div className="mt-auto">
        <button onClick={onClose} className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center text-red-300 hover:bg-red-900/50">
          <i className="fa-solid fa-power-off text-2xl"></i>
        </button>
      </div>
    </div>
  );

  const renderForm = () => {
    if (!editingItem) return null;

    // --- Agenda Form ---
    if (activeTab === 'agenda') {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Titre de l'événement</label>
                        <input type="text" className="w-full p-4 border rounded-xl bg-gray-50 text-lg font-semibold" 
                            value={editingItem.title} onChange={e => setEditingItem({...editingItem, title: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Catégorie</label>
                        <select className="w-full p-4 border rounded-xl bg-gray-50 text-lg"
                             value={editingItem.category} onChange={e => setEditingItem({...editingItem, category: e.target.value})}>
                             <option value="Compétition">Compétition</option>
                             <option value="Loisir">Loisir</option>
                             <option value="Santé">Santé</option>
                             <option value="Institutionnel">Institutionnel</option>
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Date</label>
                        {/* Simple text input for date to allow "14 Février" format flexibility, or could use type="date" */}
                        <input type="text" className="w-full p-4 border rounded-xl bg-gray-50 text-lg" 
                            placeholder="ex: 14 Février 2024"
                            value={editingItem.date} onChange={e => setEditingItem({...editingItem, date: e.target.value})} />
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Heure</label>
                        <input type="text" className="w-full p-4 border rounded-xl bg-gray-50 text-lg" 
                             placeholder="ex: 20:00"
                            value={editingItem.time} onChange={e => setEditingItem({...editingItem, time: e.target.value})} />
                     </div>
                </div>
                <div>
                     <label className="block text-sm font-bold text-gray-700 mb-1">Lieu</label>
                     <input type="text" className="w-full p-4 border rounded-xl bg-gray-50 text-lg" 
                        value={editingItem.location} onChange={e => setEditingItem({...editingItem, location: e.target.value})} />
                </div>
                <div>
                     <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                     <textarea className="w-full p-4 border rounded-xl bg-gray-50 text-lg h-32" 
                        value={editingItem.description} onChange={e => setEditingItem({...editingItem, description: e.target.value})} />
                </div>
                <ImageInputWithDrop currentImage={editingItem.image} onChange={(b64) => setEditingItem({...editingItem, image: b64})} />
            </div>
        );
    }

    // --- Leagues Form ---
    if (activeTab === 'leagues') {
        return (
             <div className="space-y-6">
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Nom du Club / Ligue</label>
                    <input type="text" className="w-full p-4 border rounded-xl bg-gray-50 text-lg font-semibold" 
                        value={editingItem.name} onChange={e => setEditingItem({...editingItem, name: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Catégorie</label>
                    <select className="w-full p-4 border rounded-xl bg-gray-50 text-lg"
                            value={editingItem.category} onChange={e => setEditingItem({...editingItem, category: e.target.value})}>
                            <option value="Résident">Résident</option>
                            <option value="Municipal">Municipal</option>
                            <option value="Partenaire">Partenaire</option>
                    </select>
                </div>
                <div>
                     <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                     <textarea className="w-full p-4 border rounded-xl bg-gray-50 text-lg h-32" 
                        value={editingItem.description} onChange={e => setEditingItem({...editingItem, description: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Icône (FontAwesome)</label>
                    <div className="flex items-center space-x-4">
                        <input type="text" className="flex-1 p-4 border rounded-xl bg-gray-50 text-lg" 
                            placeholder="ex: fa-futbol"
                            value={editingItem.logo} onChange={e => setEditingItem({...editingItem, logo: e.target.value})} />
                        <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-2xl text-blue-800">
                             <i className={`fa-solid ${editingItem.logo}`}></i>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Utilisez les noms de classes FontAwesome (ex: fa-basketball, fa-person-swimming)</p>
                </div>
             </div>
        );
    }

    // --- Rooms Form ---
    if (activeTab === 'rooms') {
        return (
            <div className="space-y-6">
                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 text-yellow-800 mb-4">
                    <i className="fa-solid fa-circle-info mr-2"></i>
                    Les modifications de salles sont immédiates.
                </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Nom de la salle</label>
                    <input type="text" className="w-full p-4 border rounded-xl bg-gray-50 text-lg font-semibold" 
                        value={editingItem.name} onChange={e => setEditingItem({...editingItem, name: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-6">
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Capacité</label>
                        <input type="number" className="w-full p-4 border rounded-xl bg-gray-50 text-lg" 
                            value={editingItem.capacity} onChange={e => setEditingItem({...editingItem, capacity: parseInt(e.target.value)})} />
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Surface</label>
                        <input type="text" className="w-full p-4 border rounded-xl bg-gray-50 text-lg" 
                            value={editingItem.area} onChange={e => setEditingItem({...editingItem, area: e.target.value})} />
                     </div>
                </div>
                <div>
                     <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                     <textarea className="w-full p-4 border rounded-xl bg-gray-50 text-lg h-32" 
                        value={editingItem.description} onChange={e => setEditingItem({...editingItem, description: e.target.value})} />
                </div>
                <ImageInputWithDrop currentImage={editingItem.image} onChange={(b64) => setEditingItem({...editingItem, image: b64})} />
            </div>
        );
    }

    // --- Presentation Form ---
    if (activeTab === 'presentation') {
         return (
             <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Titre Principal</label>
                    <input type="text" className="w-full p-4 border rounded-xl bg-gray-50 text-lg font-semibold" 
                        value={editingItem.title} onChange={e => setEditingItem({...editingItem, title: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Sous-titre</label>
                    <input type="text" className="w-full p-4 border rounded-xl bg-gray-50 text-lg" 
                        value={editingItem.subtitle} onChange={e => setEditingItem({...editingItem, subtitle: e.target.value})} />
                </div>
                <div>
                     <label className="block text-sm font-bold text-gray-700 mb-1">Texte d'accueil</label>
                     <textarea className="w-full p-4 border rounded-xl bg-gray-50 text-lg h-40" 
                        value={editingItem.introText} onChange={e => setEditingItem({...editingItem, introText: e.target.value})} />
                </div>
                <ImageInputWithDrop currentImage={editingItem.heroImage} onChange={(b64) => setEditingItem({...editingItem, heroImage: b64})} />
             </div>
         )
    }

    return null;
  };

  const renderContent = () => {
    // If editing or creating, show form
    if (editingItem) {
        return (
            <div className="flex flex-col h-full animate-fade-in">
                <div className="flex items-center justify-between mb-6 pb-4 border-b">
                    <h3 className="text-2xl font-bold text-blue-900">
                        {activeTab === 'presentation' ? 'Éditer la présentation' : (editingItem.id ? 'Modifier' : 'Nouveau')}
                    </h3>
                    <button onClick={() => setEditingItem(null)} className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-bold">
                        Annuler
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto px-2 pb-32">
                    {renderForm()}
                </div>

                {/* Sticky Action Bar */}
                <div className="absolute bottom-0 left-0 w-full bg-white border-t p-6 flex items-center justify-end space-x-4 shadow-[0_-5px_20px_rgba(0,0,0,0.1)]">
                    <button onClick={() => setEditingItem(null)} className="px-8 py-4 rounded-xl text-gray-500 font-bold text-lg">
                        Annuler
                    </button>
                    <button onClick={() => handleSave(editingItem)} className="px-10 py-4 rounded-xl bg-blue-600 text-white font-bold text-lg shadow-lg hover:bg-blue-700 active:scale-95 transition-all flex items-center">
                        <i className="fa-solid fa-floppy-disk mr-3"></i>
                        Enregistrer
                    </button>
                </div>
            </div>
        );
    }

    // LIST VIEWS
    return (
        <div className="h-full flex flex-col animate-fade-in">
             <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-extrabold text-gray-800 capitalize">{activeTab === 'leagues' ? 'Clubs & Ligues' : activeTab}</h2>
                {activeTab !== 'presentation' && (
                    <button 
                        onClick={() => {
                            const template = activeTab === 'agenda' 
                                ? { title: '', date: '', time: '', category: 'Compétition', location: '', description: '', image: '' }
                                : activeTab === 'leagues'
                                ? { name: '', category: 'Résident', description: '', logo: 'fa-user' }
                                : { name: '', capacity: 0, area: '', type: 'Sport', features: [], description: '', image: '' };
                            setEditingItem(template);
                        }}
                        className="bg-green-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-green-600 flex items-center"
                    >
                        <i className="fa-solid fa-plus mr-2"></i> Ajouter
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto pb-10 space-y-4">
                {activeTab === 'presentation' && presentation && (
                     <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 flex items-center justify-between">
                         <div>
                             <h4 className="font-bold text-lg">{presentation.title}</h4>
                             <p className="text-sm text-gray-600">{presentation.subtitle}</p>
                         </div>
                         <button onClick={() => setEditingItem(presentation)} className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-bold">
                             <i className="fa-solid fa-pen mr-2"></i> Éditer
                         </button>
                     </div>
                )}

                {activeTab === 'agenda' && events.map(evt => (
                    <div key={evt.id} className="bg-white p-4 rounded-xl border flex justify-between items-center shadow-sm">
                        <div className="flex items-center space-x-4">
                             <img src={evt.image} className="w-16 h-16 rounded-lg object-cover bg-gray-200" alt="" />
                             <div>
                                 <h4 className="font-bold">{evt.title}</h4>
                                 <div className="text-sm text-gray-500">{evt.date} • {evt.category}</div>
                             </div>
                        </div>
                        <div className="flex space-x-2">
                            <button onClick={() => setEditingItem(evt)} className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center"><i className="fa-solid fa-pen"></i></button>
                            <button onClick={() => handleDelete(evt.id)} className="w-12 h-12 bg-red-50 text-red-600 rounded-lg flex items-center justify-center"><i className="fa-solid fa-trash"></i></button>
                        </div>
                    </div>
                ))}

                {activeTab === 'leagues' && leagues.map(l => (
                    <div key={l.id} className="bg-white p-4 rounded-xl border flex justify-between items-center shadow-sm">
                        <div className="flex items-center space-x-4">
                             <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl text-gray-600">
                                 <i className={`fa-solid ${l.logo}`}></i>
                             </div>
                             <div>
                                 <h4 className="font-bold">{l.name}</h4>
                                 <div className="text-sm text-gray-500">{l.category}</div>
                             </div>
                        </div>
                        <div className="flex space-x-2">
                            <button onClick={() => setEditingItem(l)} className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center"><i className="fa-solid fa-pen"></i></button>
                            <button onClick={() => handleDelete(l.id)} className="w-12 h-12 bg-red-50 text-red-600 rounded-lg flex items-center justify-center"><i className="fa-solid fa-trash"></i></button>
                        </div>
                    </div>
                ))}

                 {activeTab === 'rooms' && rooms.map(r => (
                    <div key={r.id} className="bg-white p-4 rounded-xl border flex justify-between items-center shadow-sm">
                        <div className="flex items-center space-x-4">
                             <img src={r.image} className="w-16 h-16 rounded-lg object-cover bg-gray-200" alt="" />
                             <div>
                                 <h4 className="font-bold">{r.name}</h4>
                                 <div className="text-sm text-gray-500">{r.type} • {r.capacity} pers</div>
                             </div>
                        </div>
                        <div className="flex space-x-2">
                            <button onClick={() => setEditingItem(r)} className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center"><i className="fa-solid fa-pen"></i></button>
                            <button onClick={() => handleDelete(r.id)} className="w-12 h-12 bg-red-50 text-red-600 rounded-lg flex items-center justify-center"><i className="fa-solid fa-trash"></i></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-10">
      <div className="w-full max-w-6xl h-full max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-row">
        
        {/* If not authenticated, show PIN screen only */}
        {!isAuthenticated ? (
             <div className="w-full h-full relative">
                 <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"><i className="fa-solid fa-xmark text-3xl"></i></button>
                 {renderPinScreen()}
             </div>
        ) : (
            <>
                {renderSidebar()}
                <div className="flex-1 p-8 relative overflow-hidden bg-gray-50">
                    {renderContent()}
                </div>
            </>
        )}
      </div>
    </div>
  );
};
