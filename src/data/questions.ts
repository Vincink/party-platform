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
    {
    question: 'Quelle est la capitale de l’Islande ?',
    options: { A: 'Oslo', B: 'Reykjavik', C: 'Helsinki', D: 'Tallinn' },
    correct: 'B',
  },
  {
    question: 'Quel est le métal le plus abondant dans la croûte terrestre ?',
    options: { A: 'Le fer', B: 'Le cuivre', C: 'L’aluminium', D: 'Le magnésium' },
    correct: 'C',
  },
  {
    question: 'Qui a écrit le roman Orgueil et Préjugés ?',
    options: { A: 'Charlotte Brontë', B: 'Emily Brontë', C: 'Mary Shelley', D: 'Jane Austen' },
    correct: 'D',
  },
  {
    question: 'Quel est le pays le plus peuplé d’Afrique ?',
    options: { A: 'Égypte', B: 'Éthiopie', C: 'Nigeria', D: 'République démocratique du Congo' },
    correct: 'C',
  },
  {
    question: 'En quelle année l’Union européenne a-t-elle introduit l’euro comme monnaie fiduciaire (billets et pièces) ?',
    options: { A: '1999', B: '2001', C: '2002', D: '2004' },
    correct: 'C',
  },
  {
    question: 'Quel instrument de musique possède 47 cordes et 7 pédales dans sa version de concert classique ?',
    options: { A: 'Le clavecin', B: 'La harpe', C: 'Le violoncelle', D: 'La mandoline' },
    correct: 'B',
  },
  {
    question: 'Quelle planète du système solaire possède la rotation la plus lente sur elle-même ?',
    options: { A: 'Mercure', B: 'Vénus', C: 'Mars', D: 'Neptune' },
    correct: 'B',
  },
  {
    question: 'Dans quel pays se trouve le site antique de Pétra ?',
    options: { A: 'Égypte', B: 'Jordanie', C: 'Liban', D: 'Syrie' },
    correct: 'B',
  },
  {
    question: 'Quel est le symbole chimique du sodium ?',
    options: { A: 'So', B: 'Sd', C: 'Na', D: 'No' },
    correct: 'C',
  },
  {
    question: 'Qui a composé la célèbre bande originale du film Le Bon, la Brute et le Truand ?',
    options: { A: 'John Williams', B: 'Hans Zimmer', C: 'Nino Rota', D: 'Ennio Morricone' },
    correct: 'D',
  },
  {
    question: 'Quel est le plus long fleuve d’Asie ?',
    options: { A: 'Le Mékong', B: 'Le fleuve Jaune', C: 'Le Yangtsé', D: 'L’Indus' },
    correct: 'C',
  },
  {
    question: 'Combien de joueurs composent une équipe de volley-ball sur le terrain ?',
    options: { A: '5', B: '6', C: '7', D: '8' },
    correct: 'B',
  },
  {
    question: 'Quel peintre espagnol a réalisé Guernica en 1937 ?',
    options: { A: 'Salvador Dalí', B: 'Joan Miró', C: 'Pablo Picasso', D: 'Francisco Goya' },
    correct: 'C',
  },
  {
    question: 'Quelle est la capitale de la Suisse (siège du gouvernement fédéral) ?',
    options: { A: 'Genève', B: 'Zurich', C: 'Bâle', D: 'Berne' },
    correct: 'D',
  },
  {
    question: 'Quel est le nom de la plus grande lune de Saturne ?',
    options: { A: 'Europe', B: 'Io', C: 'Titan', D: 'Ganymède' },
    correct: 'C',
  },
  {
    question: 'Qui a écrit Don Quichotte ?',
    options: { A: 'Lope de Vega', B: 'Miguel de Cervantes', C: 'Jorge Luis Borges', D: 'Gabriel García Márquez' },
    correct: 'B',
  },
  {
    question: 'Quelle mer borde les côtes de la Suède, de la Finlande et des pays baltes ?',
    options: { A: 'Mer du Nord', B: 'Mer de Barents', C: 'Mer Baltique', D: 'Mer de Norvège' },
    correct: 'C',
  },
  {
    question: 'Combien de côtés possède un décagone ?',
    options: { A: '8', B: '9', C: '10', D: '12' },
    correct: 'C',
  },
  {
    question: 'Quel scientifique a formulé les lois universelles de la gravitation et du mouvement ?',
    options: { A: 'Johannes Kepler', B: 'Galilée', C: 'Isaac Newton', D: 'Nicolas Copernic' },
    correct: 'C',
  },
  {
    question: 'Quelle est la capitale de la Grèce ?',
    options: { A: 'Sparte', B: 'Thessalonique', C: 'Delphes', D: 'Athènes' },
    correct: 'D',
  },
  {
    question: 'Quel est l’organe qui produit principalement la bile chez l’humain ?',
    options: { A: 'Le pancréas', B: 'La vésicule biliaire', C: 'Le foie', D: 'L’estomac' },
    correct: 'C',
  },
  {
    question: 'En quelle année a eu lieu l’appel du 18 Juin du général de Gaulle ?',
    options: { A: '1939', B: '1940', C: '1942', D: '1944' },
    correct: 'B',
  },
  {
    question: 'Quel est l’animal terrestre capable de produire le rugissement audible le plus loin ?',
    options: { A: 'Le tigre', B: 'Le lion', C: 'Le jaguar', D: 'L’éléphant' },
    correct: 'B',
  },
  {
    question: 'Quelle est la monnaie officielle du Royaume-Uni ?',
    options: { A: 'L’euro', B: 'Le dollar britannique', C: 'La livre sterling', D: 'La couronne' },
    correct: 'C',
  },
  {
    question: 'Qui a peint La Nuit étoilée en 1889 ?',
    options: { A: 'Paul Cézanne', B: 'Henri Matisse', C: 'Vincent van Gogh', D: 'Claude Monet' },
    correct: 'C',
  },
  {
    question: 'Quel gaz est responsable de l’effet de serre naturel et anthropique le plus abondant parmi les gaz émis par l’activité humaine ?',
    options: { A: 'Le méthane', B: 'Le protoxyde d’azote', C: 'Le dioxyde de carbone', D: 'L’ozone' },
    correct: 'C',
  },
  {
    question: 'Dans quel pays se trouve le mont Fuji ?',
    options: { A: 'Chine', B: 'Corée du Sud', C: 'Japon', D: 'Taïwan' },
    correct: 'C',
  },
  {
    question: 'Qui a écrit le roman L’Étranger en 1942 ?',
    options: { A: 'Jean-Paul Sartre', B: 'Boris Vian', C: 'Albert Camus', D: 'André Malraux' },
    correct: 'C',
  },
  {
    question: 'Quel est le plus petit os du corps humain, situé dans l’oreille moyenne ?',
    options: { A: 'Le marteau', B: 'L’enclume', C: 'L’étrier', D: 'Le coccyx' },
    correct: 'C',
  },
  {
    question: 'Quelle est la capitale de la Suède ?',
    options: { A: 'Göteborg', B: 'Malmö', C: 'Uppsala', D: 'Stockholm' },
    correct: 'D',
  },
  {
    question: 'Combien d’années dure un mandat présidentiel en France depuis la réforme de 2000 ?',
    options: { A: '4 ans', B: '5 ans', C: '6 ans', D: '7 ans' },
    correct: 'B',
  },
  {
    question: 'Quel est le symbole chimique du potassium ?',
    options: { A: 'Po', B: 'Pt', C: 'K', D: 'P' },
    correct: 'C',
  },
  {
    question: 'Quel fleuve traverse la ville de Vienne en Autriche ?',
    options: { A: 'Le Rhin', B: 'L’Elbe', C: 'Le Danube', D: 'La Vistule' },
    correct: 'C',
  },
  {
    question: 'Qui a sculpté le célèbre Penseur à Paris ?',
    options: { A: 'Camille Claudel', B: 'Antoine Bourdelle', C: 'Auguste Rodin', D: 'Constantin Brâncuși' },
    correct: 'C',
  },
  {
    question: 'Quel est le nom scientifique du sel de table courant ?',
    options: { A: 'Bicarbonate de sodium', B: 'Chlorure de potassium', C: 'Chlorure de sodium', D: 'Sulfate de calcium' },
    correct: 'C',
  },
  {
    question: 'Dans quel océan se situe l’archipel d’Hawaï ?',
    options: { A: 'Océan Atlantique', B: 'Océan Indien', C: 'Océan Pacifique', D: 'Océan Arctique' },
    correct: 'C',
  },
  {
    question: 'Qui a inventé la radioactivité naturelle (terme et premières découvertes avec Pierre Curie) ?',
    options: { A: 'Wilhelm Röntgen', B: 'Henri Becquerel', C: 'Ernest Rutherford', D: 'Max Planck' },
    correct: 'B',
  },
  {
    question: 'Quelle est la langue officielle du Brésil ?',
    options: { A: 'L’espagnol', B: 'Le portugais', C: 'Le guarani', D: 'L’italien' },
    correct: 'B',
  },
  {
    question: 'Combien de cordes possède une guitare classique standard ?',
    options: { A: '4', B: '5', C: '6', D: '7' },
    correct: 'C',
  },
  {
    question: 'Quel célèbre navigateur portugais a mené la première expédition qui a entrepris le tour du monde (mort en route aux Philippines) ?',
    options: { A: 'Vasco de Gama', B: 'Bartolomeu Dias', C: 'Fernand de Magellan', D: 'Pedro Álvares Cabral' },
    correct: 'C',
  },
  {
    question: 'Quelle vitamine est principalement impliquée dans la coagulation sanguine ?',
    options: { A: 'Vitamine A', B: 'Vitamine C', C: 'Vitamine K', D: 'Vitamine E' },
    correct: 'C',
  },
  {
    question: 'Quelle est la capitale de la Norvège ?',
    options: { A: 'Bergen', B: 'Trondheim', C: 'Stavanger', D: 'Oslo' },
    correct: 'D',
  },
  {
    question: 'Quel animal est le symbole national de l’Écosse ?',
    options: { A: 'Le lion', B: 'La licorne', C: 'Le cerf', D: 'L’aigle royal' },
    correct: 'B',
  },
  {
    question: 'Qui a écrit le roman 1984 ?',
    options: { A: 'Aldous Huxley', B: 'Ray Bradbury', C: 'George Orwell', D: 'H. G. Wells' },
    correct: 'C',
  },
  {
    question: 'Quelle est la planète la plus chaude du système solaire en température moyenne de surface ?',
    options: { A: 'Mercure', B: 'Vénus', C: 'Mars', D: 'Jupiter' },
    correct: 'B',
  },
  {
    question: 'En quelle année a eu lieu la chute de l’Empire romain d’Occident selon la date traditionnelle ?',
    options: { A: '395', B: '410', C: '476', D: '529' },
    correct: 'C',
  },
  {
    question: 'Quel est le plus grand lac d’eau douce du monde par sa superficie ?',
    options: { A: 'Lac Victoria', B: 'Lac Baïkal', C: 'Lac Supérieur', D: 'Lac Tanganyika' },
    correct: 'C',
  },
  {
    question: 'Quel élément chimique porte le symbole Sn ?',
    options: { A: 'Sélénium', B: 'Soufre', C: 'Étain', D: 'Strontium' },
    correct: 'C',
  },
  {
    question: 'Qui a composé les 24 Préludes et Fugues du Clavier bien tempéré ?',
    options: { A: 'Ludwig van Beethoven', B: 'Wolfgang Amadeus Mozart', C: 'Johann Sebastian Bach', D: 'Frédéric Chopin' },
    correct: 'C',
  },
  {
    question: 'Quelle est la capitale du Portugal ?',
    options: { A: 'Porto', B: 'Coimbra', C: 'Faro', D: 'Lisbonne' },
    correct: 'D',
  },
  {
    question: 'Quel est le nom du détroit qui sépare la Russie de l’Alaska ?',
    options: { A: 'Détroit de Davis', B: 'Détroit de Béring', C: 'Détroit de Hudson', D: 'Détroit de Magellan' },
    correct: 'B',
  },
  {
    question: 'Combien de jours dure un mois de novembre ?',
    options: { A: '28', B: '29', C: '30', D: '31' },
    correct: 'C',
  },
  {
    question: 'Qui a peint La Jeune Fille à la perle ?',
    options: { A: 'Rembrandt', B: 'Frans Hals', C: 'Johannes Vermeer', D: 'Pierre Paul Rubens' },
    correct: 'C',
  },
  {
    question: 'Quel est le point culminant de l’Afrique ?',
    options: { A: 'Mont Kenya', B: 'Mont Cameroun', C: 'Kilimandjaro', D: 'Ras Dashan' },
    correct: 'C',
  },
  {
    question: 'Quel métal est principalement utilisé pour fabriquer les pièces d’or traditionnelles et les bijoux ?',
    options: { A: 'Cuivre', B: 'Plomb', C: 'Or', D: 'Nickel' },
    correct: 'C',
  },
  {
    question: 'Qui a écrit Germinal ?',
    options: { A: 'Gustave Flaubert', B: 'Honoré de Balzac', C: 'Émile Zola', D: 'Guy de Maupassant' },
    correct: 'C',
  },
  {
    question: 'Quelle est la capitale de l’Irlande ?',
    options: { A: 'Cork', B: 'Galway', C: 'Belfast', D: 'Dublin' },
    correct: 'D',
  },
  {
    question: 'Quel est l’instrument principal du violoncelliste Pablo Casals ?',
    options: { A: 'Violon', B: 'Contrebasse', C: 'Violoncelle', D: 'Alto' },
    correct: 'C',
  },
  {
    question: 'Dans quel pays l’invention du papier est-elle traditionnellement attribuée à Cai Lun sous la dynastie Han ?',
    options: { A: 'Japon', B: 'Inde', C: 'Chine', D: 'Égypte' },
    correct: 'C',
  },
  {
    question: 'Quel est le symbole chimique du plomb ?',
    options: { A: 'Pl', B: 'Pb', C: 'Pd', D: 'Pt' },
    correct: 'B',
  },
  {
    question: 'Quelle est la capitale de la Pologne ?',
    options: { A: 'Cracovie', B: 'Gdansk', C: 'Wrocław', D: 'Varsovie' },
    correct: 'D',
  },
  {
    question: 'Quel animal marin est un cétacé à dents doté d’une longue défense torsadée chez le mâle ?',
    options: { A: 'Béluga', B: 'Narval', C: 'Orque', D: 'Cachalot' },
    correct: 'B',
  },
  {
    question: 'Qui a écrit Le Petit Prince ?',
    options: { A: 'Jules Verne', B: 'Marcel Pagnol', C: 'Antoine de Saint-Exupéry', D: 'Colette' },
    correct: 'C',
  },
  {
    question: 'Quelle planète du système solaire est la plus éloignée du Soleil ?',
    options: { A: 'Uranus', B: 'Saturne', C: 'Neptune', D: 'Pluton' },
    correct: 'C',
  },
  {
    question: 'En quelle année l’armistice mettant fin aux combats de la Première Guerre mondiale a-t-il été signé ?',
    options: { A: '1917', B: '1918', C: '1919', D: '1920' },
    correct: 'B',
  },
  {
    question: 'Quel est le nom du fleuve qui traverse la ville de Londres ?',
    options: { A: 'La Severn', B: 'La Tamise', C: 'La Clyde', D: 'L’Humber' },
    correct: 'B',
  },
  {
    question: 'Combien de degrés mesure la somme des angles intérieurs d’un triangle dans la géométrie euclidienne ?',
    options: { A: '90°', B: '120°', C: '180°', D: '360°' },
    correct: 'C',
  },
  {
    question: 'Qui a composé la 9e Symphonie (« Ode à la joie ») ?',
    options: { A: 'Wolfgang Amadeus Mozart', B: 'Johannes Brahms', C: 'Ludwig van Beethoven', D: 'Franz Schubert' },
    correct: 'C',
  },
  {
    question: 'Quelle est la capitale de l’Autriche ?',
    options: { A: 'Salzbourg', B: 'Graz', C: 'Innsbruck', D: 'Vienne' },
    correct: 'D',
  },
  {
    question: 'Quel élément chimique a pour symbole He ?',
    options: { A: 'Hydrogène', B: 'Hélium', C: 'Hafnium', D: 'Holmium' },
    correct: 'B',
  },
  {
    question: 'Quel pays a pour capitale Wellington ?',
    options: { A: 'Australie', B: 'Fidji', C: 'Nouvelle-Zélande', D: 'Papouasie-Nouvelle-Guinée' },
    correct: 'C',
  },
  {
    question: 'Qui a peint Les Tournesols ?',
    options: { A: 'Pierre-Auguste Renoir', B: 'Edgar Degas', C: 'Vincent van Gogh', D: 'Paul Gauguin' },
    correct: 'C',
  },
  {
    question: 'Quel est l’organe qui filtre le sang pour produire l’urine ?',
    options: { A: 'Le foie', B: 'La rate', C: 'Le rein', D: 'Le pancréas' },
    correct: 'C',
  },
  {
    question: 'Dans quelle ville se trouve le musée du Prado ?',
    options: { A: 'Barcelone', B: 'Séville', C: 'Lisbonne', D: 'Madrid' },
    correct: 'D',
  },
  {
    question: 'Quel est le plus long fleuve d’Amérique du Sud ?',
    options: { A: 'L’Orénoque', B: 'Le Paraná', C: 'L’Amazone', D: 'Le São Francisco' },
    correct: 'C',
  },
  {
    question: 'Combien de faces possède un dodécaèdre régulier ?',
    options: { A: '8', B: '10', C: '12', D: '20' },
    correct: 'C',
  },
  {
    question: 'Qui a écrit Candide ?',
    options: { A: 'Jean-Jacques Rousseau', B: 'Denis Diderot', C: 'Voltaire', D: 'Montesquieu' },
    correct: 'C',
  },
  {
    question: 'Quel est le symbole chimique du magnésium ?',
    options: { A: 'Mn', B: 'Ma', C: 'Mg', D: 'Ms' },
    correct: 'C',
  },
  {
    question: 'Quelle est la capitale de l’Égypte ?',
    options: { A: 'Alexandrie', B: 'Louxor', C: 'Gizeh', D: 'Le Caire' },
    correct: 'D',
  },
  {
    question: 'Quel instrument mesure la vitesse du vent ?',
    options: { A: 'Baromètre', B: 'Hygromètre', C: 'Anémomètre', D: 'Pluviomètre' },
    correct: 'C',
  },
  {
    question: 'En quelle année l’homme a-t-il envoyé la première sonde à s’approcher ou se poser sur Mars avec succès (Viking 1) ?',
    options: { A: '1969', B: '1973', C: '1976', D: '1981' },
    correct: 'C',
  },
  {
    question: 'Quel est le nom du continent où se trouve le désert de Gobi ?',
    options: { A: 'Afrique', B: 'Amérique du Nord', C: 'Asie', D: 'Australie' },
    correct: 'C',
  },
  {
    question: 'Qui a écrit Le Comte de Monte-Cristo ?',
    options: { A: 'Victor Hugo', B: 'Honoré de Balzac', C: 'Alexandre Dumas', D: 'Eugène Sue' },
    correct: 'C',
  },
  {
    question: 'Quelle est la capitale de la Finlande ?',
    options: { A: 'Turku', B: 'Tampere', C: 'Espoo', D: 'Helsinki' },
    correct: 'D',
  },
  {
    question: 'Quel gaz est essentiel à la combustion et à la respiration des animaux ?',
    options: { A: 'Diazote', B: 'Dioxygène', C: 'Argon', D: 'Hélium' },
    correct: 'B',
  },
  {
    question: 'Combien de joueurs composent une équipe de handball sur le terrain (gardien compris) ?',
    options: { A: '5', B: '6', C: '7', D: '8' },
    correct: 'C',
  },
  {
    question: 'Qui a peint La Persistance de la mémoire avec ses montres molles ?',
    options: { A: 'René Magritte', B: 'Joan Miró', C: 'Salvador Dalí', D: 'Max Ernst' },
    correct: 'C',
  },
  {
    question: 'Quel est le plus grand mammifère terrestre actuel ?',
    options: { A: 'Rhinocéros blanc', B: 'Hippopotame', C: 'Éléphant de savane d’Afrique', D: 'Girafe' },
    correct: 'C',
  },
  {
    question: 'Quelle est la capitale du Danemark ?',
    options: { A: 'Aarhus', B: 'Odense', C: 'Aalborg', D: 'Copenhague' },
    correct: 'D',
  },
  {
    question: 'Quel est le symbole chimique du calcium ?',
    options: { A: 'Cl', B: 'Cm', C: 'Ca', D: 'Cu' },
    correct: 'C',
  },
  {
    question: 'Qui a écrit Vingt mille lieues sous les mers ?',
    options: { A: 'H. G. Wells', B: 'Robert Louis Stevenson', C: 'Jules Verne', D: 'Arthur Conan Doyle' },
    correct: 'C',
  },
  {
    question: 'Quelle mer borde les côtes sud-est de la France continentale ?',
    options: { A: 'Mer du Nord', B: 'Mer de Norvège', C: 'Mer Méditerranée', D: 'Mer Adriatique' },
    correct: 'C',
  },
  {
    question: 'Combien de côtés possède un hexagone ?',
    options: { A: '5', B: '6', C: '7', D: '8' },
    correct: 'B',
  },
  {
    question: 'Quel est le nom de la planète naine située dans la ceinture de Kuiper et découverte en 1930 ?',
    options: { A: 'Cérès', B: 'Éris', C: 'Pluton', D: 'Hauméa' },
    correct: 'C',
  },
  {
    question: 'Qui a composé l’opéra Carmen ?',
    options: { A: 'Giuseppe Verdi', B: 'Giacomo Puccini', C: 'Georges Bizet', D: 'Gioachino Rossini' },
    correct: 'C',
  },
  {
    question: 'Quelle est la capitale de la Hongrie ?',
    options: { A: 'Bratislava', B: 'Bucarest', C: 'Prague', D: 'Budapest' },
    correct: 'D',
  },
  {
    question: 'Quel est le symbole chimique de l’azote ?',
    options: { A: 'Az', B: 'Na', C: 'N', D: 'Ne' },
    correct: 'C',
  },
  {
    question: 'Dans quel pays se trouve l’Acropole d’Athènes ?',
    options: { A: 'Chypre', B: 'Turquie', C: 'Grèce', D: 'Bulgarie' },
    correct: 'C',
  },
  {
    question: 'Qui a écrit Madame Bovary ?',
    options: { A: 'Émile Zola', B: 'Stendhal', C: 'Gustave Flaubert', D: 'Honoré de Balzac' },
    correct: 'C',
  },
    {
    question: 'Quelle est la capitale de la Roumanie ?',
    options: { A: 'Cluj-Napoca', B: 'Timișoara', C: 'Bucarest', D: 'Iași' },
    correct: 'C',
  },
  {
    question: 'Quel est le symbole chimique du carbone ?',
    options: { A: 'Ca', B: 'Co', C: 'C', D: 'Cr' },
    correct: 'C',
  },
  {
    question: 'Qui a écrit Les Trois Mousquetaires ?',
    options: { A: 'Victor Hugo', B: 'George Sand', C: 'Alexandre Dumas', D: 'Théophile Gautier' },
    correct: 'C',
  },
  {
    question: 'Quel est le nom de la plus grande planète naine du système solaire ?',
    options: { A: 'Cérès', B: 'Pluton', C: 'Éris', D: 'Makemake' },
    correct: 'C',
  },
  {
    question: 'Quelle est la capitale de la République tchèque ?',
    options: { A: 'Brno', B: 'Ostrava', C: 'Prague', D: 'Plzeň' },
    correct: 'C',
  },
  {
    question: 'Combien de jours compte une année non bissextile ?',
    options: { A: '364', B: '366', C: '365', D: '360' },
    correct: 'C',
  },
  {
    question: 'Qui a peint La Cène à Milan ?',
    options: { A: 'Michel-Ange', B: 'Raphaël', C: 'Léonard de Vinci', D: 'Titien' },
    correct: 'C',
  },
  {
    question: 'Quel est le fleuve qui traverse la ville de Rome ?',
    options: { A: 'L’Arno', B: 'Le Pô', C: 'Le Tibre', D: 'L’Adige' },
    correct: 'C',
  },
  {
    question: 'Quel gaz est utilisé pour gonfler la plupart des ballons dirigeables modernes et certains ballons de fête non inflammables ?',
    options: { A: 'Hydrogène', B: 'Méthane', C: 'Hélium', D: 'Azote' },
    correct: 'C',
  },
  {
    question: 'Quelle est la capitale de la Croatie ?',
    options: { A: 'Split', B: 'Dubrovnik', C: 'Zagreb', D: 'Rijeka' },
    correct: 'C',
  },
  {
    question: 'Qui a écrit Le Rouge et le Noir ?',
    options: { A: 'Gustave Flaubert', B: 'Honoré de Balzac', C: 'Stendhal', D: 'Émile Zola' },
    correct: 'C',
  },
  {
    question: 'Quel est le symbole chimique du soufre ?',
    options: { A: 'Su', B: 'So', C: 'S', D: 'Sf' },
    correct: 'C',
  },
  {
    question: 'Dans quel pays se trouve le Taj Mahal ?',
    options: { A: 'Pakistan', B: 'Népal', C: 'Inde', D: 'Bangladesh' },
    correct: 'C',
  },
  {
    question: 'Combien de côtés possède un heptagone ?',
    options: { A: '5', B: '6', C: '7', D: '8' },
    correct: 'C',
  },
  {
    question: 'Qui a composé La Traviata ?',
    options: { A: 'Giacomo Puccini', B: 'Gioachino Rossini', C: 'Giuseppe Verdi', D: 'Gaetano Donizetti' },
    correct: 'C',
  },
  {
    question: 'Quelle est la capitale de l’Écosse ?',
    options: { A: 'Glasgow', B: 'Aberdeen', C: 'Édimbourg', D: 'Dundee' },
    correct: 'C',
  },
  {
    question: 'Quel est l’organe qui assure la vision en captant la lumière ?',
    options: { A: 'L’oreille', B: 'La peau', C: 'L’œil', D: 'Le nez' },
    correct: 'C',
  },
  {
    question: 'En quelle année a eu lieu la bataille de Marignan ?',
    options: { A: '1494', B: '1508', C: '1515', D: '1525' },
    correct: 'C',
  },
  {
    question: 'Quel est le plus grand océan après l’océan Pacifique ?',
    options: { A: 'Océan Indien', B: 'Océan Arctique', C: 'Océan Atlantique', D: 'Océan Austral' },
    correct: 'C',
  },
  {
    question: 'Qui a écrit Fahrenheit 451 ?',
    options: { A: 'Isaac Asimov', B: 'Philip K. Dick', C: 'Ray Bradbury', D: 'Arthur C. Clarke' },
    correct: 'C',
  },
  {
    question: 'Quelle est la capitale de la Serbie ?',
    options: { A: 'Novi Sad', B: 'Niš', C: 'Belgrade', D: 'Subotica' },
    correct: 'C',
  },
  {
    question: 'Quel est le symbole chimique de l’argent ?',
    options: { A: 'Ar', B: 'Au', C: 'Ag', D: 'Al' },
    correct: 'C',
  },
  {
    question: 'Quel animal terrestre est connu pour sa longue trompe préhensile et ses défenses en ivoire ?',
    options: { A: 'Rhinocéros', B: 'Tapir', C: 'Éléphant', D: 'Sanglier' },
    correct: 'C',
  },
  {
    question: 'Quelle mer borde les côtes de la Jordanie et d’Israël au sud ?',
    options: { A: 'Mer Méditerranée', B: 'Mer Noire', C: 'Mer Rouge', D: 'Mer Caspienne' },
    correct: 'C',
  },
  {
    question: 'Qui a peint L’École d’Athènes au palais du Vatican ?',
    options: { A: 'Léonard de Vinci', B: 'Michel-Ange', C: 'Raphaël', D: 'Le Pérugin' },
    correct: 'C',
  },
  {
    question: 'Combien de minutes y a-t-il dans une journée complète ?',
    options: { A: '720', B: '1 000', C: '1 440', D: '2 400' },
    correct: 'C',
  },
  {
    question: 'Quelle est la capitale de la Thaïlande ?',
    options: { A: 'Phuket', B: 'Chiang Mai', C: 'Bangkok', D: 'Pattaya' },
    correct: 'C',
  },
  {
    question: 'Qui a écrit L’Île au trésor ?',
    options: { A: 'Jules Verne', B: 'Daniel Defoe', C: 'Robert Louis Stevenson', D: 'Jonathan Swift' },
    correct: 'C',
  },
  {
    question: 'Quel métal est le principal composant du bronze avec l’étain ?',
    options: { A: 'Fer', B: 'Zinc', C: 'Cuivre', D: 'Nickel' },
    correct: 'C',
  },
  {
    question: 'Dans quel pays se trouve le désert d’Atacama, réputé pour son extrême sécheresse ?',
    options: { A: 'Pérou', B: 'Argentine', C: 'Chili', D: 'Bolivie' },
    correct: 'C',
  },
  {
    question: 'Qui a composé les Nocturnes pour piano ?',
    options: { A: 'Franz Liszt', B: 'Robert Schumann', C: 'Frédéric Chopin', D: 'Claude Debussy' },
    correct: 'C',
  },
  {
    question: 'Quelle est la capitale de la Corée du Sud ?',
    options: { A: 'Busan', B: 'Incheon', C: 'Séoul', D: 'Daegu' },
    correct: 'C',
  },
  {
    question: 'Quel est l’élément chimique de symbole Ne ?',
    options: { A: 'Nickel', B: 'Nobélium', C: 'Néon', D: 'Néodyme' },
    correct: 'C',
  },
  {
    question: 'Combien de joueurs composent une équipe de hockey sur glace sur la patinoire (gardien compris) ?',
    options: { A: '5', B: '7', C: '6', D: '8' },
    correct: 'C',
  },
  {
    question: 'Qui a écrit Le Seigneur des Anneaux ?',
    options: { A: 'C. S. Lewis', B: 'George R. R. Martin', C: 'J. R. R. Tolkien', D: 'Ursula K. Le Guin' },
    correct: 'C',
  },
  {
    question: 'Quel fleuve arrose la ville de Lyon ?',
    options: { A: 'La Loire', B: 'La Seine', C: 'Le Rhône', D: 'La Saône uniquement' },
    correct: 'C',
  },
  {
    question: 'Quelle planète est la deuxième plus grande du système solaire ?',
    options: { A: 'Jupiter', B: 'Uranus', C: 'Saturne', D: 'Neptune' },
    correct: 'C',
  },
  {
    question: 'En quelle année a eu lieu la prise de la Bastille ?',
    options: { A: '1776', B: '1787', C: '1789', D: '1792' },
    correct: 'C',
  },
  {
    question: 'Quel est le plus petit océan du monde ?',
    options: { A: 'Océan Indien', B: 'Océan Atlantique', C: 'Océan Arctique', D: 'Océan Austral' },
    correct: 'C',
  },
  {
    question: 'Qui a peint La Liberté guidant le peuple en 1830 ?',
    options: { A: 'Théodore Géricault', B: 'Gustave Courbet', C: 'Eugène Delacroix', D: 'Jean-Auguste-Dominique Ingres' },
    correct: 'C',
  },
  {
    question: 'Quelle est la capitale de l’Argentine ?',
    options: { A: 'Córdoba', B: 'Rosario', C: 'Buenos Aires', D: 'Mendoza' },
    correct: 'C',
  },
  {
    question: 'Quel est le nom de la molécule qui porte l’information génétique chez la plupart des êtres vivants ?',
    options: { A: 'ATP', B: 'ARNt', C: 'ADN', D: 'Insuline' },
    correct: 'C',
  },
  {
    question: 'Combien de côtés possède un nonagone ?',
    options: { A: '7', B: '8', C: '9', D: '10' },
    correct: 'C',
  },
  {
    question: 'Qui a écrit Robinson Crusoé ?',
    options: { A: 'Jonathan Swift', B: 'Henry Fielding', C: 'Daniel Defoe', D: 'Samuel Richardson' },
    correct: 'C',
  },
  {
    question: 'Quelle chaîne de montagnes sépare l’Europe de l’Asie en partie ?',
    options: { A: 'Les Carpates', B: 'Les Alpes', C: 'L’Oural', D: 'Les Pyrénées' },
    correct: 'C',
  },
  {
    question: 'Quel est le symbole chimique du fluor ?',
    options: { A: 'Fl', B: 'Fr', C: 'F', D: 'Fm' },
    correct: 'C',
  },
  {
    question: 'Quelle est la capitale de la Tunisie ?',
    options: { A: 'Sousse', B: 'Sfax', C: 'Tunis', D: 'Kairouan' },
    correct: 'C',
  },
  {
    question: 'Quel oiseau marin est célèbre pour son bec volumineux et coloré en saison de reproduction ?',
    options: { A: 'Albatros', B: 'Cormoran', C: 'Macareux moine', D: 'Goéland' },
    correct: 'C',
  },
  {
    question: 'Qui a composé Le Boléro en 1928 ?',
    options: { A: 'Claude Debussy', B: 'Erik Satie', C: 'Maurice Ravel', D: 'Camille Saint-Saëns' },
    correct: 'C',
  },
  {
    question: 'Dans quel pays se trouve la ville de Cracovie ?',
    options: { A: 'République tchèque', B: 'Slovaquie', C: 'Pologne', D: 'Lituanie' },
    correct: 'C',
  },
  {
    question: 'Quel organe produit l’insuline dans le corps humain ?',
    options: { A: 'Le foie', B: 'La rate', C: 'Le pancréas', D: 'La thyroïde' },
    correct: 'C',
  },
  {
    question: 'Combien de zéros comporte un milliard dans l’échelle courte (utilisée en français et en anglais) ?',
    options: { A: '6', B: '8', C: '9', D: '12' },
    correct: 'C',
  },
  {
    question: 'Qui a écrit Les Fleurs du mal ?',
    options: { A: 'Arthur Rimbaud', B: 'Paul Verlaine', C: 'Charles Baudelaire', D: 'Stéphane Mallarmé' },
    correct: 'C',
  },
  {
    question: 'Quelle est la capitale du Maroc ?',
    options: { A: 'Casablanca', B: 'Marrakech', C: 'Rabat', D: 'Fès' },
    correct: 'C',
  },
  {
    question: 'Quel est le symbole chimique du lithium ?',
    options: { A: 'Lt', B: 'Lh', C: 'Li', D: 'Lm' },
    correct: 'C',
  },
  {
    question: 'Quel fleuve traverse la ville de Budapest ?',
    options: { A: 'L’Elbe', B: 'Le Rhin', C: 'Le Danube', D: 'La Tisza' },
    correct: 'C',
  },
  {
    question: 'Qui a peint Le Baiser à Vienne ?',
    options: { A: 'Egon Schiele', B: 'Oskar Kokoschka', C: 'Gustav Klimt', D: 'Arnold Böcklin' },
    correct: 'C',
  },
  {
    question: 'Quel est le plus grand pays d’Amérique du Sud par sa superficie ?',
    options: { A: 'Argentine', B: 'Pérou', C: 'Brésil', D: 'Colombie' },
    correct: 'C',
  },
  {
    question: 'Combien de cordes possède un violon accordé de façon standard ?',
    options: { A: '3', B: '5', C: '4', D: '6' },
    correct: 'C',
  },
  {
    question: 'Qui a écrit Hamlet ?',
    options: { A: 'Christopher Marlowe', B: 'Ben Jonson', C: 'William Shakespeare', D: 'John Webster' },
    correct: 'C',
  },
  {
    question: 'Quelle est la capitale de la Bulgarie ?',
    options: { A: 'Plovdiv', B: 'Varna', C: 'Sofia', D: 'Bourgas' },
    correct: 'C',
  },
  {
    question: 'Quel est l’élément chimique de symbole Cl ?',
    options: { A: 'Calcium', B: 'Chrome', C: 'Chlore', D: 'Cobalt' },
    correct: 'C',
  },
  {
    question: 'Quel animal est le plus grand reptile vivant actuel ?',
    options: { A: 'Python réticulé', B: 'Dragon de Komodo', C: 'Crocodile marin', D: 'Tortue luth' },
    correct: 'C',
  },
  {
    question: 'En quelle année l’ONU (Organisation des Nations unies) a-t-elle été officiellement créée ?',
    options: { A: '1919', B: '1944', C: '1945', D: '1948' },
    correct: 'C',
  },
  {
    question: 'Quel est le nom du détroit qui sépare l’Angleterre de la France ?',
    options: { A: 'Détroit de Béring', B: 'Détroit de Gibraltar', C: 'Pas de Calais (détroit de Douvres)', D: 'Détroit d’Ormuz' },
    correct: 'C',
  },
  {
    question: 'Qui a écrit La Peste ?',
    options: { A: 'Jean-Paul Sartre', B: 'André Gide', C: 'Albert Camus', D: 'François Mauriac' },
    correct: 'C',
  },
  {
    question: 'Quelle est la capitale de la Slovaquie ?',
    options: { A: 'Košice', B: 'Žilina', C: 'Bratislava', D: 'Nitra' },
    correct: 'C',
  },
  {
    question: 'Quel est le symbole chimique de l’iode ?',
    options: { A: 'Io', B: 'Id', C: 'I', D: 'In' },
    correct: 'C',
  },
  {
    question: 'Combien de degrés mesure un angle plat ?',
    options: { A: '90°', B: '120°', C: '180°', D: '270°' },
    correct: 'C',
  },
  {
    question: 'Qui a composé Les Préludes ou la Rhapsodie hongroise n° 2 ?',
    options: { A: 'Frédéric Chopin', B: 'Johannes Brahms', C: 'Franz Liszt', D: 'Richard Wagner' },
    correct: 'C',
  },
  {
    question: 'Dans quel pays se trouve la ville de Florence ?',
    options: { A: 'Espagne', B: 'Portugal', C: 'Italie', D: 'Grèce' },
    correct: 'C',
  },
  {
    question: 'Quel est le nom de la science qui étudie les plantes ?',
    options: { A: 'La zoologie', B: 'La géologie', C: 'La botanique', D: 'L’écologie' },
    correct: 'C',
  },
  {
    question: 'Qui a écrit L’Odyssée dans la Grèce antique ?',
    options: { A: 'Sophocle', B: 'Hésiode', C: 'Homère', D: 'Euripide' },
    correct: 'C',
  },
  {
    question: 'Quelle est la capitale de la Slovénie ?',
    options: { A: 'Maribor', B: 'Celje', C: 'Ljubljana', D: 'Koper' },
    correct: 'C',
  },
  {
    question: 'Quel est le symbole chimique du titane ?',
    options: { A: 'Tn', B: 'Tt', C: 'Ti', D: 'Th' },
    correct: 'C',
  },
  {
    question: 'Quel océan borde la côte est des États-Unis ?',
    options: { A: 'Océan Pacifique', B: 'Océan Indien', C: 'Océan Atlantique', D: 'Océan Arctique' },
    correct: 'C',
  },
  {
    question: 'Qui a peint Le Déjeuner sur l’herbe en 1863 ?',
    options: { A: 'Claude Monet', B: 'Edgar Degas', C: 'Édouard Manet', D: 'Gustave Caillebotte' },
    correct: 'C',
  },
  {
    question: 'Combien de joueurs composent une équipe de water-polo dans l’eau (gardien compris) ?',
    options: { A: '5', B: '6', C: '7', D: '8' },
    correct: 'C',
  },
  {
    question: 'Quelle est la capitale du Pérou ?',
    options: { A: 'Cusco', B: 'Arequipa', C: 'Lima', D: 'Trujillo' },
    correct: 'C',
  },
  {
    question: 'Quel est le gaz qui compose la majeure partie de l’atmosphère de Mars ?',
    options: { A: 'Diazote', B: 'Dioxygène', C: 'Dioxyde de carbone', D: 'Argon' },
    correct: 'C',
  },
  {
    question: 'Qui a écrit Les Travailleurs de la mer ?',
    options: { A: 'Jules Verne', B: 'Émile Zola', C: 'Victor Hugo', D: 'Guy de Maupassant' },
    correct: 'C',
  },
  {
    question: 'Quel fleuve traverse la ville de Séville ?',
    options: { A: 'L’Èbre', B: 'Le Tage', C: 'Le Guadalquivir', D: 'Le Douro' },
    correct: 'C',
  },
  {
    question: 'Quel est le symbole chimique du baryum ?',
    options: { A: 'By', B: 'Br', C: 'Ba', D: 'Bh' },
    correct: 'C',
  },
  {
    question: 'Dans quel pays se trouve le site mégalithique de Stonehenge ?',
    options: { A: 'Irlande', B: 'France', C: 'Royaume-Uni', D: 'Danemark' },
    correct: 'C',
  },
  {
    question: 'Qui a composé la Symphonie du Nouveau Monde (Symphonie n° 9) ?',
    options: { A: 'Bedřich Smetana', B: 'Leoš Janáček', C: 'Antonín Dvořák', D: 'Gustav Mahler' },
    correct: 'C',
  },
  {
    question: 'Quelle est la capitale de la Lituanie ?',
    options: { A: 'Kaunas', B: 'Klaipėda', C: 'Vilnius', D: 'Šiauliai' },
    correct: 'C',
  },
  {
    question: 'Quel est l’organe qui assure la filtration et la désintoxication de nombreuses substances dans le sang ?',
    options: { A: 'Le poumon', B: 'Le rein', C: 'Le foie', D: 'La rate' },
    correct: 'C',
  },
  {
    question: 'Combien de jours compte une semaine ?',
    options: { A: '5', B: '6', C: '7', D: '8' },
    correct: 'C',
  },
  {
    question: 'Qui a écrit Le Tour du monde en quatre-vingts jours ?',
    options: { A: 'Alexandre Dumas', B: 'H. G. Wells', C: 'Jules Verne', D: 'Jack London' },
    correct: 'C',
  },
  {
    question: 'Quelle mer borde les côtes de la Grèce et de la Turquie à l’ouest de l’Anatolie ?',
    options: { A: 'Mer Noire', B: 'Mer Adriatique', C: 'Mer Égée', D: 'Mer Ionienne' },
    correct: 'C',
  },
  {
    question: 'Quel est le symbole chimique du bore ?',
    options: { A: 'Bo', B: 'Br', C: 'B', D: 'Bh' },
    correct: 'C',
  },
  {
    question: 'Quelle est la capitale de la Lettonie ?',
    options: { A: 'Daugavpils', B: 'Liepāja', C: 'Riga', D: 'Jūrmala' },
    correct: 'C',
  },
  {
    question: 'Quel animal terrestre est réputé pour sa très grande taille grâce à son long cou ?',
    options: { A: 'Chameau', B: 'Autruche', C: 'Girafe', D: 'Zèbre' },
    correct: 'C',
  },
  {
    question: 'En quelle année a eu lieu le premier vol motorisé et contrôlé des frères Wright ?',
    options: { A: '1899', B: '1901', C: '1903', D: '1908' },
    correct: 'C',
  },
  {
    question: 'Qui a peint Les Ménines en 1656 ?',
    options: { A: 'Francisco Goya', B: 'El Greco', C: 'Diego Vélasquez', D: 'Bartolomé Esteban Murillo' },
    correct: 'C',
  },
  {
    question: 'Quel est le plus long fleuve d’Allemagne ?',
    options: { A: 'L’Elbe', B: 'Le Danube', C: 'Le Rhin', D: 'Le Weser' },
    correct: 'C',
  },
  {
    question: 'Combien de chiffres composent un code PIN à 4 chiffres ?',
    options: { A: '2', B: '3', C: '4', D: '5' },
    correct: 'C',
  },
  {
    question: 'Qui a écrit Bel-Ami ?',
    options: { A: 'Gustave Flaubert', B: 'Émile Zola', C: 'Guy de Maupassant', D: 'Honoré de Balzac' },
    correct: 'C',
  },
  {
    question: 'Quelle est la capitale de l’Estonie ?',
    options: { A: 'Tartu', B: 'Pärnu', C: 'Tallinn', D: 'Narva' },
    correct: 'C',
  },
]
