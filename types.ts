
export interface Presentation {
  id: string;
  heroImage: string;
  title: string;
  subtitle: string;
  introText: string;
  stats: {
    label: string;
    value: string;
    icon: string;
  }[];
  screensaver: string[]; // Added for slideshow support
}

export interface RentalConfig {
  id: string;
  headerText: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  qrCodeImage: string;
  openingHours: string;
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  area: string;
  type: 'Sport' | 'Meeting' | 'Health' | 'Event';
  features: string[];
  description: string;
  image: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: 'Compétition' | 'Loisir' | 'Santé' | 'Institutionnel';
  description: string;
  image: string;
}

export interface League {
  id: string;
  name: string;
  category: 'Résident' | 'Municipal' | 'Partenaire';
  description: string;
  logo: string;
}
