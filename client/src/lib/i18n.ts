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
      "customize_avatar": "Customize Avatar",
      "customize_avatar_description": "Choose your head, eyes, mouth and accessories to create your unique avatar.",
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
      "stats_description": "Track and analyze your bowel movements over time.",
      "weekly_overview": "Weekly Overview",
      "monthly_trends": "Monthly Trends",
      "consistency_chart": "Consistency Chart",
      "consistency_chart_description": "Distribution of your poop consistency over time.",
      "duration_avg": "Duration Avg",
      "frequency": "Frequency",
      "frequency_chart_description": "Your log frequency over the past week.",
      "streak": "Streak",
      "longest_streak": "Longest Streak",
      "total_logs": "Total Logs",
      "most_frequent_time": "Most Frequent Time",
      "avg_consistency": "Avg Consistency",
      "avg_duration": "Avg Duration",
      "health_insights": "Health Insights",
      "vs_last_week": "vs last week",
      "time_of_day": "Time of Day",
      "day_of_week": "Day of Week",
      "rating_distribution": "Rating Distribution",
      "rating_chart_description": "How you've rated your bathroom experiences.",
      "trends_over_time": "Trends Over Time",
      "trends_description": "Track how your consistency and duration change over time.",
      "trends_footer": "This chart shows the average duration and consistency rating for each day.",
      "logs": "logs",
      "morning": "Morning",
      "afternoon": "Afternoon",
      "evening": "Evening",
      "night": "Night",
      "sunday": "Sun",
      "monday": "Mon",
      "tuesday": "Tue",
      "wednesday": "Wed",
      "thursday": "Thu",
      "friday": "Fri",
      "saturday": "Sat",
      "last_7_days": "Last 7 days",
      "distribution": "Distribution",
      "healthy_pattern_title": "Healthy Patterns Detected",
      "healthy_pattern_description": "Your consistency and frequency patterns appear normal. Keep up the good work!",
      "low_consistency_title": "Low Consistency Detected",
      "low_consistency_tip": "Your stool appears to be harder than average. Try increasing water intake and fiber in your diet.",
      "high_consistency_title": "High Consistency Detected",
      "high_consistency_tip": "Your stool consistency is softer than average. Consider adjusting fiber intake and monitor for digestive issues.",
      "long_duration_title": "Long Duration Times",
      "long_duration_tip": "You're spending more time than average on the toilet. Try to limit toilet time to prevent hemorrhoids.",
      "decreasing_frequency_title": "Decreased Frequency",
      "decreasing_frequency_tip": "Your frequency has decreased compared to last week. Stay hydrated and maintain a fiber-rich diet to promote regularity.",
      "avg_per_day": "Average Per Day",
      "most_active_day": "Most Active Day",
      "total_this_week": "Total This Week",
      "most_common": "Most Common",
      "satisfaction_rate": "Satisfaction Rate",
      "normal_rate": "Normal Rate",
      "avg_score": "Average Score",
      "pattern_insight": "Pattern Insight",
      "pattern_insight_description": "Your duration and consistency show interesting patterns. Analyze the chart to better understand your digestive health.",
      "pattern_insight_need_more_data": "Log more entries to see pattern insights and correlations in your digestive health.",
      "duration_consistency_correlation": "Duration-Consistency Correlation",
      "improving_frequency": "Improving Frequency",
      
      // Advanced Analytics
      "advanced_analytics": "Advanced Analytics",
      "advanced_analytics_description": "Detailed insights and correlations from your health data.",
      "showing_data_for": "Showing data",
      "all_time": "All time",
      "quality_score": "Quality Score",
      "stability": "Stability",
      "average": "average",
      "time_distribution": "Time Distribution",
      "when_you_usually_go": "When you usually go",
      "personal_insights": "Personal Insights",
      "personal_insights_description": "Personalized recommendations based on your data",
      "insights_disclaimer": "These insights are generated based on your data and are not medical advice.",
      "consistency_patterns": "Consistency Patterns",
      "consistency_patterns_description": "Analysis of your consistency patterns over time",
      "duration_analysis": "Duration Analysis",
      "duration_analysis_description": "How long you typically spend in the bathroom",
      "health_correlations": "Health Correlations",
      "health_correlations_description": "Relationships between different metrics",
      "efficiency": "Efficiency",
      "bathroom_efficiency_tip": "Your bathroom efficiency score is {efficiency}%, which is {score}.",
      "no_duration_data": "No duration data available yet.",
      "consistency_rating_correlation": "Consistency-Rating Correlation",
      "positive_correlation": "positive correlation",
      "negative_correlation": "negative correlation",
      "no_correlation": "no correlation",
      "higher_consistency_better_rating": "Higher consistency scores tend to give you better ratings.",
      "lower_consistency_better_rating": "Lower consistency scores tend to give you better ratings.",
      "no_clear_relationship": "There is no clear relationship between consistency and rating.",
      "duration_rating_relationship": "Duration-Rating Relationship",
      "longer_duration_better_rating": "Longer durations tend to give you better ratings.",
      "shorter_duration_better_rating": "Shorter durations tend to give you better ratings.",
      "duration_not_affecting_rating": "Duration does not seem to affect your rating.",
      "need_more_logs_for_correlations": "Add more logs to see correlations between metrics.",
      "correlations_disclaimer": "Correlations help identify patterns but don't necessarily imply causation.",
      "need_more_data": "Need More Data",
      "need_more_data_description": "Log more bathroom visits to get personalized insights.",
      "log_now": "Log Now",
      "hydration_recommendation": "Stay Hydrated",
      "hydration_recommendation_description": "Your consistency scores indicate you may need to increase water intake.",
      "fiber_recommendation": "Adjust Fiber Intake",
      "fiber_recommendation_description": "Your consistency is on the softer side. Consider adjusting your fiber intake.",
      "reduce_toilet_time": "Reduce Toilet Time",
      "reduce_toilet_time_description": "You're spending more time than average on the toilet. This can lead to hemorrhoids.",
      "healthy_patterns": "Healthy Patterns",
      "healthy_patterns_description": "Your consistency and rating patterns indicate healthy digestive function.",
      "improve_regularity": "Improve Regularity",
      "improve_regularity_description": "Try to maintain a more regular bathroom schedule for better digestive health.",
      "of_logs": "of logs",
      "advanced_trends_over_time": "Trends Over Time",
      "advanced_trends_description": "How your metrics change over time",
      "advanced_trends_footer": "View how your consistency and duration patterns change over time.",
      "recent_consistency_trend": "Recent Consistency Trend",
      "consistency_is_stable": "Your consistency is stable",
      "consistency_varies": "Your consistency varies from day to day",
      "most_common_consistency": "Most Common Consistency",
      "duration_increasing": "Increasing by {value}%",
      "duration_decreasing": "Decreasing by {value}%",
      "advanced_avg_duration": "Avg. Duration",
      "most_common_duration": "Most Common Duration",
      "of_all_logs": "of all logs",
      "no_data_available": "No Data Available",
      "no_data_description": "Select a different time range or add more logs to see analytics.",
      "view_all_time_data": "View All Time Data",
      
      // Personality quiz
      "personality_quiz": "Poop Personality Quiz",
      "your_personality": "Your Poop Personality",
      "next_question": "Next Question",
      "see_results": "See Results",
      "take_again": "Take Quiz Again",
      
      // Challenges
      "todays_challenges": "Today's Challenges",
      "no_challenges": "No active challenges",
      "log_to_get_challenges": "Log a poop to get new challenges",
      "challenge_fetch_error": "Couldn't load challenges",
      "challenge_completed": "Challenge Completed!",
      "error": "Error",
      "daily": "Daily",
      "streak_challenge": "Streak",
      "achievement": "Achievement",
      "collect_achievements": "Collect them all to earn Flush Funds",
      "discover_personality": "Discover Your Poop Personality!",
      "take_quiz_description": "Take our quiz to unlock special achievements and learn health tips",
      "retake_quiz_hint": "Click to retake the quiz and explore other personalities",
      "premium_themes": "Premium Themes",
      "customize_app": "Customize your app",
      "toilet_game": "Toilet Tapper Game",
      "unlock_game": "Unlock a new toilet game",
      "premium_status": "Premium Status",
      "premium_features": "No ads + extra features",
      "premium_analytics": "Advanced Analytics",
      "detailed_insights": "Detailed health insights",
      "custom_achievements": "Custom Achievements",
      "create_goals": "Create your own goals",
      
      // Notifications
      "notifications_center": "Notifications",
      "no_notifications": "No notifications yet",
      "mark_read": "Mark as read",
      "mark_all_read": "Mark all as read",
      "view_all_notifications": "View all notifications",
      "just_now": "Just now",
      "minutes_ago": "{{count}}m ago",
      "hours_ago": "{{count}}h ago",
      "days_ago": "{{count}}d ago",
      "loading_notifications": "Loading...",
      "notification_settings": "Notification Settings",
      "preferences": "Preferences",
      "saved": "Saved",
      "notification_preferences_saved": "Your notification preferences have been saved.",
      "achievement_notifications": "Achievement Notifications",
      "achievement_notifications_description": "Get notified when you earn new achievements.",
      "streak_notifications": "Streak Notifications",
      "streak_notifications_description": "Get notified about your daily streak progress.",
      "reminder_notifications": "Reminder Notifications",
      "reminder_notifications_description": "Get notified about your scheduled reminders.",
      "push_notifications": "Push Notifications",
      "push_notifications_description": "Enable browser push notifications.",
      "error_loading_preferences": "Error loading preferences.",
      
      // Reminders
      "reminders": "Reminders",
      "add_reminder": "Add Reminder",
      "create_reminder": "Create Reminder",
      "create_reminder_description": "Set up regular reminders to help maintain your bathroom routine.",
      "reminder_created": "Reminder Created",
      "reminder_created_description": "Your reminder has been set up successfully.",
      "reminder_deleted": "Reminder Deleted",
      "reminder_deleted_description": "Your reminder has been deleted.",
      "no_reminders": "No reminders yet",
      "no_reminders_description": "Create reminders to help maintain a healthy bathroom routine.",
      "add_first_reminder": "Add your first reminder",
      "reminder_frequency": "Frequency",
      "select_frequency": "Select frequency",
      "weekly_reminder": "Weekly",
      "custom_reminder": "Custom",
      "time": "Time",
      "days_of_week": "Days of Week",
      "days_of_week_placeholder": "e.g., 1,3,5",
      "days_of_week_help": "Enter day numbers: 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat, 7=Sun",
      "active": "Active",
      "active_description": "Turn reminder on or off",
      "time_to_log": "Time to log!",
      "reminder_message_placeholder": "It's time for your bathroom break. Don't forget to log your visit!",
      "confirm_delete_reminder": "Are you sure you want to delete this reminder?",
      "creating": "Creating...",
      "reminder_title": "Title",
      "reminder_message": "Message",
      "reminder_cancel": "Cancel",
      "create": "Create",
      "edit": "Edit",
      "delete": "Delete",
      "mon": "Mon",
      "tue": "Tue",
      "wed": "Wed",
      "thu": "Thu",
      "fri": "Fri",
      "sat": "Sat", 
      "sun": "Sun"
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
  },
  
  zh: {
    translation: {
      // Common
      "app_name": "便便伙伴",
      "loading": "加载中...",
      
      // Navigation
      "nav_home": "首页",
      "nav_stats": "统计",
      "nav_rewards": "奖励",
      "nav_profile": "个人资料",
      
      // Home page
      "recent_activity": "最近活动",
      "today": "今天",
      "yesterday": "昨天",
      "log_button": "记录",
      "status_card_title": "连续状态",
      "status_card_description": "做得很好！",
      "feature_grid_title": "跟踪你的进度",
      
      // Logging form
      "log_title": "记录排便",
      "date_time": "日期和时间",
      "duration": "持续时间",
      "minutes": "分钟",
      "rating": "评价你的体验",
      "bad": "差",
      "ok": "一般",
      "good": "好",
      "excellent": "很好！",
      "consistency": "稠度",
      "very_soft": "非常软",
      "soft": "软",
      "normal": "正常",
      "hard": "硬",
      "very_hard": "非常硬",
      "notes": "备注（可选）",
      "notes_placeholder": "添加任何注意事项或观察...",
      "submit": "保存记录",
      "cancel": "取消",
      
      // Rewards page
      "rewards": "奖励",
      "flush_funds": "冲水基金",
      "achievements": "成就",
      "achievements_unlocked": "你已解锁 {{count}} 个成就",
      "reward_shop": "奖励商店",
      "spend_funds": "花费你的冲水基金",
      
      // Achievements
      "achievement_gallery": "成就展示",
      "collect_all": "收集所有成就以赚取冲水基金",
      "quiz_title": "发现你的便便个性！",
      "quiz_description": "参加我们的测验解锁特殊成就和健康提示",
      "take_quiz": "参加测验",
      "unlocked": "已解锁",
      "locked": "已锁定",
      "progress": "进度",
      "health_tip": "健康提示：",
      
      // Profile page
      "edit_profile": "编辑资料",
      "settings": "设置",
      "notifications": "通知",
      "dark_mode": "深色模式",
      "light_mode": "浅色模式",
      "language": "语言",
      "privacy": "隐私",
      "help_support": "帮助与支持",
      "log_out": "退出登录",
      "version": "便便伙伴 v1.0.0",
      "copyright": "© 2023 便便伙伴公司",
      
      // Stats page
      "statistics": "统计",
      "weekly_overview": "每周概览",
      "monthly_trends": "月度趋势",
      "consistency_chart": "稠度图表",
      "duration_avg": "平均时长",
      "frequency": "频率",
      "streak": "连续",
      "longest_streak": "最长连续",
      "total_logs": "总记录",
      
      // Personality quiz
      "personality_quiz": "便便个性测验",
      "your_personality": "你的便便个性",
      "next_question": "下一问题",
      "see_results": "查看结果",
      "take_again": "再次测验"
    }
  },
  
  ko: {
    translation: {
      // Common
      "app_name": "푸피 팔",
      "loading": "로딩 중...",
      
      // Navigation
      "nav_home": "홈",
      "nav_stats": "통계",
      "nav_rewards": "보상",
      "nav_profile": "프로필",
      
      // Home page
      "recent_activity": "최근 활동",
      "today": "오늘",
      "yesterday": "어제",
      "log_button": "기록하기",
      "status_card_title": "연속 상태",
      "status_card_description": "잘 하고 있어요!",
      "feature_grid_title": "진행 상황 추적",
      
      // Logging form
      "log_title": "배변 기록",
      "date_time": "날짜 및 시간",
      "duration": "지속 시간",
      "minutes": "분",
      "rating": "경험 평가",
      "bad": "나쁨",
      "ok": "보통",
      "good": "좋음",
      "excellent": "최고!",
      "consistency": "굳기",
      "very_soft": "매우 부드러움",
      "soft": "부드러움",
      "normal": "보통",
      "hard": "단단함",
      "very_hard": "매우 단단함",
      "notes": "메모 (선택사항)",
      "notes_placeholder": "관찰이나 메모 추가...",
      "submit": "기록 저장",
      "cancel": "취소",
      
      // Rewards page
      "rewards": "보상",
      "flush_funds": "플러시 펀드",
      "achievements": "업적",
      "achievements_unlocked": "{{count}}개의 업적을 잠금 해제했습니다",
      "reward_shop": "보상 상점",
      "spend_funds": "플러시 펀드 사용하기",
      
      // Achievements
      "achievement_gallery": "업적 갤러리",
      "collect_all": "모든 업적을 수집하여 플러시 펀드 획득",
      "quiz_title": "당신의 배변 성격을 발견하세요!",
      "quiz_description": "퀴즈를 풀어 특별한 업적과 건강 팁 얻기",
      "take_quiz": "퀴즈 풀기",
      "unlocked": "잠금 해제됨",
      "locked": "잠김",
      "progress": "진행도",
      "health_tip": "건강 팁:",
      
      // Profile page
      "edit_profile": "프로필 편집",
      "settings": "설정",
      "notifications": "알림",
      "dark_mode": "다크 모드",
      "light_mode": "라이트 모드",
      "language": "언어",
      "privacy": "개인정보",
      "help_support": "도움말 및 지원",
      "log_out": "로그아웃",
      "version": "푸피 팔 v1.0.0",
      "copyright": "© 2023 푸피 팔 Inc.",
      
      // Stats page
      "statistics": "통계",
      "weekly_overview": "주간 개요",
      "monthly_trends": "월간 트렌드",
      "consistency_chart": "굳기 차트",
      "duration_avg": "평균 시간",
      "frequency": "빈도",
      "streak": "연속",
      "longest_streak": "최장 연속",
      "total_logs": "총 기록",
      
      // Personality quiz
      "personality_quiz": "배변 성격 퀴즈",
      "your_personality": "당신의 배변 성격",
      "next_question": "다음 질문",
      "see_results": "결과 보기",
      "take_again": "다시 풀기"
    }
  },
  
  ja: {
    translation: {
      // Common
      "app_name": "プーピーパル",
      "loading": "読み込み中...",
      
      // Navigation
      "nav_home": "ホーム",
      "nav_stats": "統計",
      "nav_rewards": "報酬",
      "nav_profile": "プロフィール",
      
      // Home page
      "recent_activity": "最近の活動",
      "today": "今日",
      "yesterday": "昨日",
      "log_button": "記録する",
      "status_card_title": "連続状況",
      "status_card_description": "素晴らしい調子です！",
      "feature_grid_title": "進捗を追跡する",
      
      // Logging form
      "log_title": "排便を記録",
      "date_time": "日時",
      "duration": "所要時間",
      "minutes": "分",
      "rating": "体験を評価",
      "bad": "悪い",
      "ok": "普通",
      "good": "良い",
      "excellent": "素晴らしい！",
      "consistency": "硬さ",
      "very_soft": "とても柔らかい",
      "soft": "柔らかい",
      "normal": "普通",
      "hard": "硬い",
      "very_hard": "とても硬い",
      "notes": "メモ（任意）",
      "notes_placeholder": "観察や気づきを追加...",
      "submit": "記録を保存",
      "cancel": "キャンセル",
      
      // Rewards page
      "rewards": "報酬",
      "flush_funds": "フラッシュファンド",
      "achievements": "実績",
      "achievements_unlocked": "{{count}}個の実績をアンロックしました",
      "reward_shop": "報酬ショップ",
      "spend_funds": "フラッシュファンドを使う",
      
      // Achievements
      "achievement_gallery": "実績ギャラリー",
      "collect_all": "すべての実績を集めてフラッシュファンドを獲得しましょう",
      "quiz_title": "あなたのウンチパーソナリティを発見！",
      "quiz_description": "クイズに答えて特別な実績と健康アドバイスを獲得",
      "take_quiz": "クイズに挑戦",
      "unlocked": "解除済み",
      "locked": "未解除",
      "progress": "進捗",
      "health_tip": "健康アドバイス：",
      
      // Profile page
      "edit_profile": "プロフィール編集",
      "settings": "設定",
      "notifications": "通知",
      "dark_mode": "ダークモード",
      "light_mode": "ライトモード",
      "language": "言語",
      "privacy": "プライバシー",
      "help_support": "ヘルプとサポート",
      "log_out": "ログアウト",
      "version": "プーピーパル v1.0.0",
      "copyright": "© 2023 プーピーパル Inc.",
      
      // Stats page
      "statistics": "統計",
      "weekly_overview": "週間概要",
      "monthly_trends": "月間傾向",
      "consistency_chart": "硬さチャート",
      "duration_avg": "平均時間",
      "frequency": "頻度",
      "streak": "連続",
      "longest_streak": "最長連続",
      "total_logs": "総記録数",
      
      // Personality quiz
      "personality_quiz": "ウンチパーソナリティクイズ",
      "your_personality": "あなたのウンチパーソナリティ",
      "next_question": "次の質問",
      "see_results": "結果を見る",
      "take_again": "もう一度挑戦"
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