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
      options: { A: 'Bruxelles', B: 'Anvers', C: 'Liège', D: 'Gand' },
      correct: 'A',
    },
  {
      question: 'Quel est le plus grand océan de la planète ?',
      options: { A: 'Océan Arctique', B: 'Océan Atlantique', C: 'Océan Indien', D: 'Océan Pacifique' },
      correct: 'D',
    },
  {
      question: 'Quel fleuve traverse la ville de Paris ?',
      options: { A: 'La Loire', B: 'La Seine', C: 'Le Rhône', D: 'La Garonne' },
      correct: 'B',
    },
  {
      question: 'Quel pays possède la plus grande superficie au monde ?',
      options: { A: 'Russie', B: 'Canada', C: 'États-Unis', D: 'Chine' },
      correct: 'A',
    },
  {
      question: 'Quelle est la capitale du Japon ?',
      options: { A: 'Tokyo', B: 'Osaka', C: 'Kyoto', D: 'Sapporo' },
      correct: 'A',
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
      options: { A: 'Gobi', B: 'Atacama', C: 'Kalahari', D: 'Sahara' },
      correct: 'D',
    },
  {
      question: 'Quelle est la capitale de l’Australie ?',
      options: { A: 'Sydney', B: 'Melbourne', C: 'Perth', D: 'Canberra' },
      correct: 'D',
    },
  {
      question: 'Quelle mer intérieure est réputée pour sa très forte salinité ?',
      options: { A: 'La mer Noire', B: 'La mer Morte', C: 'La mer Baltique', D: 'La mer Rouge' },
      correct: 'B',
    },
  {
      question: 'Quel est le fleuve le plus long d’Afrique ?',
      options: { A: 'Le Congo', B: 'Le Zambèze', C: 'Le Nil', D: 'Le Niger' },
      correct: 'C',
    },
  {
      question: 'Quelle chaîne de montagnes longe la côte ouest de l’Amérique du Sud ?',
      options: { A: 'Les Carpates', B: 'Les Rocheuses', C: 'La cordillère des Andes', D: 'L’Atlas' },
      correct: 'C',
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
      options: { A: 'Groenland', B: 'Bornéo', C: 'Grande-Bretagne', D: 'Madagascar' },
      correct: 'A',
    },
  {
      question: 'Quelle est la capitale du Brésil ?',
      options: { A: 'Brasilia', B: 'Rio de Janeiro', C: 'São Paulo', D: 'Salvador' },
      correct: 'A',
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
      options: { A: 'Florence', B: 'Naples', C: 'Venise', D: 'Milan' },
      correct: 'C',
    },
  {
      question: 'En quelle année le mur de Berlin est-il tombé ?',
      options: { A: '1987', B: '1989', C: '1991', D: '1993' },
      correct: 'B',
    },
  {
      question: 'Qui fut le premier être humain à poser le pied sur la Lune en 1969 ?',
      options: { A: 'Neil Armstrong', B: 'Buzz Aldrin', C: 'Youri Gagarine', D: 'Michael Collins' },
      correct: 'A',
    },
  {
      question: 'En quelle année Christophe Colomb a-t-il atteint les Amériques ?',
      options: { A: '1519', B: '1498', C: '1502', D: '1492' },
      correct: 'D',
    },
  {
      question: 'Qui a peint La Joconde ?',
      options: { A: 'Michel-Ange', B: 'Raphaël', C: 'Caravage', D: 'Léonard de Vinci' },
      correct: 'D',
    },
  {
      question: 'Quel pharaon égyptien est célèbre pour son masque funéraire en or ?',
      options: { A: 'Ramsès II', B: 'Akhenaton', C: 'Khéops', D: 'Toutânkhamon' },
      correct: 'D',
    },
  {
      question: 'En quelle année a débuté la Première Guerre mondiale ?',
      options: { A: '1913', B: '1914', C: '1912', D: '1918' },
      correct: 'B',
    },
  {
      question: 'Quelle civilisation précolombienne a bâti le Machu Picchu ?',
      options: { A: 'Mayas', B: 'Aztèques', C: 'Incas', D: 'Olmèques' },
      correct: 'C',
    },
  {
      question: 'Qui a été sacré empereur des Français en 1804 ?',
      options: { A: 'Louis XVI', B: 'Napoléon Ier', C: 'Charles X', D: 'Napoléon III' },
      correct: 'B',
    },
  {
      question: 'Lors de quelle bataille Napoléon Ier a-t-il subi sa défaite définitive en 1815 ?',
      options: { A: 'Austerlitz', B: 'Iéna', C: 'Leipzig', D: 'Waterloo' },
      correct: 'D',
    },
  {
      question: 'Quel célèbre amphithéâtre de Rome accueillait des combats de gladiateurs ?',
      options: { A: 'Le forum Romain', B: 'Le Panthéon', C: 'Le Colisée', D: 'Le Cirque Maxime' },
      correct: 'C',
    },
  {
      question: 'Qui fut la première femme à recevoir un prix Nobel ?',
      options: { A: 'Rosalind Franklin', B: 'Marie Curie', C: 'Ada Lovelace', D: 'Simone Veil' },
      correct: 'B',
    },
  {
      question: 'En quelle année les États-Unis ont-ils proclamé leur déclaration d’indépendance ?',
      options: { A: '1774', B: '1789', C: '1783', D: '1776' },
      correct: 'D',
    },
  {
      question: 'Quel était l’ancien nom de la ville d’Istanbul ?',
      options: { A: 'Constantinople', B: 'Smyrne', C: 'Athènes', D: 'Éphèse' },
      correct: 'A',
    },
  {
      question: 'Quel roi de France était surnommé le Roi-Soleil ?',
      options: { A: 'Henri IV', B: 'Louis XV', C: 'Louis XVI', D: 'Louis XIV' },
      correct: 'D',
    },
  {
      question: 'Quelle période de la préhistoire est marquée par la sédentarisation et l’agriculture ?',
      options: { A: 'Paléolithique', B: 'Néolithique', C: 'Âge du bronze', D: 'Mésolithique' },
      correct: 'B',
    },
  {
      question: 'Quel mur romain traverse le nord de l’Angleterre ?',
      options: { A: 'Mur de Berlin', B: 'Mur d’Hadrien', C: 'Mur d’Anvers', D: 'Mur de Trajan' },
      correct: 'B',
    },
  {
      question: 'Qui fut le premier président des États-Unis ?',
      options: { A: 'Thomas Jefferson', B: 'George Washington', C: 'Abraham Lincoln', D: 'John Adams' },
      correct: 'B',
    },
  {
      question: 'Quelle était la langue officielle de l’Empire romain ?',
      options: { A: 'L’étrusque', B: 'Le grec ancien', C: 'Le latin', D: 'L’araméen' },
      correct: 'C',
    },
  {
      question: 'En quelle année a eu lieu la révolution d’Octobre en Russie ?',
      options: { A: '1905', B: '1917', C: '1915', D: '1914' },
      correct: 'B',
    },
  {
      question: 'Quel est le symbole chimique de l’or dans le tableau périodique ?',
      options: { A: 'Ag', B: 'Fe', C: 'Or', D: 'Au' },
      correct: 'D',
    },
  {
      question: 'Quelle planète est la plus proche du Soleil ?',
      options: { A: 'Vénus', B: 'Mercure', C: 'Mars', D: 'Terre' },
      correct: 'B',
    },
  {
      question: 'Quel gaz représente environ 78 % de l’atmosphère terrestre ?',
      options: { A: 'Le dioxygène', B: 'Le dioxyde de carbone', C: 'Le diazote', D: 'L’argon' },
      correct: 'C',
    },
  {
      question: 'Quel organe assure la circulation du sang dans tout le corps humain ?',
      options: { A: 'Le poumon', B: 'Le foie', C: 'Le rein', D: 'Le cœur' },
      correct: 'D',
    },
  {
      question: 'Quelle est la formule chimique de l’eau ?',
      options: { A: 'H2O', B: 'O2', C: 'CO2', D: 'NaCl' },
      correct: 'A',
    },
  {
      question: 'Quel est l’animal terrestre le plus rapide en course ?',
      options: { A: 'L’antilope', B: 'Le lévrier', C: 'Le lion', D: 'Le guépard' },
      correct: 'D',
    },
  {
      question: 'Quel métal est liquide à température ambiante ?',
      options: { A: 'Le zinc', B: 'Le cuivre', C: 'Le mercure', D: 'L’étain' },
      correct: 'C',
    },
  {
      question: 'Combien de dents définitives possède un adulte (dents de sagesse comprises) ?',
      options: { A: '32', B: '30', C: '31', D: '28' },
      correct: 'A',
    },
  {
      question: 'Quelle planète du système solaire est célèbre pour ses grands anneaux ?',
      options: { A: 'Jupiter', B: 'Neptune', C: 'Uranus', D: 'Saturne' },
      correct: 'D',
    },
  {
      question: 'Quel est le seul groupe de mammifères capable d’un vol battu soutenu ?',
      options: { A: 'L’écureuil volant', B: 'Le lémur volant', C: 'La chauve-souris', D: 'Le planeur de sucre' },
      correct: 'C',
    },
  {
      question: 'Quelle est l’unité du Système international pour la résistance électrique ?',
      options: { A: 'Le tesla', B: 'Le watt', C: 'L’ohm', D: 'Le lux' },
      correct: 'C',
    },
  {
      question: 'Quel est le plus grand oiseau vivant incapable de voler ?',
      options: { A: 'L’émeu', B: 'L’autruche', C: 'Le casoar', D: 'Le manchot empereur' },
      correct: 'B',
    },
  {
      question: 'Comment appelle-t-on le mécanisme par lequel les plantes utilisent la lumière ?',
      options: { A: 'La photosynthèse', B: 'La fermentation', C: 'La transpiration', D: 'La pollinisation' },
      correct: 'A',
    },
  {
      question: 'Quel est l’os le plus long et le plus solide du squelette humain ?',
      options: { A: 'Le radius', B: 'L’humérus', C: 'Le tibia', D: 'Le fémur' },
      correct: 'D',
    },
  {
      question: 'Quel élément chimique a pour symbole Fe ?',
      options: { A: 'Le fermium', B: 'Le fer', C: 'Le francium', D: 'Le fluor' },
      correct: 'B',
    },
  {
      question: 'Quel cétacé est réputé pour ses chants complexes et ses sauts hors de l’eau ?',
      options: { A: 'La baleine à bosse', B: 'Le narval', C: 'Le marsouin', D: 'Le cachalot' },
      correct: 'A',
    },
  {
      question: 'Quelle est la vitesse approximative de la lumière dans le vide ?',
      options: { A: '150 000 km/s', B: '1 080 km/h', C: '30 000 km/s', D: '300 000 km/s' },
      correct: 'D',
    },
  {
      question: 'Quel arbre produit des glands ?',
      options: { A: 'Le bouleau', B: 'Le chêne', C: 'Le pin', D: 'Le saule' },
      correct: 'B',
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
      options: { A: 'Martin Scorsese', B: 'Christopher Nolan', C: 'Quentin Tarantino', D: 'David Fincher' },
      correct: 'C',
    },
  {
      question: 'Qui a composé Les Quatre Saisons ?',
      options: { A: 'Antonio Vivaldi', B: 'Wolfgang Amadeus Mozart', C: 'Johann Sebastian Bach', D: 'Ludwig van Beethoven' },
      correct: 'A',
    },
  {
      question: 'Quel est le prénom du personnage principal joué par Keanu Reeves dans Matrix ?',
      options: { A: 'Trinity', B: 'Morpheus', C: 'Neo', D: 'Cypher' },
      correct: 'C',
    },
  {
      question: 'Quel groupe britannique a sorti l’album Abbey Road en 1969 ?',
      options: { A: 'The Beatles', B: 'Pink Floyd', C: 'The Rolling Stones', D: 'Led Zeppelin' },
      correct: 'A',
    },
  {
      question: 'Dans quelle ville italienne se déroule l’histoire de Roméo et Juliette ?',
      options: { A: 'Rome', B: 'Bologne', C: 'Vérone', D: 'Pise' },
      correct: 'C',
    },
  {
      question: 'Combien de touches possède un piano acoustique standard ?',
      options: { A: '92', B: '84', C: '76', D: '88' },
      correct: 'D',
    },
  {
      question: 'Quel grand classique Disney met en scène le jeune Simba ?',
      options: { A: 'Le Roi Lion', B: 'Aladdin', C: 'Tarzan', D: 'Frère des ours' },
      correct: 'A',
    },
  {
      question: 'Qui est l’auteur du roman Les Misérables ?',
      options: { A: 'Victor Hugo', B: 'Alexandre Dumas', C: 'Gustave Flaubert', D: 'Émile Zola' },
      correct: 'A',
    },
  {
      question: 'Quelle ville sombre est associée à Batman ?',
      options: { A: 'Metropolis', B: 'Gotham City', C: 'Star City', D: 'Central City' },
      correct: 'B',
    },
  {
      question: 'Quelle danse brésilienne est indissociable du carnaval de Rio ?',
      options: { A: 'Le flamenco', B: 'La samba', C: 'La valse', D: 'Le rock' },
      correct: 'B',
    },
  {
      question: 'Qui a créé Mickey Mouse en 1928 ?',
      options: { A: 'Hanna-Barbera', B: 'Walt Disney', C: 'Tex Avery', D: 'Chuck Jones' },
      correct: 'B',
    },
  {
      question: 'Quel roman de J. R. R. Tolkien suit Frodon Sacquet vers la montagne du Destin ?',
      options: { A: 'Le Silmarillion', B: 'Bilbo le Hobbit', C: 'Le Seigneur des Anneaux', D: 'Les Enfants de Húrin' },
      correct: 'C',
    },
  {
      question: 'Quelle est la couleur emblématique de Hulk ?',
      options: { A: 'Bleu', B: 'Rouge', C: 'Violet', D: 'Vert' },
      correct: 'D',
    },
  {
      question: 'Dans quel quartier de New York le hip-hop a-t-il émergé dans les années 1970 ?',
      options: { A: 'Queens', B: 'Brooklyn', C: 'Le Bronx', D: 'Harlem' },
      correct: 'C',
    },
  {
      question: 'Qui a écrit la pièce de théâtre Cyrano de Bergerac ?',
      options: { A: 'Molière', B: 'Edmond Rostand', C: 'Jean Racine', D: 'Pierre Corneille' },
      correct: 'B',
    },
  {
      question: 'Quel studio d’animation a produit Toy Story en 1995 ?',
      options: { A: 'DreamWorks', B: 'Illumination', C: 'Aardman', D: 'Pixar' },
      correct: 'D',
    },
  {
      question: 'Quel célèbre apprenti sorcier porte une cicatrice en forme d’éclair sur le front ?',
      options: { A: 'Gandalf', B: 'Merlin', C: 'Harry Potter', D: 'Percy Jackson' },
      correct: 'C',
    },
  {
      question: 'Quel mouvement artistique est étroitement lié aux Nymphéas de Claude Monet ?',
      options: { A: 'Le surréalisme', B: 'L’impressionnisme', C: 'Le cubisme', D: 'Le pop art' },
      correct: 'B',
    },
  {
      question: 'Quelle langue officielle est parlée à la fois au Portugal et au Brésil ?',
      options: { A: 'Le galicien', B: 'L’espagnol', C: 'Le catalan', D: 'Le portugais' },
      correct: 'D',
    },
  {
      question: 'Quel personnage emblématique de jeux vidéo porte une casquette rouge et une salopette bleue ?',
      options: { A: 'Sonic', B: 'Link', C: 'Crash Bandicoot', D: 'Mario' },
      correct: 'D',
    },
  {
      question: 'Combien de joueurs par équipe sont sur le terrain au football ?',
      options: { A: '10', B: '12', C: '9', D: '11' },
      correct: 'D',
    },
  {
      question: 'Quelle est la durée réglementaire d’un match de football (hors temps additionnel) ?',
      options: { A: '60 minutes', B: '100 minutes', C: '80 minutes', D: '90 minutes' },
      correct: 'D',
    },
  {
      question: 'Combien y a-t-il de boules numérotées dans un jeu de billard américain standard ?',
      options: { A: '12', B: '15', C: '14', D: '16' },
      correct: 'B',
    },
  {
      question: 'Quelles sont les couleurs des cinq anneaux olympiques sur fond blanc : bleu, jaune, noir, vert et… ?',
      options: { A: 'Orange', B: 'Rouge', C: 'Rose', D: 'Violet' },
      correct: 'B',
    },
  {
      question: 'Quel club de golf est spécifiquement utilisé pour faire rouler la balle sur le green ?',
      options: { A: 'Le driver', B: 'Le fer 7', C: 'Le putter', D: 'Le bois 3' },
      correct: 'C',
    },
  {
      question: 'Combien de cases compte un échiquier standard ?',
      options: { A: '64', B: '56', C: '48', D: '72' },
      correct: 'A',
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
      options: { A: 'La tour', B: 'La reine', C: 'Le cavalier', D: 'Le fou' },
      correct: 'C',
    },
  {
      question: 'Quel sport d’hiver se joue sur la glace avec des pierres de granit et des balais ?',
      options: { A: 'Le curling', B: 'Le patinage artistique', C: 'Le biathlon', D: 'Le bobsleigh' },
      correct: 'A',
    },
  {
      question: 'Combien de cartes contient un jeu de tarot français complet ?',
      options: { A: '54', B: '52', C: '78', D: '32' },
      correct: 'C',
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
      options: { A: '5', B: '7', C: '4', D: '6' },
      correct: 'A',
    },
  {
      question: 'Comment appelle-t-on le fait de renverser les dix quilles au bowling dès le premier lancer ?',
      options: { A: 'Un turkey', B: 'Un spare', C: 'Un split', D: 'Un strike' },
      correct: 'D',
    },
  {
      question: 'Combien de quilles composent un jeu standard de bowling ?',
      options: { A: '6', B: '10', C: '12', D: '8' },
      correct: 'B',
    },
  {
      question: 'Dans quel pays sont nés le judo et le karaté ?',
      options: { A: 'Japon', B: 'Chine', C: 'Corée du Sud', D: 'Thaïlande' },
      correct: 'A',
    },
  {
      question: 'Quelle couleur de ceinture symbolise généralement la maîtrise ou le haut grade dans beaucoup d’arts martiaux ?',
      options: { A: 'Bleue', B: 'Marron', C: 'Noire', D: 'Rouge' },
      correct: 'C',
    },
  {
      question: 'Quelle est la capitale de l’Islande ?',
      options: { A: 'Tallinn', B: 'Oslo', C: 'Helsinki', D: 'Reykjavik' },
      correct: 'D',
    },
  {
      question: 'Quel est le métal le plus abondant dans la croûte terrestre ?',
      options: { A: 'Le fer', B: 'L’aluminium', C: 'Le cuivre', D: 'Le magnésium' },
      correct: 'B',
    },
  {
      question: 'Qui a écrit le roman Orgueil et Préjugés ?',
      options: { A: 'Jane Austen', B: 'Emily Brontë', C: 'Mary Shelley', D: 'Charlotte Brontë' },
      correct: 'A',
    },
  {
      question: 'Quel est le pays le plus peuplé d’Afrique ?',
      options: { A: 'Égypte', B: 'Nigeria', C: 'République démocratique du Congo', D: 'Éthiopie' },
      correct: 'B',
    },
  {
      question: 'En quelle année l’Union européenne a-t-elle introduit l’euro comme monnaie fiduciaire (billets et pièces) ?',
      options: { A: '1999', B: '2001', C: '2002', D: '2004' },
      correct: 'C',
    },
  {
      question: 'Quel instrument de musique possède 47 cordes et 7 pédales dans sa version de concert classique ?',
      options: { A: 'Le clavecin', B: 'Le violoncelle', C: 'La mandoline', D: 'La harpe' },
      correct: 'D',
    },
  {
      question: 'Quelle planète du système solaire possède la rotation la plus lente sur elle-même ?',
      options: { A: 'Mercure', B: 'Neptune', C: 'Mars', D: 'Vénus' },
      correct: 'D',
    },
  {
      question: 'Dans quel pays se trouve le site antique de Pétra ?',
      options: { A: 'Égypte', B: 'Syrie', C: 'Liban', D: 'Jordanie' },
      correct: 'D',
    },
  {
      question: 'Quel est le symbole chimique du sodium ?',
      options: { A: 'So', B: 'Sd', C: 'Na', D: 'No' },
      correct: 'C',
    },
  {
      question: 'Qui a composé la célèbre bande originale du film Le Bon, la Brute et le Truand ?',
      options: { A: 'John Williams', B: 'Ennio Morricone', C: 'Nino Rota', D: 'Hans Zimmer' },
      correct: 'B',
    },
  {
      question: 'Quel est le plus long fleuve d’Asie ?',
      options: { A: 'Le Mékong', B: 'Le fleuve Jaune', C: 'Le Yangtsé', D: 'L’Indus' },
      correct: 'C',
    },
  {
      question: 'Combien de joueurs composent une équipe de volley-ball sur le terrain ?',
      options: { A: '5', B: '8', C: '7', D: '6' },
      correct: 'D',
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
      options: { A: 'Titan', B: 'Io', C: 'Ganymède', D: 'Europe' },
      correct: 'A',
    },
  {
      question: 'Qui a écrit Don Quichotte ?',
      options: { A: 'Lope de Vega', B: 'Gabriel García Márquez', C: 'Jorge Luis Borges', D: 'Miguel de Cervantes' },
      correct: 'D',
    },
  {
      question: 'Quelle mer borde les côtes de la Suède, de la Finlande et des pays baltes ?',
      options: { A: 'Mer du Nord', B: 'Mer Baltique', C: 'Mer de Barents', D: 'Mer de Norvège' },
      correct: 'B',
    },
  {
      question: 'Combien de côtés possède un décagone ?',
      options: { A: '8', B: '9', C: '10', D: '12' },
      correct: 'C',
    },
  {
      question: 'Quel scientifique a formulé les lois universelles de la gravitation et du mouvement ?',
      options: { A: 'Johannes Kepler', B: 'Isaac Newton', C: 'Galilée', D: 'Nicolas Copernic' },
      correct: 'B',
    },
  {
      question: 'Quelle est la capitale de la Grèce ?',
      options: { A: 'Sparte', B: 'Delphes', C: 'Athènes', D: 'Thessalonique' },
      correct: 'C',
    },
  {
      question: 'Quel est l’organe qui produit principalement la bile chez l’humain ?',
      options: { A: 'Le pancréas', B: 'Le foie', C: 'La vésicule biliaire', D: 'L’estomac' },
      correct: 'B',
    },
  {
      question: 'En quelle année a eu lieu l’appel du 18 Juin du général de Gaulle ?',
      options: { A: '1939', B: '1940', C: '1942', D: '1944' },
      correct: 'B',
    },
  {
      question: 'Quel est l’animal terrestre capable de produire le rugissement audible le plus loin ?',
      options: { A: 'Le tigre', B: 'Le jaguar', C: 'L’éléphant', D: 'Le lion' },
      correct: 'D',
    },
  {
      question: 'Quelle est la monnaie officielle du Royaume-Uni ?',
      options: { A: 'L’euro', B: 'La livre sterling', C: 'Le dollar britannique', D: 'La couronne' },
      correct: 'B',
    },
  {
      question: 'Qui a peint La Nuit étoilée en 1889 ?',
      options: { A: 'Henri Matisse', B: 'Vincent van Gogh', C: 'Paul Cézanne', D: 'Claude Monet' },
      correct: 'B',
    },
  {
      question: 'Quel gaz est responsable de l’effet de serre naturel et anthropique le plus abondant parmi les gaz émis par l’activité humaine ?',
      options: { A: 'Le méthane', B: 'Le dioxyde de carbone', C: 'L’ozone', D: 'Le protoxyde d’azote' },
      correct: 'B',
    },
  {
      question: 'Dans quel pays se trouve le mont Fuji ?',
      options: { A: 'Japon', B: 'Chine', C: 'Corée du Sud', D: 'Taïwan' },
      correct: 'A',
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
      options: { A: 'Stockholm', B: 'Göteborg', C: 'Uppsala', D: 'Malmö' },
      correct: 'A',
    },
  {
      question: 'Combien d’années dure un mandat présidentiel en France depuis la réforme de 2000 ?',
      options: { A: '7 ans', B: '4 ans', C: '6 ans', D: '5 ans' },
      correct: 'D',
    },
  {
      question: 'Quel est le symbole chimique du potassium ?',
      options: { A: 'Po', B: 'K', C: 'Pt', D: 'P' },
      correct: 'B',
    },
  {
      question: 'Quel fleuve traverse la ville de Vienne en Autriche ?',
      options: { A: 'Le Danube', B: 'L’Elbe', C: 'Le Rhin', D: 'La Vistule' },
      correct: 'A',
    },
  {
      question: 'Qui a sculpté le célèbre Penseur à Paris ?',
      options: { A: 'Auguste Rodin', B: 'Camille Claudel', C: 'Antoine Bourdelle', D: 'Constantin Brâncuși' },
      correct: 'A',
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
      options: { A: 'Henri Becquerel', B: 'Wilhelm Röntgen', C: 'Ernest Rutherford', D: 'Max Planck' },
      correct: 'A',
    },
  {
      question: 'Quelle est la langue officielle du Brésil ?',
      options: { A: 'Le guarani', B: 'L’espagnol', C: 'Le portugais', D: 'L’italien' },
      correct: 'C',
    },
  {
      question: 'Combien de cordes possède une guitare classique standard ?',
      options: { A: '4', B: '6', C: '7', D: '5' },
      correct: 'B',
    },
  {
      question: 'Quel célèbre navigateur portugais a mené la première expédition qui a entrepris le tour du monde (mort en route aux Philippines) ?',
      options: { A: 'Vasco de Gama', B: 'Bartolomeu Dias', C: 'Pedro Álvares Cabral', D: 'Fernand de Magellan' },
      correct: 'D',
    },
  {
      question: 'Quelle vitamine est principalement impliquée dans la coagulation sanguine ?',
      options: { A: 'Vitamine E', B: 'Vitamine C', C: 'Vitamine A', D: 'Vitamine K' },
      correct: 'D',
    },
  {
      question: 'Quelle est la capitale de la Norvège ?',
      options: { A: 'Bergen', B: 'Trondheim', C: 'Stavanger', D: 'Oslo' },
      correct: 'D',
    },
  {
      question: 'Quel animal est le symbole national de l’Écosse ?',
      options: { A: 'Le cerf', B: 'Le lion', C: 'La licorne', D: 'L’aigle royal' },
      correct: 'C',
    },
  {
      question: 'Qui a écrit le roman 1984 ?',
      options: { A: 'Aldous Huxley', B: 'Ray Bradbury', C: 'George Orwell', D: 'H. G. Wells' },
      correct: 'C',
    },
  {
      question: 'Quelle est la planète la plus chaude du système solaire en température moyenne de surface ?',
      options: { A: 'Mercure', B: 'Jupiter', C: 'Vénus', D: 'Mars' },
      correct: 'C',
    },
  {
      question: 'En quelle année a eu lieu la chute de l’Empire romain d’Occident selon la date traditionnelle ?',
      options: { A: '395', B: '476', C: '410', D: '529' },
      correct: 'B',
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
      options: { A: 'Ludwig van Beethoven', B: 'Wolfgang Amadeus Mozart', C: 'Frédéric Chopin', D: 'Johann Sebastian Bach' },
      correct: 'D',
    },
  {
      question: 'Quelle est la capitale du Portugal ?',
      options: { A: 'Lisbonne', B: 'Coimbra', C: 'Faro', D: 'Porto' },
      correct: 'A',
    },
  {
      question: 'Quel est le nom du détroit qui sépare la Russie de l’Alaska ?',
      options: { A: 'Détroit de Magellan', B: 'Détroit de Davis', C: 'Détroit de Hudson', D: 'Détroit de Béring' },
      correct: 'D',
    },
  {
      question: 'Combien de jours dure un mois de novembre ?',
      options: { A: '29', B: '30', C: '28', D: '31' },
      correct: 'B',
    },
  {
      question: 'Qui a peint La Jeune Fille à la perle ?',
      options: { A: 'Johannes Vermeer', B: 'Frans Hals', C: 'Rembrandt', D: 'Pierre Paul Rubens' },
      correct: 'A',
    },
  {
      question: 'Quel est le point culminant de l’Afrique ?',
      options: { A: 'Ras Dashan', B: 'Mont Cameroun', C: 'Mont Kenya', D: 'Kilimandjaro' },
      correct: 'D',
    },
  {
      question: 'Quel métal est principalement utilisé pour fabriquer les pièces d’or traditionnelles et les bijoux ?',
      options: { A: 'Or', B: 'Cuivre', C: 'Plomb', D: 'Nickel' },
      correct: 'A',
    },
  {
      question: 'Qui a écrit Germinal ?',
      options: { A: 'Émile Zola', B: 'Honoré de Balzac', C: 'Gustave Flaubert', D: 'Guy de Maupassant' },
      correct: 'A',
    },
  {
      question: 'Quelle est la capitale de l’Irlande ?',
      options: { A: 'Belfast', B: 'Galway', C: 'Dublin', D: 'Cork' },
      correct: 'C',
    },
  {
      question: 'Quel est l’instrument principal du violoncelliste Pablo Casals ?',
      options: { A: 'Contrebasse', B: 'Violoncelle', C: 'Violon', D: 'Alto' },
      correct: 'B',
    },
  {
      question: 'Dans quel pays l’invention du papier est-elle traditionnellement attribuée à Cai Lun sous la dynastie Han ?',
      options: { A: 'Inde', B: 'Chine', C: 'Japon', D: 'Égypte' },
      correct: 'B',
    },
  {
      question: 'Quel est le symbole chimique du plomb ?',
      options: { A: 'Pb', B: 'Pl', C: 'Pd', D: 'Pt' },
      correct: 'A',
    },
  {
      question: 'Quelle est la capitale de la Pologne ?',
      options: { A: 'Cracovie', B: 'Gdansk', C: 'Wrocław', D: 'Varsovie' },
      correct: 'D',
    },
  {
      question: 'Quel animal marin est un cétacé à dents doté d’une longue défense torsadée chez le mâle ?',
      options: { A: 'Narval', B: 'Béluga', C: 'Orque', D: 'Cachalot' },
      correct: 'A',
    },
  {
      question: 'Qui a écrit Le Petit Prince ?',
      options: { A: 'Jules Verne', B: 'Antoine de Saint-Exupéry', C: 'Colette', D: 'Marcel Pagnol' },
      correct: 'B',
    },
  {
      question: 'Quelle planète du système solaire est la plus éloignée du Soleil ?',
      options: { A: 'Pluton', B: 'Saturne', C: 'Uranus', D: 'Neptune' },
      correct: 'D',
    },
  {
      question: 'En quelle année l’armistice mettant fin aux combats de la Première Guerre mondiale a-t-il été signé ?',
      options: { A: '1917', B: '1919', C: '1918', D: '1920' },
      correct: 'C',
    },
  {
      question: 'Quel est le nom du fleuve qui traverse la ville de Londres ?',
      options: { A: 'La Tamise', B: 'L’Humber', C: 'La Clyde', D: 'La Severn' },
      correct: 'A',
    },
  {
      question: 'Combien de degrés mesure la somme des angles intérieurs d’un triangle dans la géométrie euclidienne ?',
      options: { A: '90°', B: '120°', C: '360°', D: '180°' },
      correct: 'D',
    },
  {
      question: 'Qui a composé la 9e Symphonie (« Ode à la joie ») ?',
      options: { A: 'Wolfgang Amadeus Mozart', B: 'Johannes Brahms', C: 'Ludwig van Beethoven', D: 'Franz Schubert' },
      correct: 'C',
    },
  {
      question: 'Quelle est la capitale de l’Autriche ?',
      options: { A: 'Salzbourg', B: 'Innsbruck', C: 'Vienne', D: 'Graz' },
      correct: 'C',
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
      options: { A: 'Pierre-Auguste Renoir', B: 'Paul Gauguin', C: 'Edgar Degas', D: 'Vincent van Gogh' },
      correct: 'D',
    },
  {
      question: 'Quel est l’organe qui filtre le sang pour produire l’urine ?',
      options: { A: 'Le foie', B: 'La rate', C: 'Le rein', D: 'Le pancréas' },
      correct: 'C',
    },
  {
      question: 'Dans quelle ville se trouve le musée du Prado ?',
      options: { A: 'Madrid', B: 'Séville', C: 'Barcelone', D: 'Lisbonne' },
      correct: 'A',
    },
  {
      question: 'Quel est le plus long fleuve d’Amérique du Sud ?',
      options: { A: 'L’Orénoque', B: 'Le São Francisco', C: 'Le Paraná', D: 'L’Amazone' },
      correct: 'D',
    },
  {
      question: 'Combien de faces possède un dodécaèdre régulier ?',
      options: { A: '12', B: '8', C: '10', D: '20' },
      correct: 'A',
    },
  {
      question: 'Qui a écrit Candide ?',
      options: { A: 'Jean-Jacques Rousseau', B: 'Voltaire', C: 'Denis Diderot', D: 'Montesquieu' },
      correct: 'B',
    },
  {
      question: 'Quel est le symbole chimique du magnésium ?',
      options: { A: 'Mn', B: 'Ma', C: 'Mg', D: 'Ms' },
      correct: 'C',
    },
  {
      question: 'Quelle est la capitale de l’Égypte ?',
      options: { A: 'Alexandrie', B: 'Gizeh', C: 'Le Caire', D: 'Louxor' },
      correct: 'C',
    },
  {
      question: 'Quel instrument mesure la vitesse du vent ?',
      options: { A: 'Baromètre', B: 'Hygromètre', C: 'Anémomètre', D: 'Pluviomètre' },
      correct: 'C',
    },
  {
      question: 'En quelle année l’homme a-t-il envoyé la première sonde à s’approcher ou se poser sur Mars avec succès (Viking 1) ?',
      options: { A: '1976', B: '1973', C: '1969', D: '1981' },
      correct: 'A',
    },
  {
      question: 'Quel est le nom du continent où se trouve le désert de Gobi ?',
      options: { A: 'Asie', B: 'Afrique', C: 'Amérique du Nord', D: 'Australie' },
      correct: 'A',
    },
  {
      question: 'Qui a écrit Le Comte de Monte-Cristo ?',
      options: { A: 'Victor Hugo', B: 'Honoré de Balzac', C: 'Eugène Sue', D: 'Alexandre Dumas' },
      correct: 'D',
    },
  {
      question: 'Quelle est la capitale de la Finlande ?',
      options: { A: 'Turku', B: 'Helsinki', C: 'Tampere', D: 'Espoo' },
      correct: 'B',
    },
  {
      question: 'Quel gaz est essentiel à la combustion et à la respiration des animaux ?',
      options: { A: 'Dioxygène', B: 'Diazote', C: 'Argon', D: 'Hélium' },
      correct: 'A',
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
      options: { A: 'Rhinocéros blanc', B: 'Éléphant de savane d’Afrique', C: 'Hippopotame', D: 'Girafe' },
      correct: 'B',
    },
  {
      question: 'Quelle est la capitale du Danemark ?',
      options: { A: 'Copenhague', B: 'Odense', C: 'Aalborg', D: 'Aarhus' },
      correct: 'A',
    },
  {
      question: 'Quel est le symbole chimique du calcium ?',
      options: { A: 'Cm', B: 'Ca', C: 'Cl', D: 'Cu' },
      correct: 'B',
    },
  {
      question: 'Qui a écrit Vingt mille lieues sous les mers ?',
      options: { A: 'Jules Verne', B: 'Robert Louis Stevenson', C: 'H. G. Wells', D: 'Arthur Conan Doyle' },
      correct: 'A',
    },
  {
      question: 'Quelle mer borde les côtes sud-est de la France continentale ?',
      options: { A: 'Mer Méditerranée', B: 'Mer de Norvège', C: 'Mer du Nord', D: 'Mer Adriatique' },
      correct: 'A',
    },
  {
      question: 'Combien de côtés possède un hexagone ?',
      options: { A: '5', B: '7', C: '8', D: '6' },
      correct: 'D',
    },
  {
      question: 'Quel est le nom de la planète naine située dans la ceinture de Kuiper et découverte en 1930 ?',
      options: { A: 'Cérès', B: 'Pluton', C: 'Hauméa', D: 'Éris' },
      correct: 'B',
    },
  {
      question: 'Qui a composé l’opéra Carmen ?',
      options: { A: 'Georges Bizet', B: 'Giacomo Puccini', C: 'Gioachino Rossini', D: 'Giuseppe Verdi' },
      correct: 'A',
    },
  {
      question: 'Quelle est la capitale de la Hongrie ?',
      options: { A: 'Budapest', B: 'Bratislava', C: 'Prague', D: 'Bucarest' },
      correct: 'A',
    },
  {
      question: 'Quel est le symbole chimique de l’azote ?',
      options: { A: 'Az', B: 'Ne', C: 'Na', D: 'N' },
      correct: 'D',
    },
  {
      question: 'Dans quel pays se trouve l’Acropole d’Athènes ?',
      options: { A: 'Grèce', B: 'Turquie', C: 'Chypre', D: 'Bulgarie' },
      correct: 'A',
    },
  {
      question: 'Qui a écrit Madame Bovary ?',
      options: { A: 'Émile Zola', B: 'Honoré de Balzac', C: 'Stendhal', D: 'Gustave Flaubert' },
      correct: 'D',
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
      options: { A: 'Éris', B: 'Pluton', C: 'Cérès', D: 'Makemake' },
      correct: 'A',
    },
  {
      question: 'Quelle est la capitale de la République tchèque ?',
      options: { A: 'Brno', B: 'Ostrava', C: 'Plzeň', D: 'Prague' },
      correct: 'D',
    },
  {
      question: 'Combien de jours compte une année non bissextile ?',
      options: { A: '364', B: '365', C: '366', D: '360' },
      correct: 'B',
    },
  {
      question: 'Qui a peint La Cène à Milan ?',
      options: { A: 'Michel-Ange', B: 'Raphaël', C: 'Titien', D: 'Léonard de Vinci' },
      correct: 'D',
    },
  {
      question: 'Quel est le fleuve qui traverse la ville de Rome ?',
      options: { A: 'L’Arno', B: 'Le Pô', C: 'L’Adige', D: 'Le Tibre' },
      correct: 'D',
    },
  {
      question: 'Quel gaz est utilisé pour gonfler la plupart des ballons dirigeables modernes et certains ballons de fête non inflammables ?',
      options: { A: 'Hélium', B: 'Hydrogène', C: 'Méthane', D: 'Azote' },
      correct: 'A',
    },
  {
      question: 'Quelle est la capitale de la Croatie ?',
      options: { A: 'Split', B: 'Dubrovnik', C: 'Rijeka', D: 'Zagreb' },
      correct: 'D',
    },
  {
      question: 'Qui a écrit Le Rouge et le Noir ?',
      options: { A: 'Gustave Flaubert', B: 'Honoré de Balzac', C: 'Émile Zola', D: 'Stendhal' },
      correct: 'D',
    },
  {
      question: 'Quel est le symbole chimique du soufre ?',
      options: { A: 'Su', B: 'So', C: 'Sf', D: 'S' },
      correct: 'D',
    },
  {
      question: 'Dans quel pays se trouve le Taj Mahal ?',
      options: { A: 'Inde', B: 'Népal', C: 'Pakistan', D: 'Bangladesh' },
      correct: 'A',
    },
  {
      question: 'Combien de côtés possède un heptagone ?',
      options: { A: '8', B: '6', C: '5', D: '7' },
      correct: 'D',
    },
  {
      question: 'Qui a composé La Traviata ?',
      options: { A: 'Giacomo Puccini', B: 'Gaetano Donizetti', C: 'Gioachino Rossini', D: 'Giuseppe Verdi' },
      correct: 'D',
    },
  {
      question: 'Quelle est la capitale de l’Écosse ?',
      options: { A: 'Glasgow', B: 'Édimbourg', C: 'Aberdeen', D: 'Dundee' },
      correct: 'B',
    },
  {
      question: 'Quel est l’organe qui assure la vision en captant la lumière ?',
      options: { A: 'L’œil', B: 'La peau', C: 'L’oreille', D: 'Le nez' },
      correct: 'A',
    },
  {
      question: 'En quelle année a eu lieu la bataille de Marignan ?',
      options: { A: '1494', B: '1508', C: '1515', D: '1525' },
      correct: 'C',
    },
  {
      question: 'Quel est le plus grand océan après l’océan Pacifique ?',
      options: { A: 'Océan Arctique', B: 'Océan Atlantique', C: 'Océan Indien', D: 'Océan Austral' },
      correct: 'B',
    },
  {
      question: 'Qui a écrit Fahrenheit 451 ?',
      options: { A: 'Isaac Asimov', B: 'Philip K. Dick', C: 'Ray Bradbury', D: 'Arthur C. Clarke' },
      correct: 'C',
    },
  {
      question: 'Quelle est la capitale de la Serbie ?',
      options: { A: 'Novi Sad', B: 'Niš', C: 'Subotica', D: 'Belgrade' },
      correct: 'D',
    },
  {
      question: 'Quel est le symbole chimique de l’argent ?',
      options: { A: 'Ag', B: 'Au', C: 'Ar', D: 'Al' },
      correct: 'A',
    },
  {
      question: 'Quel animal terrestre est connu pour sa longue trompe préhensile et ses défenses en ivoire ?',
      options: { A: 'Rhinocéros', B: 'Éléphant', C: 'Tapir', D: 'Sanglier' },
      correct: 'B',
    },
  {
      question: 'Quelle mer borde les côtes de la Jordanie et d’Israël au sud ?',
      options: { A: 'Mer Rouge', B: 'Mer Noire', C: 'Mer Méditerranée', D: 'Mer Caspienne' },
      correct: 'A',
    },
  {
      question: 'Qui a peint L’École d’Athènes au palais du Vatican ?',
      options: { A: 'Léonard de Vinci', B: 'Michel-Ange', C: 'Le Pérugin', D: 'Raphaël' },
      correct: 'D',
    },
  {
      question: 'Combien de minutes y a-t-il dans une journée complète ?',
      options: { A: '1 440', B: '1 000', C: '720', D: '2 400' },
      correct: 'A',
    },
  {
      question: 'Quelle est la capitale de la Thaïlande ?',
      options: { A: 'Phuket', B: 'Chiang Mai', C: 'Bangkok', D: 'Pattaya' },
      correct: 'C',
    },
  {
      question: 'Qui a écrit L’Île au trésor ?',
      options: { A: 'Robert Louis Stevenson', B: 'Daniel Defoe', C: 'Jules Verne', D: 'Jonathan Swift' },
      correct: 'A',
    },
  {
      question: 'Quel métal est le principal composant du bronze avec l’étain ?',
      options: { A: 'Fer', B: 'Zinc', C: 'Cuivre', D: 'Nickel' },
      correct: 'C',
    },
  {
      question: 'Dans quel pays se trouve le désert d’Atacama, réputé pour son extrême sécheresse ?',
      options: { A: 'Pérou', B: 'Chili', C: 'Argentine', D: 'Bolivie' },
      correct: 'B',
    },
  {
      question: 'Qui a composé les Nocturnes pour piano ?',
      options: { A: 'Frédéric Chopin', B: 'Robert Schumann', C: 'Franz Liszt', D: 'Claude Debussy' },
      correct: 'A',
    },
  {
      question: 'Quelle est la capitale de la Corée du Sud ?',
      options: { A: 'Séoul', B: 'Incheon', C: 'Daegu', D: 'Busan' },
      correct: 'A',
    },
  {
      question: 'Quel est l’élément chimique de symbole Ne ?',
      options: { A: 'Nickel', B: 'Nobélium', C: 'Néon', D: 'Néodyme' },
      correct: 'C',
    },
  {
      question: 'Combien de joueurs composent une équipe de hockey sur glace sur la patinoire (gardien compris) ?',
      options: { A: '7', B: '6', C: '5', D: '8' },
      correct: 'B',
    },
  {
      question: 'Qui a écrit Le Seigneur des Anneaux ?',
      options: { A: 'Ursula K. Le Guin', B: 'George R. R. Martin', C: 'C. S. Lewis', D: 'J. R. R. Tolkien' },
      correct: 'D',
    },
  {
      question: 'Quel fleuve arrose la ville de Lyon ?',
      options: { A: 'La Seine', B: 'Le Rhône', C: 'La Loire', D: 'La Saône uniquement' },
      correct: 'B',
    },
  {
      question: 'Quelle planète est la deuxième plus grande du système solaire ?',
      options: { A: 'Uranus', B: 'Saturne', C: 'Jupiter', D: 'Neptune' },
      correct: 'B',
    },
  {
      question: 'En quelle année a eu lieu la prise de la Bastille ?',
      options: { A: '1789', B: '1787', C: '1792', D: '1776' },
      correct: 'A',
    },
  {
      question: 'Quel est le plus petit océan du monde ?',
      options: { A: 'Océan Indien', B: 'Océan Arctique', C: 'Océan Atlantique', D: 'Océan Austral' },
      correct: 'B',
    },
  {
      question: 'Qui a peint La Liberté guidant le peuple en 1830 ?',
      options: { A: 'Théodore Géricault', B: 'Eugène Delacroix', C: 'Gustave Courbet', D: 'Jean-Auguste-Dominique Ingres' },
      correct: 'B',
    },
  {
      question: 'Quelle est la capitale de l’Argentine ?',
      options: { A: 'Córdoba', B: 'Rosario', C: 'Buenos Aires', D: 'Mendoza' },
      correct: 'C',
    },
  {
      question: 'Quel est le nom de la molécule qui porte l’information génétique chez la plupart des êtres vivants ?',
      options: { A: 'ADN', B: 'ATP', C: 'ARNt', D: 'Insuline' },
      correct: 'A',
    },
  {
      question: 'Combien de côtés possède un nonagone ?',
      options: { A: '7', B: '9', C: '10', D: '8' },
      correct: 'B',
    },
  {
      question: 'Qui a écrit Robinson Crusoé ?',
      options: { A: 'Daniel Defoe', B: 'Henry Fielding', C: 'Jonathan Swift', D: 'Samuel Richardson' },
      correct: 'A',
    },
  {
      question: 'Quelle chaîne de montagnes sépare l’Europe de l’Asie en partie ?',
      options: { A: 'Les Pyrénées', B: 'Les Alpes', C: 'Les Carpates', D: 'L’Oural' },
      correct: 'D',
    },
  {
      question: 'Quel est le symbole chimique du fluor ?',
      options: { A: 'Fl', B: 'F', C: 'Fr', D: 'Fm' },
      correct: 'B',
    },
  {
      question: 'Quelle est la capitale de la Tunisie ?',
      options: { A: 'Kairouan', B: 'Sfax', C: 'Sousse', D: 'Tunis' },
      correct: 'D',
    },
  {
      question: 'Quel oiseau marin est célèbre pour son bec volumineux et coloré en saison de reproduction ?',
      options: { A: 'Albatros', B: 'Cormoran', C: 'Macareux moine', D: 'Goéland' },
      correct: 'C',
    },
  {
      question: 'Qui a composé Le Boléro en 1928 ?',
      options: { A: 'Maurice Ravel', B: 'Erik Satie', C: 'Claude Debussy', D: 'Camille Saint-Saëns' },
      correct: 'A',
    },
  {
      question: 'Dans quel pays se trouve la ville de Cracovie ?',
      options: { A: 'République tchèque', B: 'Slovaquie', C: 'Pologne', D: 'Lituanie' },
      correct: 'C',
    },
  {
      question: 'Quel organe produit l’insuline dans le corps humain ?',
      options: { A: 'La rate', B: 'Le pancréas', C: 'Le foie', D: 'La thyroïde' },
      correct: 'B',
    },
  {
      question: 'Combien de zéros comporte un milliard dans l’échelle courte (utilisée en français et en anglais) ?',
      options: { A: '9', B: '6', C: '8', D: '12' },
      correct: 'A',
    },
  {
      question: 'Qui a écrit Les Fleurs du mal ?',
      options: { A: 'Arthur Rimbaud', B: 'Paul Verlaine', C: 'Charles Baudelaire', D: 'Stéphane Mallarmé' },
      correct: 'C',
    },
  {
      question: 'Quelle est la capitale du Maroc ?',
      options: { A: 'Casablanca', B: 'Rabat', C: 'Marrakech', D: 'Fès' },
      correct: 'B',
    },
  {
      question: 'Quel est le symbole chimique du lithium ?',
      options: { A: 'Li', B: 'Lh', C: 'Lt', D: 'Lm' },
      correct: 'A',
    },
  {
      question: 'Quel fleuve traverse la ville de Budapest ?',
      options: { A: 'L’Elbe', B: 'Le Danube', C: 'Le Rhin', D: 'La Tisza' },
      correct: 'B',
    },
  {
      question: 'Qui a peint Le Baiser à Vienne ?',
      options: { A: 'Egon Schiele', B: 'Oskar Kokoschka', C: 'Gustav Klimt', D: 'Arnold Böcklin' },
      correct: 'C',
    },
  {
      question: 'Quel est le plus grand pays d’Amérique du Sud par sa superficie ?',
      options: { A: 'Brésil', B: 'Pérou', C: 'Colombie', D: 'Argentine' },
      correct: 'A',
    },
  {
      question: 'Combien de cordes possède un violon accordé de façon standard ?',
      options: { A: '6', B: '5', C: '3', D: '4' },
      correct: 'D',
    },
  {
      question: 'Qui a écrit Hamlet ?',
      options: { A: 'William Shakespeare', B: 'Christopher Marlowe', C: 'Ben Jonson', D: 'John Webster' },
      correct: 'A',
    },
  {
      question: 'Quelle est la capitale de la Bulgarie ?',
      options: { A: 'Plovdiv', B: 'Varna', C: 'Sofia', D: 'Bourgas' },
      correct: 'C',
    },
  {
      question: 'Quel est l’élément chimique de symbole Cl ?',
      options: { A: 'Cobalt', B: 'Chrome', C: 'Calcium', D: 'Chlore' },
      correct: 'D',
    },
  {
      question: 'Quel animal est le plus grand reptile vivant actuel ?',
      options: { A: 'Dragon de Komodo', B: 'Crocodile marin', C: 'Python réticulé', D: 'Tortue luth' },
      correct: 'B',
    },
  {
      question: 'En quelle année l’ONU (Organisation des Nations unies) a-t-elle été officiellement créée ?',
      options: { A: '1945', B: '1944', C: '1919', D: '1948' },
      correct: 'A',
    },
  {
      question: 'Quel est le nom du détroit qui sépare l’Angleterre de la France ?',
      options: { A: 'Pas de Calais (détroit de Douvres)', B: 'Détroit de Gibraltar', C: 'Détroit de Béring', D: 'Détroit d’Ormuz' },
      correct: 'A',
    },
  {
      question: 'Qui a écrit La Peste ?',
      options: { A: 'Jean-Paul Sartre', B: 'André Gide', C: 'François Mauriac', D: 'Albert Camus' },
      correct: 'D',
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
      options: { A: 'Johannes Brahms', B: 'Franz Liszt', C: 'Frédéric Chopin', D: 'Richard Wagner' },
      correct: 'B',
    },
  {
      question: 'Dans quel pays se trouve la ville de Florence ?',
      options: { A: 'Italie', B: 'Portugal', C: 'Grèce', D: 'Espagne' },
      correct: 'A',
    },
  {
      question: 'Quel est le nom de la science qui étudie les plantes ?',
      options: { A: 'La zoologie', B: 'La géologie', C: 'L’écologie', D: 'La botanique' },
      correct: 'D',
    },
  {
      question: 'Qui a écrit L’Odyssée dans la Grèce antique ?',
      options: { A: 'Homère', B: 'Hésiode', C: 'Sophocle', D: 'Euripide' },
      correct: 'A',
    },
  {
      question: 'Quelle est la capitale de la Slovénie ?',
      options: { A: 'Maribor', B: 'Celje', C: 'Koper', D: 'Ljubljana' },
      correct: 'D',
    },
  {
      question: 'Quel est le symbole chimique du titane ?',
      options: { A: 'Tn', B: 'Th', C: 'Tt', D: 'Ti' },
      correct: 'D',
    },
  {
      question: 'Quel océan borde la côte est des États-Unis ?',
      options: { A: 'Océan Pacifique', B: 'Océan Indien', C: 'Océan Atlantique', D: 'Océan Arctique' },
      correct: 'C',
    },
  {
      question: 'Qui a peint Le Déjeuner sur l’herbe en 1863 ?',
      options: { A: 'Claude Monet', B: 'Edgar Degas', C: 'Gustave Caillebotte', D: 'Édouard Manet' },
      correct: 'D',
    },
  {
      question: 'Combien de joueurs composent une équipe de water-polo dans l’eau (gardien compris) ?',
      options: { A: '5', B: '6', C: '7', D: '8' },
      correct: 'C',
    },
  {
      question: 'Quelle est la capitale du Pérou ?',
      options: { A: 'Trujillo', B: 'Arequipa', C: 'Cusco', D: 'Lima' },
      correct: 'D',
    },
  {
      question: 'Quel est le gaz qui compose la majeure partie de l’atmosphère de Mars ?',
      options: { A: 'Diazote', B: 'Dioxyde de carbone', C: 'Dioxygène', D: 'Argon' },
      correct: 'B',
    },
  {
      question: 'Qui a écrit Les Travailleurs de la mer ?',
      options: { A: 'Victor Hugo', B: 'Jules Verne', C: 'Émile Zola', D: 'Guy de Maupassant' },
      correct: 'A',
    },
  {
      question: 'Quel fleuve traverse la ville de Séville ?',
      options: { A: 'L’Èbre', B: 'Le Guadalquivir', C: 'Le Tage', D: 'Le Douro' },
      correct: 'B',
    },
  {
      question: 'Quel est le symbole chimique du baryum ?',
      options: { A: 'By', B: 'Br', C: 'Ba', D: 'Bh' },
      correct: 'C',
    },
  {
      question: 'Dans quel pays se trouve le site mégalithique de Stonehenge ?',
      options: { A: 'Irlande', B: 'Danemark', C: 'France', D: 'Royaume-Uni' },
      correct: 'D',
    },
  {
      question: 'Qui a composé la Symphonie du Nouveau Monde (Symphonie n° 9) ?',
      options: { A: 'Bedřich Smetana', B: 'Antonín Dvořák', C: 'Leoš Janáček', D: 'Gustav Mahler' },
      correct: 'B',
    },
  {
      question: 'Quelle est la capitale de la Lituanie ?',
      options: { A: 'Kaunas', B: 'Vilnius', C: 'Klaipėda', D: 'Šiauliai' },
      correct: 'B',
    },
  {
      question: 'Quel est l’organe qui assure la filtration et la désintoxication de nombreuses substances dans le sang ?',
      options: { A: 'Le poumon', B: 'Le foie', C: 'Le rein', D: 'La rate' },
      correct: 'B',
    },
  {
      question: 'Combien de jours compte une semaine ?',
      options: { A: '5', B: '8', C: '6', D: '7' },
      correct: 'D',
    },
  {
      question: 'Qui a écrit Le Tour du monde en quatre-vingts jours ?',
      options: { A: 'Jack London', B: 'H. G. Wells', C: 'Alexandre Dumas', D: 'Jules Verne' },
      correct: 'D',
    },
  {
      question: 'Quelle mer borde les côtes de la Grèce et de la Turquie à l’ouest de l’Anatolie ?',
      options: { A: 'Mer Noire', B: 'Mer Adriatique', C: 'Mer Ionienne', D: 'Mer Égée' },
      correct: 'D',
    },
  {
      question: 'Quel est le symbole chimique du bore ?',
      options: { A: 'Bo', B: 'B', C: 'Br', D: 'Bh' },
      correct: 'B',
    },
  {
      question: 'Quelle est la capitale de la Lettonie ?',
      options: { A: 'Riga', B: 'Liepāja', C: 'Daugavpils', D: 'Jūrmala' },
      correct: 'A',
    },
  {
      question: 'Quel animal terrestre est réputé pour sa très grande taille grâce à son long cou ?',
      options: { A: 'Chameau', B: 'Zèbre', C: 'Autruche', D: 'Girafe' },
      correct: 'D',
    },
  {
      question: 'En quelle année a eu lieu le premier vol motorisé et contrôlé des frères Wright ?',
      options: { A: '1903', B: '1901', C: '1899', D: '1908' },
      correct: 'A',
    },
  {
      question: 'Qui a peint Les Ménines en 1656 ?',
      options: { A: 'Francisco Goya', B: 'El Greco', C: 'Bartolomé Esteban Murillo', D: 'Diego Vélasquez' },
      correct: 'D',
    },
  {
      question: 'Quel est le plus long fleuve d’Allemagne ?',
      options: { A: 'L’Elbe', B: 'Le Danube', C: 'Le Rhin', D: 'Le Weser' },
      correct: 'C',
    },
  {
      question: 'Combien de chiffres composent un code PIN à 4 chiffres ?',
      options: { A: '4', B: '3', C: '2', D: '5' },
      correct: 'A',
    },
  {
      question: 'Qui a écrit Bel-Ami ?',
      options: { A: 'Guy de Maupassant', B: 'Émile Zola', C: 'Honoré de Balzac', D: 'Gustave Flaubert' },
      correct: 'A',
    },
  {
      question: 'Quelle est la capitale de l’Estonie ?',
      options: { A: 'Tartu', B: 'Tallinn', C: 'Pärnu', D: 'Narva' },
      correct: 'B',
    },
  {
      question: 'Qui a développé l’imprimerie à caractères mobiles en Europe au XVe siècle ?',
      options: { A: 'Johannes Gutenberg', B: 'Léonard de Vinci', C: 'Galilée', D: 'Érasme' },
      correct: 'A',
    },
]
