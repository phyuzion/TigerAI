const axios = require('axios');

/**
 * OpenAI API 호출
 */
async function callOpenAI(apiKey, messages) {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            { model: 'gpt-4', messages },
            { headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' } }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        throw new Error(`OpenAI API Error: ${error.message}`);
    }
}

module.exports = callOpenAI;
