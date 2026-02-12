export const translations = {
  nl: {
    // Common
    appName: 'SmartSN CRM',
    dashboard: 'Dashboard',
    leads: 'Leads',
    callCenter: 'Call Center',
    appointments: 'Afspraken',
    calculator: 'Calculator',
    orders: 'Orders',
    incentives: 'Incentives',
    commission: 'Commissie',
    team: 'Team',
    reports: 'Rapporten',
    settings: 'Instellingen',
    logout: 'Uitloggen',
    
    // Status
    new: 'Nieuw',
    contacted: 'Gecontacteerd',
    quoted: 'Offerte',
    sold: 'Verkocht',
    notInterested: 'Geen interesse',
    
    // Actions
    add: 'Toevoegen',
    edit: 'Bewerken',
    delete: 'Verwijderen',
    save: 'Opslaan',
    cancel: 'Annuleren',
    search: 'Zoeken',
    filter: 'Filteren',
    import: 'Importeren',
    export: 'Exporteren',
    call: 'Bellen',
    
    // Leads
    companyName: 'Bedrijfsnaam',
    contactName: 'Contactpersoon',
    phone: 'Telefoon',
    email: 'E-mail',
    address: 'Adres',
    city: 'Stad',
    postalCode: 'Postcode',
    province: 'Provincie',
    niche: 'Niche',
    currentProvider: 'Huidige provider',
    notes: 'Notities',
    
    // Call Center
    startQueue: 'Start Queue',
    pause: 'Pauze',
    skip: 'Overslaan',
    endCall: 'Gesprek beëindigen',
    callNotes: 'Gespreksnotities',
    callOutcome: 'Gesprek resultaat',
    interested: 'Geïnteresseerd',
    notInterested: 'Geen interesse',
    callback: 'Terugbellen',
    noAnswer: 'Geen antwoord',
    appointment: 'Afspraak',
    dncm: 'DNCM - Niet bellen',
    
    // Messages
    noLeadsFound: 'Geen leads gevonden',
    addFirstLead: 'Voeg je eerste lead toe',
    importCSV: 'Importeer via CSV',
    loading: 'Laden...',
    error: 'Er is een fout opgetreden',
    success: 'Succes',
    confirmDelete: 'Weet je zeker dat je dit wilt verwijderen?',
  },
  fr: {
    // Common
    appName: 'SmartSN CRM',
    dashboard: 'Tableau de bord',
    leads: 'Prospects',
    callCenter: 'Centre d\'appel',
    appointments: 'Rendez-vous',
    calculator: 'Calculateur',
    orders: 'Commandes',
    incentives: 'Primes',
    commission: 'Commission',
    team: 'Équipe',
    reports: 'Rapports',
    settings: 'Paramètres',
    logout: 'Déconnexion',
    
    // Status
    new: 'Nouveau',
    contacted: 'Contacté',
    quoted: 'Devis',
    sold: 'Vendu',
    notInterested: 'Pas intéressé',
    
    // Actions
    add: 'Ajouter',
    edit: 'Modifier',
    delete: 'Supprimer',
    save: 'Enregistrer',
    cancel: 'Annuler',
    search: 'Rechercher',
    filter: 'Filtrer',
    import: 'Importer',
    export: 'Exporter',
    call: 'Appeler',
    
    // Leads
    companyName: 'Nom de l\'entreprise',
    contactName: 'Contact',
    phone: 'Téléphone',
    email: 'E-mail',
    address: 'Adresse',
    city: 'Ville',
    postalCode: 'Code postal',
    province: 'Province',
    niche: 'Secteur',
    currentProvider: 'Fournisseur actuel',
    notes: 'Notes',
    
    // Call Center
    startQueue: 'Démarrer la file',
    pause: 'Pause',
    skip: 'Passer',
    endCall: 'Terminer l\'appel',
    callNotes: 'Notes d\'appel',
    callOutcome: 'Résultat de l\'appel',
    interested: 'Intéressé',
    notInterested: 'Pas intéressé',
    callback: 'Rappeler',
    noAnswer: 'Pas de réponse',
    appointment: 'Rendez-vous',
    dncm: 'DNCM - Ne pas appeler',
    
    // Messages
    noLeadsFound: 'Aucun prospect trouvé',
    addFirstLead: 'Ajoutez votre premier prospect',
    importCSV: 'Importer via CSV',
    loading: 'Chargement...',
    error: 'Une erreur s\'est produite',
    success: 'Succès',
    confirmDelete: 'Êtes-vous sûr de vouloir supprimer?',
  }
};

export type Language = 'nl' | 'fr';
export type Translations = typeof translations.nl;
