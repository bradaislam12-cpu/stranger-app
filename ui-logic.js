function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

function toggleLang() {
    const isAr = document.documentElement.lang === 'ar';
    document.documentElement.lang = isAr ? 'en' : 'ar';
    document.documentElement.dir = isAr ? 'ltr' : 'rtl';
    // تغيير نصوص بسيطة كمثال
    if(!isAr) document.title = "Stranger Meeting";
}

// استعادة الإعدادات المحفوظة
if(localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');
