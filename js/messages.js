// ============================================
// DAILY MESSAGES (WITH WEEKLY ROTATION)
// ============================================
// EDIT THIS ARRAY TO CHANGE WEEKLY MESSAGES (Sunday = 0, Saturday = 6)
const WEEKLY_MESSAGES = [
    'me on dec 30: ༼ つ ◕_◕ ༽つ',  // Sunday
    'I miss showering with you',                  // Monday
    'Te amo mas que la comida',                          // Tuesday
    'Warning: Ima squeeze you so hard u throw up',                  // Wednesday
    'I miss sniffing your hair #creep',                          // Thursday
    'I wanna travel the world with u ong',                             // Friday
    'I miss picking you up even tho ur so heavy'                        // Saturday
];

function getTodaysMessage() {
    const dayOfWeek = new Date().getDay(); // 0 (Sunday) to 6 (Saturday)
    return WEEKLY_MESSAGES[dayOfWeek];
}

async function initMessages() {
    try {
        const doc = await db.collection('messages').doc('weekly').get();
        let messages = WEEKLY_MESSAGES;
        let shouldUpdateDb = true;

        if (doc.exists) {
            const data = doc.data();
            if (data.messages && Array.isArray(data.messages) && data.messages.length === 7) {
                messages = data.messages;
                shouldUpdateDb = false;
            }
        }

        if (shouldUpdateDb) {
            // Initialize or Repair with default messages from code
            await db.collection('messages').doc('weekly').set({
                messages: WEEKLY_MESSAGES
            }, { merge: true });
            console.log('✅ Populated default messages in Firebase');
        }

        const dayOfWeek = new Date().getDay();
        const messageBox = document.getElementById('messageBox');
        messageBox.textContent = messages[dayOfWeek] || getTodaysMessage();
    } catch (error) {
        console.error('Error loading messages:', error);
        document.getElementById('messageBox').textContent = getTodaysMessage();
    }

    // Real-time updates
    db.collection('messages').doc('weekly').onSnapshot((doc) => {
        if (doc.exists) {
            const data = doc.data();
            if (data.messages && Array.isArray(data.messages) && data.messages.length === 7) {
                const dayOfWeek = new Date().getDay();
                const messageBox = document.getElementById('messageBox');
                messageBox.textContent = data.messages[dayOfWeek] || getTodaysMessage();
            }
        }
    });
}
