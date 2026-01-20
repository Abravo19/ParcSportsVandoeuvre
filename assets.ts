
// This file acts as a central registry for all application images.
// To use local images later:
// 1. Create a 'public/images' folder in your project root.
// 2. Add your image files there.
// 3. Update the paths below (e.g., hero: '/images/my-stadium.jpg').

export const IMAGES = {
  presentation: {
    hero: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop',
    screensaver: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&fit=crop&h=1920&w=1080', // Stadium
      'https://images.unsplash.com/photo-1449356669056-f1c1e6e56b0f?q=80&fit=crop&h=1920&w=1080', // Running Nature
      'https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&fit=crop&h=1920&w=1080', // Swimming
      'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&fit=crop&h=1920&w=1080'  // Yoga
    ]
  },
  config: {
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://www.vandoeuvre.fr/culture-sport-loisirs/annuaire-des-clubs-sportifs/'
  },
  rooms: {
    halle: 'https://images.unsplash.com/photo-1546519638-68e109498ee3?q=80&w=800&auto=format&fit=crop',
    stade: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
    dojo: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=800&auto=format&fit=crop',
    meeting: 'https://images.unsplash.com/photo-1517502886367-e6f63772d601?q=80&w=800&auto=format&fit=crop',
    clubHouse: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=800&auto=format&fit=crop',
    crossfit: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=800&auto=format&fit=crop',
  },
  events: {
    volley: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=800&auto=format&fit=crop',
    athletics: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800&auto=format&fit=crop',
    forum: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=800&auto=format&fit=crop',
    health: 'https://images.unsplash.com/photo-1486218119243-13883505764c?q=80&w=800&auto=format&fit=crop',
  }
};
