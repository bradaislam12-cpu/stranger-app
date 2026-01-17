const i18n = {
    ar: {
        title: "Stranger Meeting", login: "تسجيل الدخول", register: "إنشاء حساب", logout: "خروج",
        fullname: "الاسم", email: "البريد", pass: "كلمة المرور", country: "الدولة", interests: "الاهتمام",
        age: "العمر", select: "اختر...", profile: "الملف الشخصي", chat: "دردشة", haveAccount: "لديك حساب؟",
        // الدول - أفريقيا
        algeria: "الجزائر", egypt: "مصر", morocco: "المغرب", tunisia: "تونس", libya: "ليبيا", nigeria: "نيجيريا", safrica: "جنوب أفريقيا", kenya: "كينيا", ethiopia: "إثيوبيا", ghana: "غانا",
        // آسيا
        saudi: "السعودية", uae: "الإمارات", qatar: "قطر", bahrain: "البحرين", kuwait: "الكويت", iraq: "العراق", iran: "إيران", turkey: "تركيا", china: "الصين", japan: "اليابان", india: "الهند", pakistan: "باكستان",
        // أوروبا
        france: "فرنسا", germany: "ألمانيا", italy: "إيطاليا", spain: "إسبانيا", portugal: "البرتغال", uk: "المملكة المتحدة", russia: "روسيا", netherlands: "هولندا", belgium: "بلجيكا", sweden: "السويد",
        // أمريكا
        usa: "الولايات المتحدة", canada: "كندا", mexico: "المكسيك", cuba: "كوبا", jamaica: "جامايكا", brazil: "البرازيل", argentina: "الأرجنتين", chile: "تشيلي", colombia: "كولومبيا", peru: "بيرو", venezuela: "فنزويلا",
        // أوقيانوسيا
        australia: "أستراليا", nzealand: "نيوزيلندا", fiji: "فيجي", papua: "بابوا غينيا الجديدة",
        // الاهتمامات
        reading: "القراءة والكتب", languages: "تعلم اللغات", courses: "الدورات التعليمية", history: "التاريخ والثقافة", science: "العلوم والتكنولوجيا",
        drawing: "الرسم والتصميم", photo: "التصوير الفوتوغرافي", music: "الموسيقى والعزف", writing: "الكتابة الإبداعية", movies: "الأفلام والمسلسلات",
        football: "كرة القدم", basket: "كرة السلة", fitness: "الجري واللياقة", swimming: "السباحة", esports: "الرياضات الإلكترونية",
        travel: "السفر والسياحة", nature: "الطبيعة والرحلات", cities: "المدن والمعالم", cuisine: "المأكولات العالمية",
        coding: "البرمجة", games: "الألعاب الإلكترونية", ai: "الذكاء الاصطناعي", smart: "الأجهزة الذكية", ecommerce: "التجارة الإلكترونية",
        cooking: "الطبخ", fashion: "الموضة والأزياء", health: "الصحة والعافية", pets: "الحيوانات الأليفة", volunteer: "العمل التطوعي"
    },
    en: {
        title: "Stranger Meeting", login: "Login", register: "Register", logout: "Logout",
        fullname: "Name", email: "Email", pass: "Password", country: "Country", interests: "Interest",
        age: "Age", select: "Select...", profile: "Profile", chat: "Chat", haveAccount: "Have account?",
        // Countries - Africa
        algeria: "Algeria", egypt: "Egypt", morocco: "Morocco", tunisia: "Tunisia", libya: "Libya", nigeria: "Nigeria", safrica: "South Africa", kenya: "Kenya", ethiopia: "Ethiopia", ghana: "Ghana",
        // Asia
        saudi: "Saudi Arabia", uae: "UAE", qatar: "Qatar", bahrain: "Bahrain", kuwait: "Kuwait", iraq: "Iraq", iran: "Iran", turkey: "Turkey", china: "China", japan: "Japan", india: "India", pakistan: "Pakistan",
        // Europe
        france: "France", germany: "Germany", italy: "Italy", spain: "Spain", portugal: "Portugal", uk: "United Kingdom", russia: "Russia", netherlands: "Netherlands", belgium: "Belgium", sweden: "Sweden",
        // America
        usa: "United States", canada: "Canada", mexico: "Mexico", cuba: "Cuba", jamaica: "Jamaica", brazil: "Brazil", argentina: "Argentina", chile: "Chile", colombia: "Colombia", peru: "Peru", venezuela: "Venezuela",
        // Oceania
        australia: "Australia", nzealand: "New Zealand", fiji: "Fiji", papua: "Papua New Guinea",
        // Interests
        reading: "Reading & Books", languages: "Learning Languages", courses: "Online Courses", history: "History & Culture", science: "Science & Technology",
        drawing: "Drawing & Design", photo: "Photography", music: "Music & Instruments", writing: "Creative Writing", movies: "Movies & TV Shows",
        football: "Football/Soccer", basket: "Basketball", fitness: "Running & Fitness", swimming: "Swimming", esports: "E-Sports",
        travel: "Travel & Tourism", nature: "Nature & Hiking", cities: "Cities & Landmarks", cuisine: "World Cuisine",
        coding: "Programming", games: "Video Games", ai: "Artificial Intelligence", smart: "Smart Devices", ecommerce: "E-Commerce",
        cooking: "Cooking", fashion: "Fashion & Style", health: "Health & Wellness", pets: "Pets", volunteer: "Volunteering"
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

    const langBtn = document.getElementById('langBtn');
    if (langBtn) langBtn.innerText = (lang === 'ar') ? 'EN' : 'AR';
}

document.addEventListener('DOMContentLoaded', applySettings);
