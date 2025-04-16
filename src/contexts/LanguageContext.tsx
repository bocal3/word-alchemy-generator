
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

// Define supported languages
export type SupportedLanguage = 'fr' | 'en' | 'es';

// Define language context type
type LanguageContextType = {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: (key: string) => string;
};

// Create context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

// Define translations for all supported languages
const translations: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // Common
    'app.name': 'Psum',
    'app.description': 'Text Generator',
    'app.copyright': '© 2025 Psum - Text Generator',
    
    // Navigation
    'nav.home': 'Home',
    'nav.dictionaries': 'Dictionaries',
    'nav.create': 'Create Dictionary',
    'nav.config': 'Configuration',
    'nav.search': 'Search',
    
    // Generator
    'generator.title': 'Psum Generator',
    'generator.description': 'Generate themed placeholder text for your projects',
    'generator.loading': 'Loading dictionaries...',
    'generator.button': 'Generate',
    'generator.generating': 'Generating...',
    'generator.no.dictionary': 'Please select at least one dictionary.',
    'generator.paragraphs': 'Paragraphs',
    'generator.single.sentence': 'Generate a single sentence',
    'generator.advanced.options': 'Advanced options',
    'generator.words.per.sentence': 'Words per sentence',
    'generator.sentences.per.paragraph': 'Sentences per paragraph',
    
    // Dictionaries
    'dictionary.title': 'Dictionary',
    'dictionary.description': 'Dictionary of words related to',
    'dictionary.generate': 'Generate text',
    'dictionary.download': 'Download',
    'dictionary.add.word': 'Add a word',
    'dictionary.new.word': 'New word...',
    'dictionary.add': 'Add',
    'dictionary.word.count': 'Dictionary words',
    'dictionary.empty': 'No word found in selected dictionaries.',
    'dictionary.word.added': 'has been added to the dictionary',
    'dictionary.word.empty': 'Please enter a valid word',
    'dictionary.word.exists': 'This word already exists in the dictionary',
    'dictionary.word.deleted': 'has been removed from the dictionary',
    'dictionary.thematic': 'Thematic dictionary',
    'dictionary.dev': 'Development',
    'dictionary.cuisine': 'Cooking',
    
    // Create dictionary
    'create.title': 'Create a new dictionary',
    'create.name': 'Dictionary name',
    'create.name.placeholder': 'Ex: Science Fiction',
    'create.id': 'Identifier',
    'create.description': 'Description (optional)',
    'create.description.placeholder': 'Describe your dictionary...',
    'create.words': 'Words (one per line)',
    'create.words.placeholder': 'Enter your words, one per line...',
    'create.words.count': 'word(s)',
    'create.button': 'Save dictionary',
    'create.submitting': 'Creating...',
    'create.name.required': 'Name required',
    'create.name.required.message': 'Please enter a name for the dictionary.',
    'create.words.required': 'Words required',
    'create.words.required.message': 'Please enter at least a few words for the dictionary.',
    'create.success': 'Dictionary created',
    'create.success.message': 'The dictionary "{name}" has been successfully created with {count} words.',
    'create.error': 'Error',
    'create.error.message': 'An error occurred while creating the dictionary.',
    
    // Configuration
    'config.title': 'Configuration',
    'config.save': 'Save configuration',
    'config.download': 'Download all data',
    'config.language': 'Language',
    
    // Search
    'search.title': 'Search for a dictionary',
    'search.placeholder': 'Search for words, dictionaries...',
    'search.button': 'Search',
    
    // Dictionaries page
    'dictionaries.all': 'All dictionaries',
    
    // Alerts and messages
    'alert.save.reminder': "Don't forget to save your configuration, or you'll lose changes if the cache is cleared.",
    'alert.success': 'Success',
    'alert.error': 'Error',
    'alert.download.success': 'Download successful',
    'alert.download.success.message': 'The dictionary "{title}" has been downloaded.',
    'alert.download.error': 'Download error',
    'alert.download.error.message': 'Unable to download the dictionary',
    'alert.config.success': 'Configuration saved',
    'alert.config.success.message': 'Your configuration has been saved in the browser.',
    'alert.config.error': 'Configuration error',
    'alert.config.error.message': 'Unable to save the configuration'
  },
  fr: {
    // Common
    'app.name': 'Psum',
    'app.description': 'Générateur de texte',
    'app.copyright': '© 2025 Psum - Générateur de texte',
    
    // Navigation
    'nav.home': 'Accueil',
    'nav.dictionaries': 'Dictionnaires',
    'nav.create': 'Créer un dictionnaire',
    'nav.config': 'Configuration',
    'nav.search': 'Rechercher',
    
    // Generator
    'generator.title': 'Générateur Psum',
    'generator.description': 'Générez du texte de remplissage thématique pour vos projets',
    'generator.loading': 'Chargement des dictionnaires...',
    'generator.button': 'Générer',
    'generator.generating': 'Génération...',
    'generator.no.dictionary': 'Veuillez sélectionner au moins un dictionnaire.',
    'generator.paragraphs': 'Paragraphes',
    'generator.single.sentence': 'Générer une seule phrase',
    'generator.advanced.options': 'Options avancées',
    'generator.words.per.sentence': 'Mots par phrase',
    'generator.sentences.per.paragraph': 'Phrases par paragraphe',
    
    // Dictionaries
    'dictionary.title': 'Dictionnaire',
    'dictionary.description': 'Dictionnaire de mots liés à',
    'dictionary.generate': 'Générer du texte',
    'dictionary.download': 'Télécharger',
    'dictionary.add.word': 'Ajouter un mot',
    'dictionary.new.word': 'Nouveau mot...',
    'dictionary.add': 'Ajouter',
    'dictionary.word.count': 'Mots du dictionnaire',
    'dictionary.empty': 'Aucun mot trouvé dans les dictionnaires sélectionnés.',
    'dictionary.word.added': 'a été ajouté au dictionnaire',
    'dictionary.word.empty': 'Veuillez entrer un mot valide',
    'dictionary.word.exists': 'Ce mot existe déjà dans le dictionnaire',
    'dictionary.word.deleted': 'a été supprimé du dictionnaire',
    'dictionary.thematic': 'Dictionnaire thématique',
    'dictionary.dev': 'Développement',
    'dictionary.cuisine': 'Cuisine',
    
    // Create dictionary
    'create.title': 'Créer un nouveau dictionnaire',
    'create.name': 'Nom du dictionnaire',
    'create.name.placeholder': 'Ex: Science Fiction',
    'create.id': 'Identifiant',
    'create.description': 'Description (optionnelle)',
    'create.description.placeholder': 'Décrivez votre dictionnaire...',
    'create.words': 'Mots (un par ligne)',
    'create.words.placeholder': 'Entrez vos mots, un par ligne...',
    'create.words.count': 'mot(s)',
    'create.button': 'Enregistrer le dictionnaire',
    'create.submitting': 'Création en cours...',
    'create.name.required': 'Nom requis',
    'create.name.required.message': 'Veuillez entrer un nom pour le dictionnaire.',
    'create.words.required': 'Mots requis',
    'create.words.required.message': 'Veuillez entrer au moins quelques mots pour le dictionnaire.',
    'create.success': 'Dictionnaire créé',
    'create.success.message': 'Le dictionnaire "{name}" a été créé avec succès avec {count} mots.',
    'create.error': 'Erreur',
    'create.error.message': 'Une erreur est survenue lors de la création du dictionnaire.',
    
    // Configuration
    'config.title': 'Configuration',
    'config.save': 'Sauvegarder la configuration',
    'config.download': 'Télécharger toutes les données',
    'config.language': 'Langue',
    
    // Search
    'search.title': 'Rechercher un dictionnaire',
    'search.placeholder': 'Rechercher des mots, des dictionnaires...',
    'search.button': 'Rechercher',
    
    // Dictionaries page
    'dictionaries.all': 'Tous les dictionnaires',
    
    // Alerts and messages
    'alert.save.reminder': "N'oubliez pas de sauvegarder votre configuration, sinon vos modifications seront perdues si vous videz ou changez de navigateur.",
    'alert.success': 'Succès',
    'alert.error': 'Erreur',
    'alert.download.success': 'Téléchargement réussi',
    'alert.download.success.message': 'Le dictionnaire "{title}" a été téléchargé.',
    'alert.download.error': 'Erreur de téléchargement',
    'alert.download.error.message': 'Impossible de télécharger le dictionnaire',
    'alert.config.success': 'Configuration sauvegardée',
    'alert.config.success.message': 'Votre configuration a été sauvegardée dans le navigateur.',
    'alert.config.error': 'Erreur de configuration',
    'alert.config.error.message': 'Impossible de sauvegarder la configuration'
  },
  es: {
    // Common
    'app.name': 'Psum',
    'app.description': 'Generador de texto',
    'app.copyright': '© 2025 Psum - Generador de texto',
    
    // Navigation
    'nav.home': 'Inicio',
    'nav.dictionaries': 'Diccionarios',
    'nav.create': 'Crear diccionario',
    'nav.config': 'Configuración',
    'nav.search': 'Buscar',
    
    // Generator
    'generator.title': 'Generador Psum',
    'generator.description': 'Genera texto de relleno temático para tus proyectos',
    'generator.loading': 'Cargando diccionarios...',
    'generator.button': 'Generar',
    'generator.generating': 'Generando...',
    'generator.no.dictionary': 'Por favor selecciona al menos un diccionario.',
    'generator.paragraphs': 'Párrafos',
    'generator.single.sentence': 'Generar una sola frase',
    'generator.advanced.options': 'Opciones avanzadas',
    'generator.words.per.sentence': 'Palabras por frase',
    'generator.sentences.per.paragraph': 'Frases por párrafo',
    
    // Dictionaries
    'dictionary.title': 'Diccionario',
    'dictionary.description': 'Diccionario de palabras relacionadas con',
    'dictionary.generate': 'Generar texto',
    'dictionary.download': 'Descargar',
    'dictionary.add.word': 'Añadir una palabra',
    'dictionary.new.word': 'Nueva palabra...',
    'dictionary.add': 'Añadir',
    'dictionary.word.count': 'Palabras del diccionario',
    'dictionary.empty': 'No se encontraron palabras en los diccionarios seleccionados.',
    'dictionary.word.added': 'ha sido añadida al diccionario',
    'dictionary.word.empty': 'Por favor introduce una palabra válida',
    'dictionary.word.exists': 'Esta palabra ya existe en el diccionario',
    'dictionary.word.deleted': 'ha sido eliminada del diccionario',
    'dictionary.thematic': 'Diccionario temático',
    'dictionary.dev': 'Desarrollo',
    'dictionary.cuisine': 'Cocina',
    
    // Create dictionary
    'create.title': 'Crear un nuevo diccionario',
    'create.name': 'Nombre del diccionario',
    'create.name.placeholder': 'Ej: Ciencia Ficción',
    'create.id': 'Identificador',
    'create.description': 'Descripción (opcional)',
    'create.description.placeholder': 'Describe tu diccionario...',
    'create.words': 'Palabras (una por línea)',
    'create.words.placeholder': 'Introduce tus palabras, una por línea...',
    'create.words.count': 'palabra(s)',
    'create.button': 'Guardar diccionario',
    'create.submitting': 'Creando...',
    'create.name.required': 'Nombre requerido',
    'create.name.required.message': 'Por favor introduce un nombre para el diccionario.',
    'create.words.required': 'Palabras requeridas',
    'create.words.required.message': 'Por favor introduce al menos algunas palabras para el diccionario.',
    'create.success': 'Diccionario creado',
    'create.success.message': 'El diccionario "{name}" ha sido creado con éxito con {count} palabras.',
    'create.error': 'Error',
    'create.error.message': 'Ha ocurrido un error al crear el diccionario.',
    
    // Configuration
    'config.title': 'Configuración',
    'config.save': 'Guardar configuración',
    'config.download': 'Descargar todos los datos',
    'config.language': 'Idioma',
    
    // Search
    'search.title': 'Buscar un diccionario',
    'search.placeholder': 'Buscar palabras, diccionarios...',
    'search.button': 'Buscar',
    
    // Dictionaries page
    'dictionaries.all': 'Todos los diccionarios',
    
    // Alerts and messages
    'alert.save.reminder': "No olvides guardar tu configuración, o perderás los cambios si se borra la caché.",
    'alert.success': 'Éxito',
    'alert.error': 'Error',
    'alert.download.success': 'Descarga exitosa',
    'alert.download.success.message': 'El diccionario "{title}" ha sido descargado.',
    'alert.download.error': 'Error de descarga',
    'alert.download.error.message': 'No se pudo descargar el diccionario',
    'alert.config.success': 'Configuración guardada',
    'alert.config.success.message': 'Tu configuración ha sido guardada en el navegador.',
    'alert.config.error': 'Error de configuración',
    'alert.config.error.message': 'No se pudo guardar la configuración'
  }
};

// Create language provider component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get user's browser language
  const getBrowserLanguage = (): SupportedLanguage => {
    const browserLang = navigator.language.split('-')[0];
    return (browserLang as SupportedLanguage) in translations 
      ? (browserLang as SupportedLanguage) 
      : 'en';
  };

  // Use localStorage to persist language selection
  const [language, setLanguage] = useLocalStorage<SupportedLanguage>(
    'psum-language', 
    getBrowserLanguage()
  );

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
