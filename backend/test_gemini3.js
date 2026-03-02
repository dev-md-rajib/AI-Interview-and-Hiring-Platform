const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testModel(modelName) {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent("Respond with 'OK'.");
    console.log(`Success: ${modelName} works. Response: ${result.response.text().trim()}`);
    return true;
  } catch (err) {
    console.error(`Failed: ${modelName} -> ${err.message}`);
    return false;
  }
}

testModel('gemini-3-flash-preview');
