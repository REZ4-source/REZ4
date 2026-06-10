// ========== دیتابیس آخرین قسمت‌ها ==========
// اینجا میتونی قسمت‌های جدید رو بدون دستکاری انیمه‌ها اضافه کنی

const recentEpisodes = [


   {
        id: "one-piece",
        episodeNum: 1165,
        title: "One Piece S2",
        badge: "پربازدید",
        type: "hot"
    },
    {
        id: "marriagetoxin",
        episodeNum: 10,
        title: "Marriagetoxin",
        badge: "پربازدید",
        type: "hot"
    },  
    {
        id: "witch-hat-atelier",
        episodeNum: 11,
        title: "Witch Hat Atelier",
        badge: "جدید",
        type: "new"
    },   
    {
        id: "Classroom-of-the-Elite",
        episodeNum: 14,
        title: "Classroom of the Elite S4",
        badge: "بروزشده",
        type: "today"
    },
    {
        id: "The-Angel-Next-Door-Spoils-Me-Rotten",
        episodeNum: 10,
        title: "The Angel Next Door Spoils Me Rotten",
        badge: "بروزشده",
        type: "today"
    },
    
    
    
    
    
    
    
    
];

// تابع برای گرفتن آخرین قسمت‌ها (مثلاً 5 تای اول)
function getRecentEpisodes(limit = 5) {
    return recentEpisodes.slice(0, limit);
}
