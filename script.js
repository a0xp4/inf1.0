document.addEventListener('DOMContentLoaded', function() {
    // Общие анимации при скролле
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.section-title, .lesson-card, .about-text, .about-image');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animated');
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();

    // Аккордеон 
    const accordionBtns = document.querySelectorAll('.accordion-btn');
    
    accordionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

    // Слайдер презентации 
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slide-prev');
    const nextBtn = document.querySelector('.slide-next');
    let currentSlide = 0;
    
    function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }
    
    function nextSlide() {
        showSlide(currentSlide + 1);
    }
    
    function prevSlide() {
        showSlide(currentSlide - 1);
    }
    
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });
    
    // Автопереключение слайдов
    let slideInterval = setInterval(nextSlide, 5000);
    
    const presentation = document.querySelector('.presentation-container');
    presentation.addEventListener('mouseenter', () => clearInterval(slideInterval));
    presentation.addEventListener('mouseleave', () => {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);
    });

    // Игра "Угадай число" 
    const guessBtn = document.getElementById('guess-btn');
    const guessInput = document.getElementById('guess-input');
    const guessResult = document.getElementById('guess-result');
    const robotMini = document.querySelector('.robot-mini');
    const robotEyes = document.querySelectorAll('.robot-eye-mini');
    const bubble = document.querySelector('.bubble');
    let secretNumber = Math.floor(Math.random() * 10) + 1;
    let attempts = 0;
    let gameActive = true;

    // Стили для анимаций
    const style = document.createElement('style');
    style.textContent = `
        @keyframes miniRobotCelebrate {
            0%, 100% { transform: translateY(0); }
            25% { transform: translateY(-20px); }
            50% { transform: translateY(0) rotate(10deg); }
            75% { transform: translateY(-10px) rotate(-10deg); }
        }
        .secret-number {
            font-weight: bold;
            font-size: 1.2em;
            color: var(--accent-color);
            background-color: rgba(255, 101, 132, 0.2);
            padding: 2px 8px;
            border-radius: 50%;
            animation: pulse 1s infinite;
        }
    `;
    document.head.appendChild(style);

    // Сброс игры
    function resetGame() {
        secretNumber = Math.floor(Math.random() * 10) + 1;
        attempts = 0;
        gameActive = true;
        guessInput.value = '';
        guessResult.textContent = '';
        guessBtn.disabled = false;
        guessInput.disabled = false;
        bubble.textContent = "Я загадал новое число!";
        robotMini.style.animation = 'none';
        void robotMini.offsetWidth;
        robotMini.style.animation = 'miniRobotCelebrate 0.5s ease';
    }

    // Обработчик нажатия кнопки
    guessBtn.addEventListener('click', function() {
        if (!gameActive) return;

        const userGuess = parseInt(guessInput.value);
        
        // Валидация ввода
        if (isNaN(userGuess) || userGuess < 1 || userGuess > 10) {
            guessResult.textContent = 'Пожалуйста, введите число от 1 до 10';
            guessResult.style.color = 'var(--accent-color)';
            
            // Анимация "недовольства" робота
            robotEyes.forEach(eye => {
                eye.style.backgroundColor = 'var(--accent-color)';
                setTimeout(() => {
                    eye.style.backgroundColor = 'var(--primary-color)';
                }, 500);
            });
            
            return;
        }
        
        attempts++;
        
        // Проверка числа
        if (userGuess === secretNumber) {
            // Победа
            guessResult.innerHTML = `Поздравляем! Вы угадали число <span class="secret-number">${secretNumber}</span> с ${attempts} ${attempts === 1 ? 'попытки' : 'попыток'}!`;
            guessResult.style.color = 'var(--primary-color)';
            guessBtn.disabled = true;
            guessInput.disabled = true;
            gameActive = false;
            
            // Анимации победы
            robotMini.style.animation = 'miniRobotCelebrate 2s ease';
            bubble.textContent = "Ура! Ты угадал!";
            
            // Кнопка новой игры
            const newGameBtn = document.createElement('button');
            newGameBtn.textContent = 'Играть снова';
            newGameBtn.className = 'btn-lesson';
            newGameBtn.style.marginTop = '15px';
            newGameBtn.addEventListener('click', resetGame);
            
            guessResult.appendChild(document.createElement('br'));
            guessResult.appendChild(newGameBtn);
            
        } else {
            // Подсказка
            const hint = userGuess < secretNumber ? 'больше' : 'меньше';
            guessResult.textContent = `Не угадали! Загаданное число ${hint}. Попытка ${attempts}`;
            guessResult.style.color = 'var(--text-color)';
            
            // Анимация подмигивания
            robotEyes.forEach((eye, index) => {
                setTimeout(() => {
                    eye.style.transform = 'scaleY(0.1)';
                    setTimeout(() => {
                        eye.style.transform = 'scaleY(1)';
                    }, 200);
                }, index * 100);
            });
            
            // Изменение облачка
            bubble.textContent = attempts % 2 === 0 
                ? `Это не ${userGuess}...` 
                : `Попробуй ещё!`;
        }
        
        // Очистка поля ввода
        guessInput.value = '';
        guessInput.focus();
    });

    // Обработчик Enter в поле ввода
    guessInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            guessBtn.click();
        }
    });

    // Подсказка при фокусе
    guessInput.addEventListener('focus', function() {
        bubble.textContent = "Введи число от 1 до 10";
    });

    // Форма обратной связи
    const contactForm = document.querySelector('.contact-form');
    const successMessage = document.getElementById('success-message');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Получаем значения
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const age = document.getElementById('age').value;
        
        // Валидация
        if (!name || !phone || !age) {
            alert('Пожалуйста, заполните все поля');
            return;
        }
        
        // Проверка телефона
        if (!/^[\d\s()+-\-]+$/.test(phone)) {
            alert('Пожалуйста, введите корректный номер телефона');
            return;
        }
        
        // Имитация отправки
        contactForm.style.display = 'none';
        successMessage.style.display = 'block';
        
        setTimeout(() => {
            successMessage.style.opacity = '1';
            successMessage.style.transform = 'translateY(0)';
        }, 100);
        
        // Сброс формы
        contactForm.reset();
        
        // Возврат формы через 5 сек
        setTimeout(() => {
            successMessage.style.opacity = '0';
            successMessage.style.transform = 'translateY(20px)';
            setTimeout(() => {
                successMessage.style.display = 'none';
                contactForm.style.display = 'block';
            }, 300);
        }, 5000);
    });

    // Плавная прокрутка
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        });
    });

    // Анимации при загрузке 
    const animatedElements = document.querySelectorAll('.hero-title, .hero-subtitle, .btn');
    
    animatedElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 300);
    });

    // Главный робот
    const robot = document.querySelector('.robot');
    
    robot.addEventListener('mouseenter', () => {
        const leftEye = document.querySelector('.left-eye');
        const rightEye = document.querySelector('.right-eye');
        const mouth = document.querySelector('.robot-mouth');
        
        leftEye.style.transform = 'translateX(-5px)';
        rightEye.style.transform = 'translateX(5px)';
        mouth.style.width = '30px';
        mouth.style.height = '15px';
        mouth.style.borderRadius = '0 0 15px 15px';
    });
    
    robot.addEventListener('mouseleave', () => {
        const leftEye = document.querySelector('.left-eye');
        const rightEye = document.querySelector('.right-eye');
        const mouth = document.querySelector('.robot-mouth');
        
        leftEye.style.transform = 'translateX(0)';
        rightEye.style.transform = 'translateX(0)';
        mouth.style.width = '40px';
        mouth.style.height = '10px';
        mouth.style.borderRadius = '5px';
    });

    // Мини-робот следит за курсором
    document.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        const robotRect = robotMini.getBoundingClientRect();
        const robotX = robotRect.left + robotRect.width / 2;
        const robotY = robotRect.top + robotRect.height / 2;
        
        const angleX = (mouseX - robotX) / 20;
        const angleY = (mouseY - robotY) / 20;
        
        robotEyes.forEach(eye => {
            eye.style.transform = `translate(${angleX}px, ${angleY}px)`;
        });
    });

    // Параллакс эффект 
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-element');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.1 + (index * 0.05);
            element.style.transform = `translateY(${scrollPosition * speed}px)`;
        });
    });

    // Анимации карточек уроков 
    const lessonCards = document.querySelectorAll('.lesson-card');
    
    lessonCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.lesson-icon');
            icon.style.transform = 'scale(1.1) rotate(5deg)';
            icon.style.backgroundColor = 'rgba(108, 99, 255, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.lesson-icon');
            icon.style.transform = 'scale(1) rotate(0)';
            icon.style.backgroundColor = 'rgba(108, 99, 255, 0.1)';
        });
    });

    // Анимация облачка с текстом 
    const phrases = [
        "Я загадал число...",
        "От 1 до 10!",
        "Попробуй угадать!",
        "Ты сможешь!",
        "ИИ верит в тебя!"
    ];
    
    let currentPhrase = 0;
    setInterval(() => {
        bubble.textContent = phrases[currentPhrase];
        bubble.style.animation = 'none';
        void bubble.offsetWidth;
        bubble.style.animation = 'bubbleFloat 3s infinite ease-in-out';
        
        currentPhrase = (currentPhrase + 1) % phrases.length;
    }, 3000);
});