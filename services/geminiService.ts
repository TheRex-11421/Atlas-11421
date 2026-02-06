// Function to extract text from Gemini REST API response
function extractTextFromResponse(response) {
    try {
        // Accessing the nested structure to extract the required text
        const text = response.data.candidates[0].content.parts[0].text;
        return text;
    } catch (error) {
        console.error('Error extracting text:', error);
        return null;
    }
}

// Example usage
const apiResponse = { /* API response goes here */ };
const extractedText = extractTextFromResponse(apiResponse);
console.log(extractedText);