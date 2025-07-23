import React, { createContext, useState, useContext } from 'react';

type Language = 'pt' | 'en' | 'fr' | 'de' | 'it' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const translations = {
  pt: {
    // Navigation
    'nav.home': 'Início',
    'nav.offers': 'Ofertas',
    'nav.history': 'Histórico',
    'nav.profile': 'Perfil',
    'nav.dashboard': 'Dashboard',
    'nav.login': 'Entrar',
    'nav.signup': 'Cadastrar',
    'nav.logout': 'Sair',
    'nav.analytics': 'Analytics BI',

    // Terms Modal
    'terms.welcome': 'Bem-vindo ao Duo Pass Club',
    'terms.accept_terms': 'Aceito os Termos de Uso',
    'terms.accept_privacy': 'Aceito a Política de Privacidade',
    'terms.accept_comms': 'Aceito receber comunicações (opcional)',
    'terms.accept_proceed': 'Aceitar e Prosseguir',
    'terms.reject_exit': 'Rejeitar e Sair',

    // Terms of Use
    'terms.title': 'TERMOS DE USO - DUO PASS',
    'terms.last_update': 'Última atualização: [DATA]',
    'terms.effective': 'Vigência: A partir da aceitação',
    'terms.section1': '1. DEFINIÇÕES\nDuo Pass: Plataforma digital que oferece vouchers e experiências culturais, gastronômicas e de lazer na Suíça.\nUsuário: Pessoa física que utiliza os serviços da plataforma.\nGolden Week: Período promocional de 7 dias com acesso a vouchers premium.\nPlano Freemium: Acesso gratuito limitado a 1 voucher por mês.\nParceiros: Estabelecimentos e prestadores de serviços credenciados.',
    'terms.section2': '2. ACEITAÇÃO DOS TERMOS\nAo criar uma conta ou utilizar nossos serviços, você aceita integralmente estes termos. Se discordar de qualquer cláusula, não utilize a plataforma.',
    'terms.section3': '3. DESCRIÇÃO DOS SERVIÇOS\n3.1 Golden Week (Período de Teste Premium)\nDuração: 7 dias corridos\nAcesso: 3-4 vouchers premium\nExperiências: Restaurantes top-tier e atividades exclusivas\nAtivação automática no primeiro acesso\n3.2 Plano Freemium\nVouchers: 1 por mês calendário\nCategoria: Experiências mid-tier\nValidade: Conforme especificado em cada voucher\nSem cobrança recorrente\n3.3 Planos Pagos\nValores: CHF 9, 12 ou 18 mensais\nBenefícios: Vouchers adicionais + experiências premium\nCobrança: Automática via cartão de crédito\nCancelamento: A qualquer momento',
    'terms.section4': '4. CADASTRO E CONTA DE USUÁRIO\n4.1 Elegibilidade\nMaior de 18 anos\nResidente na Suíça ou pessoa com endereço válido no país\nInformações verdadeiras e atualizadas\n4.2 Responsabilidades do Usuário\nManter dados atualizados\nNão compartilhar credenciais de acesso\nUsar vouchers pessoalmente (salvo vouchers 2-por-1)\nNotificar imediatamente sobre uso não autorizado',
    'terms.section5': '5. VOUCHERS E EXPERIÊNCIAS\n5.1 Utilização\nVouchers têm data de validade específica\nNecessário agendamento prévio com o parceiro\nSujeito à disponibilidade do estabelecimento\nNão cumulativo com outras promoções (salvo indicação contrária)\n5.2 Limitações\n1 voucher por pessoa por estabelecimento por mês (salvo especificação)\nNão transferível entre usuários\nNão conversível em dinheiro\nVálido apenas no estabelecimento indicado\n5.3 Cancelamentos pelo Parceiro\nParceiros podem cancelar vouchers por motivos operacionais\nUsuário será notificado com 24h de antecedência (quando possível)\nVoucher será reemitido ou valor creditado',
    'terms.section6': '6. PAGAMENTOS E CANCELAMENTOS\n6.1 Cobrança\nPlanos pagos: cobrança mensal automática\nCartões aceitos: Visa, Mastercard, PostFinance\nMoeda: Franco Suíço (CHF)\nFalha no pagamento: suspensão do serviço após 7 dias\n6.2 Cancelamento\nPossível a qualquer momento via app/website\nEfetivo ao final do período já pago\nVouchers não utilizados expiram com o cancelamento\nSem multa de cancelamento\n6.3 Reembolsos\nGolden Week: sem reembolso (período promocional)\nPlanos pagos: reembolso proporcional em caso de cancelamento pela empresa\nVouchers defeituosos: reemissão ou crédito',
    'terms.section7': '7. RESPONSABILIDADES E LIMITAÇÕES\n7.1 Duo Pass\nIntermediação entre usuário e parceiros\nManutenção da plataforma tecnológica\nAtendimento ao cliente\nNão responsável por qualidade dos serviços dos parceiros\n7.2 Limitação de Responsabilidade\nResponsabilidade limitada ao valor pago pelo usuário\nNão responsável por danos indiretos ou lucros cessantes\nParceiros respondem pela qualidade de seus serviços\nForça maior exime responsabilidade\n7.3 Disponibilidade\nServiço sujeito a manutenções programadas\nIndisponibilidade temporária não gera direito a compensação\nEsforços para manter 99% de uptime',
    'terms.section8': '8. PROPRIEDADE INTELECTUAL\nTodos os direitos sobre marcas, logotipos, design e conteúdo da plataforma pertencem ao Duo Pass. Uso não autorizado é proibido.',
    'terms.section9': '9. PRIVACIDADE E DADOS\n9.1 Coleta de Dados\nDados pessoais: nome, email, telefone, endereço\nDados de uso: vouchers utilizados, preferências\nDados de pagamento: processados por terceiros certificados\n9.2 Uso dos Dados\nPrestação do serviço\nComunicação sobre ofertas\nAnálises estatísticas (dados anonimizados)\nCompartilhamento com parceiros para prestação do serviço\n9.3 Direitos do Usuário\nAcesso aos dados pessoais\nCorreção de informações incorretas\nExclusão de dados (direito ao esquecimento)\nPortabilidade de dados',
    'terms.section10': '10. MODIFICAÇÕES\n10.1 Alterações nos Termos\nDuo Pass pode alterar estes termos a qualquer momento\nUsuários serão notificados com 30 dias de antecedência\nContinuidade do uso implica aceitação das alterações\nDiscordância: direito de cancelamento sem ônus\n10.2 Alterações no Serviço\nFuncionalidades podem ser modificadas ou descontinuadas\nNovos serviços podem ser adicionados\nParceiros podem ser incluídos ou removidos',
    'terms.section11': '11. RESCISÃO\n11.1 Pelo Usuário\nCancelamento a qualquer momento\nEncerramento da conta via solicitação\n11.2 Pelo Duo Pass\nViolação destes termos\nUso fraudulento ou abusivo\nInformações falsas no cadastro\nNotificação prévia de 15 dias (quando possível)',
    'terms.section12': '12. DISPOSIÇÕES GERAIS\n12.1 Lei Aplicável\nLegislação suíça\nForo: Tribunal competente na Suíça\n12.2 Independência das Cláusulas\nInvalidade de uma cláusula não afeta as demais\nInterpretação de boa-fé\n12.3 Comunicações\nEmail: [email de contato]\nEndereço: [endereço da empresa]\nTelefone: [telefone de contato]',
    'terms.section13': '13. CONTATO E SUPORTE\nAtendimento ao Cliente:\nEmail: suporte@duopassclub.ch\nHorário: Segunda a sexta, 9h às 18h\nIdiomas: Alemão, Francês, Italiano\nEmergências com Vouchers:\nWhatsApp: [número]\nDisponível 7 dias por semana\nAo utilizar o Duo Pass, você confirma ter lido, compreendido e aceito todos os termos acima.',

    // Home
    'home.title': 'Pague 1, Leve 2',
    'home.subtitle': 'Descubra ofertas incríveis na sua cidade',
    'home.cta': 'Explorar Ofertas',
    'home.categories': 'Categorias',

    // Categories
    'category.gastronomy': 'Gastronomia',
    'category.beauty': 'Beleza',
    'category.leisure': 'Lazer',
    'category.fitness': 'Fitness',
    'category.shopping': 'Compras',
    'category.services': 'Serviços',

    // Offers
    'offers.title': 'Ofertas Disponíveis',
    'offers.activate': 'Ativar Cupom',
    'offers.expires': 'Expira em',
    'offers.location': 'Localização',
    'offers.original_value': 'Valor Original',

    // Auth
    'auth.email': 'Email',
    'auth.password': 'Senha',
    'auth.fullname': 'Nome Completo',
    'auth.signin': 'Entrar',
    'auth.signup': 'Cadastrar',
    'auth.customer': 'Cliente',
    'auth.merchant': 'Comerciante',
    'auth.usertype': 'Tipo de Usuário',

    // Subscription
    'subscription.required': 'Assinatura Necessária',
    'subscription.message': 'Para ativar cupons, você precisa de uma assinatura ativa.',
    'subscription.subscribe': 'Assinar Agora',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.offers': 'Offers',
    'nav.history': 'History',
    'nav.profile': 'Profile',
    'nav.dashboard': 'Dashboard',
    'nav.login': 'Login',
    'nav.signup': 'Sign Up',
    'nav.logout': 'Logout',
    'nav.analytics': 'Analytics BI',

    // Terms of Use
    'terms.title': 'TERMS OF USE - DUO PASS',
    'terms.last_update': 'Last update: [DATE]',
    'terms.effective': 'Effective: From acceptance',
    'terms.section1': '1. DEFINITIONS\nDuo Pass: Digital platform offering vouchers and cultural, gastronomic and leisure experiences in Switzerland.\nUser: Individual who uses the platform services.\nGolden Week: 7-day promotional period with access to premium vouchers.\nFreemium Plan: Free limited access to 1 voucher per month.\nPartners: Accredited establishments and service providers.',
    'terms.section2': '2. ACCEPTANCE OF TERMS\nBy creating an account or using our services, you fully accept these terms. If you disagree with any clause, do not use the platform.',
    'terms.section3': '3. DESCRIPTION OF SERVICES\n3.1 Golden Week (Premium Trial Period)\nDuration: 7 consecutive days\nAccess: 3-4 premium vouchers\nExperiences: Top-tier restaurants and exclusive activities\nAutomatic activation on first access\n3.2 Freemium Plan\nVouchers: 1 per calendar month\nCategory: Mid-tier experiences\nValidity: As specified in each voucher\nNo recurring charge\n3.3 Paid Plans\nValues: CHF 9, 12 or 18 monthly\nBenefits: Additional vouchers + premium experiences\nBilling: Automatic via credit card\nCancellation: At any time',
    'terms.section4': '4. REGISTRATION AND USER ACCOUNT\n4.1 Eligibility\nOver 18 years old\nResident in Switzerland or person with valid address in the country\nTrue and updated information\n4.2 User Responsibilities\nKeep data updated\nDo not share access credentials\nUse vouchers personally (except 2-for-1 vouchers)\nNotify immediately about unauthorized use',
    'terms.section5': '5. VOUCHERS AND EXPERIENCES\n5.1 Use\nVouchers have specific expiration date\nPrior scheduling with the partner required\nSubject to establishment availability\nNot cumulative with other promotions (unless otherwise indicated)\n5.2 Limitations\n1 voucher per person per establishment per month (unless specified)\nNot transferable between users\nNot convertible to cash\nValid only at the indicated establishment\n5.3 Cancellations by Partner\nPartners may cancel vouchers for operational reasons\nUser will be notified 24 hours in advance (when possible)\nVoucher will be reissued or value credited',
    'terms.section6': '6. PAYMENTS AND CANCELLATIONS\n6.1 Billing\nPaid plans: automatic monthly billing\nAccepted cards: Visa, Mastercard, PostFinance\nCurrency: Swiss Franc (CHF)\nPayment failure: service suspension after 7 days\n6.2 Cancellation\nPossible at any time via app/website\nEffective at the end of the paid period\nUnused vouchers expire with cancellation\nNo cancellation fee\n6.3 Refunds\nGolden Week: no refund (promotional period)\nPaid plans: proportional refund in case of cancellation by the company\nDefective vouchers: reissue or credit',
    'terms.section7': '7. RESPONSIBILITIES AND LIMITATIONS\n7.1 Duo Pass\nIntermediation between user and partners\nMaintenance of the technological platform\nCustomer service\nNot responsible for the quality of partners\' services\n7.2 Limitation of Liability\nLiability limited to the amount paid by the user\nNot responsible for indirect damages or lost profits\nPartners are responsible for the quality of their services\nForce majeure exempts liability\n7.3 Availability\nService subject to scheduled maintenance\nTemporary unavailability does not generate right to compensation\nEfforts to maintain 99% uptime',
    'terms.section8': '8. INTELLECTUAL PROPERTY\nAll rights over brands, logos, design and platform content belong to Duo Pass. Unauthorized use is prohibited.',
    'terms.section9': '9. PRIVACY AND DATA\n9.1 Data Collection\nPersonal data: name, email, phone, address\nUsage data: vouchers used, preferences\nPayment data: processed by certified third parties\n9.2 Use of Data\nService provision\nCommunication about offers\nStatistical analyses (anonymized data)\nSharing with partners for service provision\n9.3 User Rights\nAccess to personal data\nCorrection of incorrect information\nData deletion (right to be forgotten)\nData portability',
    'terms.section10': '10. MODIFICATIONS\n10.1 Changes to Terms\nDuo Pass may change these terms at any time\nUsers will be notified 30 days in advance\nContinued use implies acceptance of changes\nDisagreement: right to cancellation without charge\n10.2 Changes to Service\nFeatures may be modified or discontinued\nNew services may be added\nPartners may be included or removed',
    'terms.section11': '11. TERMINATION\n11.1 By User\nCancellation at any time\nAccount closure via request\n11.2 By Duo Pass\nViolation of these terms\nFraudulent or abusive use\nFalse information in registration\nPrior notification of 15 days (when possible)',
    'terms.section12': '12. GENERAL PROVISIONS\n12.1 Applicable Law\nSwiss legislation\nForum: Competent court in Switzerland\n12.2 Independence of Clauses\nInvalidity of one clause does not affect the others\nGood faith interpretation\n12.3 Communications\nEmail: [contact email]\nAddress: [company address]\nPhone: [contact phone]',
    'terms.section13': '13. CONTACT AND SUPPORT\nCustomer Service:\nEmail: support@duopassclub.ch\nHours: Monday to Friday, 9am to 6pm\nLanguages: German, French, Italian\nVoucher Emergencies:\nWhatsApp: [number]\nAvailable 7 days a week\nBy using Duo Pass, you confirm that you have read, understood and accepted all the terms above.',
    // Home
    'home.subtitle': 'Discover amazing offers in your city',
    'home.cta': 'Explore Offers',
    'home.categories': 'Categories',

    // Categories
    'category.gastronomy': 'Gastronomy',
    'category.beauty': 'Beauty',
    'category.leisure': 'Leisure',
    'category.fitness': 'Fitness',
    'category.shopping': 'Shopping',
    'category.services': 'Services',

    // Offers
    'offers.title': 'Available Offers',
    'offers.activate': 'Activate Coupon',
    'offers.expires': 'Expires',
    'offers.location': 'Location',
    'offers.original_value': 'Original Value',

    // Auth
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.fullname': 'Full Name',
    'auth.signin': 'Sign In',
    'auth.signup': 'Sign Up',
    'auth.customer': 'Customer',
    'auth.merchant': 'Merchant',
    'auth.usertype': 'User Type',

    // Subscription
    'subscription.required': 'Subscription Required',
    'subscription.message': 'To activate coupons, you need an active subscription.',
    'subscription.subscribe': 'Subscribe Now',
  },
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.offers': 'Offres',
    'nav.history': 'Historique',
    'nav.profile': 'Profil',
    'nav.dashboard': 'Tableau de bord',
    'nav.login': 'Connexion',
    'nav.signup': 'S\'inscrire',
    'nav.logout': 'Déconnexion',
    'nav.analytics': 'Analytics BI',

    // Terms of Use
    'terms.title': 'CONDITIONS D\'UTILISATION - DUO PASS',
    'terms.last_update': 'Dernière mise à jour : [DATE]',
    'terms.effective': 'Entrée en vigueur : À partir de l\'acceptation',
    'terms.section1': '1. DÉFINITIONS\nDuo Pass : Plateforme numérique offrant des vouchers et des expériences culturelles, gastronomiques et de loisirs en Suisse.\nUtilisateur : Personne physique utilisant les services de la plateforme.\nGolden Week : Période promotionnelle de 7 jours avec accès à des vouchers premium.\nPlan Freemium : Accès gratuit limité à 1 voucher par mois.\nPartenaires : Établissements et prestataires de services accrédités.',
    'terms.section2': '2. ACCEPTATION DES CONDITIONS\nEn créant un compte ou en utilisant nos services, vous acceptez intégralement ces conditions. Si vous êtes en désaccord avec une clause, n\'utilisez pas la plateforme.',
    'terms.section3': '3. DESCRIPTION DES SERVICES\n3.1 Golden Week (Période d\'Essai Premium)\nDurée : 7 jours consécutifs\nAccès : 3-4 vouchers premium\nExpériences : Restaurants haut de gamme et activités exclusives\nActivation automatique lors du premier accès\n3.2 Plan Freemium\nVouchers : 1 par mois calendaire\nCatégorie : Expériences de niveau moyen\nValidité : Comme spécifié dans chaque voucher\nSans facturation récurrente\n3.3 Plans Payants\nValeurs : CHF 9, 12 ou 18 mensuels\nAvantages : Vouchers supplémentaires + expériences premium\nFacturation : Automatique via carte de crédit\nAnnulation : À tout moment',
    'terms.section4': '4. INSCRIPTION ET COMPTE UTILISATEUR\n4.1 Éligibilité\nÂgé de plus de 18 ans\nRésident en Suisse ou personne avec adresse valide dans le pays\nInformations vraies et mises à jour\n4.2 Responsabilités de l\'Utilisateur\nMaintenir les données à jour\nNe pas partager les identifiants d\'accès\nUtiliser les vouchers personnellement (sauf vouchers 2-pour-1)\nNotifier immédiatement en cas d\'utilisation non autorisée',
    'terms.section5': '5. VOUCHERS ET EXPÉRIENCES\n5.1 Utilisation\nLes vouchers ont une date d\'expiration spécifique\nRéservation préalable avec le partenaire requise\nSous réserve de la disponibilité de l\'établissement\nNon cumulable avec d\'autres promotions (sauf indication contraire)\n5.2 Limitations\n1 voucher par personne par établissement par mois (sauf spécification)\nNon transférable entre utilisateurs\nNon convertible en argent\nValable uniquement dans l\'établissement indiqué\n5.3 Annulations par le Partenaire\nLes partenaires peuvent annuler des vouchers pour des raisons opérationnelles\nL\'utilisateur sera notifié 24h à l\'avance (lorsque possible)\nLe voucher sera réémis ou la valeur créditée',
    'terms.section6': '6. PAIEMENTS ET ANNULATIONS\n6.1 Facturation\nPlans payants : facturation mensuelle automatique\nCartes acceptées : Visa, Mastercard, PostFinance\nDevise : Franc Suisse (CHF)\nÉchec de paiement : suspension du service après 7 jours\n6.2 Annulation\nPossible à tout moment via app/site web\nEffectif à la fin de la période déjà payée\nVouchers non utilisés expirent avec l\'annulation\nSans pénalité d\'annulation\n6.3 Remboursements\nGolden Week : pas de remboursement (période promotionnelle)\nPlans payants : remboursement proportionnel en cas d\'annulation par l\'entreprise\nVouchers défectueux : réémission ou crédit',
    'terms.section7': '7. RESPONSABILITÉS ET LIMITATIONS\n7.1 Duo Pass\nIntermédiation entre utilisateur et partenaires\nMaintenance de la plateforme technologique\nService client\nNon responsable de la qualité des services des partenaires\n7.2 Limitation de Responsabilité\nResponsabilité limitée au montant payé par l\'utilisateur\nNon responsable des dommages indirects ou pertes de profits\nLes partenaires sont responsables de la qualité de leurs services\nForce majeure exempte de responsabilité\n7.3 Disponibilité\nService sujet à des maintenances programmées\nIndisponibilité temporaire ne génère pas de droit à compensation\nEfforts pour maintenir 99% de disponibilité',
    'terms.section8': '8. PROPRIÉTÉ INTELLECTUELLE\nTous les droits sur les marques, logos, design et contenu de la plateforme appartiennent à Duo Pass. Utilisation non autorisée interdite.',
    'terms.section9': '9. CONFIDENTIALITÉ ET DONNÉES\n9.1 Collecte de Données\nDonnées personnelles : nom, email, téléphone, adresse\nDonnées d\'utilisation : vouchers utilisés, préférences\nDonnées de paiement : traitées par des tiers certifiés\n9.2 Utilisation des Données\nFourniture du service\nCommunication sur les offres\nAnalyses statistiques (données anonymisées)\nPartage avec partenaires pour fourniture du service\n9.3 Droits de l\'Utilisateur\nAccès aux données personnelles\nCorrection d\'informations incorrectes\nSuppression de données (droit à l\'oubli)\nPortabilité des données',
    'terms.section10': '10. MODIFICATIONS\n10.1 Changements aux Conditions\nDuo Pass peut modifier ces conditions à tout moment\nLes utilisateurs seront notifiés 30 jours à l\'avance\nUtilisation continue implique acceptation des changements\nDésaccord : droit d\'annulation sans frais\n10.2 Changements au Service\nFonctionnalités peuvent être modifiées ou discontinuées\nNouveaux services peuvent être ajoutés\nPartenaires peuvent être inclus ou supprimés',
    'terms.section11': '11. RÉSILIATION\n11.1 Par l\'Utilisateur\nAnnulation à tout moment\nFermeture du compte via demande\n11.2 Par Duo Pass\nViolation de ces conditions\nUtilisation frauduleuse ou abusive\nInformations fausses lors de l\'inscription\nNotification préalable de 15 jours (lorsque possible)',
    'terms.section12': '12. DISPOSITIONS GÉNÉRALES\n12.1 Loi Applicable\nLégislation suisse\nFor : Tribunal compétent en Suisse\n12.2 Indépendance des Clauses\nInvalidité d\'une clause n\'affecte pas les autres\nInterprétation de bonne foi\n12.3 Communications\nEmail : [email de contact]\nAdresse : [adresse de l\'entreprise]\nTéléphone : [téléphone de contact]',
    'terms.section13': '13. CONTACT ET SUPPORT\nService Client :\nEmail : support@duopassclub.ch\nHoraires : Lundi à vendredi, 9h à 18h\nLangues : Allemand, Français, Italien\nUrgences avec Vouchers :\nWhatsApp : [numéro]\nDisponible 7 jours par semaine\nEn utilisant Duo Pass, vous confirmez avoir lu, compris et accepté toutes les conditions ci-dessus.',
    // Add all other sections similarly for fr, de, it, es... (truncated for length, but in full call it would be complete)
    'home.subtitle': 'Découvrez des offres incroyables dans votre ville',
    'home.cta': 'Explorer les Offres',
    'home.categories': 'Catégories',

    // Categories
    'category.gastronomy': 'Gastronomie',
    'category.beauty': 'Beauté',
    'category.leisure': 'Loisirs',
    'category.fitness': 'Fitness',
    'category.shopping': 'Shopping',
    'category.services': 'Services',

    // Offers
    'offers.title': 'Offres Disponibles',
    'offers.activate': 'Activer le Coupon',
    'offers.expires': 'Expire le',
    'offers.location': 'Localisation',
    'offers.original_value': 'Valeur Originale',

    // Auth
    'auth.email': 'Email',
    'auth.password': 'Mot de passe',
    'auth.fullname': 'Nom Complet',
    'auth.signin': 'Se connecter',
    'auth.signup': 'S\'inscrire',
    'auth.customer': 'Client',
    'auth.merchant': 'Commerçant',
    'auth.usertype': 'Type d\'Utilisateur',

    // Subscription
    'subscription.required': 'Abonnement Requis',
    'subscription.message': 'Pour activer les coupons, vous avez besoin d\'un abonnement actif.',
    'subscription.subscribe': 'S\'abonner Maintenant',
  },
  de: {
    // Navigation
    'nav.home': 'Startseite',
    'nav.offers': 'Angebote',
    'nav.history': 'Verlauf',
    'nav.profile': 'Profil',
    'nav.dashboard': 'Dashboard',
    'nav.login': 'Anmelden',
    'nav.signup': 'Registrieren',
    'nav.logout': 'Abmelden',
    'nav.analytics': 'Analytics BI',

    // Terms of Use
    'terms.title': 'NUTZUNGSBEDINGUNGEN - DUO PASS',
    'terms.last_update': 'Letzte Aktualisierung: [DATUM]',
    'terms.effective': 'Gültig: Ab Annahme',
    'terms.section1': '1. DEFINITIONEN\nDuo Pass: Digitale Plattform, die Gutscheine und kulturelle, gastronomische und Freizeiterlebnisse in der Schweiz anbietet.\nBenutzer: Natürliche Person, die die Dienste der Plattform nutzt.\nGolden Week: Werbezeitraum von 7 Tagen mit Zugang zu Premium-Gutscheinen.\nFreemium-Plan: Kostenloser begrenzter Zugang zu 1 Gutschein pro Monat.\nPartner: Akkreditierte Einrichtungen und Dienstleister.',
    'terms.section2': '2. ANNAHME DER BEDINGUNGEN\nDurch Erstellung eines Kontos oder Nutzung unserer Dienste akzeptieren Sie diese Bedingungen vollständig. Wenn Sie mit einer Klausel nicht einverstanden sind, nutzen Sie die Plattform nicht.',
    'terms.section3': '3. BESCHREIBUNG DER DIENSTE\n3.1 Golden Week (Premium-Testzeitraum)\nDauer: 7 aufeinanderfolgende Tage\nZugang: 3-4 Premium-Gutscheine\nErlebnisse: Top-Restaurants und exklusive Aktivitäten\nAutomatische Aktivierung beim ersten Zugriff\n3.2 Freemium-Plan\nGutscheine: 1 pro Kalendermonat\nKategorie: Mittelklasse-Erlebnisse\nGültigkeit: Wie in jedem Gutschein angegeben\nKeine wiederkehrende Gebühr\n3.3 Bezahlte Pläne\nWerte: CHF 9, 12 oder 18 monatlich\nVorteile: Zusätzliche Gutscheine + Premium-Erlebnisse\nAbrechnung: Automatisch per Kreditkarte\nKündigung: Jederzeit',
    'terms.section4': '4. REGISTRIERUNG UND BENUTZERKONTO\n4.1 Berechtigung\nÜber 18 Jahre alt\nWohnhaft in der Schweiz oder Person mit gültiger Adresse im Land\nWahre und aktualisierte Informationen\n4.2 Verantwortlichkeiten des Benutzers\nDaten auf dem neuesten Stand halten\nZugangsdaten nicht teilen\nGutscheine persönlich nutzen (außer 2-für-1-Gutscheine)\nUnbefugte Nutzung sofort melden',
    'terms.section5': '5. GUTSCHEINE UND ERLEBNISSE\n5.1 Nutzung\nGutscheine haben ein spezifisches Ablaufdatum\nVorherige Terminvereinbarung mit dem Partner erforderlich\nAbhängig von der Verfügbarkeit der Einrichtung\nNicht kumulierbar mit anderen Aktionen (sofern nicht anders angegeben)\n5.2 Einschränkungen\n1 Gutschein pro Person pro Einrichtung pro Monat (sofern nicht angegeben)\nNicht übertragbar zwischen Benutzern\nNicht in Bargeld umwandelbar\nNur in der angegebenen Einrichtung gültig\n5.3 Stornierungen durch den Partner\nPartner können Gutscheine aus betrieblichen Gründen stornieren\nBenutzer wird 24 Stunden im Voraus benachrichtigt (wenn möglich)\nGutschein wird neu ausgestellt oder Wert gutgeschrieben',
    'terms.section6': '6. ZAHLUNGEN UND KÜNDIGUNGEN\n6.1 Abrechnung\nBezahlte Pläne: automatische monatliche Abrechnung\nAkzeptierte Karten: Visa, Mastercard, PostFinance\nWährung: Schweizer Franken (CHF)\nZahlungsausfall: Dienstunterbrechung nach 7 Tagen\n6.2 Kündigung\nJederzeit möglich über App/Website\nWirksam am Ende der bezahlten Periode\nNicht genutzte Gutscheine verfallen mit der Kündigung\nKeine Kündigungsgebühr\n6.3 Rückerstattungen\nGolden Week: keine Rückerstattung (Werbezeitraum)\nBezahlte Pläne: proportionale Rückerstattung bei Kündigung durch das Unternehmen\nDefekte Gutscheine: Neuauflage oder Gutschrift',
    'terms.section7': '7. VERANTWORTLICHKEITEN UND EINSCHRÄNKUNGEN\n7.1 Duo Pass\nVermittlung zwischen Benutzer und Partnern\nWartung der technologischen Plattform\nKundenservice\nNicht verantwortlich für die Qualität der Dienste der Partner\n7.2 Haftungsbeschränkung\nHaftung begrenzt auf den vom Benutzer gezahlten Betrag\nNicht verantwortlich für indirekte Schäden oder entgangene Gewinne\nPartner sind für die Qualität ihrer Dienste verantwortlich\nHöhere Gewalt entbindet von der Haftung\n7.3 Verfügbarkeit\nDienst unterliegt geplanten Wartungen\nVorübergehende Nichtverfügbarkeit erzeugt kein Recht auf Entschädigung\nBemühungen, 99% Verfügbarkeit zu halten',
    'terms.section8': '8. GEISTIGES EIGENTUM\nAlle Rechte an Marken, Logos, Design und Inhalten der Plattform gehören Duo Pass. Unbefugte Nutzung verboten.',
    'terms.section9': '9. DATENSCHUTZ UND DATEN\n9.1 Datenerhebung\nPersönliche Daten: Name, E-Mail, Telefon, Adresse\nNutzungsdaten: genutzte Gutscheine, Vorlieben\nZahlungsdaten: von zertifizierten Dritten verarbeitet\n9.2 Nutzung der Daten\nErbringung des Dienstes\nKommunikation über Angebote\nStatistische Analysen (anonymisierte Daten)\nTeilen mit Partnern zur Erbringung des Dienstes\n9.3 Rechte des Benutzers\nZugang zu persönlichen Daten\nKorrektur falscher Informationen\nLöschung von Daten (Recht auf Vergessenwerden)\nDatenportabilität',
    'terms.section10': '10. ÄNDERUNGEN\n10.1 Änderungen der Bedingungen\nDuo Pass kann diese Bedingungen jederzeit ändern\nBenutzer werden 30 Tage im Voraus benachrichtigt\nFortgesetzte Nutzung impliziert Annahme der Änderungen\nUneinigkeit: Recht auf Kündigung ohne Gebühr\n10.2 Änderungen am Dienst\nFunktionen können geändert oder eingestellt werden\nNeue Dienste können hinzugefügt werden\nPartner können hinzugefügt oder entfernt werden',
    'terms.section11': '11. KÜNDIGUNG\n11.1 Durch den Benutzer\nKündigung jederzeit\nKontoschließung per Anfrage\n11.2 Durch Duo Pass\nVerletzung dieser Bedingungen\nBetrügerische oder missbräuchliche Nutzung\nFalsche Informationen bei der Registrierung\nVorherige Benachrichtigung von 15 Tagen (wenn möglich)',
    'terms.section12': '12. ALLGEMEINE BESTIMMUNGEN\n12.1 Anwendbares Recht\nSchweizer Recht\nGerichtsstand: Zuständiges Gericht in der Schweiz\n12.2 Unabhängigkeit der Klauseln\nUngültigkeit einer Klausel beeinflusst nicht die anderen\nAuslegung in gutem Glauben\n12.3 Kommunikationen\nE-Mail: [Kontakt-E-Mail]\nAdresse: [Firmenadresse]\nTelefon: [Kontakttelefon]',
    'terms.section13': '13. KONTAKT UND SUPPORT\nKundenservice:\nE-Mail: support@duopassclub.ch\nÖffnungszeiten: Montag bis Freitag, 9 bis 18 Uhr\nSprachen: Deutsch, Französisch, Italienisch\nNotfälle mit Gutscheinen:\nWhatsApp: [Nummer]\nVerfügbar 7 Tage die Woche\nDurch die Nutzung von Duo Pass bestätigen Sie, dass Sie alle obigen Bedingungen gelesen, verstanden und akzeptiert haben.',
    // Home
    'home.subtitle': 'Entdecke erstaunliche Angebote in deiner Stadt',
    'home.cta': 'Angebote Erkunden',
    'home.categories': 'Kategorien',

    // Categories
    'category.gastronomy': 'Gastronomie',
    'category.beauty': 'Schönheit',
    'category.leisure': 'Freizeit',
    'category.fitness': 'Fitness',
    'category.shopping': 'Einkaufen',
    'category.services': 'Dienstleistungen',

    // Offers
    'offers.title': 'Verfügbare Angebote',
    'offers.activate': 'Gutschein Aktivieren',
    'offers.expires': 'Läuft ab',
    'offers.location': 'Standort',
    'offers.original_value': 'Originalwert',

    // Auth
    'auth.email': 'E-Mail',
    'auth.password': 'Passwort',
    'auth.fullname': 'Vollständiger Name',
    'auth.signin': 'Anmelden',
    'auth.signup': 'Registrieren',
    'auth.customer': 'Kunde',
    'auth.merchant': 'Händler',
    'auth.usertype': 'Benutzertyp',

    // Subscription
    'subscription.required': 'Abonnement Erforderlich',
    'subscription.message': 'Um Gutscheine zu aktivieren, benötigen Sie ein aktives Abonnement.',
    'subscription.subscribe': 'Jetzt Abonnieren',
  },
  it: {
    // Navigation
    'nav.home': 'Home',
    'nav.offers': 'Offerte',
    'nav.history': 'Cronologia',
    'nav.profile': 'Profilo',
    'nav.dashboard': 'Dashboard',
    'nav.login': 'Accedi',
    'nav.signup': 'Registrati',
    'nav.logout': 'Esci',
    'nav.analytics': 'Analytics BI',

    // Terms of Use
    'terms.title': 'TERMINI DI UTILIZZO - DUO PASS',
    'terms.last_update': 'Ultimo aggiornamento: [DATA]',
    'terms.effective': 'Efficace: Dalla accettazione',
    'terms.section1': '1. DEFINIZIONI\nDuo Pass: Piattaforma digitale che offre voucher ed esperienze culturali, gastronomiche e di svago in Svizzera.\nUtente: Persona fisica che utilizza i servizi della piattaforma.\nGolden Week: Periodo promozionale di 7 giorni con accesso a voucher premium.\nPiano Freemium: Accesso gratuito limitato a 1 voucher al mese.\nPartner: Strutture e fornitori di servizi accreditati.',
    'terms.section2': `2. ACCETTAZIONE DEI TERMINI\nCreando un account o utilizzando i nostri servizi, accetti integralmente questi termini. Se non sei d'accordo con qualsiasi clausola, non utilizzare la piattaforma.`,
    'terms.section3': '3. DESCRIZIONE DEI SERVIZI\n3.1 Golden Week (Periodo di Prova Premium)\nDurata: 7 giorni consecutivi\nAccesso: 3-4 voucher premium\nEsperienze: Ristoranti top-tier e attività esclusive\nAttivazione automatica al primo accesso\n3.2 Piano Freemium\nVoucher: 1 al mese solare\nCategoria: Esperienze mid-tier\nValidità: Come specificato in ciascun voucher\nSenza addebito ricorrente\n3.3 Piani Pagati\nValori: CHF 9, 12 o 18 mensili\nBenefici: Voucher aggiuntivi + esperienze premium\nAddebito: Automatico tramite carta di credito\nCancellazione: In qualsiasi momento',
    'terms.section4': `4. REGISTRAZIONE E ACCOUNT UTENTE\n4.1 Idoneità\nMaggiore di 18 anni\nResidente in Svizzera o persona con indirizzo valido nel paese\nInformazioni vere e aggiornate\n4.2 Responsabilità dell'Utente\nMantenere i dati aggiornati\nNon condividere le credenziali di accesso\nUtilizzare i voucher personalmente (salvo voucher 2-per-1)\nNotificare immediatamente l'uso non autorizzato`,
    'terms.section5': `5. VOUCHER ED ESPERIENZE\n5.1 Utilizzo\nI voucher hanno una data di scadenza specifica\nNecessaria prenotazione anticipata con il partner\nSoggetto alla disponibilità della struttura\nNon cumulabile con altre promozioni (salvo indicazione contraria)\n5.2 Limitazioni\n1 voucher per persona per struttura al mese (salvo specifica)\nNon trasferibile tra utenti\nNon convertibile in denaro\nValido solo nella struttura indicata\n5.3 Cancellazioni dal Partner\nI partner possono cancellare voucher per motivi operativi\nL'utente sarà notificato con 24 ore di anticipo (quando possibile)\nIl voucher sarà riemesso o il valore accreditato`,
    'terms.section6': `6. PAGAMENTI E CANCELLAZIONI\n6.1 Addebito\nPiani pagati: addebito mensile automatico\nCarte accettate: Visa, Mastercard, PostFinance\nValuta: Franco Svizzero (CHF)\nFallimento del pagamento: sospensione del servizio dopo 7 giorni\n6.2 Cancellazione\nPossibile in qualsiasi momento via app/sito web\nEffettiva alla fine del periodo già pagato\nVoucher non utilizzati scadono con la cancellazione\nSenza penale di cancellazione\n6.3 Rimborsi\nGolden Week: nessun rimborso (periodo promozionale)\nPiani pagati: rimborso proporzionale in caso di cancellazione dall'azienda\nVoucher difettosi: riemissione o credito`,
    'terms.section7': `7. RESPONSABILITÀ E LIMITAZIONI\n7.1 Duo Pass\nIntermediazione tra utente e partner\nManutenzione della piattaforma tecnologica\nAssistenza clienti\nNon responsabile della qualità dei servizi dei partner\n7.2 Limitazione di Responsabilità\nResponsabilità limitata all'importo pagato dall'utente\nNon responsabile di danni indiretti o profitti cessanti\nI partner rispondono della qualità dei loro servizi\nForza maggiore esonera dalla responsabilità\n7.3 Disponibilità\nServizio soggetto a manutenzioni programmate\nIndisponibilità temporanea non genera diritto a compensazione\nSforzi per mantenere il 99% di uptime`,
    'terms.section8': '8. PROPRIETÀ INTELLETTUALE\nTutti i diritti su marchi, loghi, design e contenuti della piattaforma appartengono a Duo Pass. Uso non autorizzato proibito.',
    'terms.section9': `9. PRIVACY E DATI\n9.1 Raccolta Dati\nDati personali: nome, email, telefono, indirizzo\nDati di utilizzo: voucher utilizzati, preferenze\nDati di pagamento: elaborati da terzi certificati\n9.2 Uso dei Dati\nFornitura del servizio\nComunicazione su offerte\nAnalisi statistiche (dati anonimizzati)\nCondivisione con partner per fornitura del servizio\n9.3 Diritti dell'Utente\nAccesso ai dati personali\nCorrezione di informazioni errate\nCancellazione dei dati (diritto all'oblio)\nPortabilità dei dati`,
    'terms.section10': `10. MODIFICHE
10.1 Modifiche ai Termini
Duo Pass può modificare questi termini in qualsiasi momento
Gli utenti saranno notificati con 30 giorni di anticipo
Continuazione dell'uso implica accettazione delle modifiche
Disaccordo: diritto di cancellazione senza oneri
10.2 Modifiche al Servizio
Funzionalità possono essere modificate o discontinue
Nuovi servizi possono essere aggiunti
Partner possono essere inclusi o rimossi`,
    'terms.section11': `11. RISOLUZIONE\n11.1 Dall'Utente\nCancellazione in qualsiasi momento\nChiusura dell'account via richiesta\n11.2 Da Duo Pass\nViolazione di questi termini\nUso fraudolento o abusivo\nInformazioni false nella registrazione\nNotifica preliminare di 15 giorni (quando possibile)`,
    'terms.section12': `12. DISPOSIZIONI GENERALI\n12.1 Legge Applicabile\nLegislazione svizzera\nForo: Tribunale competente in Svizzera\n12.2 Indipendenza delle Clausole\nInvalidità di una clausola non influisce sulle altre\nInterpretazione in buona fede\n12.3 Comunicazioni\nEmail: [email di contatto]\nIndirizzo: [indirizzo dell'azienda]\nTelefono: [telefono di contatto]`,
    'terms.section13': '13. CONTATTO E SUPPORTO\nAssistenza Clienti:\nEmail: support@duopassclub.ch\nOrari: Lunedì a venerdì, 9h alle 18h\nLingue: Tedesco, Francese, Italiano\nEmergenze con Voucher:\nWhatsApp: [numero]\nDisponibile 7 giorni su 7\nUtilizzando Duo Pass, confermi di aver letto, compreso e accettato tutti i termini sopra.',
    // Home
    'home.subtitle': 'Scopri offerte incredibili nella tua città',
    'home.cta': 'Esplora Offerte',
    'home.categories': 'Categorie',

    // Categories
    'category.gastronomy': 'Gastronomia',
    'category.beauty': 'Bellezza',
    'category.leisure': 'Tempo Libero',
    'category.fitness': 'Fitness',
    'category.shopping': 'Shopping',
    'category.services': 'Servizi',

    // Offers
    'offers.title': 'Offerte Disponibili',
    'offers.activate': 'Attiva Coupon',
    'offers.expires': 'Scade',
    'offers.location': 'Posizione',
    'offers.original_value': 'Valore Originale',

    // Auth
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.fullname': 'Nome Completo',
    'auth.signin': 'Accedi',
    'auth.signup': 'Registrati',
    'auth.customer': 'Cliente',
    'auth.merchant': 'Commerciante',
    'auth.usertype': 'Tipo di Utente',

    // Subscription
    'subscription.required': 'Abbonamento Richiesto',
    'subscription.message': 'Per attivare i coupon, hai bisogno di un abbonamento attivo.',
    'subscription.subscribe': 'Abbonati Ora',
  },
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.offers': 'Ofertas',
    'nav.history': 'Historial',
    'nav.profile': 'Perfil',
    'nav.dashboard': 'Panel',
    'nav.login': 'Iniciar Sesión',
    'nav.signup': 'Registrarse',
    'nav.logout': 'Cerrar Sesión',
    'nav.analytics': 'Analytics BI',

    // Terms of Use
    'terms.title': 'TÉRMINOS DE USO - DUO PASS',
    'terms.last_update': 'Última actualización: [FECHA]',
    'terms.effective': 'Vigencia: A partir de la aceptación',
    'terms.section1': '1. DEFINICIONES\nDuo Pass: Plataforma digital que ofrece vouchers y experiencias culturales, gastronómicas y de ocio en Suiza.\nUsuario: Persona física que utiliza los servicios de la plataforma.\nGolden Week: Período promocional de 7 días con acceso a vouchers premium.\nPlan Freemium: Acceso gratuito limitado a 1 voucher por mes.\nSocios: Establecimientos y prestadores de servicios acreditados.',
    'terms.section2': '2. ACEPTACIÓN DE LOS TÉRMINOS\nAl crear una cuenta o utilizar nuestros servicios, aceptas integralmente estos términos. Si no estás de acuerdo con cualquier cláusula, no utilices la plataforma.',
    'terms.section3': '3. DESCRIPCIÓN DE LOS SERVICIOS\n3.1 Golden Week (Período de Prueba Premium)\nDuración: 7 días consecutivos\nAcceso: 3-4 vouchers premium\nExperiencias: Restaurantes top-tier y actividades exclusivas\nActivación automática en el primer acceso\n3.2 Plan Freemium\nVouchers: 1 por mes calendario\nCategoría: Experiencias mid-tier\nValidez: Según especificado en cada voucher\nSin cobro recurrente\n3.3 Planes Pagados\nValores: CHF 9, 12 o 18 mensuales\nBeneficios: Vouchers adicionales + experiencias premium\nCobro: Automático vía tarjeta de crédito\nCancelación: En cualquier momento',
    'terms.section4': '4. REGISTRO Y CUENTA DE USUARIO\n4.1 Elegibilidad\nMayor de 18 años\nResidente en Suiza o persona con dirección válida en el país\nInformaciones verdaderas y actualizadas\n4.2 Responsabilidades del Usuario\nMantener datos actualizados\nNo compartir credenciales de acceso\nUsar vouchers personalmente (salvo vouchers 2-por-1)\nNotificar inmediatamente sobre uso no autorizado',
    'terms.section5': '5. VOUCHERS Y EXPERIENCIAS\n5.1 Utilización\nLos vouchers tienen fecha de validez específica\nNecesario agendamiento previo con el socio\nSujeto a disponibilidad del establecimiento\nNo acumulable con otras promociones (salvo indicación contraria)\n5.2 Limitaciones\n1 voucher por persona por establecimiento por mes (salvo especificación)\nNo transferible entre usuarios\nNo convertible en dinero\nVálido solo en el establecimiento indicado\n5.3 Cancelaciones por el Socio\nLos socios pueden cancelar vouchers por motivos operacionales\nEl usuario será notificado con 24h de antelación (cuando posible)\nEl voucher será reemitido o valor acreditado',
    'terms.section6': '6. PAGOS Y CANCELACIONES\n6.1 Cobro\nPlanes pagados: cobro mensual automático\nTarjetas aceptadas: Visa, Mastercard, PostFinance\nMoneda: Franco Suizo (CHF)\nFalla en el pago: suspensión del servicio después de 7 días\n6.2 Cancelación\nPosible en cualquier momento vía app/sitio web\nEfectiva al final del período ya pagado\nVouchers no utilizados expiran con la cancelación\nSin multa de cancelación\n6.3 Reembolsos\nGolden Week: sin reembolso (período promocional)\nPlanes pagados: reembolso proporcional en caso de cancelación por la empresa\nVouchers defectuosos: reemisión o crédito',
    'terms.section7': '7. RESPONSABILIDADES Y LIMITACIONES\n7.1 Duo Pass\nIntermediación entre usuario y socios\nMantenimiento de la plataforma tecnológica\nAtención al cliente\nNo responsable por la calidad de los servicios de los socios\n7.2 Limitación de Responsabilidad\nResponsabilidad limitada al valor pagado por el usuario\nNo responsable por daños indirectos o lucros cesantes\nLos socios responden por la calidad de sus servicios\nFuerza mayor exime responsabilidad\n7.3 Disponibilidad\nServicio sujeto a mantenimientos programados\nIndisponibilidad temporal no genera derecho a compensación\nEsfuerzos para mantener 99% de uptime',
    'terms.section8': '8. PROPIEDAD INTELECTUAL\nTodos los derechos sobre marcas, logotipos, diseño y contenido de la plataforma pertenecen a Duo Pass. Uso no autorizado prohibido.',
    'terms.section9': '9. PRIVACIDAD Y DATOS\n9.1 Recolección de Datos\nDatos personales: nombre, email, teléfono, dirección\nDatos de uso: vouchers utilizados, preferencias\nDatos de pago: procesados por terceros certificados\n9.2 Uso de los Datos\nPrestación del servicio\nComunicación sobre ofertas\nAnálisis estadísticos (datos anonimizados)\nCompartición con socios para prestación del servicio\n9.3 Derechos del Usuario\nAcceso a datos personales\nCorrección de informaciones incorrectas\nEliminación de datos (derecho al olvido)\nPortabilidad de datos',
    'terms.section10': '10. MODIFICACIONES\n10.1 Alteraciones en los Términos\nDuo Pass puede alterar estos términos en cualquier momento\nLos usuarios serán notificados con 30 días de antelación\nContinuidad del uso implica aceptación de las alteraciones\nDesacuerdo: derecho de cancelación sin costos\n10.2 Alteraciones en el Servicio\nFuncionalidades pueden ser modificadas o descontinuadas\nNuevos servicios pueden ser agregados\nSocios pueden ser incluidos o removidos',
    'terms.section11': '11. RESCISIÓN\n11.1 Por el Usuario\nCancelación en cualquier momento\nCierre de la cuenta vía solicitud\n11.2 Por Duo Pass\nViolación de estos términos\nUso fraudulento o abusivo\nInformaciones falsas en el registro\nNotificación previa de 15 días (cuando posible)',
    'terms.section12': '12. DISPOSICIONES GENERALES\n12.1 Ley Aplicable\nLegislación suiza\nForo: Tribunal competente en Suiza\n12.2 Independencia de las Cláusulas\nInvalididad de una cláusula no afecta las demás\nInterpretación de buena fe\n12.3 Comunicaciones\nEmail: [email de contacto]\nDirección: [dirección de la empresa]\nTeléfono: [teléfono de contacto]',
    'terms.section13': '13. CONTACTO Y SOPORTE\nAtención al Cliente:\nEmail: soporte@duopassclub.ch\nHorario: Lunes a viernes, 9h a 18h\nIdiomas: Alemán, Francés, Italiano\nEmergencias con Vouchers:\nWhatsApp: [número]\nDisponible 7 días por semana\nAl utilizar Duo Pass, confirmas haber leído, comprendido y aceptado todos los términos arriba.',
    // Home
    'home.subtitle': 'Descubre ofertas increíbles en tu ciudad',
    'home.cta': 'Explorar Ofertas',
    'home.categories': 'Categorías',

    // Categories
    'category.gastronomy': 'Gastronomía',
    'category.beauty': 'Belleza',
    'category.leisure': 'Ocio',
    'category.fitness': 'Fitness',
    'category.shopping': 'Compras',
    'category.services': 'Servicios',

    // Offers
    'offers.title': 'Ofertas Disponibles',
    'offers.activate': 'Activar Cupón',
    'offers.expires': 'Expira',
    'offers.location': 'Ubicación',
    'offers.original_value': 'Valor Original',

    // Auth
    'auth.email': 'Email',
    'auth.password': 'Contraseña',
    'auth.fullname': 'Nombre Completo',
    'auth.signin': 'Iniciar Sesión',
    'auth.signup': 'Registrarse',
    'auth.customer': 'Cliente',
    'auth.merchant': 'Comerciante',
    'auth.usertype': 'Tipo de Usuario',

    // Subscription
    'subscription.required': 'Suscripción Requerida',
    'subscription.message': 'Para activar cupones, necesitas una suscripción activa.',
    'subscription.subscribe': 'Suscribirse Ahora',
  },
};

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('pt');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}