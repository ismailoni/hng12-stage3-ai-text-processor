


export async function detectLanguage(text) {
    if (!('languageDetector' in self.ai) && !('create' in self.ai.languageDetector)) {
        return console.error("Language detection API is not available.");
    }
    try {
 
        const detector = await self.ai.languageDetector.create();
        const { detectedLanguage, confidence } = (await detector.detect(text))[0];
        const humanReadableLanguage = new Intl.DisplayNames(['en'], { type: 'language' }).of(detectedLanguage) || detectedLanguage;
        return `${humanReadableLanguage}`;      
    } catch (error) {
        console.log("Language detection error:", error);
        return "Language detection error";
      }
}
  


export async function translateText(text, targetLang) {
    if (self.ai.translation && self.ai.translation.createTranslator) {
        console.log("Translation API is available.");
    
        const detector = await self.ai.languageDetector.create();
        const detectedLanguage = await detector.detect(text);

        try {
            const translator = await self.translation.createTranslator({
              sourceLanguage: `${detectedLanguage[0].detectedLanguage}`,
              targetLanguage: targetLang,
            });
            return await translator.translate(text);
          } catch (err) {
            const humanReadableLanguage = new Intl.DisplayNames(['en'], { type: 'language' }).of(detectedLanguage[0].detectedLanguage) || detectLanguage[0].detectedLanguage;
            const humanReadableTargetLanguage = new Intl.DisplayNames(['en'], { type: 'language' }).of(targetLang) || targetLang;
            if (err.message === 'Unable to create translator for the given source and target language.') {
              return (`Sorry..there is no translation for this pair ( ${humanReadableLanguage} and ${humanReadableTargetLanguage} )`)
            }
            console.log('An error occurred. Please try again.');
            console.error(err.name, err.message);
          }
    } else {
      return "Translation API is not available on your device.";
    }
  
  }

    export async function summarizeText(text) {
      // if (!window.chrome || !window.chrome.ai || !window.chrome.ai.summarize) {
      //   console.error("Chrome AI Summarizer API is not available.");
      //   return "Summarization failed";
      // }
      try {
        const result = self.ai.summarizer.create(text, {
          length: 'short',
          maxSentences: 3,
        });
        return result.summary || "No summary available";
      } catch (error) {
        console.error("Summarization error:", error);
        return "Summarization failed";
      }
    }