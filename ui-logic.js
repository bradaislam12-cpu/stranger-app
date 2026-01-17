const i18n = {
    ar: {
        title: "Stranger Meeting",
        welcome: "مرحباً بك",
        login: "تسجيل الدخول",
        register: "إنشاء حساب",
        logout: "خروج",
        fullname: "الاسم",
        email: "البريد الإلكتروني",
        pass: "كلمة المرور",
        country: "الدولة",
        interests: "الاهتمام",
        age: "العمر",
        select: "اختر...",
        profile: "الملف الشخصي",
        chat: "دردشة",
        // الاهتمامات
        music: "موسيقى", sports: "رياضة", tech: "تكنولوجيا", gaming: "ألعاب", coding: "برمجة",
        // الدول
        egypt: "مصر", saudi: "السعودية", algeria: "الجزائر", morocco: "المغرب", jordan: "الأردن", palestine: "فلسطين", Iraq: "العراق"
    },
    en: {
        title: "Stranger Meeting",
        welcome: "Welcome",
        login: "Login",
        register: "Register",
        logout: "Logout",
        fullname: "Name",
        email: "Email",
        pass: "Password",
        country: "Country",
        interests: "Interest",
        age: "Age",
        select: "Select...",
        profile: "Profile",
        chat: "Chat",
        // Interests
        music: "Music", sports: "Sports", tech: "Technology", gaming: "Gaming", coding: "Coding",
        // Countries
        egypt: "Egypt", saudi: "Saudi Arabia", algeria: "Algeria", morocco: "Morocco", jordan: "Jordan", palestine: "Palestine", Iraq: "Iraq"
    }
};

window.toggleLang = function() {
    const currentLang = localStorage.getItem('sm-lang') === 'en' ? 'ar' : 'en';
    localStorage.setItem('sm-lang', currentLang);
    location.reload(); 
};

window.toggleTheme = function() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('sm-theme', isDark ? 'dark' : 'light');
};

function applySettings() {
    const lang = localStorage.getItem('sm-lang') || 'ar';
    const theme = localStorage.getItem('sm-theme') || 'light';
    
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    if (theme === 'dark') document.body.classList.add('dark-mode');

    document.querySelectorAll('.tr').forEach(el => {
        const key = el.getAttribute('data-key');
        if (i18n[lang][key]) {
            if (el.tagName === 'INPUT') el.placeholder = i18n[lang][key];
            else el.innerText = i18n[lang][key];
        }
    });

    // تحديث زر اللغة ليصبح AR أو EN فقط
    const langBtn = document.getElementById('langBtn');
    if (langBtn) {
        langBtn.innerText = (lang === 'ar') ? 'EN' : 'AR';
    }
}

document.addEventListener('DOMContentLoaded', applySettings);
