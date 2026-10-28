// QuizMaster Pro - Core Application State & Game Logic

class QuizApp {
    constructor() {
        this.categories = { ...PRESET_CATEGORIES };
        this.questions = [...DEFAULT_QUESTIONS];
        this.customQuizzes = this.loadCustomQuizzes();

        // Game Configuration
        this.selectedCategory = 'all';
        this.selectedDifficulty = 'all';
        this.questionCount = 10;
        this.gameMode = 'classic'; // 'classic', 'blitz', 'survival', 'zen'

        // Active Game State
        this.quizQueue = [];
        this.currentIndex = 0;
        this.score = 0;
        this.streak = 0;
        this.bestStreak = 0;
        this.lives = 3;
        this.userAnswers = []; // Records user choices and performance
        this.timer = null;
        this.timeLeft = 0;
        this.maxTime = 15;
        this.isAnswered = false;
        this.gameStartTime = null;

        // Lifelines state (each usable once per game)
        this.lifelines = {
            fiftyFifty: true,
            addTime: true,
            skip: true
        };

        // DOM Element Cache
        this.elements = {};
        
        // Initialize
        document.addEventListener('DOMContentLoaded', () => this.init());
    }

    init() {
        this.cacheDOMElements();
        this.loadThemes();
        this.renderCategoryCards();
        this.bindEvents();
        this.bindKeyboardShortcuts();
        this.updateStatsDisplay();
    }

    cacheDOMElements() {
        this.elements = {
            // Screens
            startScreen: document.getElementById('start-screen'),
            quizScreen: document.getElementById('quiz-screen'),
            resultScreen: document.getElementById('result-screen'),
            customModal: document.getElementById('custom-modal'),
            reviewModal: document.getElementById('review-modal'),

            // Start Screen Controls
            categoryGrid: document.getElementById('category-grid'),
            diffButtons: document.querySelectorAll('.diff-btn'),
            countButtons: document.querySelectorAll('.count-btn'),
            modeCards: document.querySelectorAll('.mode-card'),
            startBtn: document.getElementById('btn-start-game'),
            openCustomBtn: document.getElementById('btn-open-custom'),
            soundToggleBtn: document.getElementById('btn-sound-toggle'),
            themeToggleBtn: document.getElementById('btn-theme-toggle'),

            // In-Quiz Elements
            hudCategory: document.getElementById('hud-category'),
            hudMode: document.getElementById('hud-mode'),
            hudProgress: document.getElementById('hud-progress'),
            hudProgressBar: document.getElementById('hud-progress-fill'),
            hudScore: document.getElementById('hud-score'),
            hudStreak: document.getElementById('hud-streak'),
            hudStreakBadge: document.getElementById('hud-streak-badge'),
            hudLives: document.getElementById('hud-lives'),
            timerContainer: document.getElementById('timer-container'),
            timerText: document.getElementById('timer-text'),
            timerProgressCircle: document.getElementById('timer-circle-progress'),

            // Question Card
            questionDiffBadge: document.getElementById('question-diff-badge'),
            questionText: document.getElementById('question-text'),
            codeSnippetContainer: document.getElementById('code-snippet-container'),
            codeSnippet: document.getElementById('code-snippet'),
            optionsGrid: document.getElementById('options-grid'),
            explanationBox: document.getElementById('explanation-box'),
            explanationText: document.getElementById('explanation-text'),
            nextBtn: document.getElementById('btn-next-question'),

            // Lifelines
            btnLifeline5050: document.getElementById('lifeline-5050'),
            btnLifelineTime: document.getElementById('lifeline-time'),
            btnLifelineSkip: document.getElementById('lifeline-skip'),

            // Results Elements
            resultCategoryName: document.getElementById('result-category-name'),
            resultScore: document.getElementById('result-score'),
            resultAccuracy: document.getElementById('result-accuracy'),
            resultStreak: document.getElementById('result-streak'),
            resultTime: document.getElementById('result-time'),
            resultTitleBadge: document.getElementById('result-title-badge'),
            resultCircularProgress: document.getElementById('result-circle-fill'),
            resultPercentText: document.getElementById('result-percent-text'),
            btnPlayAgain: document.getElementById('btn-play-again'),
            btnChangeCategory: document.getElementById('btn-change-category'),
            btnReviewAnswers: document.getElementById('btn-review-answers'),
            btnShareScore: document.getElementById('btn-share-score'),

            // Review Modal
            reviewList: document.getElementById('review-list'),
            btnCloseReview: document.getElementById('btn-close-review'),

            // Custom Quiz Modal
            btnCloseCustom: document.getElementById('btn-close-custom'),
            customQuizForm: document.getElementById('custom-quiz-form'),
            customQuestionList: document.getElementById('custom-question-list'),
            btnExportJson: document.getElementById('btn-export-json'),
            btnImportJson: document.getElementById('btn-import-json'),
            fileInputJson: document.getElementById('file-input-json'),
            btnAddQuestionToDraft: document.getElementById('btn-add-question-draft'),
            btnSaveQuiz: document.getElementById('btn-save-quiz')
        };
    }

    bindEvents() {
        // Category selection in Start Screen
        this.elements.diffButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.elements.diffButtons.forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                this.selectedDifficulty = e.currentTarget.dataset.diff;
                window.soundFX.playClick();
            });
        });

        this.elements.countButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.elements.countButtons.forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                this.questionCount = parseInt(e.currentTarget.dataset.count, 10);
                window.soundFX.playClick();
            });
        });

        this.elements.modeCards.forEach(card => {
            card.addEventListener('click', (e) => {
                this.elements.modeCards.forEach(c => c.classList.remove('active'));
                const target = e.currentTarget;
                target.classList.add('active');
                this.gameMode = target.dataset.mode;
                window.soundFX.playClick();
            });
        });

        // Start Quiz
        this.elements.startBtn.addEventListener('click', () => {
            window.soundFX.playClick();
            this.startQuiz();
        });

        // Sound Toggle
        this.elements.soundToggleBtn.addEventListener('click', () => {
            const isMuted = window.soundFX.toggleMute();
            this.updateSoundBtnUI(isMuted);
        });
        this.updateSoundBtnUI(window.soundFX.isMuted());

        // Theme Toggle (Switch to Dark Mode / Switch to Light Mode)
        if (this.elements.themeToggleBtn) {
            this.elements.themeToggleBtn.addEventListener('click', () => {
                window.soundFX.playClick();
                this.toggleTheme();
            });
        }

        // Next Question
        this.elements.nextBtn.addEventListener('click', () => {
            window.soundFX.playClick();
            this.handleNextQuestion();
        });

        // Lifelines
        this.elements.btnLifeline5050.addEventListener('click', () => this.useLifeline5050());
        this.elements.btnLifelineTime.addEventListener('click', () => this.useLifelineAddTime());
        this.elements.btnLifelineSkip.addEventListener('click', () => this.useLifelineSkip());

        // Results Actions
        this.elements.btnPlayAgain.addEventListener('click', () => {
            window.soundFX.playClick();
            this.startQuiz();
        });
        this.elements.btnChangeCategory.addEventListener('click', () => {
            window.soundFX.playClick();
            this.showScreen('startScreen');
        });
        this.elements.btnReviewAnswers.addEventListener('click', () => {
            window.soundFX.playClick();
            this.openReviewModal();
        });
        this.elements.btnCloseReview.addEventListener('click', () => {
            this.elements.reviewModal.classList.remove('active');
        });
        this.elements.btnShareScore.addEventListener('click', () => this.shareScore());

        // Custom Quiz Modal
        this.elements.openCustomBtn.addEventListener('click', () => {
            window.soundFX.playClick();
            this.openCustomModal();
        });
        this.elements.btnCloseCustom.addEventListener('click', () => {
            this.elements.customModal.classList.remove('active');
        });

        // Custom Quiz actions
        this.elements.btnAddQuestionToDraft.addEventListener('click', () => this.addQuestionToDraft());
        this.elements.btnSaveQuiz.addEventListener('click', (e) => {
            e.preventDefault();
            this.saveCustomQuiz();
        });
        this.elements.btnExportJson.addEventListener('click', () => this.exportQuizzesJSON());
        this.elements.btnImportJson.addEventListener('click', () => this.elements.fileInputJson.click());
        this.elements.fileInputJson.addEventListener('change', (e) => this.importQuizzesJSON(e));

        // Close modals on outside click
        window.addEventListener('click', (e) => {
            if (e.target === this.elements.customModal) {
                this.elements.customModal.classList.remove('active');
            }
            if (e.target === this.elements.reviewModal) {
                this.elements.reviewModal.classList.remove('active');
            }
        });
    }

    bindKeyboardShortcuts() {
        window.addEventListener('keydown', (e) => {
            if (this.elements.quizScreen.classList.contains('active')) {
                // Number keys 1-4 or A-D for options
                if (!this.isAnswered) {
                    const keyMap = { '1': 0, '2': 1, '3': 2, '4': 3, 'a': 0, 'b': 1, 'c': 2, 'd': 3 };
                    const choice = keyMap[e.key.toLowerCase()];
                    if (choice !== undefined) {
                        const optButtons = this.elements.optionsGrid.querySelectorAll('.option-btn:not([disabled])');
                        const targetBtn = Array.from(optButtons).find(btn => parseInt(btn.dataset.index, 10) === choice);
                        if (targetBtn) {
                            targetBtn.click();
                        }
                    }
                } else {
                    // Next question with Space or Enter
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        if (this.elements.nextBtn.style.display !== 'none') {
                            this.elements.nextBtn.click();
                        }
                    }
                }
            }
        });
    }

    updateSoundBtnUI(isMuted) {
        this.elements.soundToggleBtn.innerHTML = isMuted 
            ? '<span class="icon">🔇</span><span>Muted</span>' 
            : '<span class="icon">🔊</span><span>Sound On</span>';
        this.elements.soundToggleBtn.classList.toggle('muted', isMuted);
    }

    loadThemes() {
        const savedTheme = localStorage.getItem('quiz_theme') || 'cream';
        this.applyTheme(savedTheme);
    }

    applyTheme(theme) {
        document.body.dataset.theme = theme;
        localStorage.setItem('quiz_theme', theme);
        if (this.elements.themeToggleBtn) {
            this.elements.themeToggleBtn.textContent = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
        }
    }

    toggleTheme() {
        const currentTheme = document.body.dataset.theme === 'dark' ? 'dark' : 'cream';
        const newTheme = currentTheme === 'dark' ? 'cream' : 'dark';
        this.applyTheme(newTheme);
    }

    renderCategoryCards() {
        const grid = this.elements.categoryGrid;
        grid.innerHTML = '';

        // "All Categories" Card
        const allCard = document.createElement('div');
        allCard.className = `category-card ${this.selectedCategory === 'all' ? 'active' : ''}`;
        allCard.dataset.category = 'all';
        const totalCount = this.questions.length + this.getCustomQuestionsCount();
        allCard.innerHTML = `
            <div class="category-icon-wrapper" style="background: linear-gradient(135deg, #7c5cbf 0%, #906cd9 100%)">
                <span class="category-icon">🌟</span>
            </div>
            <div class="category-info">
                <h3>All Categories Mixed</h3>
                <p>Comprehensive ultimate challenge featuring every available topic.</p>
                <span class="category-badge">${totalCount} Questions</span>
            </div>
        `;
        allCard.addEventListener('click', () => this.selectCategory('all', allCard));
        grid.appendChild(allCard);

        // Preset Categories
        Object.values(PRESET_CATEGORIES).forEach(cat => {
            const count = this.questions.filter(q => q.category === cat.id).length;
            const card = document.createElement('div');
            card.className = `category-card ${this.selectedCategory === cat.id ? 'active' : ''}`;
            card.dataset.category = cat.id;
            card.innerHTML = `
                <div class="category-icon-wrapper" style="background: ${cat.gradient}">
                    <span class="category-icon">${cat.icon}</span>
                </div>
                <div class="category-info">
                    <h3>${cat.name}</h3>
                    <p>${cat.description}</p>
                    <span class="category-badge">${count} Questions</span>
                </div>
            `;
            card.addEventListener('click', () => this.selectCategory(cat.id, card));
            grid.appendChild(card);
        });

        // Custom Categories if any
        this.customQuizzes.forEach(custom => {
            const card = document.createElement('div');
            card.className = `category-card custom-category ${this.selectedCategory === custom.id ? 'active' : ''}`;
            card.dataset.category = custom.id;
            card.innerHTML = `
                <div class="category-icon-wrapper" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%)">
                    <span class="category-icon">${custom.icon || '✏️'}</span>
                </div>
                <div class="category-info">
                    <h3>${custom.name}</h3>
                    <p>${custom.description || 'Custom player-created quiz collection.'}</p>
                    <span class="category-badge">${custom.questions.length} Questions</span>
                </div>
                <button class="btn-delete-custom" title="Delete custom quiz" data-id="${custom.id}">🗑️</button>
            `;
            card.addEventListener('click', (e) => {
                if (e.target.classList.contains('btn-delete-custom')) {
                    e.stopPropagation();
                    this.deleteCustomQuiz(custom.id);
                    return;
                }
                this.selectCategory(custom.id, card);
            });
            grid.appendChild(card);
        });
    }

    selectCategory(catId, cardEl) {
        window.soundFX.playClick();
        this.selectedCategory = catId;
        document.querySelectorAll('.category-card').forEach(c => c.classList.remove('active'));
        cardEl.classList.add('active');
    }

    // Prepare questions for a fresh game
    startQuiz() {
        let pool = [];

        // Pool questions based on category
        if (this.selectedCategory === 'all') {
            pool = [...this.questions];
            this.customQuizzes.forEach(c => pool.push(...c.questions));
        } else {
            const customMatch = this.customQuizzes.find(c => c.id === this.selectedCategory);
            if (customMatch) {
                pool = [...customMatch.questions];
            } else {
                pool = this.questions.filter(q => q.category === this.selectedCategory);
            }
        }

        // Filter by difficulty if not 'all'
        if (this.selectedDifficulty !== 'all') {
            const diffFiltered = pool.filter(q => q.difficulty === this.selectedDifficulty);
            if (diffFiltered.length > 0) {
                pool = diffFiltered;
            }
        }

        if (pool.length === 0) {
            alert('No questions found for the chosen criteria. Please select another category.');
            return;
        }

        // Shuffle pool (Fisher-Yates)
        this.quizQueue = this.shuffleArray([...pool]);

        // Limit question count unless survival mode or count exceeds pool
        if (this.gameMode !== 'survival' && this.questionCount < this.quizQueue.length) {
            this.quizQueue = this.quizQueue.slice(0, this.questionCount);
        }

        // Reset game state
        this.currentIndex = 0;
        this.score = 0;
        this.streak = 0;
        this.bestStreak = 0;
        this.lives = 3;
        this.userAnswers = [];
        this.gameStartTime = Date.now();
        this.lifelines = { fiftyFifty: true, addTime: true, skip: true };

        // Setup Mode UI
        this.setupModeHUD();
        this.updateLifelinesUI();

        // Switch to Quiz screen
        this.showScreen('quizScreen');

        // Render first question
        this.renderQuestion();
    }

    setupModeHUD() {
        const catObj = PRESET_CATEGORIES[this.selectedCategory] || { name: this.selectedCategory === 'all' ? 'All Mixed' : 'Custom Quiz' };
        this.elements.hudCategory.textContent = catObj.name;

        const modeNames = {
            classic: '⏱️ Classic Mode',
            blitz: '⚡ Blitz Speedrun',
            survival: '💖 Survival Mode',
            zen: '🧘 Zen Practice'
        };
        this.elements.hudMode.textContent = modeNames[this.gameMode] || 'Classic';

        // Timer visibility
        if (this.gameMode === 'zen') {
            this.elements.timerContainer.style.display = 'none';
        } else {
            this.elements.timerContainer.style.display = 'flex';
        }

        // Survival lives display
        if (this.gameMode === 'survival') {
            this.elements.hudLives.style.display = 'flex';
            this.updateLivesDisplay();
        } else {
            this.elements.hudLives.style.display = 'none';
        }

        this.updateHUDScore();
    }

    updateLivesDisplay() {
        let hearts = '';
        for (let i = 0; i < 3; i++) {
            hearts += i < this.lives ? '❤️ ' : '🖤 ';
        }
        this.elements.hudLives.innerHTML = `<span>Lives:</span> <span class="hearts">${hearts}</span>`;
    }

    updateHUDScore() {
        this.elements.hudScore.textContent = this.score.toLocaleString();
        this.elements.hudStreak.textContent = `Streak: ${this.streak}`;
        
        if (this.streak >= 3) {
            this.elements.hudStreakBadge.style.display = 'inline-flex';
            this.elements.hudStreakBadge.textContent = `${this.streak}x Combo 🔥`;
        } else {
            this.elements.hudStreakBadge.style.display = 'none';
        }
    }

    renderQuestion() {
        this.isAnswered = false;
        clearInterval(this.timer);

        const currentQ = this.quizQueue[this.currentIndex];
        const total = this.quizQueue.length;

        // Progress bar
        const progressPercent = ((this.currentIndex + 1) / total) * 100;
        this.elements.hudProgress.textContent = `Question ${this.currentIndex + 1} of ${total}`;
        this.elements.hudProgressBar.style.width = `${progressPercent}%`;

        // Difficulty Badge
        const diffColors = {
            easy: 'badge-easy',
            medium: 'badge-medium',
            hard: 'badge-hard'
        };
        this.elements.questionDiffBadge.className = `diff-badge ${diffColors[currentQ.difficulty] || 'badge-easy'}`;
        this.elements.questionDiffBadge.textContent = (currentQ.difficulty || 'Normal').toUpperCase();

        // Question Title
        this.elements.questionText.textContent = currentQ.question;

        // Code Snippet (if any)
        if (currentQ.code && currentQ.code.trim()) {
            this.elements.codeSnippetContainer.style.display = 'block';
            this.elements.codeSnippet.textContent = currentQ.code;
        } else {
            this.elements.codeSnippetContainer.style.display = 'none';
            this.elements.codeSnippet.textContent = '';
        }

        // Render Options Grid
        this.renderOptions(currentQ);

        // Hide Explanation & Next button initially
        this.elements.explanationBox.classList.remove('active');
        this.elements.nextBtn.style.display = 'none';

        // Start Timer based on mode
        if (this.gameMode !== 'zen') {
            this.startTimer();
        }
    }

    renderOptions(currentQ) {
        const grid = this.elements.optionsGrid;
        grid.innerHTML = '';
        const optionLetters = ['A', 'B', 'C', 'D'];

        currentQ.options.forEach((optText, idx) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.dataset.index = idx;
            btn.innerHTML = `
                <span class="option-letter">${optionLetters[idx]}</span>
                <span class="option-text">${this.escapeHTML(optText)}</span>
                <span class="option-indicator"></span>
            `;
            btn.addEventListener('click', () => this.handleAnswer(idx, btn));
            grid.appendChild(btn);
        });
    }

    startTimer() {
        if (this.gameMode === 'blitz') {
            this.maxTime = 8;
        } else {
            this.maxTime = 15;
        }
        this.timeLeft = this.maxTime;
        this.updateTimerDisplay();

        const circumference = 2 * Math.PI * 22; // r = 22
        this.elements.timerProgressCircle.style.strokeDasharray = `${circumference}`;

        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();

            if (this.timeLeft <= 3 && this.timeLeft > 0) {
                window.soundFX.playTick(true);
            } else if (this.timeLeft > 0) {
                window.soundFX.playTick(false);
            }

            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                this.handleTimeout();
            }
        }, 1000);
    }

    updateTimerDisplay() {
        this.elements.timerText.textContent = `${this.timeLeft}s`;

        const circumference = 2 * Math.PI * 22;
        const offset = circumference - (this.timeLeft / this.maxTime) * circumference;
        this.elements.timerProgressCircle.style.strokeDashoffset = offset;

        if (this.timeLeft <= 4) {
            this.elements.timerContainer.classList.add('urgent');
        } else {
            this.elements.timerContainer.classList.remove('urgent');
        }
    }

    handleAnswer(selectedIndex, selectedBtn) {
        if (this.isAnswered) return;
        this.isAnswered = true;
        clearInterval(this.timer);

        const currentQ = this.quizQueue[this.currentIndex];
        const isCorrect = selectedIndex === currentQ.answer;
        const timeTaken = this.maxTime - this.timeLeft;

        // Disable all option buttons
        const allOptionBtns = this.elements.optionsGrid.querySelectorAll('.option-btn');
        allOptionBtns.forEach(b => b.disabled = true);

        // Highlight selected
        if (isCorrect) {
            selectedBtn.classList.add('correct');
            window.soundFX.playCorrect();

            // Calculate points
            const basePoints = { easy: 100, medium: 200, hard: 300 }[currentQ.difficulty] || 150;
            const timeBonus = this.gameMode === 'zen' ? 0 : Math.round((this.timeLeft / this.maxTime) * 100);
            
            // Streak multiplier
            this.streak++;
            if (this.streak > this.bestStreak) this.bestStreak = this.streak;

            let multiplier = 1;
            if (this.streak >= 4) multiplier = 2.0;
            else if (this.streak >= 3) multiplier = 1.5;
            else if (this.streak >= 2) multiplier = 1.2;

            if (this.gameMode === 'blitz') multiplier *= 1.5;

            const totalAdded = Math.round((basePoints + timeBonus) * multiplier);
            this.score += totalAdded;

            // Trigger streak sounds & confetti burst
            if (this.streak % 3 === 0) {
                window.soundFX.playStreak();
                window.confettiEngine.burst(window.innerWidth / 2, window.innerHeight * 0.4, 45);
            }
        } else {
            selectedBtn.classList.add('incorrect');
            window.soundFX.playIncorrect();

            // Reveal correct answer
            const correctBtn = Array.from(allOptionBtns).find(b => parseInt(b.dataset.index, 10) === currentQ.answer);
            if (correctBtn) correctBtn.classList.add('reveal-correct');

            // Break streak
            this.streak = 0;

            // Survival mode hearts deduction
            if (this.gameMode === 'survival') {
                this.lives--;
                this.updateLivesDisplay();
            }
        }

        // Record response for review
        this.userAnswers.push({
            question: currentQ.question,
            code: currentQ.code,
            options: currentQ.options,
            selectedIndex: selectedIndex,
            correctIndex: currentQ.answer,
            isCorrect: isCorrect,
            timeTaken: timeTaken,
            explanation: currentQ.explanation
        });

        this.updateHUDScore();

        // Show Explanation
        if (currentQ.explanation) {
            this.elements.explanationText.textContent = currentQ.explanation;
            this.elements.explanationBox.classList.add('active');
        }

        // Check if Survival game over
        if (this.gameMode === 'survival' && this.lives <= 0) {
            setTimeout(() => this.endGame('survival_lost'), 1200);
            return;
        }

        // Show Next button
        this.elements.nextBtn.style.display = 'inline-flex';
        this.elements.nextBtn.focus();
    }

    handleTimeout() {
        if (this.isAnswered) return;
        this.isAnswered = true;

        const currentQ = this.quizQueue[this.currentIndex];
        window.soundFX.playIncorrect();

        const allOptionBtns = this.elements.optionsGrid.querySelectorAll('.option-btn');
        allOptionBtns.forEach(b => b.disabled = true);

        // Highlight correct option
        const correctBtn = Array.from(allOptionBtns).find(b => parseInt(b.dataset.index, 10) === currentQ.answer);
        if (correctBtn) correctBtn.classList.add('reveal-correct');

        this.streak = 0;
        if (this.gameMode === 'survival') {
            this.lives--;
            this.updateLivesDisplay();
        }

        this.userAnswers.push({
            question: currentQ.question,
            code: currentQ.code,
            options: currentQ.options,
            selectedIndex: -1, // Timed out
            correctIndex: currentQ.answer,
            isCorrect: false,
            timeTaken: this.maxTime,
            explanation: currentQ.explanation
        });

        this.updateHUDScore();

        if (currentQ.explanation) {
            this.elements.explanationText.textContent = currentQ.explanation;
            this.elements.explanationBox.classList.add('active');
        }

        if (this.gameMode === 'survival' && this.lives <= 0) {
            setTimeout(() => this.endGame('survival_lost'), 1200);
            return;
        }

        this.elements.nextBtn.style.display = 'inline-flex';
    }

    handleNextQuestion() {
        this.currentIndex++;
        if (this.currentIndex < this.quizQueue.length) {
            this.renderQuestion();
        } else {
            this.endGame('completed');
        }
    }

    // --- Lifelines ---
    useLifeline5050() {
        if (!this.lifelines.fiftyFifty || this.isAnswered) return;
        this.lifelines.fiftyFifty = false;
        this.elements.btnLifeline5050.disabled = true;
        this.elements.btnLifeline5050.classList.add('used');
        window.soundFX.playLifeline();

        const currentQ = this.quizQueue[this.currentIndex];
        const correctIdx = currentQ.answer;

        const incorrectIndices = [0, 1, 2, 3].filter(i => i !== correctIdx);
        const shuffledIncorrect = this.shuffleArray(incorrectIndices);
        const toEliminate = shuffledIncorrect.slice(0, 2);

        const allOptionBtns = this.elements.optionsGrid.querySelectorAll('.option-btn');
        allOptionBtns.forEach(btn => {
            const idx = parseInt(btn.dataset.index, 10);
            if (toEliminate.includes(idx)) {
                btn.style.opacity = '0.2';
                btn.style.pointerEvents = 'none';
                btn.classList.add('eliminated');
            }
        });
    }

    useLifelineAddTime() {
        if (!this.lifelines.addTime || this.isAnswered || this.gameMode === 'zen') return;
        this.lifelines.addTime = false;
        this.elements.btnLifelineTime.disabled = true;
        this.elements.btnLifelineTime.classList.add('used');
        window.soundFX.playLifeline();

        this.timeLeft += 15;
        this.updateTimerDisplay();
    }

    useLifelineSkip() {
        if (!this.lifelines.skip || this.isAnswered) return;
        this.lifelines.skip = false;
        this.elements.btnLifelineSkip.disabled = true;
        this.elements.btnLifelineSkip.classList.add('used');
        window.soundFX.playLifeline();

        clearInterval(this.timer);
        this.handleNextQuestion();
    }

    updateLifelinesUI() {
        this.elements.btnLifeline5050.disabled = !this.lifelines.fiftyFifty;
        this.elements.btnLifeline5050.classList.toggle('used', !this.lifelines.fiftyFifty);

        this.elements.btnLifelineTime.disabled = !this.lifelines.addTime || this.gameMode === 'zen';
        this.elements.btnLifelineTime.classList.toggle('used', !this.lifelines.addTime);

        this.elements.btnLifelineSkip.disabled = !this.lifelines.skip;
        this.elements.btnLifelineSkip.classList.toggle('used', !this.lifelines.skip);
    }

    // --- End Game & Results ---
    endGame(reason = 'completed') {
        clearInterval(this.timer);
        this.showScreen('resultScreen');

        const totalAnswered = this.userAnswers.length;
        const totalCorrect = this.userAnswers.filter(a => a.isCorrect).length;
        const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
        const totalTimeSeconds = Math.round((Date.now() - this.gameStartTime) / 1000);

        // Category name
        const catObj = PRESET_CATEGORIES[this.selectedCategory] || { name: 'Custom Quiz' };
        this.elements.resultCategoryName.textContent = this.selectedCategory === 'all' ? 'All Mixed Categories' : catObj.name;

        this.elements.resultScore.textContent = this.score.toLocaleString();
        this.elements.resultAccuracy.textContent = `${accuracy}% (${totalCorrect}/${totalAnswered})`;
        this.elements.resultStreak.textContent = `${this.bestStreak}x`;
        this.elements.resultTime.textContent = `${Math.floor(totalTimeSeconds / 60)}m ${totalTimeSeconds % 60}s`;

        // Rank Badge
        let title = 'Quiz Apprentice 🥉';
        if (accuracy === 100 && totalAnswered >= 5) title = 'Grandmaster Genius 👑';
        else if (accuracy >= 80) title = 'Tech Wizard 🌟';
        else if (accuracy >= 60) title = 'Knowledge Pioneer 🚀';
        else if (accuracy >= 40) title = 'Curious Explorer 🧭';
        this.elements.resultTitleBadge.textContent = title;

        // Circular SVG animation
        const circumference = 2 * Math.PI * 68; // r=68
        const offset = circumference - (accuracy / 100) * circumference;
        this.elements.resultCircularProgress.style.strokeDasharray = `${circumference}`;
        this.elements.resultCircularProgress.style.strokeDashoffset = `${circumference}`;
        
        setTimeout(() => {
            this.elements.resultCircularProgress.style.strokeDashoffset = `${offset}`;
        }, 150);

        // Animated counter
        this.animateCounter(this.elements.resultPercentText, 0, accuracy, 1200, '%');

        // Sounds and Celebrations
        if (accuracy >= 60) {
            window.soundFX.playFanfare();
            window.confettiEngine.celebrateVictory();
        } else {
            window.soundFX.playCorrect();
        }

        // Save Highscore & History
        this.saveGameRecord(accuracy, totalCorrect, totalAnswered);
    }

    animateCounter(el, start, end, duration, suffix = '') {
        let startTime = null;
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const current = Math.floor(progress * (end - start) + start);
            el.textContent = `${current}${suffix}`;
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        requestAnimationFrame(step);
    }

    saveGameRecord(accuracy, totalCorrect, totalAnswered) {
        try {
            const records = JSON.parse(localStorage.getItem('quiz_history') || '[]');
            records.unshift({
                date: new Date().toLocaleDateString(),
                category: this.selectedCategory,
                mode: this.gameMode,
                score: this.score,
                accuracy: accuracy,
                correct: totalCorrect,
                total: totalAnswered
            });
            // Keep top 20
            localStorage.setItem('quiz_history', JSON.stringify(records.slice(0, 20)));
            this.updateStatsDisplay();
        } catch (e) {
            console.error('Failed to save score record', e);
        }
    }

    updateStatsDisplay() {
        try {
            const records = JSON.parse(localStorage.getItem('quiz_history') || '[]');
            const highestScore = records.reduce((max, r) => Math.max(max, r.score || 0), 0);
            const totalGames = records.length;
            
            const bestScoreEl = document.getElementById('stat-best-score');
            const totalGamesEl = document.getElementById('stat-total-games');
            if (bestScoreEl) bestScoreEl.textContent = highestScore.toLocaleString();
            if (totalGamesEl) totalGamesEl.textContent = totalGames;
        } catch (e) {
            console.error(e);
        }
    }

    shareScore() {
        const text = `🏆 I scored ${this.score.toLocaleString()} points (${this.elements.resultAccuracy.textContent} accuracy) on QuizMaster Pro in ${this.elements.resultCategoryName.textContent}! Can you beat my score? 🚀`;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                alert('Copied your score card to clipboard! You can paste and share it anywhere.');
            });
        } else {
            prompt('Copy your score message:', text);
        }
    }

    openReviewModal() {
        const list = this.elements.reviewList;
        list.innerHTML = '';

        this.userAnswers.forEach((ans, idx) => {
            const item = document.createElement('div');
            item.className = `review-item ${ans.isCorrect ? 'review-correct' : 'review-incorrect'}`;
            const letters = ['A', 'B', 'C', 'D'];
            const userChoiceText = ans.selectedIndex >= 0 ? `${letters[ans.selectedIndex]}: ${ans.options[ans.selectedIndex]}` : 'Timed Out / Skipped';
            const correctChoiceText = `${letters[ans.correctIndex]}: ${ans.options[ans.correctIndex]}`;

            item.innerHTML = `
                <div class="review-header">
                    <span class="review-status-icon">${ans.isCorrect ? '✅' : '❌'}</span>
                    <h4>Question ${idx + 1}: ${this.escapeHTML(ans.question)}</h4>
                </div>
                ${ans.code ? `<pre class="review-code"><code>${this.escapeHTML(ans.code)}</code></pre>` : ''}
                <div class="review-answers-grid">
                    <div class="review-answer-col ${ans.isCorrect ? 'col-correct' : 'col-wrong'}">
                        <strong>Your Answer:</strong> ${this.escapeHTML(userChoiceText)}
                    </div>
                    <div class="review-answer-col col-correct">
                        <strong>Correct Answer:</strong> ${this.escapeHTML(correctChoiceText)}
                    </div>
                </div>
                ${ans.explanation ? `<div class="review-explanation"><strong>💡 Why:</strong> ${this.escapeHTML(ans.explanation)}</div>` : ''}
            `;
            list.appendChild(item);
        });

        this.elements.reviewModal.classList.add('active');
    }

    // --- Custom Quiz Management ---
    loadCustomQuizzes() {
        try {
            return JSON.parse(localStorage.getItem('quiz_custom_quizzes') || '[]');
        } catch (e) {
            return [];
        }
    }

    getCustomQuestionsCount() {
        return this.customQuizzes.reduce((sum, q) => sum + (q.questions ? q.questions.length : 0), 0);
    }

    openCustomModal() {
        this.draftQuestions = [];
        this.renderDraftQuestions();
        this.elements.customModal.classList.add('active');
    }

    addQuestionToDraft() {
        const qTitle = document.getElementById('draft-question-title').value.trim();
        const qCode = document.getElementById('draft-question-code').value.trim();
        const optA = document.getElementById('draft-opt-0').value.trim();
        const optB = document.getElementById('draft-opt-1').value.trim();
        const optC = document.getElementById('draft-opt-2').value.trim();
        const optD = document.getElementById('draft-opt-3').value.trim();
        const correctIdx = parseInt(document.querySelector('input[name="draft-correct"]:checked').value, 10);
        const explanation = document.getElementById('draft-explanation').value.trim();
        const difficulty = document.getElementById('draft-difficulty').value;

        if (!qTitle || !optA || !optB || !optC || !optD) {
            alert('Please fill out the question title and all 4 options!');
            return;
        }

        const newQ = {
            id: 'custom-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
            category: 'custom',
            difficulty: difficulty,
            question: qTitle,
            code: qCode || null,
            options: [optA, optB, optC, optD],
            answer: correctIdx,
            explanation: explanation
        };

        if (!this.draftQuestions) this.draftQuestions = [];
        this.draftQuestions.push(newQ);
        this.renderDraftQuestions();

        // Clear input fields
        document.getElementById('draft-question-title').value = '';
        document.getElementById('draft-question-code').value = '';
        document.getElementById('draft-opt-0').value = '';
        document.getElementById('draft-opt-1').value = '';
        document.getElementById('draft-opt-2').value = '';
        document.getElementById('draft-opt-3').value = '';
        document.getElementById('draft-explanation').value = '';

        window.soundFX.playClick();
    }

    renderDraftQuestions() {
        const list = this.elements.customQuestionList;
        list.innerHTML = '';

        if (!this.draftQuestions || this.draftQuestions.length === 0) {
            list.innerHTML = '<div class="empty-draft">No questions added yet. Use the form above to add your first question!</div>';
            return;
        }

        this.draftQuestions.forEach((q, idx) => {
            const card = document.createElement('div');
            card.className = 'draft-item-card';
            card.innerHTML = `
                <div class="draft-item-info">
                    <strong>#${idx + 1}: ${this.escapeHTML(q.question)}</strong>
                    <span>Correct: Option ${['A', 'B', 'C', 'D'][q.answer]} | ${q.difficulty.toUpperCase()}</span>
                </div>
                <button type="button" class="btn-remove-draft" data-idx="${idx}">✕</button>
            `;
            card.querySelector('.btn-remove-draft').addEventListener('click', () => {
                this.draftQuestions.splice(idx, 1);
                this.renderDraftQuestions();
            });
            list.appendChild(card);
        });
    }

    saveCustomQuiz() {
        const quizName = document.getElementById('custom-quiz-name').value.trim();
        const quizDesc = document.getElementById('custom-quiz-desc').value.trim();
        const quizIcon = document.getElementById('custom-quiz-icon').value.trim() || '✏️';

        if (!quizName) {
            alert('Please give your custom quiz a title.');
            return;
        }

        if (!this.draftQuestions || this.draftQuestions.length === 0) {
            alert('Please add at least one question to your quiz.');
            return;
        }

        const customId = 'quiz-' + Date.now();
        const newQuiz = {
            id: customId,
            name: quizName,
            description: quizDesc,
            icon: quizIcon,
            questions: this.draftQuestions.map(q => ({ ...q, category: customId }))
        };

        this.customQuizzes.push(newQuiz);
        localStorage.setItem('quiz_custom_quizzes', JSON.stringify(this.customQuizzes));

        // Reset and close
        this.draftQuestions = [];
        document.getElementById('custom-quiz-name').value = '';
        document.getElementById('custom-quiz-desc').value = '';
        this.elements.customModal.classList.remove('active');

        this.renderCategoryCards();
        window.soundFX.playCorrect();
        alert(`Quiz "${quizName}" created successfully!`);
    }

    deleteCustomQuiz(quizId) {
        if (!confirm('Are you sure you want to delete this custom quiz?')) return;
        this.customQuizzes = this.customQuizzes.filter(q => q.id !== quizId);
        localStorage.setItem('quiz_custom_quizzes', JSON.stringify(this.customQuizzes));
        if (this.selectedCategory === quizId) {
            this.selectedCategory = 'all';
        }
        this.renderCategoryCards();
    }

    exportQuizzesJSON() {
        const exportData = {
            version: '1.0',
            exportedAt: new Date().toISOString(),
            quizzes: this.customQuizzes
        };
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `quizmaster_custom_quizzes_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    importQuizzesJSON(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.quizzes && Array.isArray(data.quizzes)) {
                    this.customQuizzes.push(...data.quizzes);
                    localStorage.setItem('quiz_custom_quizzes', JSON.stringify(this.customQuizzes));
                    this.renderCategoryCards();
                    alert(`Imported ${data.quizzes.length} custom quiz(zes) successfully!`);
                } else if (Array.isArray(data)) {
                    this.customQuizzes.push(...data);
                    localStorage.setItem('quiz_custom_quizzes', JSON.stringify(this.customQuizzes));
                    this.renderCategoryCards();
                    alert('Imported custom quizzes successfully!');
                } else {
                    alert('Invalid JSON structure. Expected a "quizzes" array.');
                }
            } catch (err) {
                alert('Failed to parse JSON file: ' + err.message);
            }
        };
        reader.readAsText(file);
    }

    // --- Helpers ---
    showScreen(screenKey) {
        ['startScreen', 'quizScreen', 'resultScreen'].forEach(key => {
            if (this.elements[key]) {
                this.elements[key].classList.remove('active');
            }
        });
        if (this.elements[screenKey]) {
            this.elements[screenKey].classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    escapeHTML(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
}

// Instantiate and attach app
window.quizApp = new QuizApp();
