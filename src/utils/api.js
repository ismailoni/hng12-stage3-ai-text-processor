let detectedLanguage = "";

export async function detectLanguage(text) {
  if (
    !("languageDetector" in self.ai) &&
    !("create" in self.ai.languageDetector)
  ) {
    return console.error("Language detection API is not available.");
  }
  try {
    const detector = await self.ai.languageDetector.create();
    const { detectedLanguage: lang, confidence } = (
      await detector.detect(text)
    )[0];
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
}

export async function translateText(text, targetLang) {
  if (self.translation && self.translation.createTranslator) {
    console.log("Translation API is available.");

    try {
      const translator = await self.translation.createTranslator({
        sourceLanguage: `${detectedLanguage}`,
        targetLanguage: targetLang,
      });
      return await translator.translate(text);
    } catch (err) {
      const humanReadableLanguage =
        new Intl.DisplayNames(["en"], { type: "language" }).of(
          detectedLanguage[0].detectedLanguage
        ) || detectLanguage[0].detectedLanguage;
      const humanReadableTargetLanguage =
        new Intl.DisplayNames(["en"], { type: "language" }).of(targetLang) ||
        targetLang;
      if (
        err.message ===
        "Unable to create translator for the given source and target language."
      ) {
        return `Sorry..there is no translation for this pair ( ${humanReadableLanguage} and ${humanReadableTargetLanguage} )`;
      }
      console.log("An error occurred. Please try again.");
      console.error(err.name, err.message);
    }
  } else {
    return "Translation API is not available on your device.";
  }
}

export async function summarizeText(text) {
  if (!self.ai || !self.ai.summarizer) {
    console.error("Chrome AI Summarizer API is not available.");
    return "Chrome AI Summarizer API is not available on your device.";
  }
  
  const options = {
    type: 'key-points',
    format: 'markdown',
    length: 'medium',
  };

  try {
    const summarizer = await self.ai.summarizer.create(); // Ensure correct API usage
    const summary = await summarizer.summarize(text, options); // Pass options properly
    return summary || "No summary available";
  } catch (error) {
    console.error("Summarization error:", error);
    return "Summarization failed";
  }
}

