// ========== دیتابیس آخرین قسمت‌ها ==========
// اینجا میتونی قسمت‌های جدید رو بدون دستکاری انیمه‌ها اضافه کنی

const recentEpisodes = [







    {
        id: "marriagetoxin",
        episodeNum: 9,
        title: "Marriagetoxin",
        badge: "پربازدید",
        type: "hot"
    },
    {
        id: "witch-hat-atelier",
        episodeNum: 10,
        title: "Witch Hat Atelier",
        badge: "جدید",
        type: "new"
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