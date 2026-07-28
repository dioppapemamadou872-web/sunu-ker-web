export const API_BASE = 'http://localhost:4000';
export const secteursParDepartement = {
  Dakar: [
    'Plateau', 'Médina', 'Fann', 'Point E', 'Amitié', 'Fass', 'Gueule Tapée', 'Colobane',
    'Grand Dakar', 'Biscuiterie', 'HLM', 'Hann Bel-Air', 'Sicap Liberté', 'Grand Yoff',
    'Patte d\'Oie', 'Parcelles Assainies', 'Cambérène', 'Ngor', 'Ouakam', 'Yoff',
    'Mermoz', 'Sacré-Cœur', 'Dieuppeul', 'Derklé', 'Ouest Foire', 'Liberté 6',
  ],
  Pikine: [
    'Pikine Nord', 'Pikine Est', 'Pikine Ouest', 'Guinaw Rail Nord', 'Guinaw Rail Sud',
    'Thiaroye', 'Yeumbeul Nord', 'Yeumbeul Sud', 'Malika', 'Keur Massar', 'Djiddah Thiaroye Kao',
  ],
  Guédiawaye: [
    'Golf Sud', 'Sam Notaire', 'Ndiarème Limamoulaye', 'Wakhinane Nimzatt', 'Médina Gounass',
  ],
  Rufisque: [
    'Rufisque Nord', 'Rufisque Est', 'Rufisque Ouest', 'Bargny', 'Sangalkam',
    'Diamniadio', 'Sébikotane', 'Yène',
  ],
};

export const secteurs = Object.values(secteursParDepartement).flat();

export const typesLogement = ['Studio', 'Chambre', 'Appartement', 'Maison'];

export const logementsInitiaux = [
  {
    id: 1,
    titre: 'Studio meublé',
    secteur: 'Plateau',
    type: 'Studio',
    prix: 120000,
    chambres: 1,
    salons: 1,
    description: 'Studio lumineux et meublé, proche des commerces et transports.',
    equipements: ['Eau', 'Électricité', 'Sécurité', 'Wifi'],
    telephoneProprietaire: '77 000 00 00',
    statut: 'validee',
  },
  {
    id: 2,
    titre: 'Chambre avec salle de bain',
    secteur: 'Parcelles Assainies',
    type: 'Chambre',
    prix: 60000,
    chambres: 1,
    salons: 0,
    description: 'Chambre indépendante avec salle de bain privative.',
    equipements: ['Eau', 'Électricité'],
    telephoneProprietaire: '77 111 11 11',
    statut: 'validee',
  },
  {
    id: 3,
    titre: 'Appartement 2 pièces',
    secteur: 'Ouakam',
    type: 'Appartement',
    prix: 200000,
    chambres: 2,
    salons: 1,
    description: 'Bel appartement calme avec vue dégagée, proche de la mer.',
    equipements: ['Eau', 'Électricité', 'Parking', 'Sécurité'],
    telephoneProprietaire: '77 222 22 22',
    statut: 'validee',
  },
];