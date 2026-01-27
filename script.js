// ==============================================
// 1. カウントダウンタイマー (トップページ用)
// ==============================================

// ★ここに文化祭の日付を入れてください (年, 月-1, 日)
const festivalDate = new Date(2026, 8, 19); 

function updateTimer() {
    const timerElement = document.getElementById('timer');
    if (!timerElement) return; // タイマーがないページでは何もしない

    const now = new Date();
    const diff = festivalDate - now;

    if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

        // 要素がある場合のみ書き換える
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        if (daysEl) daysEl.innerText = days;
        if (hoursEl) hoursEl.innerText = hours;
    } else {
        timerElement.innerText = "開催中！";
    }
}
setInterval(updateTimer, 1000);
updateTimer();


// ==============================================
// 2. ハンバーガーメニュー (スマホ用・共通)
// ==============================================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('#nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}


// ==============================================
// 3. ふわっと表示させるアニメーション (共通)
// ==============================================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
        }
    });
});

document.querySelectorAll('.fade-in').forEach(el => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
});


// ==============================================
// 4. 企画一覧の絞り込み & 検索機能 (projects.html用)
// ==============================================
const filterBtns = document.querySelectorAll('.filter-btn');
const projectItems = document.querySelectorAll('.project-item');
const searchInput = document.getElementById('search-input');

let currentCategory = 'all';
let currentSearchTerm = '';

function filterItems() {
    projectItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        const itemTitle = item.getAttribute('data-title') || '';
        const itemDesc = item.getAttribute('data-desc') || '';
        const itemText = (itemTitle + itemDesc).toLowerCase();

        const isCategoryMatch = (currentCategory === 'all' || itemCategory === currentCategory);
        const isSearchMatch = (currentSearchTerm === '' || itemText.includes(currentSearchTerm));

        if (isCategoryMatch && isSearchMatch) {
            item.style.display = 'flex';
            setTimeout(() => { item.style.opacity = '1'; }, 50);
        } else {
            item.style.display = 'none';
            item.style.opacity = '0';
        }
    });
}

if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.getAttribute('data-filter');
            filterItems();
        });
    });
}

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        currentSearchTerm = e.target.value.toLowerCase().trim();
        filterItems();
    });
}


// ==============================================
// 5. モーダルウィンドウの制御
// ==============================================
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalImg = document.getElementById('modal-img');
const modalTag = document.getElementById('modal-tag');

function openModal(element) {
    if (!modal) return; // モーダルがないページでのエラー防止

    const title = element.getAttribute('data-title');
    const desc = element.getAttribute('data-desc');
    const image = element.getAttribute('data-image');
    const tag = element.getAttribute('data-tag');
    const tagClass = element.getAttribute('data-tag-class');

    modalTitle.innerText = title;
    modalDesc.innerText = desc;
    modalImg.src = image;
    modalTag.innerText = tag;
    modalTag.className = 'tag ' + tagClass;

    modal.classList.add('active');
}

// 閉じるボタン (×) を押したとき
const closeBtn = document.querySelector('.close-btn');
if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });
}

// ★修正済み：黒い背景をクリックしたとき
window.addEventListener('click', (e) => {
    // modalが存在し、かつクリックされたのがmodal自体(黒背景)なら閉じる
    if (modal && e.target === modal) {
        modal.classList.remove('active');
    }
});
