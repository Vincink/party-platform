export interface QuizQuestion {
  question: string
  options: {
    A: string
    B: string
    C: string
    D: string
  }
  correct: 'A' | 'B' | 'C' | 'D'
}

export const QUESTIONS: QuizQuestion[] = [
  {
    question: 'Quelle est la capitale de la Belgique ?',
    options: { A: 'Anvers', B: 'Bruxelles', C: 'Liège', D: 'Gand' },
    correct: 'B',
  },
  {
    question: 'Quel est le plus grand océan de la planète ?',
    options: { A: 'Océan Pacifique', B: 'Océan Atlantique', C: 'Océan Indien', D: 'Océan Arctique' },
    correct: 'A',
  },
  {
    question: 'Quel fleuve traverse la ville de Paris ?',
    options: { A: 'La Loire', B: 'Le Rhône', C: 'La Seine', D: 'La Garonne' },
    correct: 'C',
  },
  {
    question: 'Quel pays possède la plus grande superficie au monde ?',
    options: { A: 'Canada', B: 'Chine', C: 'États-Unis', D: 'Russie' },
    correct: 'D',
  },
  {
    question: 'Quelle est la capitale du Japon ?',
    options: { A: 'Osaka', B: 'Tokyo', C: 'Kyoto', D: 'Sapporo' },
    correct: 'B',
  },
  {
    question: 'Quel détroit sépare l’Europe de l’Afrique ?',
    options: { A: 'Détroit de Gibraltar', B: 'Détroit de Béring', C: 'Détroit d’Ormuz', D: 'Détroit de Malacca' },
    correct: 'A',
  },
  {
    question: 'Quel est le plus haut sommet du monde au-dessus du niveau de la mer ?',
    options: { A: 'Le K2', B: 'Le Kilimandjaro', C: 'L’Everest', D: 'Le mont Blanc' },
    correct: 'C',
  },
  {
    question: 'Quel pays compte le plus de fuseaux horaires (avec ses territoires d’outre-mer) ?',
    options: { A: 'États-Unis', B: 'Russie', C: 'Royaume-Uni', D: 'France' },
    correct: 'D',
  },
  {
    question: 'Quel est le plus grand désert chaud du monde ?',
    options: { A: 'Gobi', B: 'Sahara', C: 'Kalahari', D: 'Atacama' },
    correct: 'B',
  },
  {
    question: 'Quelle est la capitale de l’Australie ?',
    options: { A: 'Sydney', B: 'Melbourne', C: 'Canberra', D: 'Perth' },
    correct: 'C',
  },
  {
    question: 'Quelle mer intérieure est réputée pour sa très forte salinité ?',
    options: { A: 'La mer Morte', B: 'La mer Noire', C: 'La mer Baltique', D: 'La mer Rouge' },
    correct: 'A',
  },
  {
    question: 'Quel est le fleuve le plus long d’Afrique ?',
    options: { A: 'Le Niger', B: 'Le Zambèze', C: 'Le Congo', D: 'Le Nil' },
    correct: 'D',
  },
  {
    question: 'Quelle chaîne de montagnes longe la côte ouest de l’Amérique du Sud ?',
    options: { A: 'Les Rocheuses', B: 'La cordillère des Andes', C: 'Les Carpates', D: 'L’Atlas' },
    correct: 'B',
  },
  {
    question: 'Quelle est la capitale du Canada ?',
    options: { A: 'Toronto', B: 'Montréal', C: 'Ottawa', D: 'Vancouver' },
    correct: 'C',
  },
  {
    question: 'Dans quel pays le tango est-il né à la fin du XIXe siècle ?',
    options: { A: 'Argentine', B: 'Espagne', C: 'Mexique', D: 'Colombie' },
    correct: 'A',
  },
  {
    question: 'Quelle est la plus grande île du monde (hors continents) ?',
    options: { A: 'Madagascar', B: 'Bornéo', C: 'Grande-Bretagne', D: 'Groenland' },
    correct: 'D',
  },
  {
    question: 'Quelle est la capitale du Brésil ?',
    options: { A: 'Rio de Janeiro', B: 'Brasilia', C: 'São Paulo', D: 'Salvador' },
    correct: 'B',
  },
  {
    question: 'Quel est le lac le plus profond du monde ?',
    options: { A: 'Lac Victoria', B: 'Lac Supérieur', C: 'Lac Baïkal', D: 'Lac Tanganyika' },
    correct: 'C',
  },
  {
    question: 'Quel pays scandinave borde à la fois la mer du Nord et la mer Baltique ?',
    options: { A: 'Danemark', B: 'Norvège', C: 'Finlande', D: 'Islande' },
    correct: 'A',
  },
  {
    question: 'Quelle ville italienne est surnommée la Sérénissime ?',
    options: { A: 'Florence', B: 'Naples', C: 'Milan', D: 'Venise' },
    correct: 'D',
  },
  {
    question: 'En quelle année le mur de Berlin est-il tombé ?',
    options: { A: '1987', B: '1989', C: '1991', D: '1993' },
    correct: 'B',
  },
  {
    question: 'Qui fut le premier être humain à poser le pied sur la Lune en 1969 ?',
    options: { A: 'Buzz Aldrin', B: 'Youri Gagarine', C: 'Neil Armstrong', D: 'Michael Collins' },
    correct: 'C',
  },
  {
    question: 'En quelle année Christophe Colomb a-t-il atteint les Amériques ?',
    options: { A: '1492', B: '1498', C: '1502', D: '1519' },
    correct: 'A',
  },
  {
    question: 'Qui a peint La Joconde ?',
    options: { A: 'Michel-Ange', B: 'Raphaël', C: 'Caravage', D: 'Léonard de Vinci' },
    correct: 'D',
  },
  {
    question: 'Quel pharaon égyptien est célèbre pour son masque funéraire en or ?',
    options: { A: 'Ramsès II', B: 'Toutânkhamon', C: 'Akhenaton', D: 'Khéops' },
    correct: 'B',
  },
  {
    question: 'En quelle année a débuté la Première Guerre mondiale ?',
    options: { A: '1912', B: '1913', C: '1914', D: '1918' },
    correct: 'C',
  },
  {
    question: 'Qui a développé l’imprimerie à caractères mobiles en Europe au XVe siècle ?',
    options: { A: 'Johannes Gutenberg', B: ' Léonard de Vinci', C: 'Galilée', D: 'Érasme' },
    correct: 'A',
  },
  {
    question: 'Quelle civilisation précolombienne a bâti le Machu Picchu ?',
    options: { A: 'Mayas', B: 'Aztèques', C: 'Olmèques', D: 'Incas' },
    correct: 'D',
  },
  {
    question: 'Qui a été sacré empereur des Français en 1804 ?',
    options: { A: 'Louis XVI', B: 'Napoléon Ier', C: 'Charles X', D: 'Napoléon III' },
    correct: 'B',
  },
  {
    question: 'Lors de quelle bataille Napoléon Ier a-t-il subi sa défaite définitive en 1815 ?',
    options: { A: 'Austerlitz', B: 'Iéna', C: 'Waterloo', D: 'Leipzig' },
    correct: 'C',
  },
  {
    question: 'Quel célèbre amphithéâtre de Rome accueillait des combats de gladiateurs ?',
    options: { A: 'Le Colisée', B: 'Le Panthéon', C: 'Le Cirque Maxime', D: 'Le forum Romain' },
    correct: 'A',
  },
  {
    question: 'Qui fut la première femme à recevoir un prix Nobel ?',
    options: { A: 'Rosalind Franklin', B: 'Ada Lovelace', C: 'Simone Veil', D: 'Marie Curie' },
    correct: 'D',
  },
  {
    question: 'En quelle année les États-Unis ont-ils proclamé leur déclaration d’indépendance ?',
    options: { A: '1774', B: '1776', C: '1783', D: '1789' },
    correct: 'B',
  },
  {
    question: 'Quel était l’ancien nom de la ville d’Istanbul ?',
    options: { A: 'Athènes', B: 'Smyrne', C: 'Constantinople', D: 'Éphèse' },
    correct: 'C',
  },
  {
    question: 'Quel roi de France était surnommé le Roi-Soleil ?',
    options: { A: 'Louis XIV', B: 'Louis XV', C: 'Louis XVI', D: 'Henri IV' },
    correct: 'A',
  },
  {
    question: 'Quelle période de la préhistoire est marquée par la sédentarisation et l’agriculture ?',
    options: { A: 'Paléolithique', B: 'Mésolithique', C: 'Âge du bronze', D: 'Néolithique' },
    correct: 'D',
  },
  {
    question: 'Quel mur romain traverse le nord de l’Angleterre ?',
    options: { A: 'Mur de Berlin', B: 'Mur d’Hadrien', C: 'Mur d’Anvers', D: 'Mur de Trajan' },
    correct: 'B',
  },
  {
    question: 'Qui fut le premier président des États-Unis ?',
    options: { A: 'Thomas Jefferson', B: 'John Adams', C: 'George Washington', D: 'Abraham Lincoln' },
    correct: 'C',
  },
  {
    question: 'Quelle était la langue officielle de l’Empire romain ?',
    options: { A: 'Le latin', B: 'Le grec ancien', C: 'L’étrusque', D: 'L’araméen' },
    correct: 'A',
  },
  {
    question: 'En quelle année a eu lieu la révolution d’Octobre en Russie ?',
    options: { A: '1905', B: '1914', C: '1915', D: '1917' },
    correct: 'D',
  },
  {
    question: 'Quel est le symbole chimique de l’or dans le tableau périodique ?',
    options: { A: 'Ag', B: 'Au', C: 'Or', D: 'Fe' },
    correct: 'B',
  },
  {
    question: 'Quelle planète est la plus proche du Soleil ?',
    options: { A: 'Vénus', B: 'Mars', C: 'Mercure', D: 'Terre' },
    correct: 'C',
  },
  {
    question: 'Quel gaz représente environ 78 % de l’atmosphère terrestre ?',
    options: { A: 'Le diazote', B: 'Le dioxygène', C: 'Le dioxyde de carbone', D: 'L’argon' },
    correct: 'A',
  },
  {
    question: 'Quel organe assure la circulation du sang dans tout le corps humain ?',
    options: { A: 'Le poumon', B: 'Le foie', C: 'Le rein', D: 'Le cœur' },
    correct: 'D',
  },
  {
    question: 'Quelle est la formule chimique de l’eau ?',
    options: { A: 'CO2', B: 'H2O', C: 'O2', D: 'NaCl' },
    correct: 'B',
  },
  {
    question: 'Quel est l’animal terrestre le plus rapide en course ?',
    options: { A: 'Le lion', B: 'Le lévrier', C: 'Le guépard', D: 'L’antilope' },
    correct: 'C',
  },
  {
    question: 'Quel métal est liquide à température ambiante ?',
    options: { A: 'Le mercure', B: 'Le zinc', C: 'Le cuivre', D: 'L’étain' },
    correct: 'A',
  },
  {
    question: 'Combien de dents définitives possède un adulte (dents de sagesse comprises) ?',
    options: { A: '28', B: '30', C: '31', D: '32' },
    correct: 'D',
  },
  {
    question: 'Quelle planète du système solaire est célèbre pour ses grands anneaux ?',
    options: { A: 'Jupiter', B: 'Saturne', C: 'Uranus', D: 'Neptune' },
    correct: 'B',
  },
  {
    question: 'Quel est le seul groupe de mammifères capable d’un vol battu soutenu ?',
    options: { A: 'L’écureuil volant', B: 'Le lémur volant', C: 'La chauve-souris', D: 'Le planeur de sucre' },
    correct: 'C',
  },
  {
    question: 'Quelle est l’unité du Système international pour la résistance électrique ?',
    options: { A: 'L’ohm', B: 'Le watt', C: 'Le tesla', D: 'Le lux' },
    correct: 'A',
  },
  {
    question: 'Quel est le plus grand oiseau vivant incapable de voler ?',
    options: { A: 'L’émeu', B: 'Le casoar', C: 'Le manchot empereur', D: 'L’autruche' },
    correct: 'D',
  },
  {
    question: 'Comment appelle-t-on le mécanisme par lequel les plantes utilisent la lumière ?',
    options: { A: 'La fermentation', B: 'La photosynthèse', C: 'La transpiration', D: 'La pollinisation' },
    correct: 'B',
  },
  {
    question: 'Quel est l’os le plus long et le plus solide du squelette humain ?',
    options: { A: 'Le tibia', B: 'L’humérus', C: 'Le fémur', D: 'Le radius' },
    correct: 'C',
  },
  {
    question: 'Quel élément chimique a pour symbole Fe ?',
    options: { A: 'Le fer', B: 'Le fluor', C: 'Le francium', D: 'Le fermium' },
    correct: 'A',
  },
  {
    question: 'Quel cétacé est réputé pour ses chants complexes et ses sauts hors de l’eau ?',
    options: { A: 'Le narval', B: 'Le cachalot', C: 'Le marsouin', D: 'La baleine à bosse' },
    correct: 'D',
  },
  {
    question: 'Quelle est la vitesse approximative de la lumière dans le vide ?',
    options: { A: '150 000 km/s', B: '300 000 km/s', C: '30 000 km/s', D: '1 080 km/h' },
    correct: 'B',
  },
  {
    question: 'Quel arbre produit des glands ?',
    options: { A: 'Le bouleau', B: 'Le pin', C: 'Le chêne', D: 'Le saule' },
    correct: 'C',
  },
  {
    question: 'Quel état de la matière n’a ni forme propre ni volume propre ?',
    options: { A: 'Le gaz', B: 'Le solide', C: 'Le liquide', D: 'Le cristal' },
    correct: 'A',
  },
  {
    question: 'Quel insecte joue un rôle clé dans la pollinisation et produit du miel ?',
    options: { A: 'La guêpe', B: 'La libellule', C: 'La fourmi', D: 'L’abeille' },
    correct: 'D',
  },
  {
    question: 'Qui a réalisé le film culte Pulp Fiction sorti en 1994 ?',
    options: { A: 'Martin Scorsese', B: 'Quentin Tarantino', C: 'Christopher Nolan', D: 'David Fincher' },
    correct: 'B',
  },
  {
    question: 'Qui a composé Les Quatre Saisons ?',
    options: { A: 'Johann Sebastian Bach', B: 'Wolfgang Amadeus Mozart', C: 'Antonio Vivaldi', D: 'Ludwig van Beethoven' },
    correct: 'C',
  },
  {
    question: 'Quel est le prénom du personnage principal joué par Keanu Reeves dans Matrix ?',
    options: { A: 'Neo', B: 'Morpheus', C: 'Trinity', D: 'Cypher' },
    correct: 'A',
  },
  {
    question: 'Quel groupe britannique a sorti l’album Abbey Road en 1969 ?',
    options: { A: 'The Rolling Stones', B: 'Pink Floyd', C: 'Led Zeppelin', D: 'The Beatles' },
    correct: 'D',
  },
  {
    question: 'Dans quelle ville italienne se déroule l’histoire de Roméo et Juliette ?',
    options: { A: 'Rome', B: 'Vérone', C: 'Bologne', D: 'Pise' },
    correct: 'B',
  },
  {
    question: 'Combien de touches possède un piano acoustique standard ?',
    options: { A: '76', B: '84', C: '88', D: '92' },
    correct: 'C',
  },
  {
    question: 'Quel grand classique Disney met en scène le jeune lion Simba ?',
    options: { A: 'Le Roi Lion', B: 'Aladdin', C: 'Tarzan', D: 'Frère des ours' },
    correct: 'A',
  },
  {
    question: 'Qui est l’auteur du roman Les Misérables ?',
    options: { A: 'Émile Zola', B: 'Alexandre Dumas', C: 'Gustave Flaubert', D: 'Victor Hugo' },
    correct: 'D',
  },
  {
    question: 'Quelle ville sombre est associée à Batman ?',
    options: { A: 'Metropolis', B: 'Gotham City', C: 'Star City', D: 'Central City' },
    correct: 'B',
  },
  {
    question: 'Quelle danse brésilienne est indissociable du carnaval de Rio ?',
    options: { A: 'Le flamenco', B: 'La valse', C: 'La samba', D: 'Le rock' },
    correct: 'C',
  },
  {
    question: 'Qui a créé Mickey Mouse en 1928 ?',
    options: { A: 'Walt Disney', B: 'Chuck Jones', C: 'Tex Avery', D: 'Hanna-Barbera' },
    correct: 'A',
  },
  {
    question: 'Quel roman de J. R. R. Tolkien suit Frodon Sacquet vers la montagne du Destin ?',
    options: { A: 'Le Silmarillion', B: 'Bilbo le Hobbit', C: 'Les Enfants de Húrin', D: 'Le Seigneur des Anneaux' },
    correct: 'D',
  },
  {
    question: 'Quelle est la couleur emblématique de Hulk ?',
    options: { A: 'Bleu', B: 'Vert', C: 'Violet', D: 'Rouge' },
    correct: 'B',
  },
  {
    question: 'Dans quel quartier de New York le hip-hop a-t-il émergé dans les années 1970 ?',
    options: { A: 'Queens', B: 'Brooklyn', C: 'Le Bronx', D: 'Harlem' },
    correct: 'C',
  },
  {
    question: 'Qui a écrit la pièce de théâtre Cyrano de Bergerac ?',
    options: { A: 'Edmond Rostand', B: 'Molière', C: 'Jean Racine', D: 'Pierre Corneille' },
    correct: 'A',
  },
  {
    question: 'Quel studio d’animation a produit Toy Story en 1995 ?',
    options: { A: 'DreamWorks', B: 'Illumination', C: 'Aardman', D: 'Pixar' },
    correct: 'D',
  },
  {
    question: 'Quel célèbre apprenti sorcier porte une cicatrice en forme d’éclair sur le front ?',
    options: { A: 'Gandalf', B: 'Harry Potter', C: 'Percy Jackson', D: 'Merlin' },
    correct: 'B',
  },
  {
    question: 'Quel mouvement artistique est étroitement lié aux Nymphéas de Claude Monet ?',
    options: { A: 'Le cubisme', B: 'Le surréalisme', C: 'L’impressionnisme', D: 'Le pop art' },
    correct: 'C',
  },
  {
    question: 'Quelle langue officielle est parlée à la fois au Portugal et au Brésil ?',
    options: { A: 'Le portugais', B: 'L’espagnol', C: 'Le catalan', D: 'Le galicien' },
    correct: 'A',
  },
  {
    question: 'Quel personnage emblématique de jeux vidéo porte une casquette rouge et une salopette bleue ?',
    options: { A: 'Sonic', B: 'Link', C: 'Crash Bandicoot', D: 'Mario' },
    correct: 'D',
  },
  {
    question: 'Combien de joueurs par équipe sont sur le terrain au football ?',
    options: { A: '10', B: '11', C: '12', D: '9' },
    correct: 'B',
  },
  {
    question: 'Quelle est la durée réglementaire d’un match de football (hors temps additionnel) ?',
    options: { A: '60 minutes', B: '80 minutes', C: '90 minutes', D: '100 minutes' },
    correct: 'C',
  },
  {
    question: 'Combien y a-t-il de boules numérotées dans un jeu de billard américain standard ?',
    options: { A: '15', B: '12', C: '14', D: '16' },
    correct: 'A',
  },
  {
    question: 'Quelles sont les couleurs des cinq anneaux olympiques sur fond blanc : bleu, jaune, noir, vert et… ?',
    options: { A: 'Orange', B: 'Violet', C: 'Rose', D: 'Rouge' },
    correct: 'D',
  },
  {
    question: 'Quel club de golf est spécifiquement utilisé pour faire rouler la balle sur le green ?',
    options: { A: 'Le driver', B: 'Le putter', C: 'Le fer 7', D: 'Le bois 3' },
    correct: 'B',
  },
  {
    question: 'Combien de cases compte un échiquier standard ?',
    options: { A: '48', B: '56', C: '64', D: '72' },
    correct: 'C',
  },
  {
    question: 'Quelle épreuve de course à pied mesure exactement 42,195 kilomètres ?',
    options: { A: 'Le marathon', B: 'Le semi-marathon', C: 'Le 10 000 mètres', D: 'Le steeple' },
    correct: 'A',
  },
  {
    question: 'Quelle équipe nationale a remporté la Coupe du monde de football en 2018 ?',
    options: { A: 'Croatie', B: 'Belgique', C: 'Allemagne', D: 'France' },
    correct: 'D',
  },
  {
    question: 'Quelle pièce des échecs se déplace en formant un « L » et peut sauter par-dessus d’autres pièces ?',
    options: { A: 'La tour', B: 'Le cavalier', C: 'Le fou', D: 'La reine' },
    correct: 'B',
  },
  {
    question: 'Quel sport d’hiver se joue sur la glace avec des pierres de granit et des balais ?',
    options: { A: 'Le biathlon', B: 'Le patinage artistique', C: 'Le curling', D: 'Le bobsleigh' },
    correct: 'C',
  },
  {
    question: 'Combien de cartes contient un jeu de tarot français complet ?',
    options: { A: '78', B: '52', C: '54', D: '32' },
    correct: 'A',
  },
  {
    question: 'Sur quelle surface se jouent les matchs du tournoi de tennis de Roland-Garros ?',
    options: { A: 'Gazon', B: 'Dur extérieur', C: 'Moquette', D: 'Terre battue' },
    correct: 'D',
  },
  {
    question: 'Combien de points vaut un essai non transformé au rugby à XV ?',
    options: { A: '3 points', B: '5 points', C: '6 points', D: '7 points' },
    correct: 'B',
  },
  {
    question: 'Quel art martial japonais met l’accent sur les projections et les immobilisations au sol ?',
    options: { A: 'L’aïkido', B: 'Le kendo', C: 'Le judo', D: 'Le sumo' },
    correct: 'C',
  },
  {
    question: 'De quelle couleur est le maillot du leader au classement général du Tour de France ?',
    options: { A: 'Jaune', B: 'Vert', C: 'Rouge', D: 'Blanc' },
    correct: 'A',
  },
  {
    question: 'Combien de joueurs de chaque équipe sont sur le terrain au basket-ball ?',
    options: { A: '6', B: '7', C: '4', D: '5' },
    correct: 'D',
  },
  {
    question: 'Comment appelle-t-on le fait de renverser les dix quilles au bowling dès le premier lancer ?',
    options: { A: 'Un spare', B: 'Un strike', C: 'Un split', D: 'Un turkey' },
    correct: 'B',
  },
  {
    question: 'Combien de quilles composent un jeu standard de bowling ?',
    options: { A: '6', B: '8', C: '10', D: '12' },
    correct: 'C',
  },
  {
    question: 'Dans quel pays sont nés le judo et le karaté ?',
    options: { A: 'Japon', B: 'Chine', C: 'Corée du Sud', D: 'Thaïlande' },
    correct: 'A',
  },
  {
    question: 'Quelle couleur de ceinture symbolise généralement la maîtrise ou le haut grade dans beaucoup d’arts martiaux ?',
    options: { A: 'Bleue', B: 'Marron', C: 'Rouge', D: 'Noire' },
    correct: 'D',
  },
]
