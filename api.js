import { API_KEY, API_URL } from './config.js';

export async function checkAvailableModels() {
    try {
        const response = await fetch(`${API_URL}/models?key=${API_KEY}`);
        const data = await response.json();
        console.log('Available Models:', data.models);
    } catch (error) {
        console.error('Error checking models:', error);
    }
}

export async function generateAdCopy(formData) {
    const prompt = `Create 4 different ad copies for:
Business: ${formData.businessName}
Type: ${formData.businessType}
Phone: ${formData.phoneNumber}
Address: ${formData.address}
Description: ${formData.description}

Return ONLY valid JSON with these exact keys (no markdown):
{
  "whatsappStatus": "short punchy text (20-30 words)",
  "instagramStatus": "engaging text with emojis (30-50 words)",
  "instagramPost": "detailed post with hashtags (50-100 words)",
  "facebookPost": "professional post (60-120 words)"
}`;

    try {
        const response = await fetch(
            `${API_URL}/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                    }
                })
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'API Error');
        }

        const data = await response.json();
        const textContent = data.candidates[0].content.parts[0].text;
        const jsonMatch = textContent.match(/\{[\s\S]*\}/);
        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        throw new Error('Failed to generate ad copy: ' + error.message);
    }
}

export async function generateAllAds(formData, adCopies) {
    const adTypes = ['whatsappStatus', 'instagramStatus', 'instagramPost', 'facebookPost'];
    const ads = {};

    const prompts = {
        whatsappStatus: `Professional advertisement banner for ${formData.businessName}, ${formData.businessType} business, vibrant colors, eye-catching, mobile-friendly, modern design`,
        instagramStatus: `Instagram story advertisement for ${formData.businessName}, ${formData.businessType}, vertical format, trendy, eye-catching, modern aesthetics`,
        instagramPost: `Instagram feed post for ${formData.businessName}, ${formData.businessType}, square format, professional, visually appealing, promotion poster`,
        facebookPost: `Facebook advertisement for ${formData.businessName}, ${formData.businessType}, landscape format, professional, promotional, business-focused`
    };

    const dimensions = {
        whatsappStatus: { width: 1080, height: 1920 },
        instagramStatus: { width: 1080, height: 1920 },
        instagramPost: { width: 1080, height: 1080 },
        facebookPost: { width: 1200, height: 628 }
    };

    for (const adType of adTypes) {
        const dim = dimensions[adType];
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompts[adType])}?width=${dim.width}&height=${dim.height}&seed=${Math.random()}`;
        ads[adType] = {
            image: imageUrl,
            text: adCopies[adType]
        };
    }

    return ads;
}