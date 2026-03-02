const textToSpeech = require('@google-cloud/text-to-speech');
const ttsClient = new textToSpeech.TextToSpeechClient();

async function test() {
  try {
    const [response] = await ttsClient.synthesizeSpeech({
      input: { text: "Hello world" },
      voice: { languageCode: 'en-US', name: 'en-US-Journey-F' },
      audioConfig: { audioEncoding: 'MP3' },
    });
    console.log("Success! Audio length:", response.audioContent.length);
  } catch (e) {
    console.error("Error:", e.message);
  }
}
test();
