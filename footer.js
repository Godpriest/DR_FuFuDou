// 底部區塊功能

// 底部區塊HTML模板
const footerHTML = `
<footer class="footer">
    <div class="contact-info">
        <div class="contact-item">
            <span>📞</span>
            <span>0987-654-321</span>
        </div>
        <div class="contact-item">
            <span>📧</span>
            <span>bacon9487@gmail.com</span>
        </div>
    </div>
    <p>Copyright © 2025 FuFuDou All Rights Reserved</p>
</footer>
`;

// 載入底部區塊HTML
function loadFooter() {
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
        footerContainer.innerHTML = footerHTML;
    }
}

// 頁面載入完成後自動載入底部區塊
document.addEventListener('DOMContentLoaded', function() {
    loadFooter();
});

console.log('Footer loaded successfully');
