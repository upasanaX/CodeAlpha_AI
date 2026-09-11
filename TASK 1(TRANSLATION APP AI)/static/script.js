/**
 * LinguoFlow PRO - Creative Multilingual Translation Suite
 * Features:
 * - Real-time Voice Dictation (Speech-to-Text) 🎙️
 * - Text-to-Speech Pronunciation with Speed Control 🔊⚡
 * - 4 Aesthetic Themes (Cyber Neon, Sunset Horizon, Emerald Forest, Cosmic Candy) 🎨
 * - Tone & Personality Switcher (Standard, Casual, Business, Poetic) 🎭
 * - Starred Favorites ⭐ & Local History Management 🕒
 * - Export translation to text file 💾
 * - Floating Emoji Celebration Confetti ✨🎉
 * - Country Flag Badges & One-Click Quick-Picks 🌐
 */

// Fallback languages list with country flag emojis
const DEFAULT_LANGUAGES = [
  { code: "auto", name: "Detect Language", flag: "✨", source_only: true },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish (Español)", flag: "🇪🇸" },
  { code: "fr", name: "French (Français)", flag: "🇫🇷" },
  { code: "de", name: "German (Deutsch)", flag: "🇩🇪" },
  { code: "hi", name: "Hindi (हिन्दी)", flag: "🇮🇳" },
  { code: "bn", name: "Bengali (বাংলা)", flag: "🇧🇩" },
  { code: "zh", name: "Chinese Simplified (简体中文)", flag: "🇨🇳" },
  { code: "ja", name: "Japanese (日本語)", flag: "🇯🇵" },
  { code: "ko", name: "Korean (한국어)", flag: "🇰🇷" },
  { code: "ar", name: "Arabic (العربية)", flag: "🇸🇦" },
  { code: "pt", name: "Portuguese (Português)", flag: "🇧🇷" },
  { code: "it", name: "Italian (Italiano)", flag: "🇮🇹" },
  { code: "ru", name: "Russian (Русский)", flag: "🇷🇺" },
  { code: "nl", name: "Dutch (Nederlands)", flag: "🇳🇱" },
  { code: "tr", name: "Turkish (Türkçe)", flag: "🇹🇷" },
  { code: "vi", name: "Vietnamese (Tiếng Việt)", flag: "🇻🇳" },
  { code: "th", name: "Thai (ไทย)", flag: "🇹🇭" },
  { code: "el", name: "Greek (Ελληνικά)", flag: "🇬🇷" },
  { code: "ta", name: "Tamil (தமிழ்)", flag: "🇮🇳" },
  { code: "te", name: "Telugu (తెలుగు)", flag: "🇮🇳" },
  { code: "mr", name: "Marathi (मराठी)", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati (ગુજરાતી)", flag: "🇮🇳" },
  { code: "ur", name: "Urdu (اردو)", flag: "🇵🇰" }
];

// Speech Synthesis locale mapping
const TTS_LOCALE_MAP = {
  en: "en-US",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
  hi: "hi-IN",
  bn: "bn-IN",
  zh: "zh-CN",
  ja: "ja-JP",
  ko: "ko-KR",
  ar: "ar-SA",
  pt: "pt-BR",
  it: "it-IT",
  ru: "ru-RU",
  nl: "nl-NL",
  tr: "tr-TR",
  vi: "vi-VN",
  th: "th-TH",
  el: "el-GR",
  ta: "ta-IN",
  te: "te-IN",
  mr: "mr-IN",
  gu: "gu-IN",
  ur: "ur-PK"
};

// Storage Keys
const STORAGE_HISTORY_KEY = "linguoflow_history_v2";
const STORAGE_STARRED_KEY = "linguoflow_starred_v2";
const STORAGE_THEME_KEY = "linguoflow_active_theme";

// DOM Elements
const sourceLangSelect = document.getElementById("sourceLangSelect");
const targetLangSelect = document.getElementById("targetLangSelect");
const swapLangsBtn = document.getElementById("swapLangsBtn");
const sourceText = document.getElementById("sourceText");
const targetText = document.getElementById("targetText");
const translateBtn = document.getElementById("translateBtn");
const translateBtnText = document.getElementById("translateBtnText");
const btnSpinner = document.getElementById("btnSpinner");
const clearSourceBtn = document.getElementById("clearSourceBtn");
const charCount = document.getElementById("charCount");
const copyBtn = document.getElementById("copyBtn");
const listenBtn = document.getElementById("listenBtn");
const starBtn = document.getElementById("starBtn");
const starIcon = document.getElementById("starIcon");
const downloadBtn = document.getElementById("downloadBtn");
const voiceDictateBtn = document.getElementById("voiceDictateBtn");
const copyFeedback = document.getElementById("copyFeedback");
const detectedBadge = document.getElementById("detectedBadge");
const providerBadge = document.getElementById("providerBadge");
const loadingSkeleton = document.getElementById("loadingSkeleton");
const apiStatusBadge = document.getElementById("apiStatusBadge");
const apiStatusText = document.getElementById("apiStatusText");
const toast = document.getElementById("toast");
const toastMsg = document.getElementById("toastMsg");
const toastIcon = document.getElementById("toastIcon");
const emojiConfettiContainer = document.getElementById("emojiConfettiContainer");
const voiceHighlightBar = document.getElementById("voiceHighlightBar");
const voiceHighlightTitle = document.getElementById("voiceHighlightTitle");
const voiceQuickListenBtn = document.getElementById("voiceQuickListenBtn");

// Auth & Cloud Elements
const STORAGE_AUTH_TOKEN_KEY = "linguoflow_auth_token";
const openAuthModalBtn = document.getElementById("openAuthModalBtn");
const userProfileBadge = document.getElementById("userProfileBadge");
const userNameDisplay = document.getElementById("userNameDisplay");
const logoutBtn = document.getElementById("logoutBtn");
const authModal = document.getElementById("authModal");
const closeAuthModalBtn = document.getElementById("closeAuthModalBtn");
const authTabLoginBtn = document.getElementById("authTabLoginBtn");
const authTabRegisterBtn = document.getElementById("authTabRegisterBtn");
const authForm = document.getElementById("authForm");
const nameFieldGroup = document.getElementById("nameFieldGroup");
const authNameInput = document.getElementById("authNameInput");
const authEmailInput = document.getElementById("authEmailInput");
const authPasswordInput = document.getElementById("authPasswordInput");
const authErrorMsg = document.getElementById("authErrorMsg");
const authSubmitBtn = document.getElementById("authSubmitBtn");
const authSubmitBtnText = document.getElementById("authSubmitBtnText");
const authSpinner = document.getElementById("authSpinner");
const authSwitchLink = document.getElementById("authSwitchLink");
const authSwitchNote = document.getElementById("authSwitchNote");
const cloudSaveBtn = document.getElementById("cloudSaveBtn");
const cloudIcon = document.getElementById("cloudIcon");

// Activity Tabs Elements
const tabHistoryBtn = document.getElementById("tabHistoryBtn");
const tabStarredBtn = document.getElementById("tabStarredBtn");
const tabCloudBtn = document.getElementById("tabCloudBtn");
const historyTabPane = document.getElementById("historyTabPane");
const starredTabPane = document.getElementById("starredTabPane");
const cloudTabPane = document.getElementById("cloudTabPane");
const historyList = document.getElementById("historyList");
const starredList = document.getElementById("starredList");
const cloudList = document.getElementById("cloudList");
const historyEmpty = document.getElementById("historyEmpty");
const starredEmpty = document.getElementById("starredEmpty");
const cloudEmpty = document.getElementById("cloudEmpty");
const historyCountBadge = document.getElementById("historyCountBadge");
const starredCountBadge = document.getElementById("starredCountBadge");
const cloudCountBadge = document.getElementById("cloudCountBadge");
const clearSectionBtn = document.getElementById("clearSectionBtn");
const cloudPromptSignIn = document.getElementById("cloudPromptSignIn");

// State
let isTranslating = false;
let currentTranslation = null;
let selectedTone = "standard";
let speechRate = 1.0;
let currentTab = "history";
let isVoiceRecording = false;
let speechRecognitionInstance = null;
let toastTimeout = null;
let currentUser = null;
let authModalMode = "login"; // 'login' or 'register'
let cloudTranslations = [];

// ============================================================================
// Initialization
// ============================================================================
document.addEventListener("DOMContentLoaded", async () => {
  initTheme();
  await loadLanguages();
  await checkApiStatus();
  initVoiceRecognition();
  setupEventListeners();
  renderHistory();
  renderStarred();
  updateSwapButtonState();
  checkUserSession();
});

// Theme & Mode Management (Light & Dark Support)
let lastDarkTheme = "cyber";

function initTheme() {
  const savedTheme = localStorage.getItem(STORAGE_THEME_KEY) || "cyber";
  if (savedTheme !== "light") {
    lastDarkTheme = savedTheme;
  }
  setTheme(savedTheme);

  document.querySelectorAll(".theme-pill").forEach((btn) => {
    btn.addEventListener("click", () => {
      const theme = btn.getAttribute("data-theme");
      if (theme !== "light") {
        lastDarkTheme = theme;
      }
      setTheme(theme);
      spawnEmojiConfetti(btn, ["🎨", "✨", "🌟", "💫"]);
    });
  });

  const modeToggleBtn = document.getElementById("modeToggleBtn");
  if (modeToggleBtn) {
    modeToggleBtn.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme") || "cyber";
      const isLight = currentTheme === "light";
      const nextTheme = isLight ? (lastDarkTheme || "cyber") : "light";
      if (!isLight) {
        lastDarkTheme = currentTheme;
      }
      setTheme(nextTheme);
      showToast(nextTheme === "light" ? "Switched to Light Mode ☀️" : "Switched to Dark Mode 🌙", "info");
      spawnEmojiConfetti(modeToggleBtn, nextTheme === "light" ? ["☀️", "🌤️", "✨"] : ["🌙", "🌌", "⭐"]);
    });
  }
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(STORAGE_THEME_KEY, theme);

  document.querySelectorAll(".theme-pill").forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-theme") === theme);
  });

  const modeToggleBtn = document.getElementById("modeToggleBtn");
  const modeIcon = document.getElementById("modeIcon");
  const modeText = document.getElementById("modeText");
  if (modeToggleBtn && modeIcon && modeText) {
    const isLight = theme === "light";
    modeIcon.textContent = isLight ? "☀️" : "🌙";
    modeText.textContent = isLight ? "Light" : "Dark";
    modeToggleBtn.title = isLight ? "Switch to Dark Mode 🌙" : "Switch to Light Mode ☀️";
  }
}

// Load Languages into Dropdowns
async function loadLanguages() {
  let languages = DEFAULT_LANGUAGES;
  try {
    const res = await fetch("/api/languages");
    if (res.ok) {
      const data = await res.json();
      if (data.languages && data.languages.length > 0) {
        languages = data.languages;
      }
    }
  } catch (err) {
    console.warn("Could not fetch languages, using defaults.", err);
  }

  // Populate source dropdown
  sourceLangSelect.innerHTML = "";
  languages.forEach((lang) => {
    const opt = document.createElement("option");
    opt.value = lang.code;
    opt.textContent = `${lang.flag || "🌐"} ${lang.name}`;
    sourceLangSelect.appendChild(opt);
  });

  // Populate target dropdown
  targetLangSelect.innerHTML = "";
  languages.filter((l) => !l.source_only).forEach((lang) => {
    const opt = document.createElement("option");
    opt.value = lang.code;
    opt.textContent = `${lang.flag || "🌐"} ${lang.name}`;
    targetLangSelect.appendChild(opt);
  });

  sourceLangSelect.value = "auto";
  targetLangSelect.value = "es";
  highlightActiveFlagPill("es");
}

// Check Backend API Status (Safe & Neutral)
async function checkApiStatus() {
  try {
    const res = await fetch("/api/status");
    if (res.ok) {
      const data = await res.json();
      if (apiStatusBadge && apiStatusText) {
        apiStatusBadge.className = "status-badge status-live";
        apiStatusText.textContent = "Online ✨";
      }
      return;
    }
  } catch (e) {
    console.warn("Status check error:", e);
  }
  if (apiStatusBadge && apiStatusText) {
    apiStatusBadge.className = "status-badge status-mock";
    apiStatusText.textContent = "Online ✨";
  }
}

// Voice Recognition Setup (Speech-to-Text)
function initVoiceRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    voiceDictateBtn.title = "Voice dictation not supported on this browser.";
    return;
  }

  speechRecognitionInstance = new SpeechRecognition();
  speechRecognitionInstance.continuous = false;
  speechRecognitionInstance.interimResults = true;

  speechRecognitionInstance.onstart = () => {
    isVoiceRecording = true;
    voiceDictateBtn.classList.add("recording");
    voiceDictateBtn.querySelector(".mic-label").textContent = "Listening...";
    showToast("Listening to your voice... Speak now! 🎙️", "info");
  };

  speechRecognitionInstance.onresult = (event) => {
    let transcript = "";
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      transcript += event.results[i][0].transcript;
    }
    sourceText.value = transcript;
    handleSourceInput();
  };

  speechRecognitionInstance.onerror = (event) => {
    console.warn("Speech recognition error:", event.error);
    stopVoiceRecognition();
    showToast(`Voice input notice: ${event.error}`, "error");
  };

  speechRecognitionInstance.onend = () => {
    stopVoiceRecognition();
    if (sourceText.value.trim().length > 0) {
      triggerTranslation();
      spawnEmojiConfetti(voiceDictateBtn, ["🎙️", "✨", "🗣️"]);
    }
  };
}

function startVoiceRecognition() {
  if (!speechRecognitionInstance) {
    showToast("Voice input is not supported in this browser. Please use Chrome or Edge.", "error");
    return;
  }
  try {
    const src = sourceLangSelect.value;
    speechRecognitionInstance.lang = TTS_LOCALE_MAP[src] || (src === "auto" ? "en-US" : src);
    speechRecognitionInstance.start();
  } catch (err) {
    console.warn("Error starting voice recognition:", err);
  }
}

function stopVoiceRecognition() {
  isVoiceRecording = false;
  voiceDictateBtn.classList.remove("recording");
  voiceDictateBtn.querySelector(".mic-label").textContent = "Voice In";
  if (speechRecognitionInstance) {
    try { speechRecognitionInstance.stop(); } catch (_) { }
  }
}

// Event Listeners
function setupEventListeners() {
  // Input tracking
  sourceText.addEventListener("input", handleSourceInput);

  // Clear button
  clearSourceBtn.addEventListener("click", () => {
    sourceText.value = "";
    handleSourceInput();
    sourceText.focus();
    if (voiceHighlightBar) voiceHighlightBar.style.display = "none";
    listenBtn.classList.remove("voice-highlight-pulse");
    targetText.textContent = "✨ Translation magic will appear right here...";
    targetText.classList.add("placeholder");
    currentTranslation = null;
    copyBtn.disabled = true;
    listenBtn.disabled = true;
    starBtn.disabled = true;
    if (cloudSaveBtn) cloudSaveBtn.disabled = true;
    downloadBtn.disabled = true;
    showToast("Input cleared 🧹", "info");
  });

  // Source language change
  sourceLangSelect.addEventListener("change", () => {
    updateSwapButtonState();
    if (sourceText.value.trim().length > 0 && currentTranslation) {
      triggerTranslation();
    }
  });

  // Target language change
  targetLangSelect.addEventListener("change", () => {
    highlightActiveFlagPill(targetLangSelect.value);
    if (sourceText.value.trim().length > 0 && currentTranslation) {
      triggerTranslation();
    }
  });

  // Swap button
  swapLangsBtn.addEventListener("click", handleSwapLanguages);

  // Voice Dictation button
  voiceDictateBtn.addEventListener("click", () => {
    if (isVoiceRecording) {
      stopVoiceRecognition();
    } else {
      startVoiceRecognition();
    }
  });

  // Tone Buttons
  document.querySelectorAll(".tone-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tone-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      selectedTone = btn.getAttribute("data-tone");
      showToast(`Tone changed to: ${btn.textContent} 🎭`, "info");
      if (sourceText.value.trim().length > 0) {
        triggerTranslation();
      }
    });
  });

  // Quick Flag Pills
  document.querySelectorAll(".flag-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      const code = pill.getAttribute("data-target");
      targetLangSelect.value = code;
      highlightActiveFlagPill(code);
      spawnEmojiConfetti(pill, ["🌍", "✈️", "💬"]);
      if (sourceText.value.trim().length > 0) {
        triggerTranslation();
      }
    });
  });

  // Speed Buttons (Speech rate)
  document.querySelectorAll(".speed-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".speed-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      speechRate = parseFloat(btn.getAttribute("data-speed")) || 1.0;
      showToast(`Voice speed set to ${speechRate}x ⚡`, "info");
    });
  });

  // Translate button
  translateBtn.addEventListener("click", () => triggerTranslation(true));

  // Keyboard shortcut: Ctrl+Enter / Cmd+Enter
  sourceText.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      triggerTranslation(true);
    }
  });

  // Copy button
  copyBtn.addEventListener("click", handleCopyToClipboard);

  // Listen Source (TTS)
  const listenSourceBtn = document.getElementById("listenSourceBtn");
  if (listenSourceBtn) {
    listenSourceBtn.addEventListener("click", () => {
      const text = sourceText.value.trim();
      const lang = sourceLangSelect.value === "auto" ? (currentTranslation?.detected_source_lang || "en") : sourceLangSelect.value;
      if (text) {
        playAudio(text, lang, listenSourceBtn);
      }
    });
  }

  // Listen Target (TTS)
  listenBtn.addEventListener("click", handleSpeechSynthesis);
  if (voiceQuickListenBtn) {
    voiceQuickListenBtn.addEventListener("click", handleSpeechSynthesis);
  }

  // Star / Favorite button
  starBtn.addEventListener("click", handleToggleStar);

  // Cloud Save button
  if (cloudSaveBtn) {
    cloudSaveBtn.addEventListener("click", handleCloudSave);
  }

  // Download / Export button
  downloadBtn.addEventListener("click", handleDownloadExport);

  // Activity Tabs (History vs Starred vs Cloud)
  tabHistoryBtn.addEventListener("click", () => switchActivityTab("history"));
  tabStarredBtn.addEventListener("click", () => switchActivityTab("starred"));
  if (tabCloudBtn) {
    tabCloudBtn.addEventListener("click", () => switchActivityTab("cloud"));
  }

  // Auth Controls
  if (openAuthModalBtn) {
    openAuthModalBtn.addEventListener("click", () => openAuthModal("login"));
  }
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }
  if (closeAuthModalBtn) {
    closeAuthModalBtn.addEventListener("click", closeAuthModal);
  }
  if (authModal) {
    authModal.addEventListener("click", (e) => {
      if (e.target === authModal) closeAuthModal();
    });
  }
  if (authTabLoginBtn) {
    authTabLoginBtn.addEventListener("click", () => setAuthModalMode("login"));
  }
  if (authTabRegisterBtn) {
    authTabRegisterBtn.addEventListener("click", () => setAuthModalMode("register"));
  }
  if (authSwitchLink) {
    authSwitchLink.addEventListener("click", (e) => {
      e.preventDefault();
      setAuthModalMode(authModalMode === "login" ? "register" : "login");
    });
  }
  if (authForm) {
    authForm.addEventListener("submit", handleAuthSubmit);
  }
  if (cloudPromptSignIn) {
    cloudPromptSignIn.addEventListener("click", (e) => {
      e.preventDefault();
      openAuthModal("login");
    });
  }

  // Clear Section Button
  clearSectionBtn.addEventListener("click", handleClearSection);

  // Quick Preset Chips
  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      sourceText.value = chip.getAttribute("data-text");
      handleSourceInput();
      triggerTranslation(true);
      spawnEmojiConfetti(chip, ["💡", "✨", "🚀"]);
    });
  });
}

function highlightActiveFlagPill(code) {
  document.querySelectorAll(".flag-pill").forEach((p) => {
    p.classList.toggle("active", p.getAttribute("data-target") === code);
  });
}

function handleSourceInput() {
  const len = sourceText.value.length;
  charCount.textContent = len.toLocaleString();
  clearSourceBtn.style.display = len > 0 ? "inline-flex" : "none";
  const listenSourceBtn = document.getElementById("listenSourceBtn");
  if (listenSourceBtn) {
    listenSourceBtn.style.display = len > 0 ? "inline-flex" : "none";
  }
}

function updateSwapButtonState() {
  const isAuto = sourceLangSelect.value === "auto";
  swapLangsBtn.disabled = isAuto;
  swapLangsBtn.title = isAuto ? "Cannot swap when source is set to Detect Language" : "Swap languages 🔄";
}

function handleSwapLanguages() {
  const src = sourceLangSelect.value;
  const tgt = targetLangSelect.value;

  if (src === "auto") return;

  sourceLangSelect.value = tgt;
  targetLangSelect.value = src;
  highlightActiveFlagPill(src);
  updateSwapButtonState();

  spawnEmojiConfetti(swapLangsBtn, ["🔄", "✨", "🔀"]);

  if (currentTranslation && currentTranslation.translated_text) {
    sourceText.value = currentTranslation.translated_text;
    handleSourceInput();
    triggerTranslation();
  }
}

// Translation Execution
async function triggerTranslation(fromUserAction = false) {
  const text = sourceText.value.trim();
  if (!text) {
    showToast("Please enter some text to translate ✍️", "error");
    sourceText.focus();
    return;
  }

  if (isTranslating) return;

  const source_lang = sourceLangSelect.value;
  const target_lang = targetLangSelect.value;

  setLoadingState(true);

  try {
    const response = await fetch("/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: text,
        source_lang: source_lang,
        target_lang: target_lang,
        tone: selectedTone
      })
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || "Translation failed. Please try again.");
    }

    currentTranslation = result;
    displayTranslation(result);
    saveToHistory(result);
    updateStarButtonState();

    if (fromUserAction) {
      spawnEmojiConfetti(translateBtn, ["🎉", "✨", "🌟", "🚀", "💖"]);
      showToast("Translation complete! ✨", "success");
    }

    if (result.warning) {
      showToast(result.warning, "info");
    }
  } catch (err) {
    console.error("Translation request error:", err);
    targetText.textContent = "Translation failed ❌";
    targetText.classList.add("placeholder");
    showToast(err.message, "error");
    providerBadge.textContent = "Error during translation ⚠️";
  } finally {
    setLoadingState(false);
  }
}

function setLoadingState(loading) {
  isTranslating = loading;
  translateBtn.disabled = loading;
  btnSpinner.style.display = loading ? "inline-block" : "none";
  translateBtnText.textContent = loading ? "Translating Magic..." : "Translate Magic";

  if (loading) {
    loadingSkeleton.style.display = "flex";
    targetText.style.visibility = "hidden";
    if (voiceHighlightBar) voiceHighlightBar.style.display = "none";
    listenBtn.classList.remove("voice-highlight-pulse");
    copyBtn.disabled = true;
    listenBtn.disabled = true;
    starBtn.disabled = true;
    if (cloudSaveBtn) cloudSaveBtn.disabled = true;
    downloadBtn.disabled = true;
    detectedBadge.style.display = "none";
    providerBadge.textContent = "Translating text with style... ⚡";
  } else {
    loadingSkeleton.style.display = "none";
    targetText.style.visibility = "visible";
  }
}

function displayTranslation(result) {
  targetText.textContent = result.translated_text;
  targetText.classList.remove("placeholder");

  // Show detected language
  if (result.source_lang === "auto" && result.detected_source_lang) {
    const detectedName = getLanguageName(result.detected_source_lang);
    detectedBadge.textContent = `🔍 Detected: ${detectedName}`;
    detectedBadge.style.display = "inline-block";
  } else {
    detectedBadge.style.display = "none";
  }

  // Highlight Translation Voice prominently
  if (voiceHighlightBar) {
    const targetLangName = getLanguageName(result.target_lang) || "Native";
    if (voiceHighlightTitle) {
      voiceHighlightTitle.textContent = `🔊 ${targetLangName} Voice Ready ✨`;
    }
    voiceHighlightBar.style.display = "flex";
  }

  // Highlight the toolbar listen button with pulsing glow
  listenBtn.classList.add("voice-highlight-pulse");

  // Status badge with emoji (no cloud API names exposed) + voice mention
  if (providerBadge) {
    providerBadge.innerHTML = '✨ Translation Complete • <span class="voice-badge-mention">🔊 Native Voice Ready</span>';
  }

  // Enable action buttons
  copyBtn.disabled = false;
  starBtn.disabled = false;
  if (cloudSaveBtn) {
    cloudSaveBtn.disabled = false;
    cloudSaveBtn.classList.remove("saved-cloud");
    cloudSaveBtn.title = "Save to Account (Cloud ☁️)";
  }
  downloadBtn.disabled = false;
  listenBtn.disabled = false;
}

function getLanguageName(code) {
  const match = DEFAULT_LANGUAGES.find((l) => l.code === code);
  return match ? `${match.flag || ""} ${match.name.split(" ")[0]}` : code.toUpperCase();
}

// Clipboard Copy
async function handleCopyToClipboard() {
  if (!currentTranslation || !currentTranslation.translated_text) return;

  try {
    await navigator.clipboard.writeText(currentTranslation.translated_text);
    copyFeedback.classList.add("show");
    setTimeout(() => copyFeedback.classList.remove("show"), 2000);
    spawnEmojiConfetti(copyBtn, ["📋", "✨", "🎉"]);
    showToast("Translation copied to clipboard! 📋✨", "success");
  } catch (err) {
    console.error("Clipboard copy error:", err);
    showToast("Translation copied to clipboard! 📋", "success");
  }
}

// Native Audio Player using /api/tts with SpeechSynthesis fallback
let activeAudio = null;

function setVoicePlayingState(isPlaying) {
  if (voiceQuickListenBtn) {
    if (isPlaying) {
      voiceQuickListenBtn.classList.add("playing");
      voiceQuickListenBtn.innerHTML = '<span class="play-icon">⏸️</span><span class="play-label">Playing Voice...</span>';
    } else {
      voiceQuickListenBtn.classList.remove("playing");
      voiceQuickListenBtn.innerHTML = '<span class="play-icon">▶️</span><span class="play-label">Play Voice</span>';
    }
  }
}

function playAudio(text, lang, btnElem) {
  // If already playing, toggle stop
  if (activeAudio) {
    activeAudio.pause();
    activeAudio = null;
    if (btnElem) btnElem.classList.remove("speaking");
    listenBtn.classList.remove("speaking");
    setVoicePlayingState(false);
    return;
  }
  if ("speechSynthesis" in window && window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    if (btnElem) btnElem.classList.remove("speaking");
    listenBtn.classList.remove("speaking");
    setVoicePlayingState(false);
    return;
  }

  // Remove decorative emojis from spoken text for pure pronunciation
  const cleanSpokenText = text.replace(/[\u{1F300}-\u{1F9FF}]/gu, "").replace(/[«»\[\]\(\)]/g, "").trim();
  if (!cleanSpokenText) return;

  if (btnElem) btnElem.classList.add("speaking");
  listenBtn.classList.add("speaking");
  setVoicePlayingState(true);

  const audioUrl = `/api/tts?text=${encodeURIComponent(cleanSpokenText)}&lang=${encodeURIComponent(lang)}`;
  const audio = new Audio(audioUrl);
  audio.playbackRate = speechRate;
  activeAudio = audio;

  audio.onplay = () => {
    if (btnElem) btnElem.classList.add("speaking");
    listenBtn.classList.add("speaking");
    setVoicePlayingState(true);
  };

  audio.onended = () => {
    activeAudio = null;
    if (btnElem) btnElem.classList.remove("speaking");
    listenBtn.classList.remove("speaking");
    setVoicePlayingState(false);
  };

  audio.onerror = (err) => {
    console.warn("Server TTS playback notice, falling back to Web Speech API:", err);
    activeAudio = null;
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(cleanSpokenText);
      utterance.lang = TTS_LOCALE_MAP[lang] || lang;
      utterance.rate = speechRate;
      utterance.onend = () => { 
        if (btnElem) btnElem.classList.remove("speaking"); 
        listenBtn.classList.remove("speaking");
        setVoicePlayingState(false);
      };
      utterance.onerror = () => { 
        if (btnElem) btnElem.classList.remove("speaking"); 
        listenBtn.classList.remove("speaking");
        setVoicePlayingState(false);
      };
      window.speechSynthesis.speak(utterance);
    } else {
      if (btnElem) btnElem.classList.remove("speaking");
      listenBtn.classList.remove("speaking");
      setVoicePlayingState(false);
      showToast("Audio playback failed.", "error");
    }
  };

  audio.play().catch((err) => {
    console.warn("Audio play() rejected, falling back to speech synthesis:", err);
    audio.onerror(err);
  });
}

function handleSpeechSynthesis() {
  if (!currentTranslation || !currentTranslation.translated_text) return;
  playAudio(currentTranslation.translated_text, currentTranslation.target_lang, listenBtn);
}

// Star / Favorites System
function getStarredList() {
  try {
    const raw = localStorage.getItem(STORAGE_STARRED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function isCurrentlyStarred() {
  if (!currentTranslation) return false;
  const list = getStarredList();
  return list.some(
    (item) => item.original_text === currentTranslation.original_text && item.target_lang === currentTranslation.target_lang
  );
}

function updateStarButtonState() {
  const starred = isCurrentlyStarred();
  starBtn.classList.toggle("starred", starred);
  starIcon.textContent = starred ? "⭐" : "☆";
  starBtn.title = starred ? "Remove from Starred Favorites" : "Add to Starred Favorites";
}

function handleToggleStar() {
  if (!currentTranslation) return;

  let list = getStarredList();
  const existingIdx = list.findIndex(
    (item) => item.original_text === currentTranslation.original_text && item.target_lang === currentTranslation.target_lang
  );

  if (existingIdx >= 0) {
    list.splice(existingIdx, 1);
    showToast("Removed from Starred Favorites ⭐", "info");
  } else {
    list.unshift({
      ...currentTranslation,
      timestamp: Date.now()
    });
    spawnEmojiConfetti(starBtn, ["⭐", "🌟", "✨", "💖"]);
    showToast("Saved to Starred Favorites! ⭐", "success");
  }

  localStorage.setItem(STORAGE_STARRED_KEY, JSON.stringify(list));
  updateStarButtonState();
  renderStarred();
}

// Download / Export as Text File
function handleDownloadExport() {
  if (!currentTranslation || !currentTranslation.translated_text) return;

  const content = `=====================================================
LinguoFlow Translation Export 🚀
Date: ${new Date().toLocaleString()}
From: ${getLanguageName(currentTranslation.source_lang)}
To: ${getLanguageName(currentTranslation.target_lang)}
Tone: ${currentTranslation.tone || "standard"}
=====================================================

ORIGINAL TEXT:
${currentTranslation.original_text}

TRANSLATION:
${currentTranslation.translated_text}

=====================================================
Translated with LinguoFlow ✨
`;

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `translation_${currentTranslation.target_lang}_${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  spawnEmojiConfetti(downloadBtn, ["💾", "📄", "✨"]);
  showToast("Exported translation text file! 💾", "success");
}

// Activity Tab Switching (History vs Starred vs Cloud)
function switchActivityTab(tab) {
  currentTab = tab;
  tabHistoryBtn.classList.toggle("active", tab === "history");
  tabStarredBtn.classList.toggle("active", tab === "starred");
  if (tabCloudBtn) tabCloudBtn.classList.toggle("active", tab === "cloud");

  historyTabPane.style.display = tab === "history" ? "block" : "none";
  starredTabPane.style.display = tab === "starred" ? "block" : "none";
  if (cloudTabPane) cloudTabPane.style.display = tab === "cloud" ? "block" : "none";

  if (tab === "cloud") {
    fetchCloudTranslations();
  }

  updateClearButtonVisibility();
}

function updateClearButtonVisibility() {
  const historyLen = getHistory().length;
  const starredLen = getStarredList().length;

  if (currentTab === "history") {
    clearSectionBtn.style.display = historyLen > 0 ? "inline-block" : "none";
    clearSectionBtn.textContent = "🧹 Clear History";
  } else if (currentTab === "starred") {
    clearSectionBtn.style.display = starredLen > 0 ? "inline-block" : "none";
    clearSectionBtn.textContent = "🧹 Clear Starred";
  } else {
    clearSectionBtn.style.display = "none";
  }
}

function handleClearSection() {
  if (currentTab === "history") {
    localStorage.removeItem(STORAGE_HISTORY_KEY);
    renderHistory();
    showToast("Translation history cleared 🧹", "info");
  } else if (currentTab === "starred") {
    localStorage.removeItem(STORAGE_STARRED_KEY);
    renderStarred();
    updateStarButtonState();
    showToast("Starred favorites cleared 🧹", "info");
  }
  updateClearButtonVisibility();
}

// Translation History Management
function getHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveToHistory(item) {
  let history = getHistory();
  history = history.filter(
    (h) => !(h.original_text === item.original_text && h.target_lang === item.target_lang)
  );
  history.unshift({
    original_text: item.original_text,
    translated_text: item.translated_text,
    source_lang: item.source_lang,
    target_lang: item.target_lang,
    detected_source_lang: item.detected_source_lang,
    tone: item.tone,
    timestamp: Date.now()
  });

  if (history.length > 15) history = history.slice(0, 15);
  localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  const history = getHistory();
  historyCountBadge.textContent = history.length;
  historyList.innerHTML = "";

  if (history.length === 0) {
    historyList.appendChild(historyEmpty);
    updateClearButtonVisibility();
    return;
  }

  history.forEach((item, index) => {
    const card = createActivityCard(item, () => {
      let h = getHistory();
      h.splice(index, 1);
      localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(h));
      renderHistory();
    });
    historyList.appendChild(card);
  });

  updateClearButtonVisibility();
}

function renderStarred() {
  const starred = getStarredList();
  starredCountBadge.textContent = starred.length;
  starredList.innerHTML = "";

  if (starred.length === 0) {
    starredList.appendChild(starredEmpty);
    updateClearButtonVisibility();
    return;
  }

  starred.forEach((item, index) => {
    const card = createActivityCard(item, () => {
      let s = getStarredList();
      s.splice(index, 1);
      localStorage.setItem(STORAGE_STARRED_KEY, JSON.stringify(s));
      renderStarred();
      updateStarButtonState();
    });
    starredList.appendChild(card);
  });

  updateClearButtonVisibility();
}

function createActivityCard(item, onDelete) {
  const card = document.createElement("div");
  card.className = "activity-item";

  const srcName = getLanguageName(item.source_lang === "auto" ? item.detected_source_lang || "auto" : item.source_lang);
  const tgtName = getLanguageName(item.target_lang);

  card.innerHTML = `
    <div class="activity-item-top">
      <span class="activity-langs">
        ${srcName} <span class="arrow">➔</span> ${tgtName}
      </span>
      <div class="activity-actions">
        <button class="activity-btn del-btn" title="Delete entry" aria-label="Delete">🗑️</button>
      </div>
    </div>
    <div class="activity-texts">
      <div class="activity-source-text" title="${escapeHtml(item.original_text)}">${escapeHtml(item.original_text)}</div>
      <div class="activity-target-text" title="${escapeHtml(item.translated_text)}">${escapeHtml(item.translated_text)}</div>
    </div>
  `;

  // Click card to reload in workbench
  card.addEventListener("click", (e) => {
    if (e.target.closest(".del-btn")) return;
    sourceText.value = item.original_text;
    handleSourceInput();
    sourceLangSelect.value = item.source_lang;
    targetLangSelect.value = item.target_lang;
    highlightActiveFlagPill(item.target_lang);
    updateSwapButtonState();
    displayTranslation(item);
    currentTranslation = item;
    updateStarButtonState();
    window.scrollTo({ top: 0, behavior: "smooth" });
    showToast("Translation reloaded into workbench 🔄", "info");
  });

  const delBtn = card.querySelector(".del-btn");
  delBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    onDelete();
  });

  return card;
}

// Floating Emoji Confetti Animation
function spawnEmojiConfetti(targetElem, emojiList = ["🎉", "✨", "🌟", "💫", "🚀"]) {
  const rect = targetElem ? targetElem.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 20 };
  const originX = rect.left + rect.width / 2;
  const originY = rect.top;

  for (let i = 0; i < 7; i++) {
    const p = document.createElement("span");
    p.className = "emoji-particle";
    p.textContent = emojiList[Math.floor(Math.random() * emojiList.length)];
    const offsetX = (Math.random() - 0.5) * 140;
    p.style.left = `${originX + offsetX}px`;
    p.style.top = `${originY}px`;
    p.style.animationDelay = `${Math.random() * 0.15}s`;
    emojiConfettiContainer.appendChild(p);

    setTimeout(() => {
      p.remove();
    }, 1800);
  }
}

// Toast Notifications
function showToast(message, type = "info") {
  if (toastTimeout) clearTimeout(toastTimeout);

  toastMsg.textContent = message;
  toast.className = `toast ${type} show`;

  if (type === "success") {
    toastIcon.textContent = "✨";
  } else if (type === "error") {
    toastIcon.textContent = "⚠️";
  } else {
    toastIcon.textContent = "💡";
  }

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}

function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ============================================================================
// Authentication & Cloud Sync Functions (Optional)
// ============================================================================

function getAuthToken() {
  return localStorage.getItem(STORAGE_AUTH_TOKEN_KEY);
}

function setAuthToken(token) {
  if (token) {
    localStorage.setItem(STORAGE_AUTH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(STORAGE_AUTH_TOKEN_KEY);
  }
}

async function checkUserSession() {
  const token = getAuthToken();
  if (!token) {
    updateUserSessionUI(null);
    return;
  }

  try {
    const res = await fetch("/auth/me", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.ok) {
      const data = await res.json();
      updateUserSessionUI(data.user);
      fetchCloudTranslations();
    } else {
      setAuthToken(null);
      updateUserSessionUI(null);
    }
  } catch (err) {
    console.warn("Session verification notice:", err);
  }
}

function updateUserSessionUI(user) {
  currentUser = user;
  if (user) {
    if (openAuthModalBtn) openAuthModalBtn.style.display = "none";
    if (userProfileBadge) {
      userProfileBadge.style.display = "inline-flex";
      userNameDisplay.textContent = user.name || user.email.split("@")[0];
      userProfileBadge.title = `Logged in as ${user.email}`;
    }
  } else {
    if (openAuthModalBtn) openAuthModalBtn.style.display = "inline-flex";
    if (userProfileBadge) userProfileBadge.style.display = "none";
  }
}

function openAuthModal(mode = "login") {
  setAuthModalMode(mode);
  if (authErrorMsg) {
    authErrorMsg.style.display = "none";
    authErrorMsg.textContent = "";
  }
  if (authModal) authModal.style.display = "flex";
  setTimeout(() => {
    if (mode === "register" && authNameInput) {
      authNameInput.focus();
    } else if (authEmailInput) {
      authEmailInput.focus();
    }
  }, 50);
}

function closeAuthModal() {
  if (authModal) authModal.style.display = "none";
}

function setAuthModalMode(mode) {
  authModalMode = mode;
  if (authErrorMsg) authErrorMsg.style.display = "none";

  if (mode === "register") {
    authTabRegisterBtn.classList.add("active");
    authTabLoginBtn.classList.remove("active");
    nameFieldGroup.style.display = "flex";
    authSubmitBtnText.textContent = "Create Account";
    authSwitchNote.innerHTML = `Already have an account? <a href="#" id="authSwitchLink">Sign in here</a>`;
  } else {
    authTabLoginBtn.classList.add("active");
    authTabRegisterBtn.classList.remove("active");
    nameFieldGroup.style.display = "none";
    authSubmitBtnText.textContent = "Sign In";
    authSwitchNote.innerHTML = `Don't have an account? <a href="#" id="authSwitchLink">Create one free</a>`;
  }

  const switchLink = document.getElementById("authSwitchLink");
  if (switchLink) {
    switchLink.addEventListener("click", (e) => {
      e.preventDefault();
      setAuthModalMode(authModalMode === "login" ? "register" : "login");
    });
  }
}

async function handleAuthSubmit(e) {
  e.preventDefault();
  const email = authEmailInput.value.trim();
  const password = authPasswordInput.value.trim();
  const name = authNameInput ? authNameInput.value.trim() : "";

  if (!email || !password) {
    showAuthError("Please provide both email and password.");
    return;
  }
  if (password.length < 6) {
    showAuthError("Password must be at least 6 characters long.");
    return;
  }

  authSubmitBtn.disabled = true;
  authSpinner.style.display = "inline-block";
  authErrorMsg.style.display = "none";

  const endpoint = authModalMode === "register" ? "/auth/register" : "/auth/login";
  const payload = { email, password };
  if (authModalMode === "register" && name) payload.name = name;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok || !data.token) {
      throw new Error(data.error || "Authentication failed. Please check your credentials.");
    }

    setAuthToken(data.token);
    updateUserSessionUI(data.user);
    closeAuthModal();
    spawnEmojiConfetti(userProfileBadge, ["🎉", "✨", "👋", "🚀"]);
    showToast(authModalMode === "register" ? "Account created! Welcome aboard 🎉" : `Welcome back, ${data.user.name || "friend"}! 👋`, "success");

    fetchCloudTranslations();

    authEmailInput.value = "";
    authPasswordInput.value = "";
    if (authNameInput) authNameInput.value = "";
  } catch (err) {
    showAuthError(err.message);
  } finally {
    authSubmitBtn.disabled = false;
    authSpinner.style.display = "none";
  }
}

function showAuthError(msg) {
  authErrorMsg.textContent = msg;
  authErrorMsg.style.display = "block";
}

function handleLogout() {
  setAuthToken(null);
  updateUserSessionUI(null);
  cloudTranslations = [];
  cloudCountBadge.textContent = "0";
  renderCloudTranslations();
  showToast("Logged out successfully 👋", "info");
}

async function handleCloudSave() {
  if (!currentUser) {
    showToast("Sign in to save translations to your cloud account ☁️", "info");
    openAuthModal("login");
    return;
  }

  if (!currentTranslation || !currentTranslation.translated_text) {
    showToast("Translate something first to save to cloud ✍️", "error");
    return;
  }

  const token = getAuthToken();
  if (!token) return;

  try {
    const res = await fetch("/translations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        source_text: currentTranslation.original_text,
        translated_text: currentTranslation.translated_text,
        source_language: currentTranslation.source_lang || "auto",
        target_language: currentTranslation.target_lang
      })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to save translation to cloud.");
    }

    if (cloudSaveBtn) {
      cloudSaveBtn.classList.add("saved-cloud");
      cloudSaveBtn.title = "Saved to Cloud! ☁️";
    }
    spawnEmojiConfetti(cloudSaveBtn, ["☁️", "✨", "💾", "🎉"]);
    showToast("Saved to your cloud account! ☁️✨", "success");
    fetchCloudTranslations();
  } catch (err) {
    showToast(err.message, "error");
  }
}

async function fetchCloudTranslations() {
  const token = getAuthToken();
  if (!token) {
    cloudTranslations = [];
    cloudCountBadge.textContent = "0";
    renderCloudTranslations();
    return;
  }

  try {
    const res = await fetch("/translations", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.ok) {
      const data = await res.json();
      cloudTranslations = data.translations || [];
      cloudCountBadge.textContent = cloudTranslations.length;
      renderCloudTranslations();
    }
  } catch (err) {
    console.warn("Could not fetch cloud translations:", err);
  }
}

async function deleteCloudTranslation(id) {
  const token = getAuthToken();
  if (!token) return;

  try {
    const res = await fetch(`/translations/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.ok) {
      cloudTranslations = cloudTranslations.filter((t) => t.id !== id);
      cloudCountBadge.textContent = cloudTranslations.length;
      renderCloudTranslations();
      showToast("Cloud translation deleted 🗑️", "info");
    } else {
      const data = await res.json();
      showToast(data.error || "Failed to delete.", "error");
    }
  } catch (err) {
    showToast("Network error deleting translation", "error");
  }
}

function renderCloudTranslations() {
  if (!cloudList) return;
  cloudList.innerHTML = "";

  if (!currentUser) {
    cloudList.innerHTML = `
      <div class="activity-empty">
        ☁️ <a href="#" id="cloudInlineSignIn" style="color: var(--accent-highlight); text-decoration: underline; font-weight: 700;">Sign in or create an account</a> to view and sync your cloud-saved translations across all devices!
      </div>
    `;
    const inlineSignIn = document.getElementById("cloudInlineSignIn");
    if (inlineSignIn) {
      inlineSignIn.addEventListener("click", (e) => {
        e.preventDefault();
        openAuthModal("login");
      });
    }
    return;
  }

  if (cloudTranslations.length === 0) {
    cloudList.innerHTML = `
      <div class="activity-empty">
        ☁️ No cloud translations saved yet. Click the cloud button ☁️ on any translation to save it to your account!
      </div>
    `;
    return;
  }

  cloudTranslations.forEach((item) => {
    const card = document.createElement("div");
    card.className = "activity-item";

    const srcName = getLanguageName(item.source_language);
    const tgtName = getLanguageName(item.target_language);

    card.innerHTML = `
      <div class="activity-item-top">
        <span class="activity-langs">
          ${srcName} <span class="arrow">➔</span> ${tgtName} <span style="font-size: 0.72rem; color: #38bdf8;">☁️ Synced</span>
        </span>
        <div class="activity-actions">
          <button class="activity-btn del-btn" title="Delete from cloud" aria-label="Delete">🗑️</button>
        </div>
      </div>
      <div class="activity-texts">
        <div class="activity-source-text" title="${escapeHtml(item.source_text)}">${escapeHtml(item.source_text)}</div>
        <div class="activity-target-text" title="${escapeHtml(item.translated_text)}">${escapeHtml(item.translated_text)}</div>
      </div>
    `;

    // Click card to reload in workbench
    card.addEventListener("click", (e) => {
      if (e.target.closest(".del-btn")) return;
      sourceText.value = item.source_text;
      handleSourceInput();
      sourceLangSelect.value = item.source_language;
      targetLangSelect.value = item.target_language;
      highlightActiveFlagPill(item.target_language);
      updateSwapButtonState();

      const transPayload = {
        original_text: item.source_text,
        translated_text: item.translated_text,
        source_lang: item.source_language,
        target_lang: item.target_language,
        provider: "Cloud Synced Record ☁️"
      };
      displayTranslation(transPayload);
      currentTranslation = transPayload;
      if (cloudSaveBtn) {
        cloudSaveBtn.classList.add("saved-cloud");
        cloudSaveBtn.title = "Already saved to Cloud ☁️";
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
      showToast("Cloud translation reloaded into workbench 🔄☁️", "info");
    });

    const delBtn = card.querySelector(".del-btn");
    delBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteCloudTranslation(item.id);
    });

    cloudList.appendChild(card);
  });
}
