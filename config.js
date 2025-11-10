// API Configuration
export const API_KEY = 'AIzaSyAvLeWv3LXu3yDVZ2AkBMbhdMID-uC6bFs';
export const API_URL = 'https://generativelanguage.googleapis.com/v1';

// Ad Types Configuration
export const adTypes = [
    { key: 'whatsappStatus', title: 'WhatsApp Status', filename: 'whatsapp-status.png' },
    { key: 'instagramStatus', title: 'Instagram Story', filename: 'instagram-story.png' },
    { key: 'instagramPost', title: 'Instagram Post', filename: 'instagram-post.png' },
    { key: 'facebookPost', title: 'Facebook Post', filename: 'facebook-post.png' }
];

// Image Dimensions
export const dimensions = {
    whatsappStatus: { width: 1080, height: 1920 },
    instagramStatus: { width: 1080, height: 1920 },
    instagramPost: { width: 1080, height: 1080 },
    facebookPost: { width: 1200, height: 628 }
};