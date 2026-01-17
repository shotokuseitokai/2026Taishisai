// ==============================================
// 1. カウントダウンタイマー (トップページ用)
// ==============================================

// ★ここに文化祭の日付を入れてください (年, 月-1, 日)
// 例: 2025年11月20日なら (2025, 10, 20)
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
        navMenu.classList.toggle('active');
    });

    // メニューのリンクをクリックしたら閉じる
    document.querySelectorAll('#nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
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
// 4. 企画一覧の絞り込み機能 (projects.html用)
// ==============================================
const filterBtns = document.querySelectorAll('.filter-btn');
const projectItems = document.querySelectorAll('.project-item');

if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 1. ボタンの見た目を切り替える
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // 2. 選択されたカテゴリを取得
            const filterValue = btn.getAttribute('data-filter');

            // 3. 企画カードを表示/非表示にする
            projectItems.forEach(item => {
                // 'all'が選ばれているか、カテゴリが一致していたら表示
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.classList.remove('hide');
                } else {
                    item.classList.add('hide');
                }
            });
        });
    });
}

// --- モーダルウィンドウの制御 ---

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
    modal.style.display = "flex";
    // 少し遅らせてフェードインさせる（アニメーション用）
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

// 閉じるボタンの処理
const closeBtn = document.querySelector('.close-btn');
if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = "none";
        }, 300);
    });
}

// モーダルの外側をクリックしても閉じる
window.addEventListener('click', (e) => {
    if (e.target == modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = "none";
        }, 300);
    }
});