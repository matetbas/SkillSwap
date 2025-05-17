export interface User {
  id: string;
  pseudo: string;
  email?: string;
  avatar: string;
  role: 'demandeur' | 'prestataire';
  credit_dispo: number;
  historique: string[]; // References to Services and Transactions
}

export interface Service {
  id: string;
  owner: User | string; // User object or User ID
  titre: string;
  description: string;
  prix: number;
  duree_estimee: string; // Format: "hh:mm"
  categorie: string;
  latitude: number;
  longitude: number;
  etat: 'ouvert' | 'réservé' | 'terminé';
  created_at?: Date;
}

export interface Message {
  id: string;
  thread_id: string;
  sender: User | string; // User object or User ID
  texte: string;
  horodate: Date;
}

export interface Transaction {
  id: string;
  service: Service | string; // Service object or Service ID
  demandeur: User | string; // User object or User ID
  prestataire: User | string; // User object or User ID
  montant_total: number;
  commission_app: number;
  montant_net_prestataire: number;
  status: 'en_attente' | 'payé' | 'reversé';
  created_at: Date;
}

export interface Thread {
  id: string;
  participants: string[]; // User IDs
  lastMessage?: Message;
  service: string; // Service ID
  created_at: Date;
}

export type Categories = 
  | 'Informatique'
  | 'Bricolage'
  | 'Ménage'
  | 'Jardinage'
  | 'Coursier'
  | 'Cuisine'
  | 'Cours particuliers'
  | 'Autre';

export const CATEGORIES: Categories[] = [
  'Informatique',
  'Bricolage',
  'Ménage',
  'Jardinage',
  'Coursier',
  'Cuisine',
  'Cours particuliers',
  'Autre'
];