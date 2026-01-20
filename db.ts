
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Presentation, RentalConfig, Room, Event, League } from './types';
import { IMAGES } from './assets';

interface ParcSportsDB extends DBSchema {
  presentation: { key: string; value: Presentation };
  config: { key: string; value: RentalConfig };
  rooms: { key: string; value: Room };
  events: { key: string; value: Event };
  leagues: { key: string; value: League };
}

// --- Initial Data ---

const INITIAL_PRESENTATION: Presentation = {
  id: 'main',
  heroImage: IMAGES.presentation.hero, 
  title: 'Parc des Sports de Vandœuvre',
  subtitle: 'Complexe Sportif Municipal & Espaces de Vie',
  introText:
    "Bienvenue au cœur du sport nancéien. Sur plus de 22 hectares, le Parc des Sports de Vandœuvre offre des infrastructures d'excellence pour la compétition de haut niveau, la pratique scolaire et le sport-loisir. Un lieu de performance et de convivialité ouvert à tous.",
  stats: [
    { label: 'Surface', value: '22 Ha', icon: 'fa-map' },
    { label: 'Associations', value: '30+', icon: 'fa-users' },
    { label: 'Public/An', value: '150k', icon: 'fa-trophy' },
  ],
  screensaver: IMAGES.presentation.screensaver
};

const INITIAL_RENTAL_CONFIG: RentalConfig = {
  id: 'main',
  headerText: 'Service des Sports - Mairie de Vandœuvre',
  contactEmail: 'sports@vandoeuvre.fr',
  contactPhone: '03 83 51 80 00',
  address: 'Rue de Gembloux, 54500 Vandœuvre-lès-Nancy',
  qrCodeImage: IMAGES.config.qrCode,
  openingHours: 'Lun-Dim : 08h00 - 22h30',
};

const INITIAL_ROOMS: Room[] = [
  {
    id: 'r1',
    name: 'Halle des Sports',
    capacity: 1500,
    area: '2000m²',
    type: 'Sport',
    features: ['Parquet Compétition', 'Tribunes', 'Sono HD', 'Éclairage LED'],
    description: 'La grande salle multisports, hôte des matchs du VNVB et des grandes compétitions régionales.',
    image: IMAGES.rooms.halle,
  },
  {
    id: 'r2',
    name: 'Stade et Piste d\'Athlétisme',
    capacity: 2500,
    area: 'Extérieur',
    type: 'Sport',
    features: ['Piste 8 couloirs', 'Saut', 'Lancer', 'Tribune couverte'],
    description: 'Piste synthétique homologuée et terrain d\'honneur engazonné pour l\'athlétisme et le football.',
    image: IMAGES.rooms.stade,
  },
  {
    id: 'r3',
    name: 'Dojo Municipal',
    capacity: 100,
    area: '400m²',
    type: 'Sport',
    features: ['4 Surfaces de combat', 'Protection murale', 'Vestiaires dédiés'],
    description: 'Un espace dédié aux arts martiaux (Judo, Karaté, Aïkido) avec tatamis de haute qualité.',
    image: IMAGES.rooms.dojo,
  },
  {
    id: 'r4',
    name: 'Salle de Réunion "Olympie"',
    capacity: 40,
    area: '50m²',
    type: 'Meeting',
    features: ['Projection', 'Wifi', 'Vue panoramique'],
    description: 'Espace de travail pour les comités directeurs des clubs et les formations fédérales.',
    image: IMAGES.rooms.meeting,
  },
  {
    id: 'r5',
    name: 'Club House & Réception',
    capacity: 80,
    area: '120m²',
    type: 'Event',
    features: ['Bar', 'Cuisine équipée', 'Terrasse', 'Espace détente'],
    description: 'Lieu de convivialité pour les après-matchs et les assemblées générales.',
    image: IMAGES.rooms.clubHouse,
  },
  {
    id: 'r6',
    name: 'Box de Cross-Training',
    capacity: 15,
    area: 'Exterieur',
    type: 'Health',
    features: ['Barres traction', 'Poids libres', 'Sol amortissant'],
    description: 'Zone de préparation physique en accès libre pour le renforcement musculaire.',
    image: IMAGES.rooms.crossfit,
  },
];

const INITIAL_AGENDA: Event[] = [
  {
    id: 'e1',
    title: 'Match VNVB vs Mulhouse',
    date: '14 Février 2026',
    time: '20:00',
    location: 'Halle des Sports',
    category: 'Compétition',
    description: 'Championnat de France de Volley-Ball Féminin. Venez soutenir les panthères !',
    image: IMAGES.events.volley,
  },
  {
    id: 'e2',
    title: 'Meeting Athlé "Stanislas"',
    date: '28 Février 2026',
    time: '09:00 - 18:00',
    location: 'Stade d\'Honneur',
    category: 'Compétition',
    description: 'Grand meeting régional qualificatif pour les championnats de France.',
    image: IMAGES.events.athletics,
  },
  {
    id: 'e3',
    title: 'Forum des Sports',
    date: '05 Septembre 2026',
    time: '10:00 - 17:00',
    location: 'Parc des Sports (Extérieur)',
    category: 'Institutionnel',
    description: 'Découvrez toutes les associations sportives de Vandœuvre et inscrivez-vous.',
    image: IMAGES.events.forum,
  },
  {
    id: 'e4',
    title: 'Parcours du Cœur',
    date: '02 Avril 2026',
    time: '08:00 - 12:00',
    location: 'Départ Club House',
    category: 'Santé',
    description: 'Marche et course solidaire pour la prévention des maladies cardiovasculaires.',
    image: IMAGES.events.health,
  },
];

const INITIAL_LEAGUES: League[] = [
  { id: 'l1', name: 'Vandœuvre Nancy Volley-Ball (VNVB)', category: 'Résident', description: 'Volley-ball professionnel féminin.', logo: 'fa-volleyball' },
  { id: 'l2', name: 'US Vandœuvre Football', category: 'Résident', description: 'Formation et compétition de football.', logo: 'fa-futbol' },
  { id: 'l3', name: 'Vandœuvre Athlétisme', category: 'Résident', description: 'Athlétisme sur piste et running.', logo: 'fa-person-running' },
  { id: 'l4', name: 'Service des Sports', category: 'Municipal', description: 'Gestion des équipements municipaux.', logo: 'fa-building-columns' },
  { id: 'l5', name: 'Judo Club Vandœuvre', category: 'Résident', description: 'École de Judo et Ju-jitsu.', logo: 'fa-hand-fist' },
  { id: 'l6', name: 'Handball Club', category: 'Résident', description: 'Pratique du handball en compétition.', logo: 'fa-hands-holding-circle' },
];

// --- Database Logic ---

const DB_NAME = 'ParcSportsVandoeuvreDB';

export const initDB = async (): Promise<IDBPDatabase<ParcSportsDB>> => {
  return openDB<ParcSportsDB>(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('presentation')) db.createObjectStore('presentation', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('config')) db.createObjectStore('config', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('rooms')) db.createObjectStore('rooms', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('events')) db.createObjectStore('events', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('leagues')) db.createObjectStore('leagues', { keyPath: 'id' });
    },
  });
};

export const seedDatabase = async () => {
  const db = await initDB();
  // We overwrite presentation to ensure title updates in this demo
  await db.put('presentation', INITIAL_PRESENTATION);
  await db.put('config', INITIAL_RENTAL_CONFIG);

  const rooms = await db.getAll('rooms');
  if (rooms.length === 0) {
    const tx = db.transaction('rooms', 'readwrite');
    await Promise.all(INITIAL_ROOMS.map((room) => tx.store.put(room)));
    await tx.done;
  }
  const events = await db.getAll('events');
  if (events.length === 0) {
    const tx = db.transaction('events', 'readwrite');
    await Promise.all(INITIAL_AGENDA.map((evt) => tx.store.put(evt)));
    await tx.done;
  }
  const leagues = await db.getAll('leagues');
  if (leagues.length === 0) {
    const tx = db.transaction('leagues', 'readwrite');
    await Promise.all(INITIAL_LEAGUES.map((l) => tx.store.put(l)));
    await tx.done;
  }
};

// READ
export const getPresentation = async () => (await initDB()).get('presentation', 'main');
export const getRentalConfig = async () => (await initDB()).get('config', 'main');
export const getRooms = async () => (await initDB()).getAll('rooms');
export const getEvents = async () => (await initDB()).getAll('events');
export const getLeagues = async () => (await initDB()).getAll('leagues');

// WRITE (CRUD)
export const savePresentation = async (data: Presentation) => (await initDB()).put('presentation', data);
export const saveConfig = async (data: RentalConfig) => (await initDB()).put('config', data);

export const saveEvent = async (event: Event) => (await initDB()).put('events', event);
export const deleteEvent = async (id: string) => (await initDB()).delete('events', id);

export const saveLeague = async (league: League) => (await initDB()).put('leagues', league);
export const deleteLeague = async (id: string) => (await initDB()).delete('leagues', id);

export const saveRoom = async (room: Room) => (await initDB()).put('rooms', room);
export const deleteRoom = async (id: string) => (await initDB()).delete('rooms', id);
