import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Our translation resources
const resources = {
  en: {
    translation: {
      // Common
      "app_name": "Poopy Pals",
      "loading": "Loading...",
      
      // Navigation
      "nav_home": "Home",
      "nav_stats": "Stats",
      "nav_rewards": "Rewards",
      "nav_profile": "Profile",
      
      // Home page
      "recent_activity": "Recent Activity",
      "today": "Today",
      "yesterday": "Yesterday",
      "log_button": "Log Poop",
      "status_card_title": "Streak Status",
      "status_card_description": "You're doing great!",
      "feature_grid_title": "Track Your Progress",
      
      // Logging form
      "log_title": "Log a Poop",
      "date_time": "Date & Time",
      "duration": "Duration",
      "minutes": "minutes",
      "rating": "Rate Your Experience",
      "bad": "Bad",
      "ok": "OK",
      "good": "Good",
      "excellent": "Excellent!",
      "consistency": "Consistency",
      "very_soft": "Very Soft",
      "soft": "Soft",
      "normal": "Normal",
      "hard": "Hard",
      "very_hard": "Very Hard",
      "notes": "Notes (Optional)",
      "notes_placeholder": "Add any notes or observations...",
      "submit": "Save Log",
      "cancel": "Cancel",
      
      // Rewards page
      "rewards": "Rewards",
      "flush_funds": "Flush Funds",
      "achievements": "Achievements",
      "achievements_unlocked": "You've unlocked {{count}} achievements",
      "reward_shop": "Reward Shop",
      "spend_funds": "Spend your Flush Funds",
      
      // Achievements
      "achievement_gallery": "Achievement Gallery",
      "collect_all": "Collect them all to earn Flush Funds",
      "quiz_title": "Discover Your Poop Personality!",
      "quiz_description": "Take our quiz to unlock special achievements and learn health tips",
      "take_quiz": "Take Quiz",
      "unlocked": "Unlocked",
      "locked": "Locked",
      "progress": "Progress",
      "health_tip": "Health Tip:",
      
      // Profile page
      "edit_profile": "Edit Profile",
      "settings": "Settings",
      "notifications": "Notifications",
      "dark_mode": "Dark Mode",
      "light_mode": "Light Mode",
      "language": "Language",
      "privacy": "Privacy",
      "help_support": "Help & Support",
      "log_out": "Log Out",
      "version": "Poopy Pals v1.0.0",
      "copyright": "© 2023 Poopy Pals Inc.",
      
      // Stats page
      "statistics": "Statistics",
      "weekly_overview": "Weekly Overview",
      "monthly_trends": "Monthly Trends",
      "consistency_chart": "Consistency Chart",
      "duration_avg": "Duration Avg",
      "frequency": "Frequency",
      "streak": "Streak",
      "longest_streak": "Longest Streak",
      "total_logs": "Total Logs",
      
      // Personality quiz
      "personality_quiz": "Poop Personality Quiz",
      "your_personality": "Your Poop Personality",
      "next_question": "Next Question",
      "see_results": "See Results",
      "take_again": "Take Quiz Again"
    }
  },
  es: {
    translation: {
      // Common
      "app_name": "Poopy Pals",
      "loading": "Cargando...",
      
      // Navigation
      "nav_home": "Inicio",
      "nav_stats": "Estadísticas",
      "nav_rewards": "Premios",
      "nav_profile": "Perfil",
      
      // Home page
      "recent_activity": "Actividad Reciente",
      "today": "Hoy",
      "yesterday": "Ayer",
      "log_button": "Registrar",
      "status_card_title": "Estado de Racha",
      "status_card_description": "¡Lo estás haciendo genial!",
      "feature_grid_title": "Monitorea Tu Progreso",
      
      // Logging form
      "log_title": "Registrar Evacuación",
      "date_time": "Fecha y Hora",
      "duration": "Duración",
      "minutes": "minutos",
      "rating": "Califica Tu Experiencia",
      "bad": "Mala",
      "ok": "Regular",
      "good": "Buena",
      "excellent": "¡Excelente!",
      "consistency": "Consistencia",
      "very_soft": "Muy Blanda",
      "soft": "Blanda",
      "normal": "Normal",
      "hard": "Dura",
      "very_hard": "Muy Dura",
      "notes": "Notas (Opcional)",
      "notes_placeholder": "Añade cualquier nota u observación...",
      "submit": "Guardar Registro",
      "cancel": "Cancelar",
      
      // Rewards page
      "rewards": "Premios",
      "flush_funds": "Fondos",
      "achievements": "Logros",
      "achievements_unlocked": "Has desbloqueado {{count}} logros",
      "reward_shop": "Tienda de Premios",
      "spend_funds": "Gasta tus Fondos",
      
      // Achievements
      "achievement_gallery": "Galería de Logros",
      "collect_all": "Colecciónalos todos para ganar Fondos",
      "quiz_title": "¡Descubre Tu Personalidad!",
      "quiz_description": "Realiza nuestro cuestionario para desbloquear logros especiales y consejos de salud",
      "take_quiz": "Hacer Cuestionario",
      "unlocked": "Desbloqueado",
      "locked": "Bloqueado",
      "progress": "Progreso",
      "health_tip": "Consejo de Salud:",
      
      // Profile page
      "edit_profile": "Editar Perfil",
      "settings": "Configuración",
      "notifications": "Notificaciones",
      "dark_mode": "Modo Oscuro",
      "light_mode": "Modo Claro",
      "language": "Idioma",
      "privacy": "Privacidad",
      "help_support": "Ayuda y Soporte",
      "log_out": "Cerrar Sesión",
      "version": "Poopy Pals v1.0.0",
      "copyright": "© 2023 Poopy Pals Inc.",
      
      // Stats page
      "statistics": "Estadísticas",
      "weekly_overview": "Resumen Semanal",
      "monthly_trends": "Tendencias Mensuales",
      "consistency_chart": "Gráfico de Consistencia",
      "duration_avg": "Duración Prom.",
      "frequency": "Frecuencia",
      "streak": "Racha",
      "longest_streak": "Racha Más Larga",
      "total_logs": "Total de Registros",
      
      // Personality quiz
      "personality_quiz": "Cuestionario de Personalidad",
      "your_personality": "Tu Personalidad",
      "next_question": "Siguiente Pregunta",
      "see_results": "Ver Resultados",
      "take_again": "Hacer de Nuevo"
    }
  },
  fr: {
    translation: {
      // Common
      "app_name": "Poopy Pals",
      "loading": "Chargement...",
      
      // Navigation
      "nav_home": "Accueil",
      "nav_stats": "Statistiques",
      "nav_rewards": "Récompenses",
      "nav_profile": "Profil",
      
      // Home page
      "recent_activity": "Activité Récente",
      "today": "Aujourd'hui",
      "yesterday": "Hier",
      "log_button": "Enregistrer",
      "status_card_title": "Statut de Série",
      "status_card_description": "Vous vous débrouillez bien !",
      "feature_grid_title": "Suivez Votre Progrès",
      
      // Logging form
      "log_title": "Enregistrer une Selle",
      "date_time": "Date et Heure",
      "duration": "Durée",
      "minutes": "minutes",
      "rating": "Évaluez Votre Expérience",
      "bad": "Mauvaise",
      "ok": "Correcte",
      "good": "Bonne",
      "excellent": "Excellente !",
      "consistency": "Consistance",
      "very_soft": "Très Molle",
      "soft": "Molle",
      "normal": "Normale",
      "hard": "Dure",
      "very_hard": "Très Dure",
      "notes": "Notes (Optionnel)",
      "notes_placeholder": "Ajoutez des notes ou observations...",
      "submit": "Sauvegarder",
      "cancel": "Annuler",
      
      // Rewards page
      "rewards": "Récompenses",
      "flush_funds": "Fonds",
      "achievements": "Réalisations",
      "achievements_unlocked": "Vous avez débloqué {{count}} réalisations",
      "reward_shop": "Boutique de Récompenses",
      "spend_funds": "Dépensez vos Fonds",
      
      // Achievements
      "achievement_gallery": "Galerie de Réalisations",
      "collect_all": "Collectionnez-les toutes pour gagner des Fonds",
      "quiz_title": "Découvrez Votre Personnalité !",
      "quiz_description": "Faites notre quiz pour débloquer des réalisations spéciales et des conseils de santé",
      "take_quiz": "Faire le Quiz",
      "unlocked": "Débloqué",
      "locked": "Verrouillé",
      "progress": "Progrès",
      "health_tip": "Conseil Santé :",
      
      // Profile page
      "edit_profile": "Modifier le Profil",
      "settings": "Paramètres",
      "notifications": "Notifications",
      "dark_mode": "Mode Sombre",
      "light_mode": "Mode Clair",
      "language": "Langue",
      "privacy": "Confidentialité",
      "help_support": "Aide et Support",
      "log_out": "Déconnexion",
      "version": "Poopy Pals v1.0.0",
      "copyright": "© 2023 Poopy Pals Inc.",
      
      // Stats page
      "statistics": "Statistiques",
      "weekly_overview": "Aperçu Hebdomadaire",
      "monthly_trends": "Tendances Mensuelles",
      "consistency_chart": "Graphique de Consistance",
      "duration_avg": "Durée Moy.",
      "frequency": "Fréquence",
      "streak": "Série",
      "longest_streak": "Série la Plus Longue",
      "total_logs": "Total des Enregistrements",
      
      // Personality quiz
      "personality_quiz": "Quiz de Personnalité",
      "your_personality": "Votre Personnalité",
      "next_question": "Question Suivante",
      "see_results": "Voir les Résultats",
      "take_again": "Refaire le Quiz"
    }
  }
};

i18n
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next
  .use(initReactI18next)
  // init i18next
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    }
  });

export default i18n;