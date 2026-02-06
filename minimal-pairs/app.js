/**
 * German Grammar Minimal Pairs App
 * Spaced repetition quiz for B2/C1 German learners
 */

(function() {
    'use strict';

    // ==================== Configuration ====================
    const CONFIG = {
        categories: [
            'wechselpraepositionen',
            'dativ-verben',
            'kasus',
            'kommasetzung',
            'wortstellung',
            'adjektivendungen',
            'konjunktiv-ii',
            'vergleiche',
            'passiv',
            'relativpronomen'
        ],
        leitnerBoxes: 5,
        // Review intervals in sessions (box 1 = every session, box 5 = every 16 sessions)
        reviewIntervals: [1, 2, 4, 8, 16],
        storageKey: 'minimalPairs_v1'
    };

    // ==================== State ====================
    let state = {
        items: [],                    // All loaded items
        currentItem: null,            // Current quiz item
        currentOptions: [],           // [correctIndex, incorrectIndex] shuffled
        answered: false,              // Has current question been answered
        sessionNumber: 1,             // Current session number
        stats: {
            totalCorrect: 0,
            totalAnswered: 0,
            streak: 0,
            maxStreak: 0,
            categoryStats: {}         // { category: { correct: n, total: n } }
        },
        leitner: {},                  // { itemId: { box: 1-5, lastReview: sessionNumber } }
        activeCategories: new Set(CONFIG.categories),
        sessionQueue: [],             // Items to review this session
        sessionAnswered: new Set()    // Items answered this session
    };

    // ==================== DOM Elements ====================
    const elements = {};

    function cacheElements() {
        elements.loading = document.getElementById('loading');
        elements.quizView = document.getElementById('quizView');
        elements.emptyState = document.getElementById('emptyState');
        elements.completionState = document.getElementById('completionState');
        elements.menuPanel = document.getElementById('menuPanel');

        elements.categoryLabel = document.getElementById('categoryLabel');
        elements.optionA = document.getElementById('optionA');
        elements.optionB = document.getElementById('optionB');
        elements.feedback = document.getElementById('feedback');
        elements.feedbackIcon = document.getElementById('feedbackIcon');
        elements.feedbackText = document.getElementById('feedbackText');
        elements.explanation = document.getElementById('explanation');
        elements.nextBtn = document.getElementById('nextBtn');

        elements.progressFill = document.getElementById('progressFill');
        elements.menuBtn = document.getElementById('menuBtn');
        elements.closeMenuBtn = document.getElementById('closeMenuBtn');

        elements.totalCorrect = document.getElementById('totalCorrect');
        elements.totalAnswered = document.getElementById('totalAnswered');
        elements.accuracy = document.getElementById('accuracy');
        elements.streak = document.getElementById('streak');

        elements.categoryFilters = document.getElementById('categoryFilters');
        elements.resetBtn = document.getElementById('resetBtn');
        elements.openCategoriesBtn = document.getElementById('openCategoriesBtn');
        elements.reviewBtn = document.getElementById('reviewBtn');
        elements.completionStats = document.getElementById('completionStats');
    }

    // ==================== Data Loading ====================
    async function loadData() {
        const items = [];

        for (const category of CONFIG.categories) {
            try {
                const response = await fetch(`data/${category}.json`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.items && Array.isArray(data.items)) {
                        data.items.forEach(item => {
                            item.category = category;
                            items.push(item);
                        });
                    }
                }
            } catch (e) {
                console.warn(`Failed to load ${category}:`, e);
            }
        }

        return items;
    }

    // ==================== Storage ====================
    function saveState() {
        const toSave = {
            stats: state.stats,
            leitner: state.leitner,
            activeCategories: Array.from(state.activeCategories),
            sessionNumber: state.sessionNumber
        };
        try {
            localStorage.setItem(CONFIG.storageKey, JSON.stringify(toSave));
        } catch (e) {
            console.warn('Failed to save state:', e);
        }
    }

    function loadState() {
        try {
            const saved = localStorage.getItem(CONFIG.storageKey);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.stats) state.stats = parsed.stats;
                if (parsed.leitner) state.leitner = parsed.leitner;
                if (parsed.activeCategories) {
                    state.activeCategories = new Set(parsed.activeCategories);
                }
                if (parsed.sessionNumber) {
                    state.sessionNumber = parsed.sessionNumber;
                }
            }
        } catch (e) {
            console.warn('Failed to load state:', e);
        }
    }

    function resetProgress() {
        if (!confirm('Möchtest du wirklich deinen gesamten Fortschritt zurücksetzen?')) {
            return;
        }
        state.stats = {
            totalCorrect: 0,
            totalAnswered: 0,
            streak: 0,
            maxStreak: 0,
            categoryStats: {}
        };
        state.leitner = {};
        state.sessionNumber = 1;
        state.sessionAnswered.clear();
        saveState();
        updateStatsDisplay();
        updateLeitnerDisplay();
        buildSessionQueue();
        showNextQuestion();
    }

    // ==================== Leitner System ====================
    function getLeitnerData(itemId) {
        if (!state.leitner[itemId]) {
            state.leitner[itemId] = { box: 1, lastReview: 0 };
        }
        return state.leitner[itemId];
    }

    function shouldReviewItem(itemId) {
        const data = getLeitnerData(itemId);
        const interval = CONFIG.reviewIntervals[data.box - 1];
        const sessionsSinceReview = state.sessionNumber - data.lastReview;
        return sessionsSinceReview >= interval;
    }

    function promoteItem(itemId) {
        const data = getLeitnerData(itemId);
        if (data.box < CONFIG.leitnerBoxes) {
            data.box++;
        }
        data.lastReview = state.sessionNumber;
        saveState();
    }

    function demoteItem(itemId) {
        const data = getLeitnerData(itemId);
        data.box = 1;
        data.lastReview = state.sessionNumber;
        saveState();
    }

    function buildSessionQueue() {
        // Get items from active categories
        const activeItems = state.items.filter(item =>
            state.activeCategories.has(item.category)
        );

        // Separate items by review status
        const dueForReview = [];
        const newItems = [];

        activeItems.forEach(item => {
            if (state.sessionAnswered.has(item.id)) return;

            const data = getLeitnerData(item.id);
            if (data.lastReview === 0) {
                // Never seen before
                newItems.push(item);
            } else if (shouldReviewItem(item.id)) {
                dueForReview.push(item);
            }
        });

        // Sort due items by box (lower boxes first = need more practice)
        dueForReview.sort((a, b) => {
            const boxA = getLeitnerData(a.id).box;
            const boxB = getLeitnerData(b.id).box;
            return boxA - boxB;
        });

        // Shuffle new items
        shuffleArray(newItems);

        // Interleave: prioritize review items, then introduce new ones
        state.sessionQueue = [...dueForReview, ...newItems];
    }

    function getNextItem() {
        while (state.sessionQueue.length > 0) {
            const item = state.sessionQueue.shift();
            if (!state.sessionAnswered.has(item.id)) {
                return item;
            }
        }
        return null;
    }

    // ==================== Quiz Logic ====================
    function showNextQuestion() {
        state.answered = false;
        elements.feedback.classList.add('hidden');
        elements.feedback.classList.remove('correct', 'incorrect');

        elements.optionA.classList.remove('correct', 'incorrect', 'disabled', 'selected');
        elements.optionB.classList.remove('correct', 'incorrect', 'disabled', 'selected');

        const item = getNextItem();

        if (!item) {
            // Check if any categories are active
            if (state.activeCategories.size === 0) {
                showEmptyState();
            } else {
                showCompletionState();
            }
            return;
        }

        state.currentItem = item;

        // Randomly assign correct/incorrect to A/B
        const correctFirst = Math.random() < 0.5;
        state.currentOptions = correctFirst ? [0, 1] : [1, 0];

        const correctText = highlightDifference(item.correct, item.highlight);
        const incorrectText = highlightDifference(item.incorrect, item.highlight);

        if (correctFirst) {
            elements.optionA.innerHTML = correctText;
            elements.optionB.innerHTML = incorrectText;
        } else {
            elements.optionA.innerHTML = incorrectText;
            elements.optionB.innerHTML = correctText;
        }

        // Update category label
        elements.categoryLabel.textContent = getCategoryDisplayName(item.category);

        // Show quiz view
        elements.quizView.classList.remove('hidden');
        elements.emptyState.classList.add('hidden');
        elements.completionState.classList.add('hidden');

        updateProgressBar();
    }

    function highlightDifference(text, highlights) {
        if (!highlights || highlights.length === 0) return escapeHtml(text);

        let result = escapeHtml(text);
        highlights.forEach(h => {
            const escaped = escapeHtml(h);
            const regex = new RegExp(`(${escapeRegex(escaped)})`, 'g');
            result = result.replace(regex, '<span class="highlight">$1</span>');
        });
        return result;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function handleAnswer(selectedIndex) {
        if (state.answered || !state.currentItem) return;
        state.answered = true;

        const item = state.currentItem;
        const correctIndex = state.currentOptions[0] === 0 ? 0 : 1;
        const isCorrect = selectedIndex === correctIndex;

        // Mark as answered this session
        state.sessionAnswered.add(item.id);

        // Update stats
        state.stats.totalAnswered++;
        if (isCorrect) {
            state.stats.totalCorrect++;
            state.stats.streak++;
            if (state.stats.streak > state.stats.maxStreak) {
                state.stats.maxStreak = state.stats.streak;
            }
            promoteItem(item.id);
        } else {
            state.stats.streak = 0;
            demoteItem(item.id);
        }

        // Update category stats
        if (!state.stats.categoryStats[item.category]) {
            state.stats.categoryStats[item.category] = { correct: 0, total: 0 };
        }
        state.stats.categoryStats[item.category].total++;
        if (isCorrect) {
            state.stats.categoryStats[item.category].correct++;
        }

        saveState();

        // Update UI
        const selectedElement = selectedIndex === 0 ? elements.optionA : elements.optionB;
        const correctElement = correctIndex === 0 ? elements.optionA : elements.optionB;

        selectedElement.classList.add('selected');

        if (isCorrect) {
            selectedElement.classList.add('correct');
        } else {
            selectedElement.classList.add('incorrect');
            correctElement.classList.add('correct');
        }

        elements.optionA.classList.add('disabled');
        elements.optionB.classList.add('disabled');

        // Show feedback
        elements.feedback.classList.remove('hidden');
        elements.feedback.classList.add(isCorrect ? 'correct' : 'incorrect');
        elements.feedbackIcon.textContent = isCorrect ? '✓' : '✗';
        elements.feedbackText.textContent = isCorrect ? 'Richtig!' : 'Falsch';
        elements.explanation.textContent = item.explanation;

        updateStatsDisplay();
        updateLeitnerDisplay();
        updateProgressBar();
    }

    // ==================== UI Updates ====================
    function updateStatsDisplay() {
        elements.totalCorrect.textContent = state.stats.totalCorrect;
        elements.totalAnswered.textContent = state.stats.totalAnswered;
        elements.streak.textContent = state.stats.streak;

        const accuracy = state.stats.totalAnswered > 0
            ? Math.round((state.stats.totalCorrect / state.stats.totalAnswered) * 100)
            : 0;
        elements.accuracy.textContent = accuracy + '%';

        // Update category accuracies
        document.querySelectorAll('.categoryAccuracy').forEach(el => {
            const category = el.dataset.category;
            const stats = state.stats.categoryStats[category];
            if (stats && stats.total > 0) {
                const acc = Math.round((stats.correct / stats.total) * 100);
                el.textContent = acc + '%';
            } else {
                el.textContent = '';
            }
        });
    }

    function updateLeitnerDisplay() {
        const counts = [0, 0, 0, 0, 0];

        // Count items in active categories
        state.items.forEach(item => {
            if (state.activeCategories.has(item.category)) {
                const data = getLeitnerData(item.id);
                counts[data.box - 1]++;
            }
        });

        for (let i = 1; i <= 5; i++) {
            document.getElementById(`box${i}Count`).textContent = counts[i - 1];
        }
    }

    function updateProgressBar() {
        const activeItems = state.items.filter(item =>
            state.activeCategories.has(item.category)
        );
        const answered = state.sessionAnswered.size;
        const total = activeItems.length;
        const progress = total > 0 ? (answered / total) * 100 : 0;
        elements.progressFill.style.width = progress + '%';
    }

    function getCategoryDisplayName(category) {
        const names = {
            'wechselpraepositionen': 'Wechselpräpositionen',
            'dativ-verben': 'Dativ-Verben',
            'kasus': 'Kasus (Fälle)',
            'kommasetzung': 'Kommasetzung',
            'wortstellung': 'Wortstellung',
            'adjektivendungen': 'Adjektivendungen',
            'konjunktiv-ii': 'Konjunktiv II',
            'vergleiche': 'Vergleiche',
            'passiv': 'Passiv',
            'relativpronomen': 'Relativpronomen'
        };
        return names[category] || category;
    }

    function showEmptyState() {
        elements.quizView.classList.add('hidden');
        elements.completionState.classList.add('hidden');
        elements.emptyState.classList.remove('hidden');
    }

    function showCompletionState() {
        elements.quizView.classList.add('hidden');
        elements.emptyState.classList.add('hidden');
        elements.completionState.classList.remove('hidden');

        const accuracy = state.stats.totalAnswered > 0
            ? Math.round((state.stats.totalCorrect / state.stats.totalAnswered) * 100)
            : 0;
        elements.completionStats.textContent =
            `${state.stats.totalCorrect}/${state.stats.totalAnswered} richtig (${accuracy}%)`;
    }

    function openMenu() {
        elements.menuPanel.classList.add('visible');
        elements.menuPanel.classList.remove('hidden');
    }

    function closeMenu() {
        elements.menuPanel.classList.remove('visible');
    }

    // ==================== Event Handlers ====================
    function setupEventListeners() {
        elements.optionA.addEventListener('click', () => handleAnswer(0));
        elements.optionB.addEventListener('click', () => handleAnswer(1));
        elements.nextBtn.addEventListener('click', showNextQuestion);

        elements.menuBtn.addEventListener('click', openMenu);
        elements.closeMenuBtn.addEventListener('click', closeMenu);

        // Close menu when clicking outside
        elements.menuPanel.addEventListener('click', (e) => {
            if (e.target === elements.menuPanel) {
                closeMenu();
            }
        });

        // Category filters
        elements.categoryFilters.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox') {
                const category = e.target.value;
                if (e.target.checked) {
                    state.activeCategories.add(category);
                } else {
                    state.activeCategories.delete(category);
                }
                saveState();
                buildSessionQueue();
                updateLeitnerDisplay();
                updateProgressBar();

                // If current item is from deactivated category, show next
                if (state.currentItem && !state.activeCategories.has(state.currentItem.category)) {
                    showNextQuestion();
                }
            }
        });

        elements.resetBtn.addEventListener('click', resetProgress);
        elements.openCategoriesBtn.addEventListener('click', openMenu);

        elements.reviewBtn.addEventListener('click', () => {
            // Reset session to review difficult items
            state.sessionAnswered.clear();
            state.sessionNumber++;
            saveState();
            buildSessionQueue();
            showNextQuestion();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (elements.menuPanel.classList.contains('visible')) {
                if (e.key === 'Escape') closeMenu();
                return;
            }

            if (!state.answered) {
                if (e.key === '1' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    handleAnswer(0);
                } else if (e.key === '2' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    handleAnswer(1);
                }
            } else {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    showNextQuestion();
                }
            }
        });
    }

    // ==================== Utilities ====================
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // ==================== Initialization ====================
    async function init() {
        cacheElements();
        loadState();

        // Set checkbox states based on saved preferences
        document.querySelectorAll('#categoryFilters input[type="checkbox"]').forEach(cb => {
            cb.checked = state.activeCategories.has(cb.value);
        });

        // Load data
        state.items = await loadData();

        if (state.items.length === 0) {
            elements.loading.classList.add('hidden');
            showEmptyState();
            return;
        }

        // Initialize leitner data for all items
        state.items.forEach(item => getLeitnerData(item.id));

        // Build session queue
        buildSessionQueue();

        // Update displays
        updateStatsDisplay();
        updateLeitnerDisplay();

        // Setup event listeners
        setupEventListeners();

        // Hide loading and show first question
        elements.loading.classList.add('hidden');
        showNextQuestion();

        // Register service worker
        if ('serviceWorker' in navigator) {
            try {
                await navigator.serviceWorker.register('sw.js');
            } catch (e) {
                console.warn('Service worker registration failed:', e);
            }
        }
    }

    // Start app when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
