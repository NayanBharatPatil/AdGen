import { adTypes } from './config.js';
import { checkAvailableModels, generateAdCopy, generateAllAds } from './api.js';
import { showToast, showLoading, switchStep, displayAds, downloadImage } from './ui.js';

// State
let formData = {
    businessName: '',
    businessType: '',
    phoneNumber: '',
    address: '',
    photo: null,
    description: ''
};

let currentStep = 'form';
let generatedAds = {};

// Get DOM elements
const formStep = document.getElementById('formStep');
const previewStep = document.getElementById('previewStep');
const loadingContainer = document.getElementById('loadingContainer');
const generateBtn = document.getElementById('generateBtn');
const backBtn = document.getElementById('backBtn');
const photoInput = document.getElementById('photoInput');
const photoPreview = document.getElementById('photoPreview');
const adsGrid = document.getElementById('adsGrid');

const inputs = {
    businessName: document.getElementById('businessName'),
    businessType: document.getElementById('businessType'),
    phoneNumber: document.getElementById('phoneNumber'),
    address: document.getElementById('address'),
    description: document.getElementById('description')
};

// Initialize
checkAvailableModels();

// Event handlers
function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            formData.photo = reader.result;
            photoPreview.src = reader.result;
            photoPreview.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
}

async function handleGenerateAds() {
    if (!inputs.businessName.value || !inputs.businessType.value || 
        !inputs.phoneNumber.value || !inputs.address.value || !inputs.description.value) {
        showToast('Please fill all fields', 'error');
        return;
    }

    formData = {
        ...formData,
        businessName: inputs.businessName.value,
        businessType: inputs.businessType.value,
        phoneNumber: inputs.phoneNumber.value,
        address: inputs.address.value,
        description: inputs.description.value
    };

    showLoading(true, formStep, previewStep, loadingContainer);

    try {
        const adCopies = await generateAdCopy(formData);
        generatedAds = await generateAllAds(formData, adCopies);
        displayAds(generatedAds, adsGrid, adTypes);
        switchStep('preview', formStep, previewStep);
        showToast('Ads generated successfully!', 'success');
    } catch (error) {
        console.error('Error:', error);
        showToast('Failed to generate ads: ' + error.message, 'error');
    } finally {
        showLoading(false, formStep, previewStep, loadingContainer);
    }
}

function handleBackToForm() {
    switchStep('form', formStep, previewStep);
}

// Event listeners
generateBtn.addEventListener('click', handleGenerateAds);
backBtn.addEventListener('click', handleBackToForm);
photoInput.addEventListener('change', handlePhotoUpload);

// Make downloadImage available globally for the onclick handlers
window.downloadImage = downloadImage;