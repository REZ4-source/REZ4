let currentAnimeId = null;
let searchTimeout = null;
let currentPage = 1;
let currentSearchTerm = '';
const ITEMS_PER_PAGE = 10;
const appContainer = document.getElementById('app');

// ========== ترکیب دیتابیس ==========
const fullAnimeData = [...animeData, ...animeData2, ...animeData3];

// ========== مدیریت علاقه‌مندی‌ها ==========
function getFavorites() {
    const favorites = localStorage.getItem('animeFavorites');
    return favorites ? JSON.parse(favorites) : [];
}

function saveFavorites(favorites) {
    localStorage.setItem('animeFavorites', JSON.stringify(favorites));
}

function toggleFavorite(animeId) {
    let favorites = getFavorites();
    if (favorites.includes(animeId)) {
        favorites = favorites.filter(id => id !== animeId);
    } else {
        favorites.push(animeId);
    }
    saveFavorites(favorites);
    return favorites.includes(animeId);
}

function isFavorite(animeId) {
    return getFavorites().includes(animeId);
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

function getFilteredAnime() {
    if (currentSearchTerm.trim() === '') {
        return fullAnimeData;
    }
    const query = currentSearchTerm.trim().toLowerCase();
    return fullAnimeData.filter(anime => 
        anime.title.toLowerCase().includes(query) || 
        anime.fullTitle.toLowerCase().includes(query) ||
        anime.genres.some(g => g.toLowerCase().includes(query))
    );
}

function getPaginatedAnime() {
    const filtered = getFilteredAnime();
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filtered.slice(start, end);
}

function getTotalPages() {
    const filtered = getFilteredAnime();
    return Math.ceil(filtered.length / ITEMS_PER_PAGE);
}

function goToPage(page) {
    const totalPages = getTotalPages();
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderHomePage();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetSearch() {
    currentSearchTerm = '';
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';
}

function getBottomNav() {
    return `
        <div class="bottom-nav">        
            <div class="nav-item" data-nav="categories">
                <div class="nav-icon"><img src="icons/category.svg" alt="دسته‌بندی" width="22" height="22"></div>
                <div class="nav-label">دسته‌ها</div>  
            </div>
            <div class="nav-item" data-nav="home">
                <div class="nav-icon"><img src="icons/home.svg" alt="خانه" width="22" height="22"></div>
                <div class="nav-label">خانه</div>
            </div>
            <div class="nav-item" data-nav="favorites">
                <div class="nav-icon"><img src="icons/favorites.svg" alt="علاقه‌مندی" width="22" height="22"></div>
                <div class="nav-label">علاقه‌مندی</div>
            </div>
            <div class="nav-item" data-nav="profile">
                <div class="nav-icon"><img src="icons/profile.svg" alt="آخرین" width="22" height="22"></div>
                <div class="nav-label">آخرین</div>
            </div>
        </div>
    `;
}

function getGenreCounts() {
    const counts = {};
    fullAnimeData.forEach(anime => {
        anime.genres.forEach(genre => {
            if (counts[genre]) {
                counts[genre]++;
            } else {
                counts[genre] = 1;
            }
        });
    });
    return counts;
}

function scrollToWithOffset(element, offset = 80) {
    if (!element) return;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

function renderCategorySidebar() {
    const container = document.getElementById('categoryList');
    if (!container) return;
    
    const genreCounts = getGenreCounts();
    
    const genresList = [
        "اکشن", "کمدی", "درام", "فانتزی", "عاشقانه", 
        "علمی تخیلی", "ماجراجویی", "ماورایی", "ترسناک", "هیجانی","تاریخی","مدرسه‌ای"
    ];
    
    let html = `
        <div class="category-item">
            <div class="category-main">
                <span>🎬 ژانر انیمه</span>
                <span class="toggle-icon">▶</span>
            </div>
            <div class="category-sub">
    `;
    
    genresList.forEach(genre => {
        const count = genreCounts[genre] || 0;
        html += `
            <div class="sub-item" data-genre="${genre}">
                <span>${genre}</span>
                <span class="count">(${count})</span>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    container.innerHTML = html;
    
    const categoryMain = document.querySelector('.category-main');
    const categorySub = document.querySelector('.category-sub');
    if (categoryMain && categorySub) {
        categoryMain.addEventListener('click', (e) => {
            e.stopPropagation();
            categoryMain.classList.toggle('open');
            categorySub.classList.toggle('open');
        });
    }
    
    document.querySelectorAll('.sub-item').forEach(item => {
        item.addEventListener('click', () => {
            const genre = item.getAttribute('data-genre');
            if (genre) {
                currentSearchTerm = genre;
                currentPage = 1;
                closeCategorySidebar();
                renderHomePage();
                
                setTimeout(() => {
                    const firstCard = document.querySelector('.anime-card');
                    if (firstCard) {
                        scrollToWithOffset(firstCard, 80);
                    }
                }, 150);
            }
        });
    });
}

function openCategorySidebar() {
    const sidebar = document.getElementById('categorySidebar');
    if (sidebar) sidebar.classList.add('open');
    renderCategorySidebar();
}

function closeCategorySidebar() {
    const sidebar = document.getElementById('categorySidebar');
    if (sidebar) sidebar.classList.remove('open');
}

function renderHomePage() {
    const filteredAnime = getPaginatedAnime();
    const totalPages = getTotalPages();
    const totalItems = getFilteredAnime().length;
    
    let cardsHtml = `
        <div class="header">
            <div class="logo">Anivora</div>
            <p style="margin-top: 0.5rem;">دانلود مستقیم انیمه و سریال</p>
            <div class="search-container">
                <div class="search-box">
                    <span class="search-icon">
                        <img src="icons/search.svg" alt="جستجو" width="22" height="22">
                    </span>
                    <input type="text" id="searchInput" placeholder="جستجوی انیمه ..." value="${escapeHtml(currentSearchTerm)}">
                    <button id="searchBtn">جستجو</button>
                </div>
            </div>
        </div>
    `;
    
    if (typeof getRecentEpisodes !== 'undefined') {
        const recentList = getRecentEpisodes(5);
        if (recentList.length > 0) {
            cardsHtml += `<div class="recent-section"><div class="section-title"><img src="icons/recent.svg" alt="آخرین" width="22" height="22" style="margin-left: 5px;">آخرین قسمت‌ها</div><div class="recent-list">`;
            recentList.forEach(ep => {
                const badgeClass = ep.type === 'hot' ? 'hot' : (ep.type === 'today' ? 'today' : 'new');
                cardsHtml += `
                    <div class="recent-item" data-id="${ep.id}">
                        <div class="recent-left">
                            <div class="recent-num">${ep.episodeNum}</div>
                            <div class="recent-info">
                                <h4>${escapeHtml(ep.title)}</h4>
                                <span>قسمت ${ep.episodeNum} · جدید</span>
                            </div>
                        </div>
                        <div class="recent-badge ${badgeClass}">${ep.badge}</div>
                    </div>
                `;
            });
            cardsHtml += `</div></div>`;
        }
    }
    
    cardsHtml += `
        <div class="section-divider">
            <h3>
                <img src="icons/list.svg" alt="لیست" width="18" height="18" style="margin-left: 6px; vertical-align: middle;">
                لیست انیمه‌ها
            </h3>
        </div>
        <div class="anime-grid">
    `;
    
    if (filteredAnime.length === 0) {
        cardsHtml += `<div class="no-result">❌ هیچ انیمه‌ای با این نام پیدا نشد.</div>`;
    } else {
        filteredAnime.forEach(anime => {
            const isFav = isFavorite(anime.id);
            cardsHtml += `
                <div class="anime-card" data-id="${anime.id}">
                    <img class="card-cover" src="${anime.horizontalCover}" loading="lazy">
                    <div class="favorite-btn" data-id="${anime.id}">
                        <img src="icons/${isFav ? 'heart-filled.svg' : 'heart-outline.svg'}" alt="علاقه‌مندی" width="20" height="20">
                    </div>
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
    }
    
    cardsHtml += `</div>`;
    
    if (totalPages > 1) {
        cardsHtml += `<div class="pagination"><button class="prev-btn" ${currentPage === 1 ? 'disabled' : ''}>قبلی</button>`;
        cardsHtml += `<button class="page-btn ${currentPage === 1 ? 'active' : ''}" data-page="1">1</button>`;
        if (currentPage > 2) cardsHtml += `<span class="page-dots">...</span>`;
        if (currentPage - 1 > 1 && currentPage - 1 < totalPages) {
            cardsHtml += `<button class="page-btn" data-page="${currentPage - 1}">${currentPage - 1}</button>`;
        }
        if (currentPage !== 1 && currentPage !== totalPages) {
            cardsHtml += `<button class="page-btn active" data-page="${currentPage}">${currentPage}</button>`;
        }
        if (currentPage + 1 > 1 && currentPage + 1 < totalPages) {
            cardsHtml += `<button class="page-btn" data-page="${currentPage + 1}">${currentPage + 1}</button>`;
        }
        if (currentPage < totalPages - 1) cardsHtml += `<span class="page-dots">...</span>`;
        if (totalPages > 1) {
            cardsHtml += `<button class="page-btn ${currentPage === totalPages ? 'active' : ''}" data-page="${totalPages}">${totalPages}</button>`;
        }
        cardsHtml += `<button class="next-btn" ${currentPage === totalPages ? 'disabled' : ''}>بعدی</button></div>`;
        cardsHtml += `<div class="info-text">نمایش ${filteredAnime.length} از ${totalItems} انیمه - صفحه ${currentPage} از ${totalPages}</div>`;
    } else if (totalItems > 0) {
        cardsHtml += `<div class="info-text">${totalItems} انیمه</div>`;
    }
    
    cardsHtml += getBottomNav();
    cardsHtml += `<div class="footer">تمامی لینک ها جمع آوری شده از منابع دیگر</div>`;
    appContainer.innerHTML = cardsHtml;
    
    document.querySelectorAll('.anime-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.getAttribute('data-id');
            if(id) { 
                window.location.hash = `anime/${id}`; 
                renderDetailPage(id); 
            }
        });
    });
    
    document.querySelectorAll('.recent-item').forEach(item => {
        item.addEventListener('click', () => {
            const id = item.getAttribute('data-id');
            if(id) { 
                window.location.hash = `anime/${id}`; 
                renderDetailPage(id); 
            }
        });
    });
    
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.getAttribute('data-id');
            const isFav = toggleFavorite(id);
            const img = btn.querySelector('img');
            if (isFav) {
                img.src = 'icons/heart-filled.svg';
            } else {
                img.src = 'icons/heart-outline.svg';
            }
        });
    });
    
    const prevBtn = document.querySelector('.prev-btn');
    if (prevBtn) prevBtn.addEventListener('click', () => { if (currentPage > 1) goToPage(currentPage - 1); });
    
    const nextBtn = document.querySelector('.next-btn');
    if (nextBtn) nextBtn.addEventListener('click', () => { if (currentPage < totalPages) goToPage(currentPage + 1); });
    
    document.querySelectorAll('.page-btn').forEach(btn => {
        btn.addEventListener('click', () => { const page = parseInt(btn.getAttribute('data-page')); if (!isNaN(page)) goToPage(page); });
    });
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const action = item.getAttribute('data-nav');
            if (action === 'home') {
                window.location.hash = '';
                currentSearchTerm = '';
                currentPage = 1;
                renderHomePage();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (action === 'categories') {
                openCategorySidebar();
            } else if (action === 'favorites') {
                window.location.href = 'favorites/favorites.html';
            } else if (action === 'profile') {
                const recentSection = document.querySelector('.recent-section');
                if (recentSection) {
                    scrollToWithOffset(recentSection, 80);
                } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }
        });
    });
    
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    function doSearch() { 
        currentSearchTerm = searchInput.value; 
        currentPage = 1; 
        renderHomePage();
        history.pushState({ search: currentSearchTerm }, '', window.location.pathname + window.location.search);
        setTimeout(() => {
            const firstCard = document.querySelector('.anime-card');
            if (firstCard) {
                scrollToWithOffset(firstCard, 80);
            }
        }, 150);
    }
    
    if (searchBtn) searchBtn.addEventListener('click', doSearch);
    if (searchInput) searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') doSearch(); });
}

function renderDetailPage(animeId) {
    const anime = fullAnimeData.find(a => a.id === animeId);
    if (!anime) { renderHomePage(); return; }
    
    let trailerHtml = '';
    if (anime.trailer && anime.trailer !== '') {
        trailerHtml = `<div class="trailer-section"><div class="trailer-title">تریلر</div><div class="trailer-player"><video controls autoplay><source src="${anime.trailer}" type="video/mp4"></video></div></div>`;
    }
    
    let seasonsHtml = `<div class="seasons-wrapper">`;
    anime.seasons.forEach((season, idx) => {
        let episodesHtml = `<div class="episode-grid">`;
        season.episodes.forEach(ep => {
            const quality480 = ep.qualities["480p"];
            const quality720 = ep.qualities["720p"];
            const has480 = quality480 && quality480 !== "#" && quality480 !== "";
            const has720 = quality720 && quality720 !== "#" && quality720 !== "";
            let buttonsHtml = '';
            if (has480) buttonsHtml += `<a href="${quality480}" class="quality-link" target="_blank" download>480p</a>`;
            if (has720) buttonsHtml += `<a href="${quality720}" class="quality-link" target="_blank" download>720p</a>`;
            if (!has480 && !has720) buttonsHtml = `<span class="quality-link" style="opacity:0.6; cursor:default; background:#333;">به زودی</span>`;
            episodesHtml += `<div class="episode-item"><div class="episode-name">قسمت ${ep.epNum}</div><div class="quality-buttons">${buttonsHtml}</div></div>`;
        });
        episodesHtml += `</div>`;
        seasonsHtml += `<div class="season-card" data-season="${idx}"><div class="season-header"><div><span class="season-title">${escapeHtml(season.seasonName)}</span></div><div class="season-arrow"><img src="icons/arrow-down.svg" alt="باز کردن" width="16" height="16"></div></div><div class="season-content">${episodesHtml}</div></div>`;
    });
    seasonsHtml += `</div>`;

    const suggestions = fullAnimeData.filter(a => a.id !== anime.id && a.genres.filter(g => anime.genres.includes(g)).length >= 2).slice(0, 10);
    let suggestionsHtml = '';
    if (suggestions.length > 0) {
        suggestionsHtml = `<div class="suggestions-section"><div class="suggestions-title">پیشنهادات مرتبط</div><div class="suggestions-grid">${suggestions.map(sug => `<div class="suggestion-card" data-id="${sug.id}"><img class="suggestion-img" src="${sug.verticalCover}" onerror="this.src='https://placehold.co/160x200/1e243b/9aa4bf?text=No+Image'"><div class="suggestion-title">${escapeHtml(sug.title)}</div><div class="suggestion-rating"> ${sug.imdbRating !== '--' ? sug.imdbRating : '?'}</div></div>`).join('')}</div></div>`;
    }
    
    const isFav = isFavorite(anime.id);
    
    const detailHtml = `
        <div class="header">
            <div class="logo">Anivora</div>
            <div class="back-home" id="backHomeBtn">بازگشت به صفحه اصلی</div>
        </div>
        <div class="detail-container">
            <div class="anime-header-info">
                <h2>${escapeHtml(anime.fullTitle)}</h2>
                <div class="favorite-btn-detail" data-id="${anime.id}">
                    <img src="icons/${isFav ? 'heart-filled.svg' : 'heart-outline.svg'}" alt="علاقه‌مندی" width="20" height="20">
                    <span>علاقه‌مندی</span>
                </div>
                <div class="detail-ratings">
                    <span class="detail-rating detail-imdb"> IMDB: ${anime.imdbRating || '?'}</span>
                </div>
                <div class="genres" style="margin-top: 0.5rem;">
                    ${anime.genres.map(g => `<span class="genre">${escapeHtml(g)}</span>`).join('')}
                </div>
                <img class="anime-poster" src="${anime.poster}">
                <p style="margin-top: 1rem; line-height: 1.6;">${escapeHtml(anime.description)}</p>
            </div>
            ${trailerHtml}
            ${seasonsHtml}
            ${suggestionsHtml}
        </div>
        ${getBottomNav()}
        <div class="footer">تمامی لینک ها جمع آوری شده از منابع دیگر</div>
    `;
    
    appContainer.innerHTML = detailHtml;
    
    document.querySelectorAll('.season-card').forEach(card => {
        const header = card.querySelector('.season-header');
        const content = card.querySelector('.season-content');
        const arrow = card.querySelector('.season-arrow');
        header.addEventListener('click', () => {
            content.classList.toggle('open');
            if (arrow) arrow.style.transform = content.classList.contains('open') ? 'rotate(180deg)' : 'rotate(0deg)';
        });
    });
    
    document.querySelectorAll('.suggestion-card').forEach(card => {
        card.addEventListener('click', () => { const id = card.getAttribute('data-id'); if(id) { window.location.hash = `anime/${id}`; renderDetailPage(id); } });
    });
    
    const favDetailBtn = document.querySelector('.favorite-btn-detail');
    if (favDetailBtn) {
        favDetailBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = favDetailBtn.getAttribute('data-id');
            const newFav = toggleFavorite(id);
            const img = favDetailBtn.querySelector('img');
            if (newFav) {
                img.src = 'icons/heart-filled.svg';
            } else {
                img.src = 'icons/heart-outline.svg';
            }
        });
    }
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const action = item.getAttribute('data-nav');
            if (action === 'home') {
                window.location.hash = '';
                currentSearchTerm = '';
                currentPage = 1;
                renderHomePage();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (action === 'categories') {
                openCategorySidebar();
            } else if (action === 'favorites') {
                window.location.href = 'favorites/favorites.html';
            } else if (action === 'profile') {
                window.location.hash = '';
                currentSearchTerm = '';
                currentPage = 1;
                renderHomePage();
                setTimeout(() => {
                    const recentSection = document.querySelector('.recent-section');
                    if (recentSection) {
                        scrollToWithOffset(recentSection, 80);
                    }
                }, 200);
            }
        });
    });
    
    const backBtn = document.getElementById('backHomeBtn');
    if (backBtn) {
        backBtn.addEventListener('click', () => { 
            resetSearch();
            window.location.hash = ''; 
            renderHomePage();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

function handleRouting() {
    const hash = window.location.hash.slice(1);
    
    if (hash.startsWith('anime/')) {
        const id = hash.split('/')[1];
        if (id) {
            currentAnimeId = id;
            renderDetailPage(id);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
    }
    
    resetSearch();
    currentAnimeId = null;
    renderHomePage();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('popstate', function(event) {
    if (event.state && event.state.search !== undefined) {
        currentSearchTerm = event.state.search;
        currentPage = 1;
        renderHomePage();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.value = currentSearchTerm;
    } else {
        resetSearch();
        currentPage = 1;
        renderHomePage();
    }
});

const closeCategoryBtn = document.getElementById('closeCategoryBtn');
if (closeCategoryBtn) {
    closeCategoryBtn.addEventListener('click', closeCategorySidebar);
}

document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('categorySidebar');
    const categoryBtn = document.querySelector('.nav-item[data-nav="categories"]');
    if (sidebar && sidebar.classList.contains('open')) {
        if (!sidebar.contains(event.target) && !categoryBtn?.contains(event.target)) {
            closeCategorySidebar();
        }
    }
});

window.addEventListener('hashchange', handleRouting);
renderCategorySidebar();
handleRouting();
