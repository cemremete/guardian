// i18n - internationalization support
// keeping translations simple with a js object

const translations = {
  en: {
    // app
    appName: 'GUARDIAN',
    appTagline: 'ML Audit Platform for CERN AI Ethics Compliance',
    
    // auth
    signIn: 'Sign In',
    signUp: 'Sign Up',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
    logout: 'Logout',
    
    // validation
    emailRequired: 'Email is required',
    passwordRequired: 'Password is required',
    passwordMinLength: 'Password must be at least 8 characters',
    passwordsNoMatch: 'Passwords do not match',
    invalidEmail: 'Please enter a valid email',
    
    // messages
    loginSuccess: 'Login successful!',
    loginFailed: 'Login failed',
    registerSuccess: 'Account created successfully!',
    registerFailed: 'Registration failed',
    logoutSuccess: 'Logged out successfully',
    
    // nav
    overview: 'Overview',
    models: 'Models',
    audits: 'Audits',
    
    // dashboard
    dashboardOverview: 'Dashboard Overview',
    totalModels: 'Total Models',
    totalAudits: 'Total Audits',
    avgCompliance: 'Avg Compliance',
    runningAudits: 'Running Audits',
    
    // charts
    complianceDistribution: 'Compliance Scores Distribution',
    recentAuditResults: 'Recent Audit Results',
    compliant: 'Compliant (>80%)',
    warning: 'Warning (60-80%)',
    nonCompliant: 'Non-compliant (<60%)',
    
    // tables
    model: 'Model',
    type: 'Type',
    status: 'Status',
    compliance: 'Compliance',
    date: 'Date',
    actions: 'Actions',
    biasScore: 'Bias Score',
    fairness: 'Fairness',
    
    // models
    mlModels: 'ML Models',
    uploadModel: '+ Upload Model',
    noModels: 'No models uploaded yet',
    framework: 'Framework',
    uploadedBy: 'Uploaded by',
    uploaded: 'Uploaded',
    runAudit: 'Run Audit',
    delete: 'Delete',
    
    // audits
    auditHistory: 'Audit History',
    allStatus: 'All Status',
    completed: 'Completed',
    running: 'Running',
    pending: 'Pending',
    failed: 'Failed',
    noAudits: 'No audits found',
    view: 'View',
    
    // upload modal
    uploadMLModel: 'Upload ML Model',
    modelName: 'Model Name',
    modelNamePlaceholder: 'e.g., Credit Risk Classifier v2',
    modelFile: 'Model File',
    dragDrop: 'Drag & drop your model file here',
    orClickBrowse: 'or click to browse',
    supportedFormats: 'Supported: .pkl, .joblib, .h5, .pt, .pth, .onnx, .pb, .zip',
    cancel: 'Cancel',
    upload: 'Upload',
    
    // audit detail
    auditResults: 'Audit Results',
    cernCompliance: 'CERN Compliance',
    biasMetrics: 'Bias Metrics',
    fairnessMetrics: 'Fairness Metrics',
    demographicParity: 'Demographic Parity',
    equalizedOdds: 'Equalized Odds',
    disparateImpact: 'Disparate Impact',
    statisticalParity: 'Statistical Parity Difference',
    equalOpportunity: 'Equal Opportunity Difference',
    averageOdds: 'Average Odds Difference',
    topFeatures: 'Top Important Features',
    warnings: 'Warnings',
    recommendations: 'Recommendations',
    downloadPdf: 'Download PDF Report',
    
    // notifications
    modelUploaded: 'Model uploaded successfully!',
    uploadFailed: 'Upload failed',
    auditStarted: 'Audit started! Check the Audits page for progress.',
    auditFailed: 'Failed to start audit',
    modelDeleted: 'Model deleted',
    deleteFailed: 'Failed to delete model',
    loadFailed: 'Failed to load data',
    downloadFailed: 'Failed to download report',
    
    // confirm
    confirmDelete: 'Are you sure you want to delete this model?',
    confirmAudit: 'Start a new audit for this model?',
    
    // misc
    unknown: 'Unknown',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    selectFile: 'Please select a model file',
    backToHome: '← Back to home',
    
    // landing
    heroTitle: 'AI Ethics Compliance,<br>built for research',
    heroSubtitle: 'Track bias, ensure fairness, and accelerate ML model compliance—with clarity and confidence.',
    learnMore: 'Learn More',
    features: 'Features',
    about: 'About',
    documentation: 'Documentation',
    getStarted: 'Get Started',
    featuresTitle: 'Everything you need to audit,<br>model, and act on AI ethics',
    trackTitle: 'Track',
    trackDesc: 'Monitor bias metrics and fairness scores across all your ML models in one place.',
    modelTitle: 'Model',
    modelDesc: 'Upload and analyze models from any framework—PyTorch, TensorFlow, scikit-learn.',
    reportTitle: 'Report',
    reportDesc: 'Generate comprehensive compliance reports aligned with CERN AI ethics guidelines.',
    actTitle: 'Act',
    actDesc: 'Get actionable recommendations to improve model fairness and reduce bias.',
    welcomeMessage: 'Good morning!',
    welcomeSubtext: 'Your daily compliance metrics are ready to review.',
    newAudit: '+ New Audit',
    recentAudits: 'Recent Audits',
    
    // language
    language: 'Language',
    english: 'English',
    german: 'Deutsch',
    french: 'Français',
    italian: 'Italiano',
    romansh: 'Rumantsch'
  },
  
  de: {
    // app
    appName: 'GUARDIAN',
    appTagline: 'ML-Audit-Plattform für CERN KI-Ethik-Compliance',
    
    // auth
    signIn: 'Anmelden',
    signUp: 'Registrieren',
    email: 'E-Mail',
    password: 'Passwort',
    confirmPassword: 'Passwort bestätigen',
    rememberMe: 'Angemeldet bleiben',
    forgotPassword: 'Passwort vergessen?',
    noAccount: 'Noch kein Konto?',
    haveAccount: 'Bereits ein Konto?',
    logout: 'Abmelden',
    
    // validation
    emailRequired: 'E-Mail ist erforderlich',
    passwordRequired: 'Passwort ist erforderlich',
    passwordMinLength: 'Passwort muss mindestens 8 Zeichen haben',
    passwordsNoMatch: 'Passwörter stimmen nicht überein',
    invalidEmail: 'Bitte gültige E-Mail eingeben',
    
    // messages
    loginSuccess: 'Anmeldung erfolgreich!',
    loginFailed: 'Anmeldung fehlgeschlagen',
    registerSuccess: 'Konto erfolgreich erstellt!',
    registerFailed: 'Registrierung fehlgeschlagen',
    logoutSuccess: 'Erfolgreich abgemeldet',
    
    // nav
    overview: 'Übersicht',
    models: 'Modelle',
    audits: 'Audits',
    
    // dashboard
    dashboardOverview: 'Dashboard-Übersicht',
    totalModels: 'Modelle gesamt',
    totalAudits: 'Audits gesamt',
    avgCompliance: 'Durchschn. Compliance',
    runningAudits: 'Laufende Audits',
    
    // charts
    complianceDistribution: 'Compliance-Verteilung',
    recentAuditResults: 'Aktuelle Audit-Ergebnisse',
    compliant: 'Konform (>80%)',
    warning: 'Warnung (60-80%)',
    nonCompliant: 'Nicht konform (<60%)',
    
    // tables
    model: 'Modell',
    type: 'Typ',
    status: 'Status',
    compliance: 'Compliance',
    date: 'Datum',
    actions: 'Aktionen',
    biasScore: 'Bias-Score',
    fairness: 'Fairness',
    
    // models
    mlModels: 'ML-Modelle',
    uploadModel: '+ Modell hochladen',
    noModels: 'Noch keine Modelle hochgeladen',
    framework: 'Framework',
    uploadedBy: 'Hochgeladen von',
    uploaded: 'Hochgeladen',
    runAudit: 'Audit starten',
    delete: 'Löschen',
    
    // audits
    auditHistory: 'Audit-Verlauf',
    allStatus: 'Alle Status',
    completed: 'Abgeschlossen',
    running: 'Läuft',
    pending: 'Ausstehend',
    failed: 'Fehlgeschlagen',
    noAudits: 'Keine Audits gefunden',
    view: 'Ansehen',
    
    // upload modal
    uploadMLModel: 'ML-Modell hochladen',
    modelName: 'Modellname',
    modelNamePlaceholder: 'z.B. Kreditrisiko-Klassifikator v2',
    modelFile: 'Modelldatei',
    dragDrop: 'Datei hier ablegen',
    orClickBrowse: 'oder klicken zum Durchsuchen',
    supportedFormats: 'Unterstützt: .pkl, .joblib, .h5, .pt, .pth, .onnx, .pb, .zip',
    cancel: 'Abbrechen',
    upload: 'Hochladen',
    
    // audit detail
    auditResults: 'Audit-Ergebnisse',
    cernCompliance: 'CERN-Compliance',
    biasMetrics: 'Bias-Metriken',
    fairnessMetrics: 'Fairness-Metriken',
    demographicParity: 'Demographische Parität',
    equalizedOdds: 'Equalized Odds',
    disparateImpact: 'Disparate Impact',
    statisticalParity: 'Statistische Paritätsdifferenz',
    equalOpportunity: 'Chancengleichheitsdifferenz',
    averageOdds: 'Durchschnittliche Odds-Differenz',
    topFeatures: 'Wichtigste Features',
    warnings: 'Warnungen',
    recommendations: 'Empfehlungen',
    downloadPdf: 'PDF-Bericht herunterladen',
    
    // notifications
    modelUploaded: 'Modell erfolgreich hochgeladen!',
    uploadFailed: 'Hochladen fehlgeschlagen',
    auditStarted: 'Audit gestartet! Prüfen Sie die Audit-Seite.',
    auditFailed: 'Audit konnte nicht gestartet werden',
    modelDeleted: 'Modell gelöscht',
    deleteFailed: 'Löschen fehlgeschlagen',
    loadFailed: 'Daten konnten nicht geladen werden',
    downloadFailed: 'Download fehlgeschlagen',
    
    // confirm
    confirmDelete: 'Möchten Sie dieses Modell wirklich löschen?',
    confirmAudit: 'Neues Audit für dieses Modell starten?',
    
    // misc
    unknown: 'Unbekannt',
    loading: 'Laden...',
    error: 'Fehler',
    success: 'Erfolg',
    selectFile: 'Bitte wählen Sie eine Modelldatei',
    backToHome: '← Zurück zur Startseite',
    
    // landing
    heroTitle: 'KI-Ethik-Compliance,<br>für die Forschung entwickelt',
    heroSubtitle: 'Verfolgen Sie Bias, gewährleisten Sie Fairness und beschleunigen Sie die ML-Modell-Compliance.',
    learnMore: 'Mehr erfahren',
    features: 'Funktionen',
    about: 'Über uns',
    documentation: 'Dokumentation',
    getStarted: 'Loslegen',
    featuresTitle: 'Alles was Sie brauchen zum Auditieren,<br>Modellieren und Handeln bei KI-Ethik',
    trackTitle: 'Verfolgen',
    trackDesc: 'Überwachen Sie Bias-Metriken und Fairness-Scores aller Ihrer ML-Modelle an einem Ort.',
    modelTitle: 'Modellieren',
    modelDesc: 'Laden und analysieren Sie Modelle aus jedem Framework—PyTorch, TensorFlow, scikit-learn.',
    reportTitle: 'Berichten',
    reportDesc: 'Erstellen Sie umfassende Compliance-Berichte gemäß den CERN KI-Ethik-Richtlinien.',
    actTitle: 'Handeln',
    actDesc: 'Erhalten Sie umsetzbare Empfehlungen zur Verbesserung der Modell-Fairness.',
    welcomeMessage: 'Guten Morgen!',
    welcomeSubtext: 'Ihre täglichen Compliance-Metriken sind bereit.',
    newAudit: '+ Neues Audit',
    recentAudits: 'Aktuelle Audits',
    
    // language
    language: 'Sprache',
    english: 'English',
    german: 'Deutsch',
    french: 'Français',
    italian: 'Italiano',
    romansh: 'Rumantsch'
  },
  
  fr: {
    // app
    appName: 'GUARDIAN',
    appTagline: "Plateforme d'audit ML pour la conformité éthique IA du CERN",
    
    // auth
    signIn: 'Se connecter',
    signUp: "S'inscrire",
    email: 'E-mail',
    password: 'Mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    rememberMe: 'Se souvenir de moi',
    forgotPassword: 'Mot de passe oublié?',
    noAccount: "Pas encore de compte?",
    haveAccount: 'Vous avez déjà un compte?',
    logout: 'Déconnexion',
    
    // validation
    emailRequired: "L'e-mail est requis",
    passwordRequired: 'Le mot de passe est requis',
    passwordMinLength: 'Le mot de passe doit contenir au moins 8 caractères',
    passwordsNoMatch: 'Les mots de passe ne correspondent pas',
    invalidEmail: 'Veuillez entrer un e-mail valide',
    
    // messages
    loginSuccess: 'Connexion réussie!',
    loginFailed: 'Échec de la connexion',
    registerSuccess: 'Compte créé avec succès!',
    registerFailed: "Échec de l'inscription",
    logoutSuccess: 'Déconnexion réussie',
    
    // nav
    overview: 'Aperçu',
    models: 'Modèles',
    audits: 'Audits',
    
    // dashboard
    dashboardOverview: 'Aperçu du tableau de bord',
    totalModels: 'Total des modèles',
    totalAudits: 'Total des audits',
    avgCompliance: 'Conformité moyenne',
    runningAudits: 'Audits en cours',
    welcomeMessage: 'Bonjour!',
    welcomeSubtext: 'Vos métriques de conformité quotidiennes sont prêtes.',
    newAudit: '+ Nouvel audit',
    
    // charts
    complianceDistribution: 'Distribution des scores de conformité',
    recentAuditResults: 'Résultats des audits récents',
    compliant: 'Conforme (>80%)',
    warning: 'Avertissement (60-80%)',
    nonCompliant: 'Non conforme (<60%)',
    
    // tables
    model: 'Modèle',
    type: 'Type',
    status: 'Statut',
    compliance: 'Conformité',
    date: 'Date',
    actions: 'Actions',
    biasScore: 'Score de biais',
    fairness: 'Équité',
    recentAudits: 'Audits récents',
    
    // models
    mlModels: 'Modèles ML',
    uploadModel: '+ Télécharger un modèle',
    noModels: 'Aucun modèle téléchargé',
    framework: 'Framework',
    uploadedBy: 'Téléchargé par',
    uploaded: 'Téléchargé',
    runAudit: 'Lancer un audit',
    delete: 'Supprimer',
    
    // audits
    auditHistory: 'Historique des audits',
    allStatus: 'Tous les statuts',
    completed: 'Terminé',
    running: 'En cours',
    pending: 'En attente',
    failed: 'Échoué',
    noAudits: 'Aucun audit trouvé',
    view: 'Voir',
    
    // upload modal
    uploadMLModel: 'Télécharger un modèle ML',
    modelName: 'Nom du modèle',
    modelNamePlaceholder: 'ex: Classificateur de risque de crédit v2',
    modelFile: 'Fichier du modèle',
    dragDrop: 'Glissez-déposez votre fichier ici',
    orClickBrowse: 'ou cliquez pour parcourir',
    supportedFormats: 'Formats supportés: .pkl, .joblib, .h5, .pt, .pth, .onnx, .pb, .zip',
    cancel: 'Annuler',
    upload: 'Télécharger',
    
    // audit detail
    auditResults: "Résultats de l'audit",
    cernCompliance: 'Conformité CERN',
    biasMetrics: 'Métriques de biais',
    fairnessMetrics: "Métriques d'équité",
    demographicParity: 'Parité démographique',
    equalizedOdds: 'Odds égalisés',
    disparateImpact: 'Impact disparate',
    statisticalParity: 'Différence de parité statistique',
    equalOpportunity: "Différence d'égalité des chances",
    averageOdds: 'Différence moyenne des odds',
    topFeatures: 'Caractéristiques principales',
    warnings: 'Avertissements',
    recommendations: 'Recommandations',
    downloadPdf: 'Télécharger le rapport PDF',
    
    // notifications
    modelUploaded: 'Modèle téléchargé avec succès!',
    uploadFailed: 'Échec du téléchargement',
    auditStarted: 'Audit lancé! Consultez la page Audits.',
    auditFailed: "Échec du lancement de l'audit",
    modelDeleted: 'Modèle supprimé',
    deleteFailed: 'Échec de la suppression',
    loadFailed: 'Échec du chargement des données',
    downloadFailed: 'Échec du téléchargement',
    
    // confirm
    confirmDelete: 'Êtes-vous sûr de vouloir supprimer ce modèle?',
    confirmAudit: 'Lancer un nouvel audit pour ce modèle?',
    
    // misc
    unknown: 'Inconnu',
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    selectFile: 'Veuillez sélectionner un fichier',
    backToHome: 'Retour à l\'accueil',
    
    // landing
    heroTitle: 'Conformité éthique IA,<br>conçue pour la recherche',
    heroSubtitle: 'Suivez les biais, assurez l\'équité et accélérez la conformité des modèles ML.',
    learnMore: 'En savoir plus',
    features: 'Fonctionnalités',
    about: 'À propos',
    documentation: 'Documentation',
    getStarted: 'Commencer',
    featuresTitle: 'Tout ce dont vous avez besoin pour auditer,<br>modéliser et agir sur l\'éthique IA',
    trackTitle: 'Suivre',
    trackDesc: 'Surveillez les métriques de biais et les scores d\'équité de tous vos modèles ML.',
    modelTitle: 'Modéliser',
    modelDesc: 'Téléchargez et analysez des modèles de tout framework—PyTorch, TensorFlow, scikit-learn.',
    reportTitle: 'Rapporter',
    reportDesc: 'Générez des rapports de conformité complets alignés sur les directives éthiques du CERN.',
    actTitle: 'Agir',
    actDesc: 'Obtenez des recommandations concrètes pour améliorer l\'équité et réduire les biais.',
    
    // language
    language: 'Langue',
    english: 'English',
    german: 'Deutsch',
    french: 'Français',
    italian: 'Italiano',
    romansh: 'Rumantsch'
  },
  
  it: {
    // app
    appName: 'GUARDIAN',
    appTagline: 'Piattaforma di audit ML per la conformità etica IA del CERN',
    
    // auth
    signIn: 'Accedi',
    signUp: 'Registrati',
    email: 'E-mail',
    password: 'Password',
    confirmPassword: 'Conferma password',
    rememberMe: 'Ricordami',
    forgotPassword: 'Password dimenticata?',
    noAccount: 'Non hai un account?',
    haveAccount: 'Hai già un account?',
    logout: 'Esci',
    
    // validation
    emailRequired: "L'e-mail è obbligatoria",
    passwordRequired: 'La password è obbligatoria',
    passwordMinLength: 'La password deve contenere almeno 8 caratteri',
    passwordsNoMatch: 'Le password non corrispondono',
    invalidEmail: 'Inserisci un\'e-mail valida',
    
    // messages
    loginSuccess: 'Accesso riuscito!',
    loginFailed: 'Accesso fallito',
    registerSuccess: 'Account creato con successo!',
    registerFailed: 'Registrazione fallita',
    logoutSuccess: 'Disconnessione riuscita',
    
    // nav
    overview: 'Panoramica',
    models: 'Modelli',
    audits: 'Audit',
    
    // dashboard
    dashboardOverview: 'Panoramica dashboard',
    totalModels: 'Modelli totali',
    totalAudits: 'Audit totali',
    avgCompliance: 'Conformità media',
    runningAudits: 'Audit in corso',
    welcomeMessage: 'Buongiorno!',
    welcomeSubtext: 'Le tue metriche di conformità giornaliere sono pronte.',
    newAudit: '+ Nuovo audit',
    
    // charts
    complianceDistribution: 'Distribuzione dei punteggi di conformità',
    recentAuditResults: 'Risultati degli audit recenti',
    compliant: 'Conforme (>80%)',
    warning: 'Avviso (60-80%)',
    nonCompliant: 'Non conforme (<60%)',
    
    // tables
    model: 'Modello',
    type: 'Tipo',
    status: 'Stato',
    compliance: 'Conformità',
    date: 'Data',
    actions: 'Azioni',
    biasScore: 'Punteggio bias',
    fairness: 'Equità',
    recentAudits: 'Audit recenti',
    
    // models
    mlModels: 'Modelli ML',
    uploadModel: '+ Carica modello',
    noModels: 'Nessun modello caricato',
    framework: 'Framework',
    uploadedBy: 'Caricato da',
    uploaded: 'Caricato',
    runAudit: 'Avvia audit',
    delete: 'Elimina',
    
    // audits
    auditHistory: 'Cronologia audit',
    allStatus: 'Tutti gli stati',
    completed: 'Completato',
    running: 'In esecuzione',
    pending: 'In attesa',
    failed: 'Fallito',
    noAudits: 'Nessun audit trovato',
    view: 'Visualizza',
    
    // upload modal
    uploadMLModel: 'Carica modello ML',
    modelName: 'Nome modello',
    modelNamePlaceholder: 'es: Classificatore rischio credito v2',
    modelFile: 'File modello',
    dragDrop: 'Trascina e rilascia il file qui',
    orClickBrowse: 'o clicca per sfogliare',
    supportedFormats: 'Formati supportati: .pkl, .joblib, .h5, .pt, .pth, .onnx, .pb, .zip',
    cancel: 'Annulla',
    upload: 'Carica',
    
    // audit detail
    auditResults: "Risultati dell'audit",
    cernCompliance: 'Conformità CERN',
    biasMetrics: 'Metriche di bias',
    fairnessMetrics: 'Metriche di equità',
    demographicParity: 'Parità demografica',
    equalizedOdds: 'Odds equalizzati',
    disparateImpact: 'Impatto disparato',
    statisticalParity: 'Differenza di parità statistica',
    equalOpportunity: 'Differenza di pari opportunità',
    averageOdds: 'Differenza media degli odds',
    topFeatures: 'Caratteristiche principali',
    warnings: 'Avvisi',
    recommendations: 'Raccomandazioni',
    downloadPdf: 'Scarica report PDF',
    
    // notifications
    modelUploaded: 'Modello caricato con successo!',
    uploadFailed: 'Caricamento fallito',
    auditStarted: 'Audit avviato! Controlla la pagina Audit.',
    auditFailed: "Impossibile avviare l'audit",
    modelDeleted: 'Modello eliminato',
    deleteFailed: 'Eliminazione fallita',
    loadFailed: 'Impossibile caricare i dati',
    downloadFailed: 'Download fallito',
    
    // confirm
    confirmDelete: 'Sei sicuro di voler eliminare questo modello?',
    confirmAudit: 'Avviare un nuovo audit per questo modello?',
    
    // misc
    unknown: 'Sconosciuto',
    loading: 'Caricamento...',
    error: 'Errore',
    success: 'Successo',
    selectFile: 'Seleziona un file',
    backToHome: 'Torna alla home',
    
    // landing
    heroTitle: 'Conformità etica IA,<br>progettata per la ricerca',
    heroSubtitle: 'Monitora i bias, garantisci l\'equità e accelera la conformità dei modelli ML.',
    learnMore: 'Scopri di più',
    features: 'Funzionalità',
    about: 'Chi siamo',
    documentation: 'Documentazione',
    getStarted: 'Inizia',
    featuresTitle: 'Tutto ciò di cui hai bisogno per auditare,<br>modellare e agire sull\'etica IA',
    trackTitle: 'Monitora',
    trackDesc: 'Monitora le metriche di bias e i punteggi di equità di tutti i tuoi modelli ML.',
    modelTitle: 'Modella',
    modelDesc: 'Carica e analizza modelli da qualsiasi framework—PyTorch, TensorFlow, scikit-learn.',
    reportTitle: 'Reporta',
    reportDesc: 'Genera report di conformità completi allineati alle linee guida etiche del CERN.',
    actTitle: 'Agisci',
    actDesc: 'Ottieni raccomandazioni concrete per migliorare l\'equità e ridurre i bias.',
    
    // language
    language: 'Lingua',
    english: 'English',
    german: 'Deutsch',
    french: 'Français',
    italian: 'Italiano',
    romansh: 'Rumantsch'
  },
  
  rm: {
    // app
    appName: 'GUARDIAN',
    appTagline: 'Plattafurma da audit ML per la conformitad etica IA dal CERN',
    
    // auth
    signIn: "S'annunziar",
    signUp: 'Sa registrar',
    email: 'E-mail',
    password: 'Pled-clav',
    confirmPassword: 'Confermar pled-clav',
    rememberMe: 'Salvar las datas',
    forgotPassword: 'Emblidà il pled-clav?',
    noAccount: 'Nagin conto anc?',
    haveAccount: 'Gia in conto?',
    logout: 'Sortir',
    
    // validation
    emailRequired: "L'e-mail è obligatoric",
    passwordRequired: 'Il pled-clav è obligatoric',
    passwordMinLength: 'Il pled-clav sto cuntegnair almain 8 caracters',
    passwordsNoMatch: 'Ils pleds-clav na correspundan betg',
    invalidEmail: 'Endatescha per plaschair ina adressa dad e-mail valida',
    
    // messages
    loginSuccess: 'Annunzia cun success!',
    loginFailed: "L'annunzia n'è betg reussida",
    registerSuccess: 'Conto creà cun success!',
    registerFailed: "La registraziun n'è betg reussida",
    logoutSuccess: 'Sortì cun success',
    
    // nav
    overview: 'Survista',
    models: 'Models',
    audits: 'Audits',
    
    // dashboard
    dashboardOverview: 'Survista dal dashboard',
    totalModels: 'Models total',
    totalAudits: 'Audits total',
    avgCompliance: 'Conformitad media',
    runningAudits: 'Audits actuals',
    welcomeMessage: 'Bun di!',
    welcomeSubtext: 'Tias metricas da conformitad dal di èn prontas.',
    newAudit: '+ Nov audit',
    
    // charts
    complianceDistribution: 'Distribuziun dals puncts da conformitad',
    recentAuditResults: 'Resultats dals ultims audits',
    compliant: 'Conform (>80%)',
    warning: 'Avertiment (60-80%)',
    nonCompliant: 'Betg conform (<60%)',
    
    // tables
    model: 'Model',
    type: 'Tip',
    status: 'Status',
    compliance: 'Conformitad',
    date: 'Data',
    actions: 'Acziuns',
    biasScore: 'Puncts da bias',
    fairness: 'Gistadad',
    recentAudits: 'Ultims audits',
    
    // models
    mlModels: 'Models ML',
    uploadModel: '+ Chargiar model',
    noModels: 'Anc nagins models chargiads',
    framework: 'Framework',
    uploadedBy: 'Chargià da',
    uploaded: 'Chargià',
    runAudit: 'Lantschar audit',
    delete: 'Stizzar',
    
    // audits
    auditHistory: 'Istorgia dals audits',
    allStatus: 'Tut ils status',
    completed: 'Terminà',
    running: 'En execuziun',
    pending: 'En spetga',
    failed: 'Fallì',
    noAudits: 'Nagins audits chattads',
    view: 'Guardar',
    
    // upload modal
    uploadMLModel: 'Chargiar model ML',
    modelName: 'Num dal model',
    modelNamePlaceholder: 'p.ex: Classificatur da ristga da credit v2',
    modelFile: 'Datoteca dal model',
    dragDrop: 'Tira e banduna la datoteca qua',
    orClickBrowse: 'u clicca per tschertgar',
    supportedFormats: 'Formats sustegnids: .pkl, .joblib, .h5, .pt, .pth, .onnx, .pb, .zip',
    cancel: 'Annullar',
    upload: 'Chargiar',
    
    // audit detail
    auditResults: "Resultats da l'audit",
    cernCompliance: 'Conformitad CERN',
    biasMetrics: 'Metricas da bias',
    fairnessMetrics: 'Metricas da gistadad',
    demographicParity: 'Paritad demografica',
    equalizedOdds: 'Odds egalisads',
    disparateImpact: 'Impact disparat',
    statisticalParity: 'Differenza da paritad statistica',
    equalOpportunity: 'Differenza da pussaivladads egualas',
    averageOdds: 'Differenza media dals odds',
    topFeatures: 'Caracteristicas principalas',
    warnings: 'Avertiments',
    recommendations: 'Recumandaziuns',
    downloadPdf: 'Telechargiar rapport PDF',
    
    // notifications
    modelUploaded: 'Model chargià cun success!',
    uploadFailed: 'Chargiar fallì',
    auditStarted: 'Audit lantschà! Controllescha la pagina Audits.',
    auditFailed: "Impussibel da lantschar l'audit",
    modelDeleted: 'Model stizzà',
    deleteFailed: 'Stizzar fallì',
    loadFailed: 'Impussibel da chargiar las datas',
    downloadFailed: 'Telechargiar fallì',
    
    // confirm
    confirmDelete: 'Es ti segir che ti vuls stizzar quest model?',
    confirmAudit: 'Lantschar in nov audit per quest model?',
    
    // misc
    unknown: 'Nunenconuschent',
    loading: 'Chargiar...',
    error: 'Errur',
    success: 'Success',
    selectFile: 'Tscherna per plaschair ina datoteca',
    backToHome: 'Enavos a la pagina principala',
    
    // landing
    heroTitle: 'Conformitad etica IA,<br>construì per la perscrutaziun',
    heroSubtitle: 'Persequitescha bias, garantescha gistadad e accelerescha la conformitad dals models ML.',
    learnMore: 'Emprender dapli',
    features: 'Funcziuns',
    about: 'Davart nus',
    documentation: 'Documentaziun',
    getStarted: 'Cumenzar',
    featuresTitle: 'Tut quai che ti dovras per auditar,<br>modellar e agir sin l\'etica IA',
    trackTitle: 'Persequitar',
    trackDesc: 'Survegliescha las metricas da bias e ils puncts da gistadad da tut tes models ML.',
    modelTitle: 'Modellar',
    modelDesc: 'Chargia e analisescha models da mintga framework—PyTorch, TensorFlow, scikit-learn.',
    reportTitle: 'Rapportar',
    reportDesc: 'Generescha rapports da conformitad cumplets allineads cun las directivas eticas dal CERN.',
    actTitle: 'Agir',
    actDesc: 'Survegn recumandaziuns concrettas per meglierar la gistadad e reducir ils bias.',
    
    // language
    language: 'Lingua',
    english: 'English',
    german: 'Deutsch',
    french: 'Français',
    italian: 'Italiano',
    romansh: 'Rumantsch'
  }
};

// i18n manager
const i18n = {
  currentLang: 'en',
  
  init() {
    // load saved language or use browser default
    const saved = localStorage.getItem('guardian_lang');
    if (saved && translations[saved]) {
      this.currentLang = saved;
    } else {
      // try to detect from browser
      const browserLang = navigator.language.split('-')[0];
      if (translations[browserLang]) {
        this.currentLang = browserLang;
      }
    }
    return this.currentLang;
  },
  
  setLanguage(lang) {
    if (translations[lang]) {
      this.currentLang = lang;
      localStorage.setItem('guardian_lang', lang);
      this.updatePage();
      return true;
    }
    return false;
  },
  
  t(key) {
    // get translation, fallback to english, then to key itself
    const lang = translations[this.currentLang] || translations.en;
    return lang[key] || translations.en[key] || key;
  },
  
  updatePage() {
    // update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = this.t(key);
    });
    
    // update elements with HTML content (data-i18n-html)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      el.innerHTML = this.t(key);
    });
    
    // update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      el.placeholder = this.t(key);
    });
    
    // update titles
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      el.title = this.t(key);
    });
    
    // update select options
    document.querySelectorAll('select option[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = this.t(key);
    });
  },
  
  getAvailableLanguages() {
    return [
      { code: 'en', name: 'English' },
      { code: 'de', name: 'Deutsch' },
      { code: 'fr', name: 'Français' },
      { code: 'it', name: 'Italiano' },
      { code: 'rm', name: 'Rumantsch' }
    ];
  }
};

// expose globally
window.i18n = i18n;
window.t = (key) => i18n.t(key);
