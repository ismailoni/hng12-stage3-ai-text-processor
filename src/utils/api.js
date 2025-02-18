


export async function detectLanguage(text) {
    if (!('translation' in self)) {
        return console.error("Language detection API is not available.");
    }
    try {
 
        const detector = await self.ai.languageDetector.create();
        const { detectedLanguage, confidence } = (await detector.detect(text))[0];
        const humanReadableLanguage = new Intl.DisplayNames(['en'], { type: 'language' }).of(detectedLanguage) || detectedLanguage;
        return `${(confidence * 100).toFixed(1)}% sure that this is ${humanReadableLanguage}`;      
    } catch (error) {
      console.log("Language detection error:", error);
      return "Error";
    }
  }
  
  

  export async function summarizeText(text) {
    if (!window.chrome || !window.chrome.ai || !window.chrome.ai.summarize) {
      console.error("Chrome AI Summarizer API is not available.");
      return "Summarization failed";
    }
    try {
      const result = await window.chrome.ai.summarize(text);
      return result.summary || "No summary available";
    } catch (error) {
      console.error("Summarization error:", error);
      return "Summarization failed";
    }
  }
  
  export async function translateText(text, targetLang) {
    if ('createTranslator' in self.translation) {
        console.log("Translation API is available.");
    
        try {
            const detector = await self.ai.languageDetector.create();
            const detectedLanguage = await detector.detect(text);
            const translator = await self.translation.createTranslator({
              sourceLanguage: `${detectedLanguage[0].detectedLanguage}`,
              targetLanguage: targetLang,
            });
            return await translator.translate(text);
          } catch (err) {
            console.log('An error occurred. Please try again.');
            console.error(err.name, err.message);
          }
    }
      
  }