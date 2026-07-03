// ============================================
// دریافت داده‌ها از فایل‌های اصلی
// ============================================
let allAnimeData = [];

function loadAnimeData() {
    try {
        if (typeof animeData !== 'undefined' && 
            typeof animeData2 !== 'undefined' && 
            typeof animeData3 !== 'undefined' &&
            typeof animeData4 !== 'undefined' &&  
            typeof animeData5 !== 'undefined') {
            
            allAnimeData = [...animeData, ...animeData2, ...animeData3, ...animeData4, ...animeData5];
            console.log(' داده‌ها بارگذاری شدند:', allAnimeData.length, 'انیمه');
            return true;
        }
        
        if (typeof fullAnimeData !== 'undefined') {
            allAnimeData = fullAnimeData;
            console.log(' داده از fullAnimeData:', allAnimeData.length);
            return true;
        }
        
        console.log(' داده پیدا نشد');
        return false;
    } catch(e) {
        console.log(' خطا:', e);
        return false;
    }
}

// ============================================
// لیست ژانرها
// ============================================
const genreList = [
    "اکشن", "کمدی", "درام", "فانتزی", "عاشقانه",
    "علمی تخیلی", "ماجراجویی", "ماورایی", "ترسناک", 
    "هیجانی", "تاریخی", "مدرسه‌ای", "برشی از زندگی",
    "معمایی", "روانی", "ورزشی", "موسیقی", "جادویی",
    "ایسکای", "تناسخ", "شونن"
];

let filteredGenres = [...genreList];

// ============================================
// توابع اصلی
// ============================================

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function getAnimeByGenre(genre) {
    if (!allAnimeData || allAnimeData.length === 0) return [];
    return allAnimeData.filter(anime => 
        anime.genres && anime.genres.includes(genre)
    );
}

function renderArchive() {
    const container = document.getElementById('archiveContent');
    if (!container) return;

    if (allAnimeData.length === 0) {
        container.innerHTML = `
            <div class="empty-archive">
                <p>⏳ در حال بارگذاری داده‌ها...</p>
            </div>
        `;
        return;
    }

    const activeGenres = filteredGenres.filter(genre => {
        return getAnimeByGenre(genre).length > 0;
    });

    if (activeGenres.length === 0) {
        container.innerHTML = `
            <div class="empty-archive">
                <p>هیچ ژانری با این نام پیدا نشد</p>
            </div>
        `;
        return;
    }

    let html = '';

    activeGenres.forEach(genre => {
        const animes = getAnimeByGenre(genre);
        
        html += `
            <div class="genre-section">
                <div class="genre-section-title">
                    ${genre}
                    <span class="genre-count-badge">${animes.length} انیمه</span>
                </div>
                <div class="genre-anime-grid">
        `;

        animes.forEach(anime => {
            const rating = anime.imdbRating || anime.malRating || '?';
            const cover = anime.verticalCover || anime.horizontalCover || 'https://placehold.co/180x250/1e243b/9aa4bf?text=No+Image';
            
            html += `
                <div class="genre-anime-card" onclick="goToAnime('${anime.id}')">
                    <img src="${cover}" loading="lazy" 
                         onerror="this.src='https://placehold.co/180x250/1e243b/9aa4bf?text=No+Image'">
                    <div class="card-overlay">
                        <div class="card-title">${escapeHtml(anime.title)}</div>
                        <div class="card-rating">
                            <span class="star">★</span>
                            ${rating}
                        </div>
                    </div>
                </div>
            `;
        });

        html += `</div></div>`;
    });

    container.innerHTML = html;
}

function filterGenres(query) {
    const search = query.trim().toLowerCase();
    
    if (search === '') {
        filteredGenres = [...genreList];
    } else {
        filteredGenres = genreList.filter(g => 
            g.includes(search) || g.toLowerCase().includes(search)
        );
    }
    
    renderArchive();
}

function goToAnime(id) {
    window.location.href = `../index.html#anime/${id}`;
}

function goBack() {
    window.history.back();
}

// ============================================
// نوار پایین - مدیریت کلیک‌ها
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            const action = this.getAttribute('data-nav');
            
            if (action === 'home') {
                window.location.href = '../index.html';
            } else if (action === 'favorites') {
                window.location.href = '../favorites/favorites.html';
            } else if (action === 'archive') {
                location.reload();
            } else if (action === 'categories') {
                alert(' دسته‌بندی ژانرها در صفحه اصلی');
            }
        });
    });
});

// ============================================
// اجرا
// ============================================
function initializeArchive() {
    loadAnimeData();
    
    if (allAnimeData.length > 0) {
        renderArchive();
    } else {
        setTimeout(() => {
            if (loadAnimeData() && allAnimeData.length > 0) {
                renderArchive();
            }
        }, 500);
    }
}

document.addEventListener('DOMContentLoaded', initializeArchive);