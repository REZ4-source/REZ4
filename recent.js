// ========== دیتابیس آخرین قسمت‌ها ==========
// اینجاا میتونی قسمت‌های جدید رو بدون دستکاری انیمه‌ها اضافه کنی

const recentEpisodes = [
  
   {
        id: "The-Exiled-Heavy-Knight-Knows-How-to-Game-the-System",
        episodeNum: 2,
        title: "The Exiled Heavy Knight Knows How to Game the System",
        badge: "جدید",
        type: "today"
   },
   {
        id: "Black-Torch",
        episodeNum: 1,
        title: "Black Torch",
        badge: "جدید",
        type: "new"
   },
   {
        id: "Mushoku-Tensei",
        episodeNum: 2,
        title: "Mushoku Tensei Season 3",
        badge: "پربازدید",
        type: "hot"
    },    
    {
        id: "one-piece",
        episodeNum: 1168,
        title: "One Piece S2",
        badge: "پربازدید",
        type: "hot"
    },
   
  
    
    
    
    
    
    
    
    
    
    
];

// تابع برای گرفتن آخرین قسمت‌ها (مثلاً 5 تای اول)
function getRecentEpisodes(limit = 5) {
    return recentEpisodes.slice(0, limit);
}
