// ========== دیتابیس آخرین قسمت‌ها ==========
// اینجا میتونی قسمت‌های جدید رو بدون دستکاری انیمه‌ها اضافه کنی

const recentEpisodes = [


    {
        id: "marriagetoxin",
        episodeNum: 11,
        title: "Marriagetoxin",
        badge: "پربازدید",
        type: "hot"
    },
    {
        id: "one-piece",
        episodeNum: 1166,
        title: "One Piece S2",
        badge: "پربازدید",
        type: "hot"
    },
    {
        id: "Classroom-of-the-Elite",
        episodeNum: 14,
        title: "Classroom of the Elite S4",
        badge: "بروزشده",
        type: "today"
    },
    {
        id: "witch-hat-atelier",
        episodeNum: 12,
        title: "Witch Hat Atelier",
        badge: "جدید",
        type: "new"
 },   
 {
        id: "The-Angel-Next-Door-Spoils-Me-Rotten",
        episodeNum: 11,
        title: "The Angel Next Door Spoils Me Rotten",
        badge: "بروزشده",
        type: "today"
    },
    
    
    
    
    
    
    
    
];

// تابع برای گرفتن آخرین قسمت‌ها (مثلاً 5 تای اول)
function getRecentEpisodes(limit = 5) {
    return recentEpisodes.slice(0, limit);
}
