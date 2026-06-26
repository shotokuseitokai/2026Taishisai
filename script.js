// ==============================================
// 1. カウントダウンタイマー (トップページ用)
// ==============================================

// ★ここに文化祭の日付を入れてください (年, 月-1, 日)
const festivalDate = new Date(2026, 8, 19, 9, 0); 

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

// 💡 絞り込み（ボタン）と検索（文字）を両方同時に処理する関数
function filterProjects() {
    if (projectItems.length === 0) return;

    // 1. 左右のグループごとに、現在ONになっているボタンを集める
    const activeLeft = [];
    const activeRight = [];

    // 左側のグループのキーワード（内容）
    const leftTargets = ['attraction', 'exhibition'];
    // 右側のグループのキーワード（主体）
    const rightTargets = ['class', 'club', 'volunteer'];

    filterBtns.forEach(btn => {
        if (btn.classList.contains('active')) {
            const target = btn.getAttribute('data-target');
            // 押されたボタンが左右どちらのグループか判定して振り分ける
            if (leftTargets.includes(target)) {
                activeLeft.push(target);
            } else if (rightTargets.includes(target)) {
                activeRight.push(target);
            }
        }
    });

    // 2. 検索窓の文字を取得
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';

    // 3. すべてのカードをチェックして表示/非表示を切り替え
    projectItems.forEach(card => {
        const cardCategoryStr = card.getAttribute('data-category') || '';
        const cardCategories = cardCategoryStr.split(' '); // スペース区切りのカテゴリを分割

        const cardTitle = card.getAttribute('data-title') ? card.getAttribute('data-title').toLowerCase() : '';
        
        // 💡 左側の条件：何も選択されていないか、選択されたものが含まれているか
        const isLeftMatch = (activeLeft.length === 0) || activeLeft.some(cat => cardCategories.includes(cat));
        
        // 💡 右側の条件：何も選択されていないか、選択されたものが含まれているか
        const isRightMatch = (activeRight.length === 0) || activeRight.some(cat => cardCategories.includes(cat));
        
        // 💡 検索文字の条件：空欄か、タイトルに文字が含まれているか
        const isSearchMatch = (searchTerm === '') || cardTitle.includes(searchTerm);

        // 🔥 すべての条件（左側 AND 右側 AND 検索窓）を同時にクリアしたものだけ表示！
        if (isLeftMatch && isRightMatch && isSearchMatch) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// 💡 ボタンがクリックされたときの処理
if (filterBtns.length > 0) {
    // 左側と右側のグループ定義
    const leftTargets = ['attraction', 'exhibition'];
    const rightTargets = ['class', 'club', 'volunteer'];

    filterBtns.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.getAttribute('data-target');

            // 1. すでに自分がactive（選択中）なら、OFFにするだけ
            if (button.classList.contains('active')) {
                button.classList.remove('active');
            } else {
                // 2. 自分が選択されていなかった場合、同じグループの他のボタンのactiveを消す（単一選択・後勝ち）
                if (leftTargets.includes(target)) {
                    // 左側グループの他のボタンを解除
                    filterBtns.forEach(btn => {
                        if (leftTargets.includes(btn.getAttribute('data-target'))) {
                            btn.classList.remove('active');
                        }
                    });
                } else if (rightTargets.includes(target)) {
                    // 右側グループの他のボタンを解除
                    filterBtns.forEach(btn => {
                        if (rightTargets.includes(btn.getAttribute('data-target'))) {
                            btn.classList.remove('active');
                        }
                    });
                }
                // 3. そのあと、新しく押されたボタンをONにする
                button.classList.add('active');
            }

            // 4. 画面の表示を更新
            filterProjects();
        });
    });
}

// 💡 検索窓に入力されたときの処理
if (searchInput) {
    searchInput.addEventListener('input', () => {
        filterProjects(); // 画面の表示を更新
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

// ==========================================
//  背景クリックでも詳細画面を閉じる処理 (スマホ対応版)
// ==========================================

// モーダルそのものにイベントを設定（windowより確実です）
if (modal) {
    // PCのクリック用 & スマホのタップ用
    const closeEvents = ['click', 'touchend'];

    closeEvents.forEach(eventType => {
        modal.addEventListener(eventType, (e) => {
            // 黒い背景(modal)そのものが押された時だけ閉じる
            // (中の白いカードが押された時は閉じない)
            if (e.target === modal) {
                // スマホでの誤動作防止（ゴーストクリック対策）
                e.preventDefault(); 
                modal.classList.remove('active');
            }
        });
    });
}

// ==============================================
// タイムテーブルのタブ切り替え
// ==============================================
const tabBtns = document.querySelectorAll('.tab-btn');
const timeContents = document.querySelectorAll('.timetable-content');

if (tabBtns.length > 0) {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 1. すべてのボタンの色（active）を外す
            tabBtns.forEach(b => b.classList.remove('active'));
            // 2. すべてのタイムテーブルを非表示にする
            timeContents.forEach(content => content.classList.remove('active'));

            // 3. クリックされたボタンに色（active）をつける
            btn.classList.add('active');
            
            // 4. 対応するIDのタイムテーブルを表示する
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });
}

