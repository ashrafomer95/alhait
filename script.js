document.addEventListener('DOMContentLoaded', () => {
    // 1. JavaScript لتبديل قائمة الجوال (mobile menu toggle)
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // 2. JavaScript لسلايدر الصور (تلقائي ويدوي)
    const sliderContainer = document.getElementById('image-slider-container');
    const prevButton = document.getElementById('prev-slide');
    const nextButton = document.getElementById('next-slide');

    const imageMargin = 20;
    const imageBaseWidth = 300;
    const imageScrollAmount = imageBaseWidth + imageMargin;

    if (sliderContainer && prevButton && nextButton) {
        const scrollSlider = (direction) => {
            let currentScroll = sliderContainer.scrollLeft;
            let newScroll;

            if (direction === 'next') {
                newScroll = currentScroll - imageScrollAmount;
            } else {
                newScroll = currentScroll + imageScrollAmount;
            }

            const maxScrollLeft = sliderContainer.scrollWidth - sliderContainer.clientWidth;

            if (newScroll < 0) {
                newScroll = maxScrollLeft;
            } else if (newScroll > maxScrollLeft) {
                newScroll = 0;
            }

            sliderContainer.scrollTo({
                left: newScroll,
                behavior: 'smooth'
            });
        };

        nextButton.addEventListener('click', () => scrollSlider('next'));
        prevButton.addEventListener('click', () => scrollSlider('prev'));
    }

    // 3. JavaScript لتأثير "reveal" (الظهور عند التمرير)
    const revealElements = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    revealElements.forEach(element => {
        observer.observe(element);
    });

    // 4. JavaScript لنظام التبويبات (Tabs)
    const tabLinks = document.querySelectorAll('.tab-link'); // جميع روابط التبويبات
    const tabContents = document.querySelectorAll('.tab-content'); // جميع أقسام محتوى التبويبات

    tabLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // منع السلوك الافتراضي للرابط

            // إزالة فئة 'active-tab' من الرابط النشط حالياً
            tabLinks.forEach(l => {
                l.classList.remove('active-tab', 'bg-primary', 'text-text-light');
                l.classList.add('text-primary', 'hover:bg-primary', 'hover:text-text-light');
            });

            // إضافة فئة 'active-tab' وخصائص اللون للرابط الذي تم النقر عليه
            link.classList.add('active-tab', 'bg-primary', 'text-text-light');
            link.classList.remove('text-primary', 'hover:bg-primary', 'hover:text-text-light');

            // إخفاء جميع محتويات التبويبات
            tabContents.forEach(content => {
                content.classList.add('hidden');
            });

            // إظهار محتوى التبويب المستهدف
            const targetTabId = link.dataset.targetTab; // الحصول على ID التبويب المستهدف من data-attribute
            const targetTabContent = document.getElementById(targetTabId);
            if (targetTabContent) {
                targetTabContent.classList.remove('hidden');
            }
        });
    });

    // جعل التبويب الأول هو النشط افتراضياً عند تحميل الصفحة
    const defaultActiveLink = document.querySelector('.tab-link[data-target-tab="tab-about"]');
    const defaultActiveContent = document.getElementById('tab-about');
    if (defaultActiveLink && defaultActiveContent) {
        defaultActiveLink.classList.add('active-tab', 'bg-primary', 'text-text-light');
        defaultActiveLink.classList.remove('text-primary', 'hover:bg-primary', 'hover:text-text-light');
        defaultActiveContent.classList.remove('hidden');
    }

    // 5. JavaScript لتحريك دوائر الإحصائيات (التحليل)
    const statsSection = document.querySelector('section.py-16.bg-white.reveal'); // حدد قسم الإحصائيات

    // تأكد من أن هذا هو القسم الصحيح الذي يحتوي على الإحصائيات
    if (statsSection && statsSection.querySelector('h2').textContent.includes('أرقام وإحصائيات البركة')) {
        const animateProgressCircles = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statItems = entry.target.querySelectorAll('.flex.flex-col.items-center.text-center');
                    statItems.forEach(item => {
                        const circle = item.querySelector('circle.text-primary');
                        const numberSpan = item.querySelector('span.absolute.inset-0.flex.items-center.justify-center.text-3xl.font-bold.text-primary');

                        if (circle && numberSpan) {
                            const targetValueText = numberSpan.textContent.replace('+', '').trim();
                            let targetValue = parseFloat(targetValueText);

                            // تحديد قيمة stroke-dashoffset الأولية (0% مكتمل)
                            const circumference = 2 * Math.PI * 60; // r=60 من الـ SVG
                            circle.style.strokeDasharray = circumference;
                            circle.style.strokeDashoffset = circumference; // ابدأ الدائرة فارغة

                            // تحويل الأرقام الكبيرة إلى نسب مئوية معقولة للرسوم المتحركة
                            // يمكن تعديل هذه النسب بناءً على حجم الأرقام الفعلية
                            let percentage = 0;
                            if (targetValueText === '13922') percentage = 90; // الساعات التطوعية
                            else if (targetValueText === '895') percentage = 80;   // عدد المتطوعين
                            else if (targetValueText === '2080066') percentage = 95; // عدد المستفيدين
                            else if (targetValueText === '208738554') percentage = 70; // إجمالي المساعدات
                            else percentage = 0; // افتراضي (إذا لم يتطابق الرقم)

                            const offset = circumference - (percentage / 100) * circumference;

                            // تحريك الدائرة
                            circle.style.transition = 'stroke-dashoffset 2s ease-out';
                            circle.style.strokeDashoffset = offset;

                            // تحريك الأرقام
                            let currentNumber = 0;
                            const duration = 2000; // 2 ثانية
                            const start = performance.now();

                            const animateNumber = (currentTime) => {
                                const elapsed = currentTime - start;
                                const progress = Math.min(elapsed / duration, 1);

                                // حساب القيمة الحالية للعداد
                                let animatedValue;
                                if (targetValueText.includes('.')) { // إذا كان الرقم عشري
                                    animatedValue = (progress * targetValue).toFixed(1); // لعدد عشري واحد
                                } else {
                                    animatedValue = Math.floor(progress * targetValue);
                                }

                                // إضافة علامة الزائد إذا كانت موجودة في الأصل
                                numberSpan.textContent = (targetValueText.startsWith('+') ? '+' : '') + animatedValue;

                                if (progress < 1) {
                                    requestAnimationFrame(animateNumber);
                                } else {
                                    // التأكد من أن القيمة النهائية هي القيمة المستهدفة بالضبط
                                    numberSpan.textContent = (targetValueText.startsWith('+') ? '+' : '') + targetValueText.replace('+', '');
                                }
                            };
                            requestAnimationFrame(animateNumber);
                        }
                    });
                    observer.unobserve(entry.target); // توقف عن المراقبة بعد التشغيل مرة واحدة
                }
            });
        };

        const statsObserver = new IntersectionObserver(animateProgressCircles, {
            threshold: 0.5 // تشغيل عندما يكون 50% من العنصر مرئياً
        });

        statsObserver.observe(statsSection);
    }
});