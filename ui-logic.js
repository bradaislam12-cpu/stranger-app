/**
 * Stranger Meeting - UI Logic Engine 2026
 * هذا الملف مسؤول عن مزامنة المظهر واللغة عبر كافة صفحات الموقع
 */

// 1. دالة تبديل الوضع الليلي والنهاري
window.toggleTheme = function() {
    const body = document.body;
    
    if (body.classList.contains('light-mode')) {
        // التحويل للوضع الليلي
        body.classList.replace('light-mode', 'dark-mode');
        localStorage.setItem('sm-theme', 'dark');
    } else {
        // التحويل للوضع النهاري
        body.classList.replace('dark-mode', 'light-mode');
        localStorage.setItem('sm-theme', 'light');
    }
};

// 2. دالة تشغيل الإعدادات المحفوظة (تنفذ تلقائياً عند تحميل أي صفحة)
(function applySavedSettings() {
    document.addEventListener('DOMContentLoaded', () => {
        const savedTheme = localStorage.getItem('sm-theme');
        
        // إذا كان المستخدم قد اختار الوضع الليلي مسبقاً، نقوم بتطبيقه فوراً
        if (savedTheme === 'dark') {
            document.body.classList.replace('light-mode', 'dark-mode');
        } else {
            // الوضع الافتراضي هو النهاري
            document.body.classList.add('light-mode');
        }
        
        // ملاحظة: يمكنك إضافة منطق حفظ اللغة هنا مستقبلاً بنفس الطريقة
    });
})();

// 3. منع "الومضة البيضاء" (اختياري)
// هذا السطر يساعد في تطبيق اللون قبل اكتمال تحميل عناصر HTML الثقيلة
if (localStorage.getItem('sm-theme') === 'dark') {
    document.documentElement.classList.add('dark-mode');
}
