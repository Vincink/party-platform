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
      question: 'Quel chanteur français interprète « Les Lacs du Connemara » sorti en 1981 ?',
      options: { A: 'Patrick Bruel', B: 'Jean-Jacques Goldman', C: 'Alain Bashung', D: 'Michel Sardou' },
      correct: 'D',
    },
  {
      question: 'Quel groupe britannique chante « Bohemian Rhapsody » en 1975 ?',
      options: { A: 'The Rolling Stones', B: 'Led Zeppelin', C: 'Queen', D: 'Pink Floyd' },
      correct: 'C',
    },
  {
      question: 'Qui chante « Pour que tu m’aimes encore » en 1995 ?',
      options: { A: 'Céline Dion', B: 'Lara Fabian', C: 'Hélène Ségara', D: 'Mylène Farmer' },
      correct: 'A',
    },
  {
      question: 'Quel artiste américain a sorti l’album « Thriller » en 1982 avec « Billie Jean » et « Beat It » ?',
      options: { A: 'Lionel Richie', B: 'Michael Jackson', C: 'Stevie Wonder', D: 'Prince' },
      correct: 'B',
    },
  {
      question: 'Qui interprète le tube « Je te donne » en duo avec Michael Jones en 1985 ?',
      options: { A: 'Jean-Jacques Goldman', B: 'Calogero', C: 'Francis Cabrel', D: 'Daniel Balavoine' },
      correct: 'A',
    },
  {
      question: 'Dans quel dessin animé des années 80 suit-on Esteban, Zia et Tao ?',
      options: { A: 'Les Mystérieuses Cités d’Or', B: 'Il était une fois… la Vie', C: 'Rémi sans famille', D: 'Tom Sawyer' },
      correct: 'A',
    },
  {
      question: 'Quel groupe suédois chante « Dancing Queen » en 1976 ?',
      options: { A: 'ABBA', B: 'Roxette', C: 'Ace of Base', D: 'Europe' },
      correct: 'A',
    },
  {
      question: 'Qui chante « L’Aziza » en 1985 ?',
      options: { A: 'Étienne Daho', B: 'Alain Chamfort', C: 'Daniel Balavoine', D: 'Marc Lavoine' },
      correct: 'C',
    },
  {
      question: 'Quel groupe a sorti le tube « Smells Like Teen Spirit » en 1991 ?',
      options: { A: 'Pearl Jam', B: 'Nirvana', C: 'Soundgarden', D: 'Foo Fighters' },
      correct: 'B',
    },
  {
      question: 'Qui chante « Alexandrie Alexandra » en 1978 ?',
      options: { A: 'Julien Clerc', B: 'Joe Dassin', C: 'Mike Brant', D: 'Claude François' },
      correct: 'D',
    },
  {
      question: 'Quel personnage de dessin animé est accompagné de son générique « Toujours prêt, pour l’aventure… » ?',
      options: { A: 'Columbo', B: 'Lupin III', C: 'Inspecteur Gadget', D: 'Tintin' },
      correct: 'C',
    },
  {
      question: 'Quel chanteur britannique a sorti « Shape of You » en 2017 ?',
      options: { A: 'Sam Smith', B: 'Harry Styles', C: 'Ed Sheeran', D: 'George Ezra' },
      correct: 'C',
    },
  {
      question: 'Qui interprète « Aux Champs-Élysées » sorti en 1969 et devenu un classique indémodable ?',
      options: { A: 'Joe Dassin', B: 'Serge Lama', C: 'Yves Montand', D: 'Gilbert Bécaud' },
      correct: 'A',
    },
  {
      question: 'Quel dessin animé français des années 80 met en scène un petit extraterrestre bleu venu d’une planète lointaine ?',
      options: { A: 'Ulysse 31', B: 'L’Île aux enfants', C: 'Barbapapa', D: 'Bouli' },
      correct: 'D',
    },
  {
      question: 'Quel groupe a chanté « Hotel California » dans les années 70 ?',
      options: { A: 'Eagles', B: 'Fleetwood Mac', C: 'Dire Straits', D: 'Lynyrd Skynyrd' },
      correct: 'A',
    },
  {
      question: 'Qui chante « Ella, elle l’a » en 1987 ?',
      options: { A: 'Vanessa Paradis', B: 'Véronique Sanson', C: 'France Gall', D: 'Zazie' },
      correct: 'C',
    },
  {
      question: 'Quel générique emblématique accompagne « Pokémon » dès la fin des années 90 ?',
      options: { A: '« Le Roi des Pokémon »', B: '« Il faut tous les attraper »', C: '« À l’attaque Pikachu »', D: '« Attrapez-les tous »' },
      correct: 'D',
    },
  {
      question: 'Quel artiste a sorti le tube « Blinding Lights » en 2019 ?',
      options: { A: 'Post Malone', B: 'Bruno Mars', C: 'The Weeknd', D: 'Drake' },
      correct: 'C',
    },
  {
      question: 'Qui chante « Mistral gagnant » en 1985 ?',
      options: { A: 'Renaud', B: 'Hubert-Félix Thiéfaine', C: 'Bénabar', D: 'Francis Cabrel' },
      correct: 'A',
    },
  {
      question: 'Quel célèbre générique de jeu télévisé français est composé par François de Roubaix dans les années 60-70 ?',
      options: { A: '« Des chiffres et des lettres »', B: '« Intervilles »', C: '« Fort Boyard »', D: '« Questions pour un champion »' },
      correct: 'A',
    },
  {
      question: 'Quel groupe australien chante « Highway to Hell » en 1979 ?',
      options: { A: 'AC/DC', B: 'INXS', C: 'Midnight Oil', D: 'Men at Work' },
      correct: 'A',
    },
  {
      question: 'Qui interprète « Papaoutai » en 2013 ?',
      options: { A: 'Stromae', B: 'Maître Gims', C: 'Orelsan', D: 'Vianney' },
      correct: 'A',
    },
  {
      question: 'Quelle chanteuse britannique a sorti l’album « 21 » avec « Rolling in the Deep » ?',
      options: { A: 'Amy Winehouse', B: 'Adele', C: 'Dua Lipa', D: 'Jessie J' },
      correct: 'B',
    },
  {
      question: 'Qui chante « Sarbacane » en 1989 ?',
      options: { A: 'Étienne Daho', B: 'Laurent Voulzy', C: 'Francis Cabrel', D: 'Alain Souchon' },
      correct: 'C',
    },
  {
      question: 'Dans quel dessin animé voit-on trois sœurs voleuses d’œuvres d’art la nuit ?',
      options: { A: 'Embrasse-moi Lucile', B: 'Lady Oscar', C: 'Cat’s Eyes', D: 'Max et Compagnie' },
      correct: 'C',
    },
  {
      question: 'Quel groupe irlandais chante « With or Without You » en 1987 ?',
      options: { A: 'U2', B: 'Coldplay', C: 'The Cranberries', D: 'Snow Patrol' },
      correct: 'A',
    },
  {
      question: 'Qui chante « Foule sentimentale » en 1993 ?',
      options: { A: 'Alain Souchon', B: 'Dominique A', C: 'Laurent Voulzy', D: 'Philippe Katerine' },
      correct: 'A',
    },
  {
      question: 'Quel dessin animé met en scène un petit robot nommé Nono ?',
      options: { A: 'Capitaine Flam', B: 'San Ku Kaï', C: 'Ulysse 31', D: 'X-Or' },
      correct: 'C',
    },
  {
      question: 'Quel chanteur a sorti le tube « Uptown Funk » en collaboration avec Mark Ronson en 2014 ?',
      options: { A: 'Justin Timberlake', B: 'Bruno Mars', C: 'Pharrell Williams', D: 'Usher' },
      correct: 'B',
    },
  {
      question: 'Qui interprète « Sans contrefaçon » en 1987 ?',
      options: { A: 'Jenifer', B: 'Zaho', C: 'Alizée', D: 'Mylène Farmer' },
      correct: 'D',
    },
  {
      question: 'Quel générique d’émission de télévision ou de dessin animé est célèbre pour la musique de Paul Koulak sur France 2 ?',
      options: { A: '« Pékin Express »', B: '« Koh-Lanta »', C: '« The Voice »', D: '« Fort Boyard »' },
      correct: 'D',
    },
  {
      question: 'Quel groupe britannique chante « Wonderwall » en 1995 ?',
      options: { A: 'Oasis', B: 'Blur', C: 'Radiohead', D: 'Pulp' },
      correct: 'A',
    },
  {
      question: 'Qui chante « La Bohème » dès 1965, resté l’un des plus grands classiques de la chanson française ?',
      options: { A: 'Jacques Brel', B: 'Charles Aznavour', C: 'Léo Ferré', D: 'Georges Brassens' },
      correct: 'B',
    },
  {
      question: 'Quel dessin animé a pour thème la vie à l’intérieur du corps humain avec Maestro et Globule ?',
      options: { A: 'Dexter', B: 'C’est pas sorcier', C: 'Les Razmoket', D: 'Il était une fois… la Vie' },
      correct: 'D',
    },
  {
      question: 'Quelle chanteuse barbadienne a sorti le tube « Umbrella » en 2007 ?',
      options: { A: 'Beyoncé', B: 'Alicia Keys', C: 'Rihanna', D: 'Ciara' },
      correct: 'C',
    },
  {
      question: 'Quel générique de dessin animé des années 90 commence par « Il en faut peu pour être heureux » (chanson du film d’origine) ?',
      options: { A: '« Tarzan »', B: '« Robin des Bois »', C: '« Dumbo »', D: '« Le Livre de la Jungle »' },
      correct: 'D',
    },
  {
      question: 'Quel groupe britannique a chanté « Let It Be » en 1970 ?',
      options: { A: 'Pink Floyd', B: 'The Kinks', C: 'The Who', D: 'The Beatles' },
      correct: 'D',
    },
  {
      question: 'Qui interprète « Alors on danse » en 2009 ?',
      options: { A: 'Stromae', B: 'Soprano', C: 'Indochine', D: 'Booba' },
      correct: 'A',
    },
  {
      question: 'Dans quel dessin animé voit-on un chat bleu futuriste sans oreilles ?',
      options: { A: 'Hamtaro', B: 'Pokémon', C: 'Doraemon', D: 'Hello Kitty' },
      correct: 'C',
    },
  {
      question: 'Quel duo français d’électro a sorti « One More Time » en 2000 ?',
      options: { A: 'Justice', B: 'Daft Punk', C: 'Air', D: 'Cassius' },
      correct: 'B',
    },
  {
      question: 'Quel générique accompagne les aventures de « Bob l’éponge » ?',
      options: { A: '« Les Pirates de la mer »', B: '« Qui vit dans un ananas… »', C: '« Le Capitaine Crochet »', D: '« Sous l’océan »' },
      correct: 'B',
    },
  {
      question: 'Quel chanteur français interprète « Les Démons de minuit » avec le groupe Images en 1986 ?',
      options: { A: 'Émile & Images', B: 'Mario Ramsamy & Jean-Louis Pujade', C: 'Gold', D: 'Partenaire Particulier' },
      correct: 'B',
    },
  {
      question: 'Quel dessin animé des années 80 met en scène un pirate de l’espace à la cape noire et au pistolet laser ?',
      options: { A: 'San Ku Kaï', B: 'Capitaine Flam', C: 'Albator', D: 'X-Or' },
      correct: 'C',
    },
  {
      question: 'Quel groupe américain chante « Sweet Child o’ Mine » en 1987 ?',
      options: { A: 'Bon Jovi', B: 'Aerosmith', C: 'Guns N’ Roses', D: 'Mötley Crüe' },
      correct: 'C',
    },
  {
      question: 'Qui chante « La Grenade » en 2018 ?',
      options: { A: 'Angèle', B: 'Louane', C: 'Clara Luciani', D: 'Juliette Armanet' },
      correct: 'C',
    },
  {
      question: 'Quelle chanteuse américaine a sorti le tube « Like a Virgin » en 1984 ?',
      options: { A: 'Cyndi Lauper', B: 'Janet Jackson', C: 'Whitney Houston', D: 'Madonna' },
      correct: 'D',
    },
  {
      question: 'Qui interprète « C’est écrit » en 2001 ?',
      options: { A: 'Marc Lavoine', B: 'Francis Cabrel', C: 'Pascal Obispo', D: 'Gérald de Palmas' },
      correct: 'B',
    },
  {
      question: 'Dans quel dessin animé des années 80 voit-on un petit renard roux et sa maman ?',
      options: { A: '« Goupil ou face »', B: '« Le Petit Renard »', C: '« Le Renard et le Petit Chien »', D: '« Robin des Bois »' },
      correct: 'C',
    },
  {
      question: 'Quel groupe britannique chante « Every Breath You Take » en 1983 ?',
      options: { A: 'Duran Duran', B: 'The Police', C: 'Tears for Fears', D: 'Simple Minds' },
      correct: 'B',
    },
  {
      question: 'Qui chante « Le Sud » en 1973 ?',
      options: { A: 'Georges Brassens', B: 'Nino Ferrer', C: 'Claude Nougaro', D: 'Serge Reggiani' },
      correct: 'B',
    },
  {
      question: 'Quel chanteur américain a sorti « Purple Rain » en 1984 ?',
      options: { A: 'Michael Jackson', B: 'Prince', C: 'Lenny Kravitz', D: 'Stevie Wonder' },
      correct: 'B',
    },
  {
      question: 'Qui interprète « Elle a les yeux revolver » en 1985 ?',
      options: { A: 'Marc Lavoine', B: 'Étienne Daho', C: 'Alain Bashung', D: 'Jean-Louis Aubert' },
      correct: 'A',
    },
  {
      question: 'Quel dessin animé suit une petite fille blonde vivant dans les montagnes suisses avec son grand-père ?',
      options: { A: '« Belle et Sébastien »', B: '« Candy »', C: '« Princesse Sarah »', D: '« Heidi »' },
      correct: 'D',
    },
  {
      question: 'Quel groupe britannique chante « Viva La Vida » en 2008 ?',
      options: { A: 'Coldplay', B: 'Muse', C: 'Keane', D: 'Travis' },
      correct: 'A',
    },
  {
      question: 'Qui chante « Les Mots bleus » en 1974 ?',
      options: { A: 'Christophe', B: 'Alain Chamfort', C: 'Michel Jonasz', D: 'Gérard Lenorman' },
      correct: 'A',
    },
  {
      question: 'Quel dessin animé met en scène un garçon et son chien blanc nommé Milou ?',
      options: { A: '« Boule et Bill »', B: '« Spirou »', C: '« Gaston »', D: '« Les Aventures de Tintin »' },
      correct: 'D',
    },
  {
      question: 'Quelle chanteuse américaine a sorti « I Will Always Love You » en version culte en 1992 ?',
      options: { A: 'Whitney Houston', B: 'Aretha Franklin', C: 'Céline Dion', D: 'Mariah Carey' },
      correct: 'A',
    },
  {
      question: 'Qui interprète « Petite Marie » en 1977 ?',
      options: { A: 'Maxime Le Forestier', B: 'Francis Cabrel', C: 'Alain Souchon', D: 'Yves Duteil' },
      correct: 'B',
    },
  {
      question: 'Quel générique culte accompagne « Les Simpson » à la télévision ?',
      options: { A: 'Le thème de Danny Elfman', B: 'Le thème de John Williams', C: 'Le thème de Hans Zimmer', D: 'Le thème de Lalo Schifrin' },
      correct: 'A',
    },
  {
      question: 'Quel groupe britannique chante « Losing My Religion » ? Non, quel groupe américain chante « Losing My Religion » en 1991 ?',
      options: { A: 'Pearl Jam', B: 'Radiohead', C: 'R.E.M.', D: 'Smashing Pumpkins' },
      correct: 'C',
    },
  {
      question: 'Qui chante « Je marche seul » en 1981 ?',
      options: { A: 'Jean-Jacques Goldman', B: 'Gérard Blanc', C: 'Michel Berger', D: 'William Sheller' },
      correct: 'A',
    },
  {
      question: 'Quel dessin animé français des années 80 montre une petite fille et une grosse boule rose élastique ?',
      options: { A: '« Casimir »', B: '« Colargol »', C: '« Touni »', D: '« Barbapapa »' },
      correct: 'D',
    },
  {
      question: 'Quel chanteur britannique a sorti « Rocket Man » en 1972 ?',
      options: { A: 'David Bowie', B: 'Rod Stewart', C: 'George Michael', D: 'Elton John' },
      correct: 'D',
    },
  {
      question: 'Qui interprète « Tous les cris les S.O.S. » en 1985 ?',
      options: { A: 'France Gall', B: 'Daniel Balavoine', C: 'Maurane', D: 'Véronique Sanson' },
      correct: 'B',
    },
  {
      question: 'Quel dessin animé suit un petit ours en peluche jaune et rouge très gourmand de miel ?',
      options: { A: '« Paddington »', B: '« Colargol »', C: '« Yogi l’Ours »', D: '« Winnie l’Ourson »' },
      correct: 'D',
    },
  {
      question: 'Qui chante « Aline » en 1965, devenu un immense tube populaire ?',
      options: { A: 'Hugues Aufray', B: 'Salvatore Adamo', C: 'Claude François', D: 'Christophe' },
      correct: 'D',
    },
  {
      question: 'Quel dessin animé met en scène un petit garçon et un chien des Pyrénées blanc ?',
      options: { A: '« Lassie »', B: '« Belle et Sébastien »', C: '« Clifford »', D: '« Rintintin »' },
      correct: 'B',
    },
  {
      question: 'Quel chanteur a sorti « Starman » en 1972 ?',
      options: { A: 'Lou Reed', B: 'Mick Jagger', C: 'Iggy Pop', D: 'David Bowie' },
      correct: 'D',
    },
  {
      question: 'Qui interprète « Quand la musique est bonne » en 1982 ?',
      options: { A: 'Téléphone', B: 'Jean-Jacques Goldman', C: 'Indochine', D: 'Trust' },
      correct: 'B',
    },
  {
      question: 'Quel dessin animé culte met en scène un chat orange amateur de lasagnes ?',
      options: { A: '« Tom »', B: '« Sylvester »', C: '« Garfield »', D: '« Félix le Chat »' },
      correct: 'C',
    },
  {
      question: 'Quel groupe britannique chante « Stairway to Heaven » en 1971 ?',
      options: { A: 'Deep Purple', B: 'Cream', C: 'Black Sabbath', D: 'Led Zeppelin' },
      correct: 'D',
    },
  {
      question: 'Qui chante « La Groupie du pianiste » en 1978 ?',
      options: { A: 'William Sheller', B: 'Michel Berger', C: 'Julien Clerc', D: 'Alain Souchon' },
      correct: 'B',
    },
  {
      question: 'Quel chanteur britannique a chanté « Careless Whisper » en 1984 ?',
      options: { A: 'Phil Collins', B: 'Rick Astley', C: 'Paul Young', D: 'George Michael' },
      correct: 'D',
    },
  {
      question: 'Qui interprète « Le Coup de soleil » en 1976 ?',
      options: { A: 'Gérard Lenorman', B: 'Laurent Voulzy', C: 'Dave', D: 'Richard Cocciante' },
      correct: 'D',
    },
  {
      question: 'Quel groupe britannique chante « Another Brick in the Wall (Part 2) » en 1979 ?',
      options: { A: 'Pink Floyd', B: 'King Crimson', C: 'Yes', D: 'Genesis' },
      correct: 'A',
    },
  {
      question: 'Qui chante « L’Envie » en 1985 ?',
      options: { A: 'Eddy Mitchell', B: 'Dick Rivers', C: 'Johnny Hallyday', D: 'Michel Sardou' },
      correct: 'C',
    },
  {
      question: 'Quel groupe américain chante « Africa » en 1982 ?',
      options: { A: 'REO Speedwagon', B: 'Toto', C: 'Journey', D: 'Chicago' },
      correct: 'B',
    },
  {
      question: 'Qui interprète « Le Chanteur » en 1978 ?',
      options: { A: 'Serge Lama', B: 'Michel Fugain', C: 'Julien Clerc', D: 'Daniel Balavoine' },
      correct: 'D',
    },
  {
      question: 'Quel dessin animé met en scène un petit garçon qui grandit à bord du vaisseau Arcadia ?',
      options: { A: '« Ulysse 31 »', B: '« Albator 84 »', C: '« Capitaine Flam »', D: '« Jayce »' },
      correct: 'B',
    },
  {
      question: 'Quelle chanteuse américaine a sorti « Toxic » en 2003 ?',
      options: { A: 'Pink', B: 'Christina Aguilera', C: 'Britney Spears', D: 'Gwen Stefani' },
      correct: 'C',
    },
  {
      question: 'Qui chante « Ma préférence » en 1981 ?',
      options: { A: 'Yves Simon', B: 'Michel Berger', C: 'Julien Clerc', D: 'Alain Chamfort' },
      correct: 'C',
    },
  {
      question: 'Quel dessin animé met en scène un petit éléphant gris aux grandes oreilles ?',
      options: { A: '« Dumbo »', B: '« Babar »', C: '« Elmer »', D: '« Trompette »' },
      correct: 'A',
    },
  {
      question: 'Quel groupe américain a sorti le tube « Sweet Home Alabama » en 1974 ?',
      options: { A: 'Allman Brothers Band', B: 'Creedence Clearwater Revival', C: 'Lynyrd Skynyrd', D: 'Doobie Brothers' },
      correct: 'C',
    },
  {
      question: 'Qui interprète « Pour un plaisir » en 1982 ?',
      options: { A: 'Alain Souchon', B: 'Herbert Léonard', C: 'Laurent Voulzy', D: 'Didier Barbelivien' },
      correct: 'B',
    },
  {
      question: 'Quel chanteur français interprète « Envole-moi » en 1984 ?',
      options: { A: 'Jean-Jacques Goldman', B: 'Gérard Blanc', C: 'Michel Berger', D: 'Didier Barbelivien' },
      correct: 'A',
    },
  {
      question: 'Qui chante « Tombé pour la France » en 1982 ?',
      options: { A: 'Marc Lavoine', B: 'Étienne Daho', C: 'Alain Bashung', D: 'Hubert-Félix Thiéfaine' },
      correct: 'B',
    },
  {
      question: 'Dans quel dessin animé voit-on un petit ours blanc polaire et ses amis sur la banquise ?',
      options: { A: '« Bernard l’Ours »', B: '« Ours polaire »', C: '« Pingu »', D: '« Tipoune »' },
      correct: 'A',
    },
  {
      question: 'Quelle chanteuse américaine a sorti « Single Ladies (Put a Ring on It) » en 2008 ?',
      options: { A: 'Kelly Rowland', B: 'Beyoncé', C: 'Alicia Keys', D: 'Rihanna' },
      correct: 'B',
    },
  {
      question: 'Qui interprète « Capitaine abandonné » en 1986 ?',
      options: { A: 'Émile & Images', B: 'Partenaire Particulier', C: 'Gold', D: 'Début de soirée' },
      correct: 'C',
    },
  {
      question: 'Qui chante « Les Champs-Élysées » ?',
      options: { A: 'Julien Clerc', B: 'Michel Fugain', C: 'Joe Dassin', D: 'Serge Lama' },
      correct: 'C',
    },
  {
      question: 'Quel dessin animé met en scène un petit robot rouge et bleu qui se transforme en camion ?',
      options: { A: '« Jayce »', B: '« Mask »', C: '« Cosmocats »', D: '« Transformers »' },
      correct: 'D',
    },
  {
      question: 'Quel artiste américain a sorti « Superstition » en 1972 ?',
      options: { A: 'Al Green', B: 'Marvin Gaye', C: 'Stevie Wonder', D: 'Ray Charles' },
      correct: 'C',
    },
  {
      question: 'Qui interprète « Comment te dire adieu » dans sa version la plus célèbre en 1968 ?',
      options: { A: 'Sylvie Vartan', B: 'France Gall', C: 'Françoise Hardy', D: 'Sheila' },
      correct: 'C',
    },
  {
      question: 'Quel générique culte accompagne la série animée « La Panthère Rose » ?',
      options: { A: 'Le thème de John Barry', B: 'Le thème de Lalo Schifrin', C: 'Le thème jazzy composé par Henry Mancini', D: 'Le thème de Michel Legrand' },
      correct: 'C',
    },
  {
      question: 'Quel groupe britannique chante « Yellow » en 2000 ?',
      options: { A: 'Coldplay', B: 'Travis', C: 'Keane', D: 'Muse' },
      correct: 'A',
    },
  {
      question: 'Quel dessin animé français des années 80 suit un petit monstre vert et orange vivant dans un volcan ?',
      options: { A: '« Casimir »', B: '« Bouli »', C: '« Gloubi Boulga »', D: '« Nestor »' },
      correct: 'A',
    },
  {
      question: 'Quelle chanteuse américaine a sorti « Poker Face » en 2008 ?',
      options: { A: 'Pink', B: 'Katy Perry', C: 'Lady Gaga', D: 'Kesha' },
      correct: 'C',
    },
  {
      question: 'Qui interprète « Si maman si » en 1979 ?',
      options: { A: 'Véronique Sanson', B: 'Brigitte Fontaine', C: 'Catherine Lara', D: 'France Gall' },
      correct: 'D',
    },
  {
      question: 'Quel dessin animé met en scène un marin qui mange des épinards pour devenir plus fort ?',
      options: { A: '« Popeye »', B: '« Capitaine Caverne »', C: '« Mister Magoo »', D: '« Droopy »' },
      correct: 'A',
    },
  {
      question: 'Qui chante « Le Jardin extraordinaire » en 1964, resté un grand classique de la chanson française ?',
      options: { A: 'Henri Salvador', B: 'Charles Trenet', C: 'Georges Brassens', D: 'Yves Montand' },
      correct: 'B',
    },
  {
      question: 'Quel chanteur américain a sorti « Just the Way You Are » en 2010 ?',
      options: { A: 'Bruno Mars', B: 'Jason Mraz', C: 'Ne-Yo', D: 'John Legend' },
      correct: 'A',
    },
  {
      question: 'Qui chante « Pull marine » en 1983 ?',
      options: { A: 'Charlotte Gainsbourg', B: 'Isabelle Adjani', C: 'Jane Birkin', D: 'Vanessa Paradis' },
      correct: 'B',
    },
  {
      question: 'Quel groupe britannique a chanté « Smoke on the Water » en 1972 ?',
      options: { A: 'Black Sabbath', B: 'Deep Purple', C: 'Led Zeppelin', D: 'Uriah Heep' },
      correct: 'B',
    },
  {
      question: 'Qui chante « Chanson sur ma drôle de vie » en 1973 ?',
      options: { A: 'Nicoletta', B: 'Véronique Sanson', C: 'Anne Sylvestre', D: 'Françoise Hardy' },
      correct: 'B',
    },
  {
      question: 'Quelle chanteuse britannique a sorti « Back to Black » en 2006 ?',
      options: { A: 'Joss Stone', B: 'Duffy', C: 'Lily Allen', D: 'Amy Winehouse' },
      correct: 'D',
    },
  {
      question: 'Qui chante « Mon amant de Saint-Jean » dans ses reprises les plus connues ?',
      options: { A: 'Pascal Obispo', B: 'Bénabar', C: 'Calogero', D: 'Patrick Bruel' },
      correct: 'D',
    },
  {
      question: 'Quel chanteur britannique a sorti « Imagine » en 1971 ?',
      options: { A: 'Paul McCartney', B: 'George Harrison', C: 'Ringo Starr', D: 'John Lennon' },
      correct: 'D',
    },
  {
      question: 'Quel chanteur a sorti « Happy » en 2013 ?',
      options: { A: 'Pharrell Williams', B: 'Will.i.am', C: 'Justin Timberlake', D: 'CeeLo Green' },
      correct: 'A',
    },
  {
      question: 'Qui interprète « La Vie en rose » dans la version la plus célèbre ?',
      options: { A: 'Zaz', B: 'Dalida', C: 'Juliette Gréco', D: 'Édith Piaf' },
      correct: 'D',
    },
  {
      question: 'Quel groupe américain a chanté « Californication » en 1999 ?',
      options: { A: 'Red Hot Chili Peppers', B: 'Foo Fighters', C: 'Weezer', D: 'Green Day' },
      correct: 'A',
    },
  {
      question: 'Qui chante « Je t’aime… moi non plus » en 1969 avec Serge Gainsbourg ?',
      options: { A: 'Sylvie Vartan', B: 'Brigitte Bardot', C: 'Françoise Hardy', D: 'Jane Birkin' },
      correct: 'D',
    },
  {
      question: 'Quelle chanteuse américaine a sorti « Firework » en 2010 ?',
      options: { A: 'Selena Gomez', B: 'Katy Perry', C: 'Ariana Grande', D: 'Taylor Swift' },
      correct: 'B',
    },
  {
      question: 'Qui chante « La Madrague » en 1963 ?',
      options: { A: 'Dalida', B: 'Brigitte Bardot', C: 'Sheila', D: 'France Gall' },
      correct: 'B',
    },
  {
      question: 'Quel groupe britannique chante « Bitter Sweet Symphony » en 1997 ?',
      options: { A: 'Oasis', B: 'Blur', C: 'The Verve', D: 'Pulp' },
      correct: 'C',
    },
  {
      question: 'Qui chante « C’est la chenille qui redémarre » / « La Chenille » (1989) ?',
      options: { A: 'Patrick Sébastien', B: 'Les Forbans', C: 'La Bande à Basile', D: 'Gérard Lenorman' },
      correct: 'C',
    },
  {
      question: 'Quelle chanteuse britannique a sorti « Someone Like You » en 2011 ?',
      options: { A: 'Florence Welch', B: 'Adele', C: 'Emeli Sandé', D: 'Jessie J' },
      correct: 'B',
    },
  {
      question: 'Qui chante « Pour un flirt » en 1971 ?',
      options: { A: 'Julien Clerc', B: 'Dave', C: 'Gérard Lenorman', D: 'Michel Delpech' },
      correct: 'D',
    },
]
