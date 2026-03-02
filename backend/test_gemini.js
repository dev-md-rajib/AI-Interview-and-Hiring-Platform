const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = 'AIzaSyDSViaziVgTRCdLI2w8_ChNTZbB89k04_s';
const genAI = new GoogleGenerativeAI(apiKey);

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

async function run() {
  const models = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-2.5-flash'];
  for (const m of models) {
    await testModel(m);
  }
}
run();
