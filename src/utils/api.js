let detectedLanguage = "";

// Language Detector API Function
export async function detectLanguage(text) {
  if ("ai" in self && "languageDetector" in self.ai) {
    try {
      const detector = await self.ai.languageDetector.create();
      const { detectedLanguage: lang } = (await detector.detect(text))[0];
      detectedLanguage = lang;
      const humanReadableLanguage =
        new Intl.DisplayNames(["en"], { type: "language" }).of(
          detectedLanguage
        ) || detectedLanguage;
      return `${humanReadableLanguage}`;
    } catch (error) {
      console.log("Language detection error:", error);
      return "Language detection error";
    }
  } else {
    return "Language detection API is not available on your browser.";
  }
}

// Translator API Function
export async function translateText(text, targetLang) {
  if ("ai" in self && "translator" in self.ai) {
    console.log("Translation API is available.");

    try {
      // Check Translator Capability
      const translatorCapabilities = await self.ai.translator.capabilities();
      const available = translatorCapabilities.languagePairAvailable(
        detectedLanguage,
        targetLang
      );
      console.log("Translation available:", available);

      // Create Translation Instance
      const translator = await self.translation.createTranslator({
        sourceLanguage: `${detectedLanguage}`,
        targetLanguage: targetLang,
      });

      if (available === "readily") {
        return await translator.translate(text);
      } else if (available === "after-download") {
        return "Translation is pending";
      }
    } catch (err) {
        if (err.message === "Unable to create translator for the given source and target language.") {
          const humanReadableLanguage =
            new Intl.DisplayNames(["en"], { type: "language" }).of(
              detectedLanguage[0].detectedLanguage
            ) || detectLanguage[0].detectedLanguage;
          const humanReadableTargetLanguage =
            new Intl.DisplayNames(["en"], { type: "language" }).of(targetLang) ||
            targetLang;

          return `Sorry..there is no translation for this pair ( ${humanReadableLanguage} -> ${humanReadableTargetLanguage} )`;
        }
      console.error(err.name, err.message);
      return "An error occurred. Please try again.";
    }
  } else {
    return "Translation API is not available on your device.";
  }
}

export async function summarizeText(text) {
    if ('ai' in self && 'summarizer' in self.ai) {
      
      
      const options = {
        type: "key-points",
        format: "markdown",
        length: "medium",
      };

      try {
        const summarizer = await self.ai.summarizer.create();
        const summary = await summarizer.summarize(text, options);
        return summary || "No summary available";
      } catch (error) {
        console.error("Summarization error:", error);
        return "Summarization failed";
      }
    } else {
      console.error("Chrome AI Summarizer API is not available.");
      return "Chrome AI Summarizer API is not available on your device.";
    }
}
