// ========== توابع علاقه‌مندی ==========
function getFavorites() {
    const favorites = localStorage.getItem('animeFavorites');
    return favorites ? JSON.parse(favorites) : [];
}

function saveFavorites(favorites) {
    localStorage.setItem('animeFavorites', JSON.stringify(favorites));
}

function removeFromFavorites(animeId) {
    let favorites = getFavorites();
    favorites = favorites.filter(id => id !== animeId);
    saveFavorites(favorites);
    return favorites;
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

const fullAnimeData = [...animeData, ...animeData2, ...animeData3];

function getBottomNav() {
    return `
        <div class="bottom-nav">        
            <div class="nav-item" data-nav="categories">
                <div class="nav-icon"><img src="../icons/category.svg" alt="دسته‌بندی" width="22" height="22"></div>
                <div class="nav-label">دسته‌ها</div>  
            </div>
            <div class="nav-item" data-nav="home">
                <div class="nav-icon"><img src="../icons/home.svg" alt="خانه" width="22" height="22"></div>
                <div class="nav-label">خانه</div>
            </div>
            <div class="nav-item" data-nav="favorites">
                <div class="nav-icon"><img src="../icons/favorites.svg" alt="علاقه‌مندی" width="22" height="22"></div>
                <div class="nav-label">علاقه‌مندی</div>
            </div>
            <div class="nav-item" data-nav="profile">
                <div class="nav-icon"><img src="../icons/profile.svg" alt="آخرین" width="22" height="22"></div>
                <div class="nav-label">آخرین</div>
            </div>
        </div>
    `;
}

function renderFavoritesPage() {
    let favorites = getFavorites();
    let favoriteAnimes = fullAnimeData.filter(anime => favorites.includes(anime.id));
    
    let html = `
        <div class="header">
            <div class="logo">Anivora</div>
            <p style="margin-top: 0.5rem;">دانلود مستقیم انیمه و سریال</p>
        </div>
        <div class="favorites-header">
            <h2>علاقه‌مندی‌ها</h2>
        </div>
    `;
    
    if (favoriteAnimes.length === 0) {
        html += `
            <div class="empty-favorites">
                <img src="../icons/heart.svg" alt="علاقه‌مندی" width="64" height="64" style="margin-bottom: 1rem;">
                <h3>هیچ انیمه‌ای به علاقه‌مندی‌ها اضافه نشده است</h3>
                <p>با کلیک روی قلب کنار هر انیمه، آن را به لیست علاقه‌مندی‌های خود اضافه کنید</p>
                <button class="btn-home" onclick="location.href='../index.html'">بازگشت به صفحه اصلی</button>
            </div>
        `;
    } else {
        html += `<div class="anime-grid">`;
        favoriteAnimes.forEach(anime => {
            html += `
                <div class="anime-card" data-id="${anime.id}">
                    <div class="remove-fav-btn" data-id="${anime.id}">
                        <img src="../icons/trash.svg" alt="حذف" width="18" height="18">
                    </div>
                    <img class="card-cover" src="${anime.horizontalCover}" loading="lazy">
                    <div class="card-content">
                        <div class="anime-title">${escapeHtml(anime.title)}</div>
                        <div class="rating-badges">
                            <span class="rating-badge rating-imdb"> IMDB ${anime.imdbRating || '?'}</span>
                            <span class="rating-badge rating-mal"> MAL ${anime.malRating || '?'}</span>
                        </div>
                        <div class="genres">${anime.genres.map(g => `<span class="genre">${escapeHtml(g)}</span>`).join('')}</div>
                        <div class="anime-desc">${escapeHtml(anime.description.length > 90 ? anime.description.slice(0, 90) + '...' : anime.description)}</div>
                        <div class="detail-btn">مشاهده جزئیات و دانلود</div>
                    </div>
                </div>
            `;
        });
        html += `</div>`;
    }
    
    html += getBottomNav();
    html += `<div class="footer">تمامی لینک ها جمع آوری شده از منابع دیگر</div>`;
    document.getElementById('app').innerHTML = html;
    
    document.querySelectorAll('.anime-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.remove-fav-btn')) return;
            const id = card.getAttribute('data-id');
            if(id) window.location.href = `../index.html#anime/${id}`;
        });
    });
    
    document.querySelectorAll('.remove-fav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.getAttribute('data-id');
            removeFromFavorites(id);
            renderFavoritesPage();
        });
    });
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const action = item.getAttribute('data-nav');
            if (action === 'home') window.location.href = '../index.html';
            else if (action === 'favorites') location.reload();
            else if (action === 'profile') window.location.href = '../index.html';
            else if (action === 'categories') alert('دسته‌بندی ژانرها در صفحه اصلی');
        });
    });
}

renderFavoritesPage();
