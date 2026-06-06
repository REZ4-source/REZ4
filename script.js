let currentAnimeId = null;
let searchTimeout = null;
let currentPage = 1;
let currentSearchTerm = '';
const ITEMS_PER_PAGE = 9;
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

// دریافت انیمه‌های فیلتر شده بر اساس جستجو
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

// دریافت انیمه‌های صفحه جاری
function getPaginatedAnime() {
    const filtered = getFilteredAnime();
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filtered.slice(start, end);
}

// محاسبه تعداد کل صفحات
function getTotalPages() {
    const filtered = getFilteredAnime();
    return Math.ceil(filtered.length / ITEMS_PER_PAGE);
}

// تغییر صفحه
function goToPage(page) {
    const totalPages = getTotalPages();
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderHomePage();
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
                </div>
            </div>
        </div>
        <div class="anime-grid">
    `;
    
    if (filteredAnime.length === 0) {
        cardsHtml += `<div class="no-result">❌ هیچ انیمه‌ای با این نام پیدا نشد.</div>`;
    } else {
        filteredAnime.forEach(anime => {
            const coverImg = anime.horizontalCover;
            cardsHtml += `
                <div class="anime-card" data-id="${anime.id}">
                    <img class="card-cover" src="${coverImg}" alt="کاور ${escapeHtml(anime.title)}" loading="lazy">
                    <div class="card-content">
                        <div class="anime-title">${escapeHtml(anime.title)}</div>
                        <div class="rating-badges">
                            <span class="rating-badge rating-imdb"> IMDB ${anime.imdbRating || '?'}</span>
                            <span class="rating-badge rating-mal"> MAL ${anime.malRating || '?'}</span>
                        </div>
                        <div class="genres">
                            ${anime.genres.map(g => `<span class="genre">${escapeHtml(g)}</span>`).join('')}
                        </div>
                        <div class="anime-desc">
                            ${escapeHtml(anime.description.length > 90 ? anime.description.slice(0, 90) + '...' : anime.description)}
                        </div>
                        <div class="detail-btn">
                            مشاهده جزئیات و دانلود
                        </div>
                    </div>
                </div>
            `;
        });
    }
    
    cardsHtml += `</div>`;
    
    // صفحه‌بندی
    if (totalPages > 1) {
        cardsHtml += `<div class="pagination">`;
        cardsHtml += `<button class="prev-btn" ${currentPage === 1 ? 'disabled' : ''}>قبلی</button>`;
        cardsHtml += `<div class="page-numbers">`;
        
        // نمایش صفحات (حداکثر ۵ دکمه)
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);
        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            cardsHtml += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
        
        cardsHtml += `</div>`;
        cardsHtml += `<button class="next-btn" ${currentPage === totalPages ? 'disabled' : ''}>بعدی</button>`;
        cardsHtml += `</div>`;
        cardsHtml += `<div class="info-text">نمایش ${filteredAnime.length} از ${totalItems} انیمه - صفحه ${currentPage} از ${totalPages}</div>`;
    } else if (totalItems > 0) {
        cardsHtml += `<div class="info-text">${totalItems} انیمه</div>`;
    }
    
    cardsHtml += `<div class="footer">تمامی لینک ها جمع آوری شده از منابع دیگر</div>`;
    appContainer.innerHTML = cardsHtml;
    
    // رویداد کلیک روی کارت‌ها
    document.querySelectorAll('.anime-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const id = card.getAttribute('data-id');
            if(id) {
                window.location.hash = `anime/${id}`;
                renderDetailPage(id);
            }
        });
    });
    
    // رویداد دکمه قبلی
    const prevBtn = document.querySelector('.prev-btn');
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                goToPage(currentPage - 1);
            }
        });
    }
    
    // رویداد دکمه بعدی
    const nextBtn = document.querySelector('.next-btn');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                goToPage(currentPage + 1);
            }
        });
    }
    
    // رویداد دکمه‌های صفحه
    document.querySelectorAll('.page-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const page = parseInt(btn.getAttribute('data-page'));
            if (!isNaN(page)) {
                goToPage(page);
            }
        });
    });
    
    // رویداد جستجو
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            if (searchTimeout) clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                currentSearchTerm = e.target.value;
                currentPage = 1;  // برگشت به صفحه اول
                renderHomePage();
            }, 300);
        });
    }
}

function renderDetailPage(animeId) {
    const anime = animeData.find(a => a.id === animeId);
    if (!anime) {
        renderHomePage();
        return;
    }
    
    let trailerHtml = '';
    if (anime.trailer && anime.trailer !== '') {
        trailerHtml = `
            <div class="trailer-section">
                <div class="trailer-title">
                    <span></span>تریلر</span>
                </div>
                <div class="trailer-player">
                    <video controls autoplay>
                        <source src="${anime.trailer}" type="video/mp4">
                        مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
                    </video>
                </div>
            </div>
        `;
    }
    
    let seasonsHtml = `<div class="seasons-wrapper">`;
    
    anime.seasons.forEach((season, idx) => {
        let episodesHtml = `<div class="episode-grid">`;
        
        season.episodes.forEach(ep => {
            const quality480 = ep.qualities["480p"];
            const quality720 = ep.qualities["720p"];
            const hasLinks = quality480 && quality720 && quality480 !== "#" && quality720 !== "";
            
            episodesHtml += `
                <div class="episode-item">
                    <div class="episode-name">قسمت ${ep.epNum}</div>
                    <div class="quality-buttons">
                        ${hasLinks ? `
                            <a href="${quality480}" class="quality-link" target="_blank" download>480p</a>
                            <a href="${quality720}" class="quality-link" target="_blank" download>720p</a>
                        ` : `
                            <span class="quality-link" style="opacity:0.6; cursor:default; background:#333;">به زودی</span>
                        `}
                    </div>
                </div>
            `;
        });
        episodesHtml += `</div>`;
        
        seasonsHtml += `
            <div class="season-card" data-season="${idx}">
                <div class="season-header">
                    <div>
                        <span class="season-title">${escapeHtml(season.seasonName)}</span>
                    </div>
                    <div class="season-arrow">▼</div>
                </div>
                <div class="season-content">
                    ${episodesHtml}
                </div>
            </div>
        `;
    });
    
    seasonsHtml += `</div>`;

    const suggestions = animeData.filter(a => {
        if (a.id === anime.id) return false;
        const commonGenres = a.genres.filter(g => anime.genres.includes(g));
        return commonGenres.length >= 2;
    }).slice(0, 10);
    
    let suggestionsHtml = '';
    if (suggestions.length > 0) {
        suggestionsHtml = `
            <div class="suggestions-section">
                <div class="suggestions-title">پیشنهادات مرتبط</div>
                <div class="suggestions-grid">
                    ${suggestions.map(sug => `
                        <div class="suggestion-card" data-id="${sug.id}">
                            <img class="suggestion-img" src="${sug.verticalCover}" onerror="this.src='https://placehold.co/160x200/1e243b/9aa4bf?text=No+Image'">
                            <div class="suggestion-title">${escapeHtml(sug.title)}</div>
                            <div class="suggestion-rating"> ${sug.imdbRating !== '--' ? sug.imdbRating : '?'}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    const detailHtml = `
        <div class="header">
            <div class="logo">AniVerse</div>
            <div class="back-home" id="backHomeBtn">بازگشت به صفحه اصلی</div>
        </div>
        <div class="detail-container">
            <div class="anime-header-info">
                <h2>${escapeHtml(anime.fullTitle)}</h2>
                <div class="detail-ratings">
                    <span class="detail-rating detail-imdb"> IMDB: ${anime.imdbRating || '?'}</span>
                </div>
                <div class="genres" style="margin-top: 0.5rem;">
                    ${anime.genres.map(g => `<span class="genre">${escapeHtml(g)}</span>`).join('')}
                </div>
                <img class="anime-poster" src="${anime.poster}" alt="پوستر ${escapeHtml(anime.title)}">
                <p style="margin-top: 1rem; line-height: 1.6;">${escapeHtml(anime.description)}</p>
            </div>
            ${trailerHtml}
            ${seasonsHtml}
            ${suggestionsHtml}
        </div>
        <div class="footer">تمامی لینک ها جمع آوری شده از منابع دیگر</div>
    `;
    
    appContainer.innerHTML = detailHtml;
    
    document.querySelectorAll('.season-card').forEach(card => {
        const header = card.querySelector('.season-header');
        const content = card.querySelector('.season-content');
        const arrow = card.querySelector('.season-arrow');
        
        header.addEventListener('click', () => {
            content.classList.toggle('open');
            if (arrow) {
                if (content.classList.contains('open')) {
                    arrow.style.transform = 'rotate(180deg)';
                } else {
                    arrow.style.transform = 'rotate(0deg)';
                }
            }
        });
    });
    
    document.querySelectorAll('.suggestion-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.getAttribute('data-id');
            if (id) {
                window.location.hash = `anime/${id}`;
                renderDetailPage(id);
            }
        });
    });
    
    const backBtn = document.getElementById('backHomeBtn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.hash = '';
            currentSearchTerm = '';
            currentPage = 1;
            renderHomePage();
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
            return;
        }
    }
    currentAnimeId = null;
    renderHomePage();
}

window.addEventListener('hashchange', handleRouting);
handleRouting();
