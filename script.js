let currentAnimeId = null;
let searchTimeout = null;
let currentPage = 1;
let currentSearchTerm = '';
const ITEMS_PER_PAGE = 10;
const appContainer = document.getElementById('app');

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
        return animeData;
    }
    const query = currentSearchTerm.trim().toLowerCase();
    return animeData.filter(anime => 
        anime.title.toLowerCase().includes(query) || 
        anime.fullTitle.toLowerCase().includes(query)
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

function renderHomePage() {
    const filteredAnime = getPaginatedAnime();
    const totalPages = getTotalPages();
    const totalItems = getFilteredAnime().length;
    
    let cardsHtml = `
        <div class="header">
            <div class="logo">AniVerse</div>
            <p style="margin-top: 0.5rem;">دانلود مستقیم انیمه و سریال</p>
            <div class="search-container">
                <div class="search-box">
                    <span class="search-icon">🔍</span>
                    <input type="text" id="searchInput" placeholder="جستجوی انیمه ..." value="${escapeHtml(currentSearchTerm)}">
                    <button id="searchBtn">جستجو</button>
                </div>
            </div>
        </div>
    `;
    
    if (typeof getRecentEpisodes !== 'undefined') {
        const recentList = getRecentEpisodes(5);
        if (recentList.length > 0) {
            cardsHtml += `<div class="recent-section"><div class="section-title"><span></span> آخرین قسمت‌ها</div><div class="recent-list">`;
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
            <h3>لیست انیمه‌ها</h3>
        </div>
        <div class="anime-grid">
    `;
    
    if (filteredAnime.length === 0) {
        cardsHtml += `<div class="no-result">❌ هیچ انیمه‌ای با این نام پیدا نشد.</div>`;
    } else {
        filteredAnime.forEach(anime => {
            cardsHtml += `
                <div class="anime-card" data-id="${anime.id}">
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
    }
    
    cardsHtml += `</div>`;
    
    if (totalPages > 1) {
        cardsHtml += `<div class="pagination"><button class="prev-btn" ${currentPage === 1 ? 'disabled' : ''}>قبلی</button><div class="page-numbers">`;
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);
        if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);
        for (let i = startPage; i <= endPage; i++) {
            cardsHtml += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
        cardsHtml += `</div><button class="next-btn" ${currentPage === totalPages ? 'disabled' : ''}>بعدی</button></div>`;
        cardsHtml += `<div class="info-text">نمایش ${filteredAnime.length} از ${totalItems} انیمه - صفحه ${currentPage} از ${totalPages}</div>`;
    } else if (totalItems > 0) {
        cardsHtml += `<div class="info-text">${totalItems} انیمه</div>`;
    }
    
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
    
    const prevBtn = document.querySelector('.prev-btn');
    if (prevBtn) prevBtn.addEventListener('click', () => { if (currentPage > 1) goToPage(currentPage - 1); });
    
    const nextBtn = document.querySelector('.next-btn');
    if (nextBtn) nextBtn.addEventListener('click', () => { if (currentPage < totalPages) goToPage(currentPage + 1); });
    
    document.querySelectorAll('.page-btn').forEach(btn => {
        btn.addEventListener('click', () => { const page = parseInt(btn.getAttribute('data-page')); if (!isNaN(page)) goToPage(page); });
    });
    
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    function doSearch() { 
        currentSearchTerm = searchInput.value; 
        currentPage = 1; 
        renderHomePage();
        
        // اضافه کردن state به تاریخچه مرورگر
        history.pushState({ search: currentSearchTerm }, '', window.location.pathname + window.location.search);
        
        setTimeout(() => {
            const firstCard = document.querySelector('.anime-card');
            if (firstCard) {
                firstCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 150);
    }
    
    if (searchBtn) searchBtn.addEventListener('click', doSearch);
    if (searchInput) searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') doSearch(); });
}

function renderDetailPage(animeId) {
    const anime = animeData.find(a => a.id === animeId);
    if (!anime) { renderHomePage(); return; }
    
    let trailerHtml = '';
    if (anime.trailer && anime.trailer !== '') {
        trailerHtml = `<div class="trailer-section"><div class="trailer-title"><span></span>تریلر</span></div><div class="trailer-player"><video controls autoplay><source src="${anime.trailer}" type="video/mp4"></video></div></div>`;
    }
    
    let seasonsHtml = `<div class="seasons-wrapper">`;
    anime.seasons.forEach((season, idx) => {
        let episodesHtml = `<div class="episode-grid">`;
        season.episodes.forEach(ep => {
            const quality480 = ep.qualities["480p"];
            const quality720 = ep.qualities["720p"];
            const hasLinks = quality480 && quality720 && quality480 !== "#" && quality720 !== "";
            episodesHtml += `<div class="episode-item"><div class="episode-name">قسمت ${ep.epNum}</div><div class="quality-buttons">${hasLinks ? `<a href="${quality480}" class="quality-link" target="_blank" download>480p</a><a href="${quality720}" class="quality-link" target="_blank" download>720p</a>` : `<span class="quality-link" style="opacity:0.6; cursor:default; background:#333;">به زودی</span>`}</div></div>`;
        });
        episodesHtml += `</div>`;
        seasonsHtml += `<div class="season-card" data-season="${idx}"><div class="season-header"><div><span class="season-title">${escapeHtml(season.seasonName)}</span></div><div class="season-arrow">▼</div></div><div class="season-content">${episodesHtml}</div></div>`;
    });
    seasonsHtml += `</div>`;

    const suggestions = animeData.filter(a => a.id !== anime.id && a.genres.filter(g => anime.genres.includes(g)).length >= 2).slice(0, 10);
    let suggestionsHtml = '';
    if (suggestions.length > 0) {
        suggestionsHtml = `<div class="suggestions-section"><div class="suggestions-title">پیشنهادات مرتبط</div><div class="suggestions-grid">${suggestions.map(sug => `<div class="suggestion-card" data-id="${sug.id}"><img class="suggestion-img" src="${sug.verticalCover}" onerror="this.src='https://placehold.co/160x200/1e243b/9aa4bf?text=No+Image'"><div class="suggestion-title">${escapeHtml(sug.title)}</div><div class="suggestion-rating"> ${sug.imdbRating !== '--' ? sug.imdbRating : '?'}</div></div>`).join('')}</div></div>`;
    }
    
    const detailHtml = `<div class="header"><div class="logo">AniVerse</div><div class="back-home" id="backHomeBtn">بازگشت به صفحه اصلی</div></div><div class="detail-container"><div class="anime-header-info"><h2>${escapeHtml(anime.fullTitle)}</h2><div class="detail-ratings"><span class="detail-rating detail-imdb"> IMDB: ${anime.imdbRating || '?'}</span></div><div class="genres" style="margin-top: 0.5rem;">${anime.genres.map(g => `<span class="genre">${escapeHtml(g)}</span>`).join('')}</div><img class="anime-poster" src="${anime.poster}"><p style="margin-top: 1rem; line-height: 1.6;">${escapeHtml(anime.description)}</p></div>${trailerHtml}${seasonsHtml}${suggestionsHtml}</div><div class="footer">تمامی لینک ها جمع آوری شده از منابع دیگر</div>`;
    
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
    
    // اگه هش وجود داره و شروعش با anime/ هست
    if (hash.startsWith('anime/')) {
        const id = hash.split('/')[1];
        if (id) {
            currentAnimeId = id;
            renderDetailPage(id);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
    }
    
    // صفحه اصلی: ریست کردن جستجو
    resetSearch();
    currentAnimeId = null;
    renderHomePage();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// پشتیبانی از دکمه Back گوشی
window.addEventListener('popstate', function(event) {
    // اگه state وجود داره و سرچ توش هست
    if (event.state && event.state.search !== undefined) {
        currentSearchTerm = event.state.search;
        currentPage = 1;
        renderHomePage();
        
        // آپدیت کردن مقدار اینپوت
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.value = currentSearchTerm;
    } else {
        // برگشت به حالت بدون سرچ
        resetSearch();
        currentPage = 1;
        renderHomePage();
    }
});

window.addEventListener('hashchange', handleRouting);
handleRouting();
