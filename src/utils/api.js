let detectedLanguage = "";

// Language Detector API Function
export async function detectLanguage(text) {
  if (!("ai" in self) || !("languageDetector" in self.ai)) {
    return "Language detection is not supported on this browser.";
  }

  try {
    const detector = await self.ai.languageDetector.create();
    const detectedResult = await detector.detect(text);
    
    if (!detectedResult.length || !detectedResult[0].detectedLanguage) {
      throw new Error("Failed to retrieve detected language.");
    }

    detectedLanguage = detectedResult[0].detectedLanguage;
    const humanReadableLanguage =
      new Intl.DisplayNames(["en"], { type: "language" }).of(detectedLanguage) || detectedLanguage;

    return humanReadableLanguage;
  } catch (error) {
    console.error("Language detection error:", error);
    return "Error detecting language. Please try again.";
  }
}

// Translator API Function
export async function translateText(text, targetLang) {
  if (!("ai" in self) || !("translator" in self.ai)) {
    return "Translation is not supported on this browser.";
  }

  try {
    if (!detectedLanguage) {
      throw new Error("Source language is unknown. Please detect language first.");
    }

    const translatorCapabilities = await self.ai.translator.capabilities();
    const available = translatorCapabilities.languagePairAvailable(detectedLanguage, targetLang);

    if (available !== "readily" && available !== "after-download") {
      const sourceLangName = new Intl.DisplayNames(["en"], { type: "language" }).of(detectedLanguage) || detectedLanguage;
      const targetLangName = new Intl.DisplayNames(["en"], { type: "language" }).of(targetLang) || targetLang;
      return `Translation is not available for ${sourceLangName} → ${targetLangName}.`;
    }

    const translator = await self.ai.translator.create({ sourceLanguage: detectedLanguage, targetLanguage: targetLang });
    return await translator.translate(text);
  } catch (error) {
    console.error("Translation error:", error);
    return "Error translating text. Please try again.";
  }
}

// Summarizer API Function
export async function summarizeText(text) {
  if (!("ai" in self) || !("summarizer" in self.ai)) {
    return "Summarization is not supported on this browser.";
  }

  const options = {
    type: "key-points",
    format: "markdown",
    length: "medium",
  };

  try {
    const summarizer = await self.ai.summarizer.create();
    const summary = await summarizer.summarize(text, options);
    return summary || "No summary available.";
  } catch (error) {
    console.error("Summarization error:", error);
    return "Error summarizing text. Please try again.";
  }
}
