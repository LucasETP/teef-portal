// ============================================
// PHOTO WIDGETS (GENERIC)
// ============================================

/**
 * Compresses an image file to a smaller base64 string
 * @param {File} file - The file object from input
 * @param {number} maxWidth - Maximum width for the image
 * @param {number} quality - JPEG quality (0 to 1)
 * @returns {Promise<string>} - Compressed base64 string
 */
function compressImage(file, maxWidth = 800, quality = 0.7) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Resize if too large
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Compress
                const dataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(dataUrl);
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
}

function initPhotoUpload(petName, inputId, previewId, dateId, loadingId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    const dateDisplay = document.getElementById(dateId);
    const loading = document.getElementById(loadingId);

    // Load current photo
    db.collection('photos').doc(petName).get().then(doc => {
        if (doc.exists) {
            const data = doc.data();
            preview.src = data.photoData;
            preview.style.display = 'block';
            dateDisplay.textContent = `Uploaded: ${data.date}`;
        }
    }).catch(error => console.error('Error loading photo:', error));

    // Real-time updates
    db.collection('photos').doc(petName).onSnapshot((doc) => {
        if (doc.exists) {
            const data = doc.data();
            preview.src = data.photoData;
            preview.style.display = 'block';
            dateDisplay.textContent = `Uploaded: ${data.date}`;
            loading.style.display = 'none';
        }
    });

    input.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        loading.style.display = 'block';

        try {
            // COMPRESS IMAGE BEFORE UPLOADING
            const compressedPhotoData = await compressImage(file);

            await db.collection('photos').doc(petName).set({
                photoData: compressedPhotoData,
                date: new Date().toLocaleDateString(),
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log('✅ Photo uploaded successfully (compressed)');
        } catch (error) {
            console.error('Error uploading photo:', error);
            alert('Upload failed! The image might still be too large or there was a network error.');
            loading.style.display = 'none';
        }
    });
}
