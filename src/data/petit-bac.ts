export interface PetitBacRound {
  letter: string
  category: string
}

export type PetitBacVerdict = 'unique' | 'duplicate' | 'rejected' | 'empty'

export interface EvaluatedPetitBacEntry {
  playerId: number
  rawAnswer: string
  normalizedAnswer: string
  verdict: PetitBacVerdict
  pointsDelta: number
  isCloseMatch: boolean
  isKnownInCategory: boolean
  needsManualCheck: boolean
}

export const PETIT_BAC_ROUNDS_PER_GAME = 10
export const PETIT_BAC_DURATION_SECONDS = 20
export const PETIT_BAC_UNIQUE_POINTS = 10
export const PETIT_BAC_DUPLICATE_POINTS = 5
export const PETIT_BAC_REJECTED_POINTS = 0
export const PETIT_BAC_NO_ANSWER_PENALTY = 2

export const PETIT_BAC_LETTERS = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'L',
  'M',
  'N',
  'O',
  'P',
  'R',
  'S',
  'T',
  'V',
] as const

export const PETIT_BAC_CATEGORIES: string[] = [
  'Animal',
  'Pays ou Ville',
  'Métier',
  'Film ou Série',
  'Fruit ou Légume',
  'Marque',
  'Prénom',
  'Sport',
  'Objet du quotidien',
  'Célébrité',
  'Plat ou Aliment',
  'Instrument ou Art',
  'Vêtement ou Accessoire',
  'Boisson',
]

export function normalizePetitBacWord(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['’\-]+/g, ' ')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0
  if (!a.length) return b.length
  if (!b.length) return a.length

  const dp: number[][] = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0)
  )

  for (let i = 0; i <= a.length; i++) dp[i][0] = i
  for (let j = 0; j <= b.length; j++) dp[0][j] = j

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      )
    }
  }

  return dp[a.length][b.length]
}

export function areWordsSimilar(a: string, b: string): boolean {
  const normA = normalizePetitBacWord(a)
  const normB = normalizePetitBacWord(b)
  if (!normA || !normB) return false
  if (normA === normB) return true

  const dist = levenshteinDistance(normA, normB)
  const maxLen = Math.max(normA.length, normB.length)

  if (maxLen <= 3) return dist <= 0
  if (maxLen <= 5) return dist <= 1
  return dist <= 2
}

const RAW_DICTIONARY: Record<string, string[]> = {
  'Animal': [
    'aigle', 'albatros', 'alligator', 'alpaga', 'anaconda', 'ane', 'antilope', 'araignee',
    'babouin', 'baleine', 'belette', 'beluga', 'blaireau', 'boa', 'boeuf', 'bufflon', 'buse',
    'calf', 'caméléon', 'cameleon', 'canard', 'capybara', 'caribou', 'carpe', 'castor', 'cerf', 'chacal', 'chameau', 'chamois', 'chat', 'chauve souris', 'cheval', 'chevre', 'chien', 'chimpanze', 'chinchilla', 'cigogne', 'cobra', 'cochon', 'colibri', 'condor', 'coq', 'corbeau', 'cormoran', 'crabe', 'crapaud', 'crevette', 'crocodile', 'cuckoo', 'coucou',
    'daim', 'dauphin', 'dindon', 'dodo', 'dromadaire',
    'ecureuil', 'elan', 'elephant', 'emu', 'epervier', 'esturgeon', 'etourneau',
    'faisan', 'faucon', 'faon', 'flamant', 'fouine', 'furet',
    'gazelle', 'gecko', 'gerboise', 'girafe', 'gnu', 'goeland', 'gorille', 'grenouille', 'grue', 'guepard', 'guepe',
    'hamster', 'herisson', 'heron', 'hippopotame', 'hirondelle', 'homard', 'huppe', 'hyene',
    'iguane', 'impala',
    'jaguar', 'geai', 'jument',
    'labrador', 'lamantin', 'lapin', 'lemurien', 'leopard', 'levrier', 'lezard', 'libellule', 'lievre', 'limace', 'lion', 'loup', 'loutre', 'lynx',
    'macaque', 'mammouth', 'manchot', 'mante religieuse', 'marabout', 'marmotte', 'martre', 'meduse', 'merlan', 'merle', 'mesange', 'morue', 'mouche', 'mouette', 'mouflon', 'mouton', 'mulot', 'murène', 'murene',
    'narval', 'nautile',
    'ocelot', 'oie', 'orang outan', 'orque', 'ortolan', 'oryx', 'otarie', 'ours', 'outarde',
    'panda', 'panthere', 'paon', 'papillon', 'parakeet', 'perroquet', 'perruche', 'phacochere', 'phoque', 'pie', 'pigeon', 'pingouin', 'piranha', 'pivert', 'poisson', 'poney', 'porc', 'porc epik', 'porc epic', 'pou', 'poule', 'poussin', 'poulpe', 'puma', 'putois',
    'rat', 'raton laveur', 'raie', 'renard', 'renne', 'requin', 'rhinoceros', 'rossignol', 'rouge gorge', 'roux',
    'salamandre', 'sanglier', 'sardine', 'saumon', 'scarabee', 'scorpion', 'serpent', 'serval', 'singes', 'singe', 'souris', 'suricate',
    'tapir', 'tatou', 'taureau', 'termite', 'tigre', 'thon', 'tortue', 'toucan', 'truite',
    'vache', 'vautour', 'veau', 'ver', 'vipere', 'vison', 'wallaby', 'wombat', 'zebre', 'zebu',
  ],
  'Pays ou Ville': [
    'afghanistan', 'afrique du sud', 'albanie', 'algerie', 'allemagne', 'andorre', 'angleterre', 'angola', 'anvers', 'arabie saoudite', 'argentine', 'armenie', 'athenes', 'australie', 'autriche', 'azerbaidjan',
    'bahamas', 'bahrein', 'bangladesh', 'barcelone', 'belgique', 'belgrade', 'belize', 'benin', 'berlin', 'berne', 'bhoutan', 'bolivie', 'bordeaux', 'bosnie herzegovine', 'botswana', 'bresil', 'brunei', 'bruxelles', 'budapest', 'buenos aires', 'bulgarie', 'burkina faso', 'burundi',
    'caire', 'cambodge', 'cameroun', 'canada', 'cannes', 'cap vert', 'caracas', 'chili', 'chine', 'chypre', 'colombie', 'comores', 'congo', 'copenhague', 'coree du nord', 'coree du sud', 'costa rica', 'cote divoire', 'croatie', 'cuba',
    'dakar', 'danemark', 'djibouti', 'dominique', 'dubai', 'dublin',
    'echirolles', 'ecosse', 'egypte', 'emirats arabes unis', 'equateur', 'erythree', 'espagne', 'estonie', 'etats unis', 'ethiopie',
    'fidji', 'finlande', 'florence', 'france',
    'gabon', 'gambie', 'geneve', 'georgie', 'ghana', 'grece', 'grenade', 'guatemala', 'guinee', 'guinee bissau', 'guinee equatoriale', 'guyana',
    'haiti', 'hambourg', 'helsinki', 'honduras', 'hongrie',
    'inde', 'indonesie', 'irak', 'iran', 'irlande', 'islande', 'israel', 'italie',
    'jamaique', 'japon', 'jordanie',
    'kazakhstan', 'kenya', 'kirghizistan', 'kiribati', 'koweit', 'kyoto',
    'la louviere', 'laos', 'lesotho', 'lettonie', 'liban', 'liberia', 'libye', 'liechtenstein', 'liege', 'lille', 'lisbonne', 'lituanie', 'londres', 'luxembourg', 'lyon',
    'macedoine', 'madagascar', 'madrid', 'malaisie', 'malawi', 'maldives', 'mali', 'malte', 'maroc', 'marseille', 'maurice', 'mauritanie', 'mexique', 'micronesie', 'milan', 'moldavie', 'monaco', 'mongolie', 'montenegro', 'montreal', 'moscou', 'mozambique', 'munich',
    'namibie', 'naples', 'nauru', 'nepal', 'nicaragua', 'niger', 'nigeria', 'nice', 'norvege', 'nouvelle zelande',
    'oman', 'oslo', 'ottawa',
    'ouganda', 'ouzbekistan',
    'pakistan', 'palaos', 'palestine', 'panama', 'papouasie nouvelle guinee', 'paraguay', 'paris', 'pays bas', 'pekin', 'perou', 'philippines', 'pologne', 'porto', 'portugal', 'prague',
    'qatar',
    'rabat', 'reykjavik', 'roumanie', 'royaume uni', 'russie', 'rwanda', 'rome',
    'saint marin', 'salomon', 'salvador', 'samoa', 'san marino', 'sao tome et principe', 'senegal', 'serbie', 'seoul', 'seville', 'seychelles', 'sierra leone', 'singapour', 'slovaquie', 'slovenie', 'somalie', 'soudan', 'sri lanka', 'stockholm', 'suede', 'suisse', 'suriname', 'sydney', 'syrie',
    'tadjikistan', 'tanzanie', 'tchad', 'republique tcheque', 'thailande', 'timor oriental', 'togo', 'tokyo', 'tonga', 'toronto', 'toulouse', 'trinite et tobago', 'tunisie', 'turkménistan', 'turkmenistan', 'turquie', 'tuvalu',
    'ukraine', 'uruguay', 'ouzbekistan',
    'vanuatu', 'vatican', 'venezuela', 'venise', 'vienne', 'vietnam',
    'yemen',
    'zambie', 'zimbabwe', 'zurich',
  ],
  'Métier': [
    'acteur', 'actrice', 'agriculteur', 'architecte', 'artisan', 'astronaute', 'avocat',
    'boulanger', 'boucher', 'bijoutier', 'bibliothecaire', 'biologiste', 'bucheron', 'barman',
    'caissier', 'carreleur', 'charpentier', 'chauffeur', 'chef cuisinier', 'chimiste', 'chirurgien', 'coiffeur', 'commissaire', 'comptable', 'cordonnier', 'couturier', 'cuisinier',
    'danseur', 'dentiste', 'designer', 'detective', 'developpeur', 'directeur', 'docteur', 'douanier',
    'ebéniste', 'ebeniste', 'educateur', 'electricien', 'employe', 'enfermier', 'infirmier', 'ingenieur', 'instituteur', 'interprete',
    'facteur', 'fermier', 'fleuriste', 'fonctionnaire', 'footballeur', 'forestier', 'forgeron', 'frigoriste',
    'gardien', 'gendarme', 'geologue', 'grapheur', 'graphiste', 'guide',
    'horloger', 'hotelier', 'huissier', 'humoriste',
    'illustrateur', 'imprimeur', 'infirmier', 'informaticien', 'inspecteur', 'instituteur',
    'jardinier', 'jockey', 'journaliste', 'juge', 'juriste',
    'kinesitherapeute',
    'libraire', 'livreur', 'logopediste', 'lutteur',
    'macon', 'magicien', 'magistrat', 'maitre nageur', 'maquilleur', 'maraicher', 'marin', 'mecanicien', 'medecin', 'menuisier', 'meteorologue', 'militaire', 'mineur', 'modeleur', 'musicien',
    'notaire', 'nourrice', 'nutritionniste',
    'opticien', 'orfevre', 'orthophoniste', 'ostéopathe', 'osteopathe', 'ouvrier',
    'patissier', 'paysagiste', 'peintre', 'pharmacien', 'philosophe', 'photographe', 'physicien', 'pilote', 'plombier', 'poissonnier', 'policier', 'pompier', 'potier', 'prefet', 'professeur', 'programmeur', 'psychologue',
    'radiologue', 'realisateur', 'receptionniste', 'redacteur', 'relieur', 'reparateur', 'reporter',
    'sage femme', 'sapeur pompier', 'scaphandrier', 'scientifique', 'sculpteur', 'secretaire', 'serrurier', 'serveur', 'sommelier', 'soudeur', 'sportif', 'styliste',
    'tailleur', 'taxidermiste', 'technicien', 'teleconseiller', 'therapeute', 'topographe', 'traducteur', 'transporteur',
    'urbaniste', 'urgentiste', 'ussier',
    'vendeur', 'veterinaire', 'videaste', 'vigneron', 'violoniste', 'viticulteur', 'voyageur',
  ],
  'Film ou Série': [
    'aladdin', 'alien', 'amelie poulain', 'avatar', 'avengers',
    'bambi', 'batman', 'beetlejuice', 'blanche neige', 'breaking bad', 'braveheart', 'brazil',
    'cars', 'casablanca', 'chernobyl', 'cinderella', 'coco', 'columbo', 'conan', 'cool hand luke', 'crow',
    'dark', 'deadpool', 'dexter', 'die hard', 'dirty dancing', 'django', 'doctor who', 'dune',
    'edward scissorhands', 'e.t.', 'et', 'exorciste', 'l exorciste',
    'fargo', 'fast and furious', 'fight club', 'forrest gump', 'friends', 'frozen',
    'game of thrones', 'gladiator', 'godfather', 'goodfellas', 'gremlins', 'gossip girl',
    'hannibal', 'harry potter', 'heat', 'highlander', 'home alone', 'house of cards', 'hulk',
    'inception', 'indiana jones', 'interstellar', 'intouchables', 'iron man', 'it',
    'jaws', 'john wick', 'joker', 'jumanji', 'jurassic park',
    'kaamelott', 'kill bill', 'king kong', 'kung fu panda',
    'la casa de papel', 'la haine', 'la liste de schindler', 'la reine des neiges', 'la vita e bella', 'le fabuleux destin d amelie poulain', 'le parrain', 'le seigneur des anneaux', 'leon', 'les dents de la mer', 'les évadés', 'les indestructibles', 'les miserables', 'les visiteurs', 'lost', 'lucifer',
    'mad max', 'maman j ai rate l avion', 'matrix', 'memento', 'men in black', 'mission impossible', 'moana', 'monstres et cie', 'moonlight', 'mulan',
    'narcos', 'nemo', 'ninja turtles', 'nosferatu', 'notting hill',
    'oceans eleven', 'old boy', 'oppenheimer', 'orange is the new black', 'orphan black', 'outlander',
    'pacific rim', 'pulp fiction', 'parasite', 'peaky blinders', 'peter pan', 'pinocchio', 'pirates des caraibes', 'planete des singes', 'pokemon', 'predator', 'prestige', 'prison break', 'psycho',
    'ratatouille', 'ready player one', 'rebel without a cause', 'reservoir dogs', 'retour vers le futur', 'rocky', 'rogue one', 'romeo et juliette', 'ronin',
    'scarface', 'scream', 'se7en', 'seven', 'shining', 'shrek', 'sicario', 'silence des agneaux', 'simpsons', 'skyscraper', 'snow white', 'social network', 'soul', 'spider man', 'star trek', 'star wars', 'stranger things', 'suicidesquad', 'superman', 'suits',
    'taken', 'taxi driver', 'terminator', 'the boys', 'the crown', 'the dark knight', 'the office', 'the walking dead', 'the witcher', 'thor', 'titanic', 'top gun', 'toy story', 'trainspotting', 'transformers', 'truman show', 'twilight',
    'up', 'us',
    'v for vendetta', 'vaiana', 'valerian', 'venom', 'vertigo', 'vikings', 'vol au dessus d un nid de coucou',
  ],
  'Fruit ou Légume': [
    'abricot', 'ail', 'airelle', 'amande', 'ananas', 'artichaut', 'asperge', 'aubergine', 'avocat',
    'banane', 'betterave', 'blette', 'broccoli', 'brocoli', 'brugnon',
    'cacao', 'cacahuete', 'cassis', 'cedrat', 'celeri', 'cerise', 'chataigne', 'citron', 'citron vert', 'clementine', 'coing', 'concombre', 'courge', 'courgette', 'cranberry',
    'datte', 'durian',
    'echalote', 'endive', 'epinard',
    'feve', 'figue', 'fraise', 'framboise', 'fruit de la passion',
    'goyave', 'grenade', 'groseille',
    'haricot', 'haricot vert',
    'igname',
    'jujube',
    'kak', 'kaki', 'kiwi',
    'laitue', 'litchi', 'lentille', 'lime',
    'macadamia', 'mandarine', 'mangue', 'manioc', 'melon', 'mirabelle', 'mure', 'myrtille',
    'navet', 'nectarine', 'noisette', 'noix', 'noix de coco',
    'oignon', 'olive', 'orange', 'oseille',
    'pamplemousse', 'papaye', 'pasteque', 'patate douce', 'peche', 'persil', 'petit pois', 'physalis', 'piment', 'pissenlit', 'pistache', 'poire', 'poireau', 'pois', 'poivron', 'pomme', 'pomme de terre', 'potiron', 'prune', 'pruneau',
    'radis', 'raisin', 'rambutan', 'rhubarbe', 'roquette', 'rutabaga',
    'salsifis', 'soja',
    'tamarin', 'tomate', 'topinambour',
    'ugli',
    'vacances', 'vanille', 'verveine',
  ],
  'Marque': [
    'adidas', 'airbus', 'aldi', 'alfa romeo', 'amazon', 'apple', 'asus', 'audi',
    'balenciaga', 'banana republic', 'barilla', 'bayer', 'bic', 'bmw', 'boeing', 'bosch', 'bose', 'burberry',
    'canon', 'carrefour', 'cartier', 'chanel', 'chevrolet', 'citroen', 'cocacola', 'coca cola', 'colgate', 'converse', 'corsair', 'crocs',
    'dacia', 'danone', 'decathlon', 'dell', 'dhl', 'dior', 'disney', 'dolce gabbana', 'dyson',
    'epson', 'ericsson', 'estee lauder', 'evian',
    'fanta', 'ferrari', 'fiat', 'fnac', 'ford', 'fujifilm',
    'garmin', 'gillette', 'givenchy', 'google', 'gopro', 'gucci',
    'haribo', 'harley davidson', 'heineken', 'hermes', 'honda', 'huawei', 'hyundai',
    'ibm', 'ikea', 'intel', 'instagram',
    'jaguar', 'jbl', 'jeep', 'jordan', 'juicy couture',
    'kawasaki', 'kellogg s', 'kelloggs', 'kia', 'kindred', 'kitkat', 'kodak', 'lacoste',
    'lacoste', 'lamborghini', 'lancome', 'leclerc', 'lego', 'lenovo', 'levis', 'lg', 'lidl', 'lindt', 'loreal', 'louis vuitton', 'lu',
    'mcdonalds', 'mercedes', 'microsoft', 'milka', 'michelin', 'mitsubishi', 'montblanc', 'motorola',
    'nasa', 'nestle', 'netflix', 'new balance', 'nike', 'nintendo', 'nissan', 'nivea', 'nokia', 'north face', 'nutella',
    'omega', 'opel', 'oppo', 'oracle', 'orange', 'osram',
    'panasonic', 'pepsi', 'perrier', 'peugeot', 'philips', 'pirelli', 'playstation', 'porsche', 'prada', 'puma',
    'ray ban', 'reebok', 'renault', 'rolex', 'rolls royce', 'samsung', 'seat', 'seiko', 'shell', 'siemens', 'skoda', 'sony', 'spotify', 'starbucks', 'subaru', 'suzuki',
    'tag heuer', 'tata', 'tesla', 'tissot', 'tiktok', 'tinder', 'toyota', 'tupperware',
    'uber', 'ubisoft', 'uniqlo', 'ups',
    'valentino', 'vans', 'vauxhall', 'versace', 'visa', 'volkswagen', 'volvo',
  ],
  'Prénom': [
    'adam', 'adele', 'adrien', 'agathe', 'agnes', 'alain', 'alan', 'albert', 'alex', 'alexandre', 'alexis', 'alice', 'aline', 'amelie', 'amandine', 'amour', 'anais', 'andre', 'angelique', 'anne', 'anthony', 'antoine', 'antonin', 'ariane', 'armand', 'arnaud', 'arthur', 'audrey', 'aurelie', 'axel',
    'baptiste', 'barbara', 'bastien', 'beatrice', 'benjamin', 'benoit', 'bernard', 'bernadette', 'boris', 'brice', 'brigitte', 'bruno',
    'camille', 'carine', 'caroline', 'catherine', 'cedric', 'celia', 'celine', 'cesar', 'charles', 'charlotte', 'chloe', 'christian', 'christine', 'christophe', 'claire', 'clara', 'claude', 'clement', 'clementine', 'coline', 'constance', 'coralie', 'corentin', 'cyril',
    'damien', 'daniel', 'danielle', 'daphne', 'david', 'delphine', 'denis', 'diane', 'didier', 'diego', 'dimitri', 'dominique', 'dorothee', 'dylan',
    'edgar', 'edith', 'edmond', 'edouard', 'elena', 'eleonore', 'elodie', 'eloi', 'elsa', 'emilie', 'emilien', 'emmanuel', 'emma', 'eric', 'estelle', 'esther', 'etienne', 'eva', 'evan', 'eve',
    'fabien', 'fabrice', 'fanny', 'felix', 'fernand', 'fiona', 'florence', 'florian', 'francis', 'franck', 'francois', 'francoise', 'frederic',
    'gabriel', 'gabrielle', 'gael', 'gaelle', 'gaspard', 'gauthier', 'geoffrey', 'georges', 'geraldine', 'gerard', 'ghislain', 'gilbert', 'gilles', 'gisele', 'gregoire', 'guillaume', 'guy',
    'hadrien', 'harold', 'hector', 'helene', 'henri', 'herve', 'hippolyte', 'honore', 'hugo', 'hugues',
    'ida', 'igor', 'ines', 'ingrid', 'irene', 'iris', 'isaac', 'isabelle', 'isidore',
    'jack', 'jacob', 'jacques', 'jade', 'james', 'jean', 'jeanne', 'jeremie', 'jerome', 'jessica', 'joachim', 'joel', 'johan', 'johanna', 'john', 'jonathan', 'jordan', 'jose', 'joseph', 'josephine', 'josiane', 'josselin', 'jules', 'julia', 'julian', 'julie', 'julien', 'juliette', 'justin', 'justine',
    'karim', 'karine', 'kevin', 'kilian', 'kim',
    'laetitia', 'laura', 'laure', 'laurent', 'lea', 'leila', 'leo', 'leon', 'leonard', 'leonie', 'lilou', 'lisa', 'loic', 'lola', 'louis', 'louise', 'louison', 'luc', 'lucas', 'luce', 'lucie', 'lucien', 'lucile', 'ludovic', 'lydia',
    'maeva', 'maelle', 'malo', 'manon', 'marc', 'marcel', 'marceau', 'marco', 'marcus', 'margaux', 'marguerite', 'maria', 'marie', 'marine', 'mario', 'marion', 'marius', 'martin', 'martine', 'mathieu', 'mathilde', 'matteo', 'matthieu', 'max', 'maxime', 'maximilien', 'maylis', 'melanie', 'melissa', 'michel', 'michele', 'mickael', 'milan', 'mireille', 'morgan', 'morgane', 'muriel', 'myriam',
    'nadege', 'nadia', 'naomi', 'nathan', 'nathalie', 'neil', 'nicolas', 'nina', 'noa', 'noah', 'noemie', 'nolan', 'nora', 'norbert',
    'oceane', 'octave', 'odette', 'odilon', 'olivier', 'ophelie', 'oriane', 'oscar',
    'pablo', 'pascal', 'pascale', 'patricia', 'patrick', 'paul', 'paula', 'pauline', 'penelope', 'philippe', 'pierre', 'pierrick',
    'quentin',
    'rachid', 'rafael', 'raphael', 'raphaelle', 'raymond', 'regis', 'remi', 'remy', 'rena', 'rene', 'ricardo', 'richard', 'rita', 'robert', 'robin', 'rodolphe', 'rodrigue', 'roger', 'roland', 'romain', 'romeo', 'romy', 'ronan', 'rosa', 'rose', 'roxane', 'ruben', 'rudy',
    'sabrina', 'samuel', 'sandra', 'sandrine', 'sara', 'sarah', 'sasha', 'sebastien', 'segolene', 'selma', 'serge', 'severine', 'simon', 'simone', 'solene', 'sophia', 'sophie', 'stanislas', 'stephane', 'stephanie', 'steve', 'sylvain', 'sylvie',
    'tanguy', 'tatiana', 'theo', 'theodore', 'theophile', 'thibault', 'thierry', 'thomas', 'timothe', 'timothee', 'tina', 'tiphaine', 'tobias', 'tom', 'tomas', 'tony', 'tristan',
    'ulysse', 'urbain',
    'valentin', 'valentina', 'valentine', 'valerie', 'valery', 'vanessa', 'veronique', 'victoire', 'victor', 'victoria', 'vincent', 'virginie', 'viviane', 'vladimir',
    'william', 'wilfried', 'xavier', 'yann', 'yannick', 'yanis', 'yoann', 'yves', 'yvette', 'yvonne',
    'zacharie', 'zoe',
  ],
  'Sport': [
    'aikido', 'alpinisme', 'apnee', 'athletisme', 'aviron',
    'badminton', 'baseball', 'basket', 'basketball', 'biathlon', 'billard', 'bobsleigh', 'bodybuilding', 'boxe',
    'canoeing', 'canoe', 'canyonisme', 'capoeira', 'course a pied', 'cricket', 'crossfit', 'curling', 'cyclisme',
    'danse sportive', 'decathlon', 'deltaplane', 'darts', 'flechettes',
    'equitation', 'escalade', 'escrime',
    'fitness', 'flechettes', 'football', 'football americain', 'futsal',
    'golf', 'gymnastique',
    'haltérophilie', 'halterophilie', 'handball', 'hockey', 'hockey sur glace', 'hockey sur gazon',
    'judo', 'jiu jitsu',
    'karate', 'kayak', 'kickboxing', 'kite surf', 'kitesurf',
    'luge', 'lutte',
    'marathon', 'marche', 'motocross', 'moto', 'musculation',
    'natation', 'rugby', 'running',
    'parkour', 'patinage', 'patinage artistique', 'pentathlon', 'petanque', 'ping pong', 'plongee', 'polo',
    'rafting', 'randonnee', 'rugby',
    'saut a la perche', 'saut en hauteur', 'saut en longueur', 'ski', 'ski alpin', 'ski de fond', 'snowboard', 'squash', 'surf',
    'taekwondo', 'tennis', 'tennis de table', 'tir a l arc', 'triathlon',
    'ultra trail',
    'voile', 'volley', 'volley ball', 'volleyball', 'vtt',
    'wakeboard', 'water polo', 'windsurf',
  ],
  'Objet du quotidien': [
    'abat jour', 'agenda', 'agrafeuse', 'aimant', 'alarme', 'album photo', 'allumette', 'ampoule', 'anneau', 'arroseoir', 'assiette',
    'baguette', 'balance', 'balai', 'bande dessinee', 'barbecue', 'bassine', 'batterie', 'biberon', 'bijou', 'bloc notes', 'boite', 'bol', 'bougie', 'bouilloire', 'boulon', 'boussole', 'bracelet', 'brosse', 'brosse a dents', 'brouette', 'bureau',
    'cadenas', 'cadre', 'cahier', 'calculatrice', 'calendrier', 'canape', 'canette', 'carafe', 'carnet', 'carte', 'casserole', 'casquette', 'ceinture', 'cendrier', 'chaise', 'chapeau', 'chargeur', 'chaussette', 'chaussure', 'chemise', 'cheque', 'cle', 'cle usb', 'ciseaux', 'clavier', 'clou', 'cochon tirelire', 'coffre', 'colle', 'collier', 'compas', 'compte gouttes', 'console', 'coque', 'corbeille', 'corde', 'couette', 'coupe ongles', 'couteau', 'couvercle', 'couvert', 'crayon', 'creme', 'croissant', 'cuillere', 'coussin',
    'de', 'desodorisant', 'disque', 'drap', 'douche',
    'eau de javel', 'echelle', 'ecran', 'ecouteurs', 'eponge', 'equerre', 'essuie tout', 'etendoir', 'etagere', 'etiquette', 'extincteur',
    'feutre', 'ficelle', 'fichier', 'fil', 'film etirable', 'flacon', 'fleche', 'fourchette', 'fouet', 'four', 'frigo',
    'gant', 'gomme', 'gobelet', 'grille pain', 'guirlande',
    'hamac', 'horloge', 'huile',
    'imprimante', 'interrupteur',
    'jarretiere', 'jouet', 'journal', 'jumelles',
    'kit',
    'lampe', 'lampe de poche', 'lavabo', 'lessive', 'lettre', 'lime', 'linge', 'lit', 'livre', 'louche', 'loupe', 'lunettes',
    'magneto', 'maillot', 'mallette', 'manette', 'manteau', 'marqueur', 'marteau', 'masque', 'matelas', 'meuble', 'micro onde', 'miroir', 'montre', 'mouchoir', 'moulin', 'mousse', 'mug',
    'nappe', 'natte', 'navette', 'niveau', 'notebook',
    'ongle', 'ouvre boite', 'outil',
    'paillasson', 'paille', 'panier', 'pansement', 'pantalon', 'papier', 'papier toilette', 'parapluie', 'parfum', 'passeport', 'passoire', 'peigne', 'peinture', 'pelle', 'pendule', 'pese personne', 'petard', 'photo', 'pince', 'pinceau', 'planche', 'plante', 'plateau', 'plume', 'pneu', 'pochette', 'poele', 'poignee', 'pointe', 'pommeau', 'pompe', 'portable', 'porte cle', 'porte manteau', 'pot', 'poubelle', 'poudre', 'poulie', 'poupée', 'poupee', 'poussette', 'prise', 'projecteur', 'protege cahier', 'pull', 'puzzle',
    'racket', 'radio', 'rangement', 'rappe', 'rape', 'rasoir', 'rateau', 'recette', 'refrigerateur', 'regle', 'reveil', 'rideau', 'rivet', 'robinet', 'robot', 'rouleau', 'rouleau peinture', 'ruban', 'ruban adhesif',
    'sac', 'sac a dos', 'sac poubelle', 'saladier', 'savon', 'scie', 'seau', 'seche cheveux', 'seche linge', 'serviette', 'sifflet', 'skateboard', 'smartphone', 'sonnette', 'spatule', 'spray', 'stylo', 'sucre', 'support',
    'table', 'tablette', 'tabouret', 'tapis', 'tasse', 'telephone', 'television', 'tenaille', 'thermos', 'ticket', 'timbre', 'tire bouchon', 'tiroir', 'toile', 'toise', 'tondeuse', 'torchon', 'torche', 'tournevis', 'trampoline', 'trottinette', 'trousse', 'tuyau',
    'valise', 'vase', 'veilleuse', 'velo', 'ventilateur', 'verre', 'verrou', 'veste', 'vide poche', 'vis', 'vitre', 'voiture', 'volet',
  ],
  'Célébrité': [
    'adele', 'albert einstein', 'al pacino', 'angelina jolie', 'anthony hopkins', 'ariana grande', 'arnold schwarzenegger', 'audrey hepburn', 'ayrton senna',
    'barack obama', 'beyonce', 'bill gates', 'bob marley', 'brad pitt', 'britney spears', 'bruce lee', 'bruce springsteen', 'bruce willis',
    'cameron diaz', 'celine dion', 'charlie chaplin', 'cher', 'chris hemsworth', 'christian bale', 'christiano ronaldo', 'cristiano ronaldo', 'chuck norris', 'claude francois', 'cleopatre', 'coluche',
    'dalida', 'daniel craig', 'david beckham', 'david bowie', 'demi moore', 'denzel washington', 'diego maradona', 'dwayne johnson',
    'ed sheeran', 'edith piaf', 'elena', 'elton john', 'elvis presley', 'eminem', 'emma watson', 'enrique iglesias', 'eric cantona',
    'fernandel', 'freddie mercury', 'frieda kahlo', 'frida kahlo',
    'galilee', 'gandhi', 'gerard depardieu', 'george clooney', 'george michael', 'grace kelly', 'greta thunberg',
    'harrison ford', 'hector', 'henry cavill', 'hugh jackman',
    'ian mckellen', 'iggy pop', 'igor', 'ingrid bergman', 'isaac newton',
    'jack nicholson', 'jackie chan', 'jacques brel', 'jacques chirac', 'james bond', 'jane birkin', 'janet jackson', 'jean dujardin', 'jean paul belmondo', 'jean reno', 'jennifer aniston', 'jennifer lopez', 'jimi hendrix', 'jim carrey', 'joaquin phoenix', 'joe dassin', 'john lennon', 'johnny depp', 'johnny hallyday', 'josephine baker', 'julia roberts', 'julien clerc', 'justin bieber', 'justin timberlake',
    'karl lagerfeld', 'kate winslet', 'katy perry', 'keanu reeves', 'kevin costner', 'kim kardashian', 'kobe bryant', 'kurt cobain', 'kylian mbappe',
    'lady gaga', 'lana del rey', 'leonardo da vinci', 'leonardo dicaprio', 'lewis hamilton', 'liam neeson', 'lionel messi', 'louis de funes', 'luciano pavarotti', 'luke skywalker',
    'madonna', 'mahatma gandhi', 'mariah carey', 'marie curie', 'marilyn monroe', 'mark zuckerberg', 'marlon brando', 'martin scorsese', 'matt damon', 'maud', 'max verstappen', 'merlin monroe', 'michael jackson', 'michael jordan', 'michael schumacher', 'michel berger', 'mick jagger', 'miley cyrus', 'mireille mathieu', 'mohammed ali', 'monica bellucci', 'morgan freeman', 'mozart', 'mylène farmer', 'mylene farmer',
    'napoleon', 'natalie portman', 'neil armstrong', 'nelsen mandela', 'nelson mandela', 'nicolas cage', 'nicole kidman', 'nikola tesla', 'noah', 'norah jones',
    'omar sy', 'oprah winfrey', 'orlando bloom', 'oscar wilde',
    'pablo picasso', 'pamela anderson', 'patrick swayze', 'paul mccartney', 'pele', 'penelope cruz', 'phil collins', 'pierre cardin', 'prince',
    'queen elizabeth', 'quentin tarantino',
    'rafael nadal', 'rami malek', 'ray charles', 'rihanna', 'robert de niro', 'robert downey jr', 'robin williams', 'roger federer', 'romain duris', 'romy schneider', 'ronaldo', 'rowan atkinson', 'russell crowe', 'ryan gosling', 'ryan reynolds',
    'salma hayek', 'samuel l jackson', 'sandra bullock', 'scarlett johansson', 'selena gomez', 'serge gainsbourg', 'shakira', 'shania twain', 'sharon stone', 'sherlock holmes', 'sigourney weaver', 'simone veil', 'snoop dogg', 'sofia vergara', 'steven spielberg', 'stevie wonder', 'sting', 'stromae', 'sylvester stallone',
    'taylor swift', 'terence hill', 'tina turner', 'tom cruise', 'tom hanks', 'tony parker', 'toto cutugno', 'tupac',
    'uma thurman', 'usher',
    'vanessa paradis', 'vin diesel', 'vincent cassel', 'vincent van gogh', 'vladimir poutine', 'voltaire',
    'walt disney', 'whitney houston', 'whoopi goldberg', 'will smith', 'willem dafoe', 'wolfgang amadeus mozart', 'woody allen',
    'xavier dolan',
    'yannick noah', 'yves montand', 'yves saint laurent',
    'zendaya', 'zinedine zidane', 'zlatan ibrahimovic',
  ],
  'Plat ou Aliment': [
    'agneau', 'ail', 'amande', 'ananas', 'anchois', 'andouillette', 'anguille', 'avocat',
    'bacon', 'baguette', 'banane', 'barbecue', 'beignet', 'betterave', 'bifteck', 'blanquette', 'boeuf bourguignon', 'boudin', 'bouillabaisse', 'brioche', 'brochette', 'brownie', 'burger',
    'cake', 'calamar', 'camembert', 'canard', 'canneloni', 'caramel', 'carbonara', 'carotte', 'carpaccio', 'cassoulet', 'caviar', 'cereale', 'cerise', 'chataigne', 'chevre', 'chocolat', 'chou', 'chou fleur', 'choucroute', 'citron', 'clafoutis', 'coing', 'compote', 'concombre', 'cookie', 'coq au vin', 'coquille saint jacques', 'cordon bleu', 'cornet', 'cote de boeuf', 'courgette', 'crabe', 'creme brulee', 'creme chantilly', 'crepe', 'croissant', 'croque monsieur', 'crustace', 'cupcake', 'curry', 'couscous',
    'daube', 'dinde', 'donut', 'dorade',
    'eclair', 'empanada', 'endive', 'entrecote', 'epinard', 'escalope', 'escargot',
    'fajita', 'falafel', 'far breton', 'fenouil', 'feta', 'feuilleté', 'feuillete', 'figue', 'flan', 'fondue', 'fraise', 'framboise', 'frites', 'fromage', 'fromage blanc', 'fruit',
    'galette', 'ganache', 'gaspacho', 'gateau', 'gaufre', 'gelato', 'gesier', 'gingembre', 'glace', 'gnocchi', 'gouda', 'gratin', 'grenade', 'groseille', 'gruyere', 'guacamole',
    'hachis parmentier', 'hamburger', 'haricot', 'hareng', 'homard', 'houmous', 'huitre',
    'ile flottante',
    'jambon', 'jambon beurre', 'jarret', 'joue de boeuf',
    'kebab', 'ketchup', 'kiwi', 'kouign amann',
    'lasagne', 'lentille', 'lievre', 'lime', 'limonade', 'litchi', 'loukoum',
    'macaron', 'madeleine', 'magret', 'mais', 'mangue', 'maquereau', 'maroilles', 'mascarpone', 'mayonnaise', 'melon', 'meringue', 'merlan', 'merlu', 'miel', 'mille feuille', 'mimosa', 'minestrone', 'mirabelle', 'moelleux', 'mojito', 'morue', 'moule', 'moussaka', 'mousse au chocolat', 'moutarde', 'muffin', 'mure', 'myrtille',
    'nachos', 'navet', 'nectarine', 'noisette', 'noix', 'noix de coco', 'nougat', 'nouille', 'nutella',
    'oeuf', 'oeufs brouilles', 'oeufs cocotte', 'oeufs durs', 'oeufs pochés', 'oignon', 'olive', 'omelette', 'orange', 'ossobuco', 'ostreicole',
    'paella', 'pain', 'pain au chocolat', 'pain d epices', 'pain perdu', 'pamplemousse', 'pancake', 'pannequet', 'papaye', 'pate', 'pates', 'pasteque', 'patisserie', 'peche', 'pesto', 'petit pois', 'petit suisse', 'pho', 'piccata', 'pieuvre', 'piment', 'pistache', 'pizza', 'poire', 'poireau', 'pois chiche', 'poisson', 'poivron', 'polenta', 'pomme', 'pomme de terre', 'pomme d amour', 'popcorn', 'pot au feu', 'potage', 'potiron', 'poulet', 'poulpe', 'praline', 'profiterole', 'prune', 'puree',
    'quiche',
    'raclette', 'radis', 'raisin', 'ramen', 'ratatouille', 'ravioli', 'reblochon', 'religieuse', 'rhubarbe', 'risotto', 'riz', 'riz au lait', 'roastbeef', 'rognon', 'roquette', 'roquefort', 'rosbeef', 'rouleau de printemps', 'rumsteak',
    'saint marcellin', 'salade', 'salade nicoise', 'salami', 'saumon', 'saucisse', 'saucisson', 'sauerkraut', 'seiche', 'semoule', 'shakshuka', 'sole', 'sorbet', 'souffle', 'soupe', 'spaghetti', 'steak', 'steak frites', 'strudel', 'sucre', 'sushi',
    'taboule', 'tacos', 'tagliatelle', 'tajine', 'tarte', 'tarte aux pommes', 'tarte tatin', 'tartiflette', 'tartine', 'tempura', 'terrine', 'thon', 'tiramisu', 'tofu', 'tomate', 'topinambour', 'tortilla', 'tourte', 'tournedos', 'truite', 'tzatziki',
    'vacherin', 'vanille', 'veau', 'veloute', 'vermicelle', 'viande', 'vinaigrette', 'volaille',
    'wrap',
    'yaourt',
    'zeste', 'zucchini',
  ],
  'Instrument ou Art': [
    'accordeon', 'accordéon', 'acoustique', 'aquarelle', 'architecture', 'archet', 'harmonica',
    'ballet', 'banjo', 'basse', 'basson', 'baton', 'batterie', 'bd', 'bande dessinee', 'bijouterie', 'bongos', 'broderie', 'bronze',
    'calligraphie', 'carillon', 'castagnettes', 'celesta', 'cello', 'violoncelle', 'ceramique', 'chant', 'chanson', 'chapellerie', 'cinema', 'clarinette', 'clavecin', 'clavier', 'collage', 'comedie', 'composition', 'contrebasse', 'cor', 'cor anglais', 'cor de chasse', 'corne', 'costume', 'couture', 'cymbale', 'cymbales',
    'danse', 'dessin', 'djembé', 'djembe', 'dobro', 'doublage',
    'eaux fortes', 'ebenisterie', 'ecriture', 'edition', 'sculpture', 'estampe',
    'fagot', 'fauvisme', 'ferronnerie', 'flute', 'flûte', 'flute traversiere', 'fresque', 'fresco',
    'gong', 'gouache', 'graphisme', 'gravure', 'guitare', 'guitare acoustique', 'guitare basse', 'guitare electrique',
    'harpe', 'harmonica', 'hautbois', 'helicon', 'hurdy gurdy',
    'illustration', 'improvisation', 'installation', 'instrument',
    'jazz', 'jeu',
    'kalimba', 'koto',
    'litterature', 'lithographie', 'luth', 'lyre',
    'mandoline', 'maracas', 'marimba', 'marionnette', 'marqueterie', 'masque', 'metallophone', 'mime', 'miniature', 'modelage', 'monotype', 'mosaique', 'musique',
    'nyckelharpa',
    'ocarina', 'ode', 'opera', 'opéra', 'orgue', 'orgue de barbarie', 'oud',
    'peinture', 'perfectionnement', 'performance', 'photographie', 'piano', 'piano a queue', 'piano droit', 'pipeau', 'poesie', 'poterie', 'poupée', 'portrait', 'pottery', 'poudre',
    'quatuor',
    'recital', 'récital', 'relief', 'renaissance', 'repertoire', 'rock', 'rondeau', 'rumba',
    'saxophone', 'scene', 'scène', 'sculpture', 'sitar', 'solfege', 'sonate', 'sonnet', 'soubassophone', 'statue', 'stylisme', 'symphonie', 'synthetiseur',
    'tableaux', 'tambour', 'tambourin', 'tam tam', 'tango', 'tapisserie', 'theatre', 'théâtre', 'theremine', 'timbale', 'timbales', 'tissage', 'trombone', 'trompette', 'tuba',
    'ukulele', 'urbain',
    'vaudeville', 'verrerie', 'vibraphone', 'vielle a roue', 'viole', 'violon', 'violon alto', 'violoncelle', 'vitrail',
    'xylophone',
    'yodel',
    'zither', 'zurna',
  ],
  'Vêtement ou Accessoire': [
    'anorak', 'anneau', 'apron', 'armure',
    'babouche', 'badge', 'baguette', 'bague', 'balaclava', 'bandana', 'bandeau', 'banane', 'bas', 'basket', 'baskets', 'bavette', 'béret', 'beret', 'bermuda', 'bikini', 'bijou', 'blazer', 'blouson', 'boa', 'bob', 'body', 'bolero', 'bonnet', 'booties', 'bottes', 'bottines', 'boucle d oreille', 'boucles d oreilles', 'boutons de manchette', 'boxer', 'bracelet', 'bretelles', 'broche',
    'cabas', 'calecon', 'caleçon', 'camisole', 'cape', 'capuche', 'cardigan', 'casquette', 'ceinture', 'chale', 'châle', 'chapeau', 'chaussette', 'chaussettes', 'chaussure', 'chaussures', 'chemise', 'chemisier', 'chouchou', 'claquette', 'claquettes', 'col', 'collier', 'combinaison', 'corsage', 'corset', 'costume', 'cravate', 'crop top', 'culotte',
    'debardeur', 'débardeur', 'demi botte', 'dentelle', 'doudoune', 'drap', 'duffle coat',
    'echarpe', 'écharpe', 'ecusson', 'elastique', 'enfiler', 'ensemble', 'epingle', 'escarpin', 'escarpins', 'etole', 'étole',
    'fausse fourrure', 'faux col', 'fedora', 'fichu', 'filet', 'flip flops', 'flip flop', 'foulard', 'fourrure',
    'gabardine', 'gant', 'gants', 'gilet', 'guetre', 'guêtres',
    'habit', 'haut', 'hoodie',
    'impermeable', 'imperméable', 'insigne',
    'jabot', 'jarretiere', 'jarretière', 'jean', 'jeans', 'jersey', 'jogging', 'jupe', 'jupon', 'justaucorps',
    'kilt', 'kimono',
    'lacet', 'lacets', 'legging', 'leggings', 'lentilles', 'lingerie', 'lorgnon', 'lunettes', 'lunettes de soleil',
    'maillot', 'maillot de bain', 'maillot de corps', 'manteau', 'manchette', 'manchettes', 'mantille', 'mariniere', 'marinière', 'masque', 'mitaine', 'mitaines', 'mocassin', 'mocassins', 'monocle', 'montre', 'mouchoir', 'moufle', 'moufles', 'mules',
    'noeud', 'noeud papillon', 'nuisette',
    'parka', 'parure', 'pardessus', 'pantalon', 'pantoufles', 'parapluie', 'pareo', 'paréo', 'peignoir', 'peigne', 'pelerine', 'pèlerine', 'pendeloque', 'perle', 'perles', 'perruque', 'piercing', 'pince', 'pince a cravate', 'pince a cheveux', 'pochette', 'polo', 'poncho', 'porte cle', 'porte clés', 'porte monnaie', 'porte jarretelles', 'prada', 'pull', 'pull over', 'pullover', 'pyjama',
    'rancon', 'randonnee', 'robe', 'robe de chambre', 'robe de mariée', 'robe de mariee', 'robe de soiree', 'robe de soirée', 'robe longue', 'robe courte', 'robe pull', 'ruban',
    'sac', 'sac a dos', 'sac a main', 'sac banane', 'sac de voyage', 'sacoche', 'sandale', 'sandales', 'sarouel', 'sarwel', 'scrunchie', 'semelle', 'serre tete', 'serre tête', 'short', 'slip', 'smoking', 'socquette', 'socquettes', 'sombrero', 'soutien gorge', 'stetson', 'string', 'suede', 'suedine', 'survêtement', 'survetement', 'sweat', 'sweat shirt', 'sweatshirt',
    'tablier', 'tailleur', 'tangas', 'tanga', 'tee shirt', 't shirt', 'tshirt', 'tenue', 'tongs', 'top', 'trench', 'tricorne', 'tricot', 'tutu',
    'uniforme',
    'vaisselle', 'valise', 'velours', 'veste', 'veston', 'vetement', 'vêtement', 'voile', 'voilette',
    'yarmulke',
  ],
  'Boisson': [
    'absinthe', 'agua fresca', 'alcool', 'aloe vera', 'amaretto', 'americano', 'anise', 'anisette', 'aperitif', 'apéritif', 'apple juice', 'aquarius',
    'badoit', 'baileys', 'banana split', 'bancha', 'barley tea', 'bavarois', 'beer', 'bellini', 'benedictine', 'biere', 'bière', 'biere blonde', 'biere brune', 'biere blanche', 'biere ambrée', 'biere ambree', 'biere sans alcool', 'bitter', 'bloody mary', 'bock', 'bourbon', 'brandy', 'bubble tea',
    'cacao', 'cafe', 'café', 'cafe au lait', 'cafe creme', 'cafe crème', 'cafe glace', 'cafe glacé', 'cafe long', 'cafe noir', 'caffeine', 'caipirinha', 'camomille', 'canelle', 'cappuccino', 'caramel macchiato', 'cassis', 'champagne', 'chantilly', 'chardonnay', 'chartreuse', 'chaud cacao', 'chicoree', 'chicorée', 'cidre', 'citronnade', 'cocktail', 'coca', 'coca cola', 'cognac', 'cola', 'compote', 'concoction', 'cordial', 'cosmopolitan', 'cointreau', 'coupe', 'cremant', 'crémant', 'curacao', 'curaçao',
    'daiquiri', 'decafeine', 'décaféiné', 'diabolo', 'diabolo fraise', 'diabolo menthe', 'digestif', 'drink',
    'eau', 'eau gazeuse', 'eau minerale', 'eau minérale', 'eau pétillante', 'eau petillante', 'eau plate', 'eau de coco', 'eau de vie', 'eau tonique', 'egg nog', 'eggnog', 'elixir', 'élixir', 'energy drink', 'espresso', 'expresso', 'evian',
    'fanta', 'fernet', 'fizzy', 'frappe', 'frappé', 'fruit juice',
    'genepi', 'génépi', 'geneva', 'gin', 'gin tonic', 'ginger ale', 'ginger beer', 'glace', 'gluhwein', 'granita', 'grapefruit juice', 'grenadine', 'grogs', 'grog', 'guiness', 'guinness',
    'hibiscus', 'hot chocolate', 'hot toddy', 'huile', 'hydromel',
    'ice tea', 'iced coffee', 'infusion', 'irish coffee',
    'jagermeister', 'jägermeister', 'jus', 'jus d abricot', 'jus d ananas', 'jus d orange', 'jus de carotte', 'jus de citron', 'jus de cranberry', 'jus de fraise', 'jus de fruit', 'jus de fruits', 'jus de goyave', 'jus de legumes', 'jus de légumes', 'jus de mangue', 'jus de pamplemousse', 'jus de peche', 'jus de pêche', 'jus de poire', 'jus de pomme', 'jus de raisin', 'jus de tomate', 'jus de vegetable', 'jus vert',
    'kefir', 'kéfir', 'kir', 'kir royal', 'kirsch', 'kombucha', 'kriek', 'kvass',
    'lager', 'lait', 'lait amande', 'lait d amande', 'lait d avoine', 'lait de coco', 'lait de soja', 'lait fraise', 'lait frais', 'lait chaud', 'latte', 'latte macchiato', 'lemonade', 'limonade', 'liqueur', 'long island',
    'mai tai', 'malbec', 'malt', 'manhattan', 'margarita', 'martini', 'matcha', 'mate', 'maté', 'mazagran', 'merlot', 'mezcal', 'milk', 'milkshake', 'mimosa', 'mineral water', 'mint tea', 'mocha', 'moka', 'mojito', 'monaco', 'moscow mule', 'mulled wine', 'muscat',
    'nectar', 'nectar d abricot', 'nectar de mangue', 'nectar de peche', 'nectar de pêche', 'nectar de poire', 'negroni', 'nescafe', 'nestlé', 'nestle',
    'oasis', 'oats milk', 'old fashioned', 'oolong', 'orange juice', 'orangina', 'ouzo',
    'panache', 'panaché', 'pastis', 'peach iced tea', 'pepsi', 'perrier', 'pina colada', 'piña colada', 'pinot', 'pisco', 'pils', 'pilsner', 'pineapple juice', 'pinot noir', 'poire', 'poire williams', 'poireau', 'pomme', 'porto', 'prosecco', 'punch', 'pu erh',
    'quinquina',
    'radler', 'ratafia', 'rhum', 'rhum arrange', 'rhum arrangé', 'ricard', 'riesling', 'rose', 'rosé', 'rouge', 'rum',
    'sake', 'saké', 'sambuca', 'sangria', 'sante', 'santé', 'sazerac', 'schweppes', 'screwdriver', 'shandy', 'sherry', 'shiraz', 'sirop', 'sirop d erable', 'sirop d érable', 'sirop de citron', 'sirop de fraise', 'sirop de grenadine', 'sirop de menthe', 'sirop de peche', 'sirop de pêche', 'smoothie', 'soda', 'soja', 'sommelier', 'sparkling water', 'sprite', 'stout', 'suze', 'syrah',
    'tap water', 'tequila', 'the', 'thé', 'the blanc', 'thé blanc', 'the chaud', 'thé chaud', 'the de noel', 'thé de noël', 'the glacé', 'the glace', 'thé glacé', 'thé glace', 'the jasmin', 'thé jasmin', 'the matcha', 'thé matcha', 'the menthe', 'thé menthe', 'the noir', 'thé noir', 'the vert', 'thé vert', 'tisane', 'tokay', 'tomato juice', 'tonic', 'tonic water', 'topset', 'triple sec',
    'vin', 'vin blanc', 'vin chaud', 'vin doux', 'vin mousseux', 'vin petillant', 'vin pétillant', 'vin rouge', 'viognier', 'vodka', 'vittel', 'volvic',
    'water', 'whisky', 'whiskey', 'white wine', 'wine',
    'xeres', 'xérès',
    'yaourt a boire', 'yerba mate',
    'zinfandel',
  ],
}

const NORMALIZED_DICTIONARY: Record<string, Record<string, string[]>> = (() => {
  const result: Record<string, Record<string, string[]>> = {}

  for (const category of PETIT_BAC_CATEGORIES) {
    const rawWords = RAW_DICTIONARY[category] || []
    const byLetter: Record<string, string[]> = {}

    for (const raw of rawWords) {
      const norm = normalizePetitBacWord(raw)
      if (!norm) continue
      const firstChar = norm.charAt(0).toUpperCase()
      if (!byLetter[firstChar]) byLetter[firstChar] = []
      if (!byLetter[firstChar].includes(norm)) {
        byLetter[firstChar].push(norm)
      }
    }

    result[category] = byLetter
  }

  return result
})()

export function isWordInCategoryDictionary(
  word: string,
  targetLetter: string,
  category: string
): boolean {
  const normWord = normalizePetitBacWord(word)
  if (!normWord) return false

  const expectedFirst = normalizePetitBacWord(targetLetter).charAt(0)
  if (expectedFirst && !normWord.startsWith(expectedFirst)) {
    return false
  }

  const byLetter = NORMALIZED_DICTIONARY[category]
  if (!byLetter) return false

  const letterKey = (expectedFirst || normWord.charAt(0)).toUpperCase()
  const candidates = byLetter[letterKey] || []

  for (const entry of candidates) {
    if (entry === normWord || areWordsSimilar(entry, normWord)) {
      return true
    }
  }

  return false
}

export function pickPetitBacRounds(count = PETIT_BAC_ROUNDS_PER_GAME): PetitBacRound[] {
  const lettersPool = [...PETIT_BAC_LETTERS]
  for (let i = lettersPool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[lettersPool[i], lettersPool[j]] = [lettersPool[j], lettersPool[i]]
  }

  const categoriesPool = [...PETIT_BAC_CATEGORIES]
  for (let i = categoriesPool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[categoriesPool[i], categoriesPool[j]] = [categoriesPool[j], categoriesPool[i]]
  }

  const rounds: PetitBacRound[] = []
  for (let i = 0; i < count; i++) {
    const letter = lettersPool[i % lettersPool.length]
    const category = categoriesPool[i % categoriesPool.length]
    rounds.push({ letter, category })
  }
  return rounds
}

export function computePetitBacPoints(verdict: PetitBacVerdict): number {
  switch (verdict) {
    case 'unique':
      return PETIT_BAC_UNIQUE_POINTS
    case 'duplicate':
      return PETIT_BAC_DUPLICATE_POINTS
    case 'rejected':
      return PETIT_BAC_REJECTED_POINTS
    case 'empty':
      return -PETIT_BAC_NO_ANSWER_PENALTY
  }
}

export function evaluatePetitBacAnswers(
  players: { id: number; answer?: string | null }[],
  targetLetter: string,
  targetCategory = ''
): EvaluatedPetitBacEntry[] {
  const expectedFirst = normalizePetitBacWord(targetLetter).charAt(0)

  const initial = players.map((p) => {
    const raw = (p.answer ?? '').trim()
    const normalized = normalizePetitBacWord(raw)

    if (!normalized) {
      return {
        playerId: p.id,
        rawAnswer: raw,
        normalizedAnswer: '',
        verdict: 'empty' as PetitBacVerdict,
        pointsDelta: computePetitBacPoints('empty'),
        isCloseMatch: false,
        isKnownInCategory: false,
        needsManualCheck: false,
      }
    }

    const startsWithRightLetter = expectedFirst ? normalized.startsWith(expectedFirst) : true
    if (!startsWithRightLetter) {
      return {
        playerId: p.id,
        rawAnswer: raw,
        normalizedAnswer: normalized,
        verdict: 'rejected' as PetitBacVerdict,
        pointsDelta: computePetitBacPoints('rejected'),
        isCloseMatch: false,
        isKnownInCategory: false,
        needsManualCheck: false,
      }
    }

    const inDict = targetCategory
      ? isWordInCategoryDictionary(normalized, targetLetter, targetCategory)
      : true

    if (!inDict) {
      return {
        playerId: p.id,
        rawAnswer: raw,
        normalizedAnswer: normalized,
        verdict: 'rejected' as PetitBacVerdict,
        pointsDelta: computePetitBacPoints('rejected'),
        isCloseMatch: false,
        isKnownInCategory: false,
        needsManualCheck: true,
      }
    }

    return {
      playerId: p.id,
      rawAnswer: raw,
      normalizedAnswer: normalized,
      verdict: 'unique' as PetitBacVerdict,
      pointsDelta: computePetitBacPoints('unique'),
      isCloseMatch: false,
      isKnownInCategory: true,
      needsManualCheck: false,
    }
  })

  const nonEmptyOrBadLetter = initial.filter((e) => e.verdict !== 'empty' && !(!e.isKnownInCategory && !e.needsManualCheck))

  for (let i = 0; i < nonEmptyOrBadLetter.length; i++) {
    for (let j = i + 1; j < nonEmptyOrBadLetter.length; j++) {
      if (areWordsSimilar(nonEmptyOrBadLetter[i].normalizedAnswer, nonEmptyOrBadLetter[j].normalizedAnswer)) {
        const bothKnown =
          nonEmptyOrBadLetter[i].isKnownInCategory && nonEmptyOrBadLetter[j].isKnownInCategory
        const nextVerdict: PetitBacVerdict = bothKnown ? 'duplicate' : 'rejected'

        nonEmptyOrBadLetter[i].verdict = nextVerdict
        nonEmptyOrBadLetter[j].verdict = nextVerdict
        nonEmptyOrBadLetter[i].pointsDelta = computePetitBacPoints(nextVerdict)
        nonEmptyOrBadLetter[j].pointsDelta = computePetitBacPoints(nextVerdict)

        if (nonEmptyOrBadLetter[i].normalizedAnswer !== nonEmptyOrBadLetter[j].normalizedAnswer) {
          nonEmptyOrBadLetter[i].isCloseMatch = true
          nonEmptyOrBadLetter[j].isCloseMatch = true
        }
      }
    }
  }

  return initial
}
