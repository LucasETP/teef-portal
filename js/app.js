// ============================================
// INITIALIZE WIDGETS
// ============================================
function initWidgets() {
    initWordle();
    initPhotoUpload('stubert', 'stubertInput', 'stubertPreview', 'stubertDate', 'stubertLoading');
    initPhotoUpload('shiba', 'shibaInput', 'shibaPreview', 'shibaDate', 'shibaLoading');
    loadLanguageWord('chinese');
    loadLanguageWord('spanish');
    initMessages();
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('passwordInput')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkPassword();
    });
});
