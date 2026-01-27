// ==============================================
// 1. カウントダウンタイマー (トップページ用)
// ==============================================

// ★ここに文化祭の日付を入れてください (年, 月-1, 日)
// 例: 2026年9月19日なら (2026, 8, 19)
const festivalDate = new Date(2026, 8, 19); 

function updateTimer() {
    // タイマーが表示される要素があるか確認（エラー防止）
    const timerElement = document.getElementById('timer');
    if (!timerElement) return; 

    const now = new Date();
    const diff = festivalDate - now;

    if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

        document.getElementById('days').innerText = days;
        document.getElementById('hours').innerText = hours;
    } else {
        timerElement.innerText = "開催中！";
    }
}

// 1秒ごとに更新
setInterval(updateTimer, 1000);
updateTimer();


// ==============================================
// 2. ハンバーガーメニュー (スマホ用・共通)
// ==============================================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active'); // アイコンのアニメーション用
        navMenu.classList.toggle('active');
    });

    // メニューのリンクをクリックしたら閉じる
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

// 現在の絞り込み状態を保存する変数
let currentCategory = 'all';
let currentSearchTerm = '';

// ▼ 共通の絞り込み実行関数（ボタンと検索の両方から呼ばれる）
function filterItems() {
    projectItems.forEach(item => {
        // カードの情報を取得
        const itemCategory = item.getAttribute('data-category');
        const itemTitle = item.getAttribute('data-title') || '';
        const itemDesc = item.getAttribute('data-desc') || '';
        
        // 検索用に文字を小文字に統一して結合
        const itemText = (itemTitle + itemDesc).toLowerCase();

        // 判定1：カテゴリは合っているか？
        const isCategoryMatch = (currentCategory === 'all' || itemCategory === currentCategory);

        // 判定2：検索ワードが含まれているか？
        const isSearchMatch = (currentSearchTerm === '' || itemText.includes(currentSearchTerm));

        // 両方OKなら表示、どちらかダメなら非表示
        if (isCategoryMatch && isSearchMatch) {
            item.style.display = 'flex'; // レイアウトに合わせてblockかflex
            // 再表示時のアニメーション用
            setTimeout(() => { item.style.opacity = '1'; }, 50);
        } else {
            item.style.display = 'none';
            item.style.opacity = '0';
        }
    });
}

// ▼ ボタンがクリックされた時の処理
if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 見た目の切り替え
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // 選択されたカテゴリを保存して絞り込み実行
            currentCategory = btn.getAttribute('data-filter');
            filterItems();
        });
    });
}

// ▼ 検索窓に入力された時の処理
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        // 入力文字を小文字にして保存し、絞り込み実行
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

// カードがクリックされたらモーダルを開く関数
function openModal(element) {
    // データ属性から情報を取得
    const title = element.getAttribute('data-title');
    const desc = element.getAttribute('data-desc');
    const image = element.getAttribute('data-image');
    const tag = element.getAttribute('data-tag');
    const tagClass = element.getAttribute('data-tag-class');

    // モーダルの中身を書き換え
    modalTitle.innerText = title;
    modalDesc.innerText = desc;
    modalImg.src = image;
    modalTag.innerText = tag;

    // タグの色をリセットして設定
    modalTag.className = 'tag ' + tagClass;

    // モーダルを表示
    modal.classList.add('active');
}

// 閉じるボタンの処理
const closeBtn = document.querySelector('.close-btn');
if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });
}

// モーダルの外側をクリックしても閉じる
window.addEventListener('click', (e) => {
    if (e.target == modal) {
        modal.classList.remove('active');
    }
});

window.addEventListener('click', (e) => {
    // クリックされた場所(e.target)が、モーダル全体(黒背景部分)と同じなら閉じる
    if (e.target === modal) {
        modal.classList.remove('active');
    }
});
