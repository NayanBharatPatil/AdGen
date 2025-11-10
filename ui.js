export function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

export function showLoading(show, formStep, previewStep, loadingContainer) {
    if (show) {
        formStep.classList.add('hidden');
        previewStep.classList.add('hidden');
        loadingContainer.classList.remove('hidden');
    } else {
        loadingContainer.classList.add('hidden');
    }
}

export function switchStep(step, formStep, previewStep) {
    if (step === 'form') {
        formStep.classList.remove('hidden');
        previewStep.classList.add('hidden');
    } else {
        formStep.classList.add('hidden');
        previewStep.classList.remove('hidden');
    }
}

export function displayAds(generatedAds, adsGrid, adTypes) {
    adsGrid.innerHTML = '';

    adTypes.forEach(({ key, title, filename }) => {
        if (generatedAds[key]) {
            const adHtml = `
                <div class="ad-item">
                    <h3>${title}</h3>
                    <img src="${generatedAds[key].image}" alt="${title}" onerror="this.src='https://via.placeholder.com/300x300?text=${title}'">
                    <p class="ad-text">${generatedAds[key].text}</p>
                    <button class="btn-download" onclick="downloadImage('${generatedAds[key].image}', '${filename}')">⬇️ Download</button>
                </div>
            `;
            adsGrid.innerHTML += adHtml;
        }
    });
}

export async function downloadImage(imageUrl, filename) {
    try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        showToast('Image downloaded!', 'success');
    } catch (error) {
        console.error('Download error:', error);
        showToast('Failed to download image', 'error');
    }
}