// 導航欄動態效果

// 導航欄HTML模板
const navigationHTML = `
<div class="top-section">
    <div class="pattern-top"></div>
    <div class="main-block">
        <div class="content-wrapper">
            <div class="logo"></div>
            <nav>
                <ul class="nav-menu">
                    <li><a href="#shop-info">店鋪資訊</a></li>
                    <span class="nav-separator">|</span>
                    <li><a href="#menu">最新菜單</a></li>
                    <span class="nav-separator">|</span>
                    <li><a href="2025openingdraw.html">優惠活動</a></li>
                </ul>
            </nav>
        </div>
    </div>
    <div class="pattern-bottom"></div>
</div>

<!-- 佔位元素 -->
<div class="nav-spacer"></div>
`;

// 載入導航欄HTML
function loadNavigation() {
    const navigationContainer = document.getElementById('navigation-container');
    if (navigationContainer) {
        navigationContainer.innerHTML = navigationHTML;
        // 載入完成後初始化動態效果
        initializeNavigation();
    }
}

// 初始化導航欄動態效果
function initializeNavigation() {
    // 動態導航列效果變數
let lastScrollY = 0;
let isScrolling = false; // 防循環標記

// 花紋消失/恢復動畫變數
let fadeStartTime = null;
let isFading = false;
let hasTriggeredFade = false; // 記錄是否已經觸發過消失動畫
let restoreStartTime = null;
let isRestoring = false;

// Logo漸變動畫變數
let logoChangeStartTime = null;
let isLogoChanging = false;

// 滾動事件處理
window.addEventListener('scroll', function() {
    if (isScrolling) return; // 防止循環觸發
    
    const mainBlock = document.querySelector('.main-block');
    const navSpacer = document.querySelector('.nav-spacer');
    const patternBottom = document.querySelector('.pattern-bottom');
    const logo = document.querySelector('.logo');
    const scrollY = window.scrollY;
    
    // 計算動態高度（加入遲滯機制）
    let newHeight;
    if (scrollY >= 180) {
        // 180px以上：固定60px
        newHeight = 60;
    } else if (scrollY >= 175) {
        // 175px~180px：遲滯區域，保持當前狀態
        // 這裡不改變高度，讓導航列保持穩定
        newHeight = parseInt(mainBlock.style.height) || 240;
        if (newHeight < 60) newHeight = 60;
    } else {
        // 175px以下：動態縮減
        newHeight = 240 - scrollY;
        if (newHeight < 60) newHeight = 60;
    }
    
    // 檢查是否需要更新導航列高度
    const currentHeight = parseInt(mainBlock.style.height) || 240;
    const heightChanged = Math.abs(currentHeight - newHeight) > 1;
    
    // 下花紋位置：持續移動到180px為止
    const currentBottomTop = parseInt(patternBottom.style.top) || 200;
    let newBottomTop = 200;
    if (scrollY <= 180) {
        newBottomTop = 200 - scrollY; // 下花紋等距上移
    } else {
        newBottomTop = 200 - 180; // 180px後保持在20px位置
    }
    const bottomTopChanged = Math.abs(currentBottomTop - newBottomTop) > 1;
    
    // 檢查是否開始Logo漸變動畫
    if (scrollY >= 70 && !isLogoChanging) {
        logoChangeStartTime = Date.now();
        isLogoChanging = true;
    } else if (scrollY < 70 && isLogoChanging) {
        // 滾動回70px以下，重置Logo
        isLogoChanging = false;
        logoChangeStartTime = null;
        logo.classList.remove('logo-change');
    }

    // Logo縮放動畫（兩個Logo同步縮放）
    if (scrollY >= 20 && scrollY <= 180) {
        const shrinkProgress = (scrollY - 20) / 160; // 0到1之間（160px範圍）
        const scale = 1 - (shrinkProgress * 0.4); // 從1縮小到0.6
        logo.style.transform = `scale(${scale})`;
    } else if (scrollY > 180) {
        logo.style.transform = 'scale(0.6)'; // 180px以上：固定縮小到60%
    } else if (scrollY < 20) {
        logo.style.transform = 'scale(1)'; // 20px以下：恢復原始大小
    }
    
    // 檢查是否開始花紋消失動畫（只觸發一次）
    if (scrollY >= 100 && !hasTriggeredFade && !isFading) {
        fadeStartTime = Date.now();
        isFading = true;
        hasTriggeredFade = true; // 標記已經觸發過
        // 停止恢復動畫
        isRestoring = false;
        restoreStartTime = null;
    } else if (scrollY < 100) {
        // 滾動回100px以下，開始恢復動畫
        if (!isRestoring && (hasTriggeredFade || isFading)) {
            restoreStartTime = Date.now();
            isRestoring = true;
        }
        // 停止消失動畫
        isFading = false;
        fadeStartTime = null;
    }
    
    // 只有真的需要更新時才執行
    if (heightChanged || bottomTopChanged) {
        isScrolling = true;
        
        // 記錄當前滾動位置
        const currentScroll = window.scrollY;
        
        // 更新導航列高度
        if (heightChanged) {
            mainBlock.style.height = newHeight + 'px';
            // nav-spacer保持固定240px高度，不跟著導航列縮放
        }
        
        // 更新下花紋位置
        if (bottomTopChanged) {
            patternBottom.style.top = newBottomTop + 'px';
        }
        
        // 陰影處理
        if (scrollY >= 180) {
            mainBlock.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            mainBlock.style.boxShadow = 'none';
        }
        
        // 恢復滾動位置（如果因為高度變化而改變）
        if (Math.abs(window.scrollY - currentScroll) > 5) {
            window.scrollTo(0, currentScroll);
        }
        
        setTimeout(() => {
            isScrolling = false;
        }, 16); // 約一幀的時間
    }
    
    lastScrollY = scrollY;
});

// 動畫函數（花紋和Logo）
function fadeAnimation() {
    const patternTop = document.querySelector('.pattern-top');
    const patternBottom = document.querySelector('.pattern-bottom');
    const logo = document.querySelector('.logo');

    // Logo漸變動畫
    if (isLogoChanging && logoChangeStartTime) {
        const elapsedTime = Date.now() - logoChangeStartTime;
        const logoChangeDuration = 200; // 0.2秒內完成Logo漸變

        // 立即切換Logo
        logo.classList.add('logo-change');

        // 動畫結束後停止
        if (elapsedTime >= logoChangeDuration) {
            isLogoChanging = false;
            logoChangeStartTime = null;
        }
    }

    // 消失動畫
    if (isFading && fadeStartTime) {
        const elapsedTime = Date.now() - fadeStartTime;
        const fadeDuration = 500; // 0.5秒內消失
        const fadeProgress = Math.max(0, 1 - (elapsedTime / fadeDuration));

        patternTop.style.opacity = fadeProgress.toString();
        patternBottom.style.opacity = fadeProgress.toString();

        // 動畫結束後停止
        if (elapsedTime >= fadeDuration) {
            isFading = false;
            fadeStartTime = null;
        }
    }

    // 恢復動畫
    if (isRestoring && restoreStartTime) {
        const elapsedTime = Date.now() - restoreStartTime;
        const restoreDuration = 300; // 0.3秒內恢復
        const restoreProgress = Math.min(1, elapsedTime / restoreDuration);

        patternTop.style.opacity = restoreProgress.toString();
        patternBottom.style.opacity = restoreProgress.toString();

        // 動畫結束後停止並重置觸發標記
        if (elapsedTime >= restoreDuration) {
            isRestoring = false;
            restoreStartTime = null;
            hasTriggeredFade = false; // 重置觸發標記，允許下次重新觸發
            patternTop.style.opacity = '1';
            patternBottom.style.opacity = '1';
        }
    }

    requestAnimationFrame(fadeAnimation);
}

// 啟動花紋動畫循環
fadeAnimation();

}

// 頁面載入完成後自動載入導航欄
document.addEventListener('DOMContentLoaded', function() {
    loadNavigation();
});
