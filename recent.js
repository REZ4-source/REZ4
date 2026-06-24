// ========== دیتابیس آخرین قسمت‌ها ==========
// اینجا میتونی قسمت‌های جدید رو بدون دستکاری انیمه‌ها اضافه کنی

const recentEpisodes = [

    
   {
        id: "marriagetoxin",
        episodeNum: 12,
        title: "Marriagetoxin",
        badge: "پربازدید",
        type: "hot"
    },  
    
    {
        id: "witch-hat-atelier",
        episodeNum: 13,
        title: "Witch Hat Atelier",
        badge: "بروزشد",
        type: "today"
 },   
 {
        id: "The-Angel-Next-Door-Spoils-Me-Rotten",
        episodeNum: 12,
        title: "The Angel Next Door Spoils Me Rotten",
        badge: "بروزشد",
        type: "today"
    },
    {
        id: "one-piece",
        episodeNum: 1167,
        title: "One Piece S2",
        badge: "پربازدید",
        type: "hot"
    },
    {
        id: "I-Made-Friends-with-the-Second-Prettiest-Girl-in-My-Class",
        episodeNum: 12,
        title: "...I Made Friends with the",
        badge: "جدید",
        type: "new"
    },
    {
        id: "Classroom-of-the-Elite",
        episodeNum: 15,
        title: "Classroom of the Elite S4",
        badge: "بروزشده",
        type: "today"
    },
    
    
    
    
    
    
    
    
    
    
];

// تابع برای گرفتن آخرین قسمت‌ها (مثلاً 5 تای اول)
function getRecentEpisodes(limit = 5) {
    return recentEpisodes.slice(0, limit);
}
