// ========== دیتابیس آخرین قسمت‌ها ==========
// اینجاا میتونی قسمت‌های جدید رو بدون دستکاری انیمه‌ها اضافه کنی

const recentEpisodes = [





    {
        id: "one-piece",
        episodeNum: 1170,
        title: "One Piece S2",
        badge: "پربازدید",
        type: "hot"
    },
   {
        id: "Mushoku-Tensei",
        episodeNum: 4,
        title: "Mushoku Tensei Season 3",
        badge: "پربازدید",
        type: "hot"
    },    
    {
        id: "Black-Torch",
        episodeNum: 3,
        title: "Black Torch",
        badge: "جدید",
        type: "new"
    },
    {
        id: "The-Exiled-Heavy-Knight-Knows-How-to-Game-the-System",
        episodeNum: 3,
        title: "The Exiled Heavy Knight Knows How to Game the System",
        badge: "جدید",
        type: "today"
    },  
     {
        id: "Tomb-Raider-King",
        episodeNum: 2,
        title: "Tomb Raider King",
        badge: "جدید",
        type: "new"
     },
   
   
   
   
  
    
    
    
    
    
    
    
    
    
    
];

// تابع برای گرفتن آخرین قسمت‌ها (مثلاً 5 تای اول)
function getRecentEpisodes(limit = 5) {
    return recentEpisodes.slice(0, limit);
}
