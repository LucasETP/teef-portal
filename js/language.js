// ============================================
// LANGUAGE WORD WIDGETS
// ============================================
function loadLanguageWord(language) {
    // Load initial word
    db.collection('words').doc(language).get().then(doc => {
        if (doc.exists) {
            const data = doc.data();
            updateLanguageDisplay(language, data);
            if (data.history && data.history.length > 0) {
                renderWordHistory(language, data.history);
            }
        }
    }).catch(error => console.error(`Error loading ${language} word:`, error));

    // Real-time updates
    db.collection('words').doc(language).onSnapshot((doc) => {
        if (doc.exists) {
            const data = doc.data();
            updateLanguageDisplay(language, data);
            if (data.history && data.history.length > 0) {
                renderWordHistory(language, data.history);
            }
        }
    });
}

function renderWordHistory(language, history) {
    const historyList = document.getElementById(language + 'HistoryList');
    if (!historyList) return;

    historyList.innerHTML = '';

    // Reverse to show newest first
    const reversedHistory = [...history].reverse();

    reversedHistory.forEach((word, index) => {
        const item = document.createElement('div');
        item.className = 'word-history-item';

        if (language === 'chinese') {
            item.innerHTML = `
                <div class="word-char">${word.character}</div>
                <div class="word-info">${word.pinyin}</div>
                <div class="word-info">"${word.english}"</div>
            `;
        } else if (language === 'spanish') {
            item.innerHTML = `
                <div class="word-char">${word.word}</div>
                <div class="word-info">${word.pronunciation}</div>
                <div class="word-info">"${word.english}"</div>
            `;
        }

        historyList.appendChild(item);
    });
}

function toggleHistory(language) {
    const historyList = document.getElementById(language + 'HistoryList');
    const toggle = document.getElementById(language + 'HistoryToggle');

    if (historyList.classList.contains('show')) {
        historyList.classList.remove('show');
        toggle.textContent = '▼';
    } else {
        historyList.classList.add('show');
        toggle.textContent = '▲';
    }
}

function updateLanguageDisplay(language, data) {
    const display = document.getElementById(language + 'Display');

    if (language === 'chinese') {
        display.innerHTML = `
            <div class="word-char">${data.character}</div>
            <div class="word-info">${data.pinyin}</div>
            <div class="word-info">"${data.english}"</div>
        `;
    } else if (language === 'spanish') {
        display.innerHTML = `
            <div class="word-char">${data.word}</div>
            <div class="word-info">${data.pronunciation}</div>
            <div class="word-info">"${data.english}"</div>
        `;
    }
}

async function submitChineseWord() {
    const character = document.getElementById('chineseChar').value.trim();
    const pinyin = document.getElementById('chinesePinyin').value.trim();
    const english = document.getElementById('chineseEnglish').value.trim();

    if (!character || !pinyin || !english) {
        alert('Please fill in all fields!');
        return;
    }

    try {
        // Get current word to add to history
        const currentDoc = await db.collection('words').doc('chinese').get();
        let history = [];

        if (currentDoc.exists) {
            const currentData = currentDoc.data();
            // Only add to history if there's a current word (not empty/placeholder)
            if (currentData.character && currentData.character !== '🎎') {
                history = currentData.history || [];
                history.push({
                    character: currentData.character,
                    pinyin: currentData.pinyin,
                    english: currentData.english,
                    timestamp: currentData.timestamp || firebase.firestore.FieldValue.serverTimestamp()
                });
            }
        }

        await db.collection('words').doc('chinese').set({
            character,
            pinyin,
            english,
            history: history,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        document.getElementById('chineseChar').value = '';
        document.getElementById('chinesePinyin').value = '';
        document.getElementById('chineseEnglish').value = '';

        alert('Word uploaded! ✨');
    } catch (error) {
        console.error('Error uploading Chinese word:', error);
        alert('Upload failed!');
    }
}

async function submitSpanishWord() {
    const word = document.getElementById('spanishWord').value.trim();
    const pronunciation = document.getElementById('spanishPronunciation').value.trim();
    const english = document.getElementById('spanishEnglish').value.trim();

    if (!word || !pronunciation || !english) {
        alert('Please fill in all fields!');
        return;
    }

    try {
        // Get current word to add to history
        const currentDoc = await db.collection('words').doc('spanish').get();
        let history = [];

        if (currentDoc.exists) {
            const currentData = currentDoc.data();
            // Only add to history if there's a current word (not empty/placeholder)
            if (currentData.word && currentData.word !== '💃') {
                history = currentData.history || [];
                history.push({
                    word: currentData.word,
                    pronunciation: currentData.pronunciation,
                    english: currentData.english,
                    timestamp: currentData.timestamp || firebase.firestore.FieldValue.serverTimestamp()
                });
            }
        }

        await db.collection('words').doc('spanish').set({
            word,
            pronunciation,
            english,
            history: history,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        document.getElementById('spanishWord').value = '';
        document.getElementById('spanishPronunciation').value = '';
        document.getElementById('spanishEnglish').value = '';

        alert('Word uploaded! ✨');
    } catch (error) {
        console.error('Error uploading Spanish word:', error);
        alert('Upload failed!');
    }
}
