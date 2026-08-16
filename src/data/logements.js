export const API_BASE = 'http://localhost:4000';

export const secteursParDepartement = {
  Dakar: [
    'Almadies',
    'Amitié',
    'Baobab',
    'Biscuiterie',
    'Cambérène',
    'Castors',
    'Cité Keur Gorgui',
    'Colobane',
    'Derklé',
    'Dieuppeul',
    'Fann',
    'Fann Hock',
    'Fass',
    'Grand Dakar',
    'Grand Yoff',
    'Gueule Tapée',
    'Hann Bel-Air',
    'Hann Maristes',
    'HLM',
    'Karack',
    'Liberté',
    'Mamelles',
    'Médina',
    'Mermoz',
    'Ngor',
    'Niary Tally',
    'Nord Foire',
    'Ouakam',
    'Ouest Foire',
    'Parcelles Assainies',
    'Patte d\'Oie',
    'Plateau',
    'Point E',
    'Rebeuss',
    'Sacré-Cœur',
    'Scat Urbam',
    'Soumbédioune',
    'Sud Foire',
    'Virage',
    'Yoff',
    'Zone de Captage'
  ],
  Pikine: [
    'Guinaw Rail',
    'Icotaf',
    'Malika',
    'Mbao',
    'Pikine Est',
    'Pikine Nord',
    'Pikine Ouest',
    'Pikine Sud',
    'Thiaroye',
    'Yeumbeul'
  ],
  Guédiawaye: [
    'Golf Nord',
    'Golf Sud',
    'Médina Gounass',
    'Ndiarème Limamoulaye',
    'Sam Notaire',
    'Wakhinane Nimzatt'
  ],
  'Keur Massar': [
    'Boune',
    'Jaxaay',
    'Keur Massar',
    'Niacoulrab'
  ],
  Rufisque: [
    'Bambilor',
    'Bargny',
    'Diamniadio',
    'Gorée',
    'Rufisque Est',
    'Rufisque Nord',
    'Rufisque Ouest',
    'Sangalkam',
    'Sébikotane',
    'Yène'
  ]
};

export const secteurs = Array.from(
  new Set(Object.values(secteursParDepartement).flat())
).sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }));

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