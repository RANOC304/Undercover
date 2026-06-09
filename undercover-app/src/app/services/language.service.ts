import { Injectable, signal, computed } from '@angular/core';

export type Language = 'fr' | 'en';

export const TRANSLATIONS = {
  fr: {
    home_title: "UNDERCOVER",
    home_subtitle: "Jeu de déduction par les mots",
    tab_play: "🎮 Jouer",
    tab_groups: "👥 Groupes",
    tab_words: "📖 Mots",
    
    // Modes
    mode_classic: "Classique",
    mode_spy: "Mode Espion",
    mode_spy_desc: "Trouvez l'espion qui a un mot légèrement différent des civils.",
    mode_hardcore: "Espion Hardcore 🔥",
    mode_hardcore_desc: "L'espion a un mot complètement différent — rien à voir avec celui des civils !",
    mode_mrwhite: "Mode M. Blanc",
    mode_mrwhite_desc: "Trouvez l'imposteur qui n'a aucun mot et qui bluffe pour survivre.",
    mode_duo: "Duo (4 joueurs min.)",
    mode_2spies_allied: "2 Espions Alliés",
    mode_2spies_allied_desc: "Deux espions se connaissent entre eux.",
    mode_2spies_solo: "2 Espions Solo",
    mode_2spies_solo_desc: "Deux espions qui ne savent pas qui est l'autre.",
    mode_2mrwhite_allied: "2 M. Blanc Alliés",
    mode_2mrwhite_allied_desc: "Deux imposteurs sans mot qui se connaissent.",
    mode_2mrwhite_solo: "2 M. Blanc Solo",
    mode_2mrwhite_solo_desc: "Deux imposteurs sans mot qui s'ignorent.",

    // Groups Tab
    group_new: "Nouveau groupe",
    group_edit: "Modifier le groupe",
    group_name_placeholder: "Nom du groupe (ex: Famille)",
    group_player_placeholder: "Nom du joueur",
    group_add_player: "+ Ajouter un joueur",
    group_cancel: "Annuler",
    group_save: "Enregistrer",
    group_empty: "Aucun groupe encore.",
    group_empty_sub: "Crée-en un pour démarrer une partie rapidement !",
    group_players_count: "joueur",
    group_players_count_plural: "joueurs",
    group_confirm_delete: "Supprimer le groupe ?",

    // Words Tab
    word_new_cat: "+ Nouvelle catégorie",
    word_cat_name_placeholder: "Nom de la catégorie...",
    word_create: "Créer",
    word_table_civilian: "Civil",
    word_table_spy: "Espion",
    word_add_word: "+ Ajouter un mot",
    word_civilian_placeholder: "Mot civil",
    word_spy_placeholder: "Mot espion",
    word_add: "Ajouter",
    word_confirm_delete_cat: "Supprimer la catégorie \"{cat}\" et tous ses mots personnalisés ?",

    // Setup Page
    setup_title: "Configurer la partie",
    setup_mode: "Mode :",
    setup_load_group: "Charger un groupe :",
    setup_loaded_hint: "Joueurs chargés · tu peux modifier ci-dessous",
    setup_start: "Lancer la partie !",
    setup_error_min: "Il faut au moins {min} joueurs avec des noms valides.",
    setup_back: "← Retour",

    // Category Page
    cat_title: "Catégorie",
    cat_subtitle: "Les mots seront tirés de la catégorie choisie.",
    cat_random: "Aléatoire",
    cat_random_desc: "Catégorie secrète",
    cat_all: "Tout",
    cat_all_desc: "Toutes catégories",
    cat_back: "← Retour",

    // Reveal Page
    reveal_pass_title: "Passe le téléphone à :",
    reveal_pass_btn: "Appuie pour révéler ton mot",
    reveal_cancel: "✕ Annuler la partie",
    reveal_secret_word_label: "Ton mot secret est :",
    reveal_partner_label: "Ton complice :",
    reveal_memorized_btn: "J'ai mémorisé",
    reveal_mrwhite_role: "M. BLANC",

    // Wheel Page
    wheel_title: "Qui va commencer ?",
    wheel_winner_header: "C'est parti !",
    wheel_winner_suffix: "commence à dire son mot en premier !",
    wheel_spin_btn: "🎰 Lancer la roue",
    wheel_spinning: "Sélection en cours...",
    wheel_start_game: "🔥 Commencer la partie",

    // Game On Page
    game_title: "Que le jeu commence !",
    game_starter_label: "Premier à parler :",
    game_instruction_1: "Tous les mots ont été distribués. Ne regardez plus le téléphone !",
    game_instruction_2: "Discutez. Mentez. Trouvez l'Espion / M. Blanc.",
    game_reroll: "🔄 Changer les mots",
    game_restart: "Terminer et recommencer",
    
    // Reminders
    reminder_title: "🔍 Rappel secret (glisse & clique sur ton nom) :",
    reminder_modal_title: "Rappel Secret 🕵️",
    reminder_modal_desc: "Passe le téléphone à {name}. Les autres joueurs ne doivent pas regarder l'écran.",
    reminder_show_word: "Afficher mon mot",
    reminder_cancel: "Annuler",
    reminder_word_label: "{name}, ton mot secret est :",
    reminder_partner_label: "Ton complice :",
    reminder_done: "J'ai mémorisé",

    // Category translations
    cat_Nourriture: "Nourriture",
    cat_Nature: "Nature",
    cat_Animaux: "Animaux",
    cat_Maison: "Maison",
    cat_Corps: "Corps",
    cat_Mode: "Mode",
    cat_Transport: "Transport",
    cat_Technologie: "Technologie",
    cat_Sports: "Sports",
    cat_Musique: "Musique",
    cat_Professions: "Professions",
    cat_Lieux: "Lieux",
    cat_Émotions: "Émotions",
    cat_Cinéma: "Cinéma",
    cat_Jeux: "Jeux",
    cat_Histoire: "Histoire",
    cat_Science: "Science",
    cat_Géographie: "Géographie",
    cat_Art: "Art",
    cat_Espace: "Espace",
    cat_Cuisine_du_Monde: "Cuisine du Monde",
    cat_Météo: "Météo",
    cat_Adulte: "Adulte"
  },
  en: {
    home_title: "UNDERCOVER",
    home_subtitle: "Word deduction game",
    tab_play: "🎮 Play",
    tab_groups: "👥 Groups",
    tab_words: "📖 Words",
    
    // Modes
    mode_classic: "Classic",
    mode_spy: "Spy Mode",
    mode_spy_desc: "Find the spy who has a word slightly different from the civilians.",
    mode_hardcore: "Hardcore Spy 🔥",
    mode_hardcore_desc: "The spy has a completely different word — nothing to do with the civilians'!",
    mode_mrwhite: "Mr. White Mode",
    mode_mrwhite_desc: "Find the impostor who has no word and bluffs to survive.",
    mode_duo: "Duo (4 players min.)",
    mode_2spies_allied: "2 Allied Spies",
    mode_2spies_allied_desc: "Two spies know each other.",
    mode_2spies_solo: "2 Solo Spies",
    mode_2spies_solo_desc: "Two spies who don't know who the other is.",
    mode_2mrwhite_allied: "2 Allied Mr. Whites",
    mode_2mrwhite_allied_desc: "Two impostors with no word who know each other.",
    mode_2mrwhite_solo: "2 Solo Mr. Whites",
    mode_2mrwhite_solo_desc: "Two impostors with no word who ignore each other.",

    // Groups Tab
    group_new: "New Group",
    group_edit: "Edit Group",
    group_name_placeholder: "Group name (e.g. Family)",
    group_player_placeholder: "Player name",
    group_add_player: "+ Add Player",
    group_cancel: "Cancel",
    group_save: "Save",
    group_empty: "No groups yet.",
    group_empty_sub: "Create one to start a game quickly!",
    group_players_count: "player",
    group_players_count_plural: "players",
    group_confirm_delete: "Delete group?",

    // Words Tab
    word_new_cat: "+ New Category",
    word_cat_name_placeholder: "Category name...",
    word_create: "Create",
    word_table_civilian: "Civilian",
    word_table_spy: "Spy",
    word_add_word: "+ Add Word",
    word_civilian_placeholder: "Civilian word",
    word_spy_placeholder: "Spy word",
    word_add: "Add",
    word_confirm_delete_cat: "Delete category \"{cat}\" and all of its custom words?",

    // Setup Page
    setup_title: "Configure Game",
    setup_mode: "Mode:",
    setup_load_group: "Load a group:",
    setup_loaded_hint: "Players loaded · you can edit below",
    setup_start: "Start the Game!",
    setup_error_min: "At least {min} players with valid names are required.",
    setup_back: "← Back",

    // Category Page
    cat_title: "Category",
    cat_subtitle: "Words will be drawn from the selected category.",
    cat_random: "Random",
    cat_random_desc: "Secret category",
    cat_all: "All",
    cat_all_desc: "All categories",
    cat_back: "← Back",

    // Reveal Page
    reveal_pass_title: "Pass the phone to:",
    reveal_pass_btn: "Tap to reveal your word",
    reveal_cancel: "✕ Cancel game",
    reveal_secret_word_label: "Your secret word is:",
    reveal_partner_label: "Your partner:",
    reveal_memorized_btn: "I have memorized",
    reveal_mrwhite_role: "MR. WHITE",

    // Wheel Page
    wheel_title: "Who is going to start?",
    wheel_winner_header: "Let's go!",
    wheel_winner_suffix: "starts saying their word first!",
    wheel_spin_btn: "🎰 Spin the wheel",
    wheel_spinning: "Selection in progress...",
    wheel_start_game: "🔥 Start the game",

    // Game On Page
    game_title: "Let the game begin!",
    game_starter_label: "First to speak:",
    game_instruction_1: "All words have been distributed. Do not look at the phone anymore!",
    game_instruction_2: "Discuss. Lie. Find the Spy / Mr. White.",
    game_reroll: "🔄 Change words",
    game_restart: "End and restart",
    
    // Reminders
    reminder_title: "🔍 Secret Reminder (swipe & click your name):",
    reminder_modal_title: "Secret Reminder 🕵️",
    reminder_modal_desc: "Pass the phone to {name}. Other players must not look at the screen.",
    reminder_show_word: "Show my word",
    reminder_cancel: "Cancel",
    reminder_word_label: "{name}, your secret word is:",
    reminder_partner_label: "Your partner:",
    reminder_done: "I have memorized",

    // Category translations
    cat_Nourriture: "Food",
    cat_Nature: "Nature",
    cat_Animaux: "Animals",
    cat_Maison: "Home",
    cat_Corps: "Body",
    cat_Mode: "Fashion",
    cat_Transport: "Transport",
    cat_Technologie: "Technology",
    cat_Sports: "Sports",
    cat_Musique: "Music",
    cat_Professions: "Jobs",
    cat_Lieux: "Places",
    cat_Émotions: "Emotions",
    cat_Cinéma: "Cinema",
    cat_Jeux: "Games",
    cat_Histoire: "History",
    cat_Science: "Science",
    cat_Géographie: "Geography",
    cat_Art: "Art",
    cat_Espace: "Space",
    cat_Cuisine_du_Monde: "World Cuisine",
    cat_Météo: "Weather",
    cat_Adulte: "Adult"
  }
};

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private activeLang = signal<Language>(this.loadLanguage());

  language = this.activeLang.asReadonly();

  t = computed(() => {
    const lang = this.language();
    return (key: keyof typeof TRANSLATIONS['fr'], params?: Record<string, string | number>) => {
      let val = TRANSLATIONS[lang][key] || TRANSLATIONS['fr'][key] || String(key);
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          val = val.replace(`{${k}}`, String(v));
        });
      }
      return val;
    };
  });

  setLanguage(lang: Language) {
    this.activeLang.set(lang);
    try {
      localStorage.setItem('undercover_lang', lang);
    } catch {}
  }

  private loadLanguage(): Language {
    try {
      const saved = localStorage.getItem('undercover_lang');
      if (saved === 'en' || saved === 'fr') return saved;
    } catch {}

    const browserLang = typeof navigator !== 'undefined' ? (navigator.language || '') : '';
    return browserLang.startsWith('en') ? 'en' : 'fr';
  }
}
