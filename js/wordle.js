// ============================================
// WORDLE WIDGET (WITH WEEKLY ROTATION)
// ============================================
// EDIT THIS ARRAY TO CHANGE WEEKLY WORDS (Sunday = 0, Saturday = 6)
const WEEKLY_WORDS = [
    'BLIMP',  // Sunday
    'FIGHT',  // Monday
    'CROWD',  // Tuesday
    'STRAY',  // Wednesday
    'RIVER',  // Thursday
    'GHOUL',  // Friday
    'WRITE'    // Saturday
];

let wordleState = {
    word: '',
    guesses: [],
    currentGuess: '',
    gameOver: false,
    maxGuesses: 6
};

function getTodaysWord() {
    const dayOfWeek = new Date().getDay(); // 0 (Sunday) to 6 (Saturday)
    return WEEKLY_WORDS[dayOfWeek];
}

async function initWordle() {
    const today = new Date().toDateString();
    const todaysWord = getTodaysWord();

    try {
        const doc = await db.collection('wordle').doc('current').get();
        if (doc.exists) {
            const data = doc.data();
            if (data.date === today) {
                wordleState = data;
                renderWordle();
                return;
            }
        }
    } catch (error) {
        console.error('Error loading Wordle:', error);
    }

    wordleState = {
        word: todaysWord,
        guesses: [],
        currentGuess: '',
        gameOver: false,
        maxGuesses: 6,
        date: today
    };
    renderWordle();
}

async function saveWordleState() {
    try {
        await db.collection('wordle').doc('current').set(wordleState);
    } catch (error) {
        console.error('Error saving Wordle:', error);
    }
}

function renderWordle() {
    const grid = document.getElementById('wordleGrid');
    grid.innerHTML = '';

    wordleState.guesses.forEach(guess => {
        renderGuess(guess, true);
    });

    if (!wordleState.gameOver && wordleState.guesses.length < wordleState.maxGuesses) {
        renderGuess(wordleState.currentGuess, false);
    }

    const remaining = wordleState.maxGuesses - wordleState.guesses.length - (wordleState.gameOver ? 0 : 1);
    for (let i = 0; i < remaining; i++) {
        renderGuess('', false);
    }

    renderKeyboard();

    if (wordleState.gameOver) {
        const msg = document.getElementById('wordleMessage');
        if (wordleState.guesses[wordleState.guesses.length - 1] === wordleState.word) {
            msg.textContent = '🎉 You won! Come back tomorrow!';
            msg.style.color = '#228b22';
        } else {
            msg.textContent = `Game over! Word was ${wordleState.word}`;
            msg.style.color = '#ff1493';
        }
    }
}

function renderGuess(guess, evaluated) {
    const grid = document.getElementById('wordleGrid');

    for (let i = 0; i < 5; i++) {
        const cell = document.createElement('div');
        cell.className = 'wordle-cell';
        cell.textContent = guess[i] || '';

        if (evaluated && guess.length === 5) {
            const letter = guess[i];
            if (letter === wordleState.word[i]) {
                cell.classList.add('correct');
            } else if (wordleState.word.includes(letter)) {
                cell.classList.add('present');
            } else {
                cell.classList.add('absent');
            }
        }

        grid.appendChild(cell);
    }
}

function renderKeyboard() {
    const keyboard = document.getElementById('keyboard');
    const keys = 'QWERTYUIOPASDFGHJKLZXCVBNM'.split('');
    keyboard.innerHTML = '';

    // Track the best state for each letter across all guesses
    const letterStates = {};

    wordleState.guesses.forEach(guess => {
        if (guess.length === 5) {
            for (let i = 0; i < 5; i++) {
                const letter = guess[i];
                const currentState = letterStates[letter] || 'none';

                // Determine state for this letter in this position
                let newState = 'none';
                if (letter === wordleState.word[i]) {
                    newState = 'correct';
                } else if (wordleState.word.includes(letter)) {
                    newState = 'present';
                } else {
                    newState = 'absent';
                }

                // Update to best state (correct > present > absent > none)
                if (newState === 'correct' || currentState === 'correct') {
                    letterStates[letter] = 'correct';
                } else if (newState === 'present' || currentState === 'present') {
                    letterStates[letter] = 'present';
                } else if (newState === 'absent' && currentState === 'none') {
                    letterStates[letter] = 'absent';
                }
            }
        }
    });

    keys.forEach(key => {
        const btn = document.createElement('div');
        btn.className = 'key';

        // Apply state class if letter has been guessed
        if (letterStates[key]) {
            btn.classList.add(letterStates[key]);
        }

        btn.textContent = key;
        btn.onclick = () => handleKeyPress(key);
        keyboard.appendChild(btn);
    });

    const enter = document.createElement('div');
    enter.className = 'key wide';
    enter.textContent = 'ENTER';
    enter.onclick = () => handleEnter();
    keyboard.appendChild(enter);

    const back = document.createElement('div');
    back.className = 'key wide';
    back.textContent = '←';
    back.onclick = () => handleBackspace();
    keyboard.appendChild(back);
}

function handleKeyPress(key) {
    if (wordleState.gameOver || wordleState.currentGuess.length >= 5) return;
    wordleState.currentGuess += key;
    renderWordle();
}

function handleBackspace() {
    if (wordleState.gameOver) return;
    wordleState.currentGuess = wordleState.currentGuess.slice(0, -1);
    renderWordle();
}

function handleEnter() {
    if (wordleState.gameOver || wordleState.currentGuess.length !== 5) return;

    wordleState.guesses.push(wordleState.currentGuess);

    if (wordleState.currentGuess === wordleState.word || wordleState.guesses.length >= wordleState.maxGuesses) {
        wordleState.gameOver = true;
    }

    wordleState.currentGuess = '';
    saveWordleState();
    renderWordle();
}
