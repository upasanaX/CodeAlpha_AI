"""
Language Translation Web Application - LinguoFlow PRO
=====================================================
A full-stack Flask web application supporting:
- High-Accuracy Google Neural Translation (googletrans & Google Cloud API v3)
- High-Fidelity Native Voice Text-to-Speech (gTTS & Web Speech API)
- Real-Time Voice Dictation (Speech-to-Text)
- Tone variations (Standard, Casual, Business, Poetic)
"""

import os
import io
import re
import sys
import logging
import requests
from flask import Flask, request, jsonify, render_template, send_file
from dotenv import load_dotenv
from gtts import gTTS
from googletrans import Translator

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Global Translator instance
translator = Translator()

# Configuration
GOOGLE_PROJECT_ID = os.getenv("PROJECT_ID", "").strip()
GOOGLE_CREDENTIALS = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "").strip()
MOCK_TRANSLATION = os.getenv("MOCK_TRANSLATION", "false").lower() in ("true", "1", "yes")

# Supported languages list with Country Flag Emojis & Display Names
SUPPORTED_LANGUAGES = [
    {"code": "auto", "name": "Detect Language", "flag": "✨", "source_only": True},
    {"code": "en", "name": "English", "flag": "🇺🇸"},
    {"code": "es", "name": "Spanish (Español)", "flag": "🇪🇸"},
    {"code": "fr", "name": "French (Français)", "flag": "🇫🇷"},
    {"code": "de", "name": "German (Deutsch)", "flag": "🇩🇪"},
    {"code": "hi", "name": "Hindi (हिन्दी)", "flag": "🇮🇳"},
    {"code": "bn", "name": "Bengali (বাংলা)", "flag": "🇧🇩"},
    {"code": "zh-cn", "name": "Chinese Simplified (简体中文)", "flag": "🇨🇳"},
    {"code": "ja", "name": "Japanese (日本語)", "flag": "🇯🇵"},
    {"code": "ko", "name": "Korean (한국어)", "flag": "🇰🇷"},
    {"code": "ar", "name": "Arabic (العربية)", "flag": "🇸🇦"},
    {"code": "pt", "name": "Portuguese (Português)", "flag": "🇧🇷"},
    {"code": "it", "name": "Italian (Italiano)", "flag": "🇮🇹"},
    {"code": "ru", "name": "Russian (Русский)", "flag": "🇷🇺"},
    {"code": "nl", "name": "Dutch (Nederlands)", "flag": "🇳🇱"},
    {"code": "tr", "name": "Turkish (Türkçe)", "flag": "🇹🇷"},
    {"code": "vi", "name": "Vietnamese (Tiếng Việt)", "flag": "🇻🇳"},
    {"code": "th", "name": "Thai (ไทย)", "flag": "🇹🇭"},
    {"code": "el", "name": "Greek (Ελληνικά)", "flag": "🇬🇷"},
    {"code": "ta", "name": "Tamil (தமிழ்)", "flag": "🇮🇳"},
    {"code": "te", "name": "Telugu (తెలుగు)", "flag": "🇮🇳"},
    {"code": "mr", "name": "Marathi (मराठी)", "flag": "🇮🇳"},
    {"code": "gu", "name": "Gujarati (ગુજરાતી)", "flag": "🇮🇳"},
    {"code": "ur", "name": "Urdu (اردو)", "flag": "🇵🇰"},
]

# Quick offline fallback dictionary
OFFLINE_DICTIONARY = {
    "hello": {
        "es": "Hola", "fr": "Bonjour", "de": "Hallo", "hi": "नमस्ते",
        "bn": "নমস্কার", "zh-cn": "你好", "ja": "こんにちは", "ko": "안녕하세요",
        "ar": "مرحبا", "pt": "Olá", "it": "Ciao", "ru": "Привет"
    },
    "i am eating": {
        "bn": "আমি খাচ্ছি", "es": "Estoy comiendo", "fr": "Je mange",
        "hi": "मैं खा रहा हूँ", "de": "Ich esse", "ja": "食べています"
    },
    "welcome": {
        "es": "Bienvenido", "fr": "Bienvenue", "de": "Willkommen", "hi": "स्वागत हे",
        "bn": "স্বাগতম", "zh-cn": "欢迎", "ja": "ようこそ", "ko": "환영합니다",
        "ar": "أهلاً وسهلاً", "pt": "Bem-vindo", "it": "Benvenuto", "ru": "Добро пожаловать"
    },
    "thank you": {
        "es": "Muchas gracias", "fr": "Merci beaucoup", "de": "Vielen Dank", "hi": "बहुत बहुत धन्यवाद",
        "bn": "অনেক ধন্যবাদ", "zh-cn": "非常感谢", "ja": "どうもありがとうございます", "ko": "정말 감사합니다",
        "ar": "شكراً جزيلاً", "pt": "Muito obrigado", "it": "Grazie mille", "ru": "Большое спасибо"
    }
}


def apply_tone_styling(text: str, tone: str) -> str:
    """Applies creative tone styling to translation output."""
    res = text.strip()
    if tone == "casual" and not any(e in res for e in ["😊", "✨", "🎉"]):
        res = f"{res} 😊✨"
    elif tone == "poetic" and not res.startswith("«"):
        res = f"« {res} » 🌸"
    return res


def translate_with_googletrans(text: str, source_lang: str, target_lang: str, tone: str = "standard") -> dict:
    """
    Translates text accurately using Google Translate's neural models via googletrans.
    Fixes community translation errors like 'i am eating' -> 'আমি পড়ছি'.
    """
    # Normalize language code for Google Translate
    tgt = "zh-cn" if target_lang in ["zh", "zh-cn"] else target_lang
    src = "auto" if not source_lang or source_lang == "auto" else source_lang

    trans_result = translator.translate(text, src=src, dest=tgt)
    translated_text = trans_result.text.strip()
    detected_lang = getattr(trans_result.src, "name", None) or trans_result.src or source_lang

    final_text = apply_tone_styling(translated_text, tone)

    return {
        "translated_text": final_text,
        "detected_source_lang": detected_lang,
        "provider": "Google Neural Translation Engine 🌐",
        "is_mock": False
    }


def translate_with_google_cloud_v3(text: str, source_lang: str, target_lang: str, tone: str = "standard") -> dict:
    """Translates text using Google Cloud Translation API v3 when GCP credentials exist."""
    try:
        from google.cloud import translate_v3 as translate
    except ImportError as e:
        raise RuntimeError("Google Cloud Translation client library is not installed.") from e

    if not GOOGLE_PROJECT_ID or GOOGLE_PROJECT_ID == "your-google-cloud-project-id":
        raise ValueError("PROJECT_ID is not configured in .env.")

    client = translate.TranslationServiceClient()
    parent = f"projects/{GOOGLE_PROJECT_ID}/locations/global"

    tgt = "zh-CN" if target_lang in ["zh", "zh-cn"] else target_lang

    request_payload = {
        "parent": parent,
        "contents": [text],
        "mime_type": "text/plain",
        "target_language_code": tgt,
    }

    if source_lang and source_lang != "auto":
        request_payload["source_language_code"] = source_lang

    logger.info(f"Calling Google Cloud Translation API v3: source={source_lang}, target={target_lang}")
    response = client.translate_text(request=request_payload)

    if not response.translations:
        raise RuntimeError("No translation returned by Google Cloud Translation API.")

    first_trans = response.translations[0]
    raw_translated_text = first_trans.translated_text
    detected_lang = getattr(first_trans, "detected_language_code", None) or source_lang
    final_text = apply_tone_styling(raw_translated_text, tone)

    return {
        "translated_text": final_text,
        "detected_source_lang": detected_lang,
        "provider": "Google Cloud Translation API v3 🚀",
        "is_mock": False
    }


def translate_with_mymemory_mt(text: str, source_lang: str, target_lang: str, tone: str = "standard") -> dict:
    """Backup translation using Machine Translation API only (avoiding crowd-sourced errors)."""
    src = "autodetect" if source_lang == "auto" else source_lang
    langpair = f"{src}|{target_lang}"

    url = "https://api.mymemory.translated.net/get"
    params = {
        "q": text,
        "langpair": langpair,
        "mt": "1"  # Force machine translation
    }
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) LinguoFlow/2.0"
    }

    resp = requests.get(url, params=params, headers=headers, timeout=10)
    resp.raise_for_status()
    data = resp.json()

    translated_text = data.get("responseData", {}).get("translatedText", "").strip()
    if not translated_text or "MYMEMORY WARNING" in translated_text:
        raise RuntimeError("MyMemory returned invalid response")

    detected_lang = data.get("responseData", {}).get("detectedLanguage") or (source_lang if source_lang != "auto" else "en")
    final_text = apply_tone_styling(translated_text, tone)

    return {
        "translated_text": final_text,
        "detected_source_lang": detected_lang,
        "provider": "Neural Machine Translation 🌐",
        "is_mock": False
    }


def translate_with_offline_fallback(text: str, source_lang: str, target_lang: str, tone: str = "standard") -> dict:
    """Offline dictionary fallback if internet is completely disconnected."""
    cleaned = text.strip().lower()
    if cleaned in OFFLINE_DICTIONARY and target_lang in OFFLINE_DICTIONARY[cleaned]:
        translated_text = OFFLINE_DICTIONARY[cleaned][target_lang]
    else:
        target_lang_item = next((l for l in SUPPORTED_LANGUAGES if l["code"] == target_lang), None)
        target_name = target_lang_item["name"].split(" ")[0] if target_lang_item else target_lang
        target_flag = target_lang_item.get("flag", "🌐") if target_lang_item else "🌐"
        translated_text = f"[{target_flag} {target_name}] {text}"

    final_text = apply_tone_styling(translated_text, tone)
    return {
        "translated_text": final_text,
        "detected_source_lang": "en" if source_lang == "auto" else source_lang,
        "provider": "Local Fallback Engine ✨",
        "is_mock": True
    }


@app.route("/")
def index():
    """Renders the main translation single-page web app."""
    return render_template("index.html")


@app.route("/api/languages", methods=["GET"])
def get_languages():
    """Returns the list of supported languages with emojis and flags."""
    return jsonify({"languages": SUPPORTED_LANGUAGES})


@app.route("/api/status", methods=["GET"])
def get_status():
    """Returns the backend configuration status."""
    has_gcp_project = bool(GOOGLE_PROJECT_ID and GOOGLE_PROJECT_ID != "your-google-cloud-project-id")
    has_gcp_creds = bool(GOOGLE_CREDENTIALS and os.path.exists(GOOGLE_CREDENTIALS))
    is_live_gcp = has_gcp_project and (has_gcp_creds or "GOOGLE_APPLICATION_CREDENTIALS" in os.environ) and not MOCK_TRANSLATION

    return jsonify({
        "status": "online",
        "live_mode": True,
        "gcp_live": is_live_gcp,
        "active_provider": "Google Cloud Translation v3 🚀" if is_live_gcp else "Google Neural Translation Engine 🌐"
    })


@app.route("/api/tts", methods=["GET"])
def text_to_speech():
    """
    Generates realistic, native pronunciation audio using gTTS.
    Params:
        - text: string to speak
        - lang: ISO language code (e.g. 'es', 'fr', 'hi', 'bn', 'ja', 'de')
    Returns: audio/mp3 stream
    """
    text = request.args.get("text", "").strip()
    lang = request.args.get("lang", "en").strip().lower()

    if not text:
        return jsonify({"error": "No text provided for pronunciation."}), 400

    # Clean out decorative emojis and brackets so TTS speaks the exact language words naturally
    clean_text = re.sub(r'[\U00010000-\U0010ffff]', '', text)
    clean_text = re.sub(r'[«»\[\]\(\)]', '', clean_text).strip()
    if not clean_text:
        clean_text = text

    # Supported gTTS code normalization
    gtts_lang = lang.split("-")[0]
    if lang.startswith("zh"):
        gtts_lang = "zh-CN"

    try:
        fp = io.BytesIO()
        tts = gTTS(text=clean_text, lang=gtts_lang, slow=False)
        tts.write_to_fp(fp)
        fp.seek(0)
        return send_file(fp, mimetype="audio/mp3", as_attachment=False)
    except Exception as e:
        logger.warning(f"gTTS error for lang {lang}: {e}. Trying fallback...")
        try:
            fp = io.BytesIO()
            tts = gTTS(text=clean_text, lang="en", slow=False)
            tts.write_to_fp(fp)
            fp.seek(0)
            return send_file(fp, mimetype="audio/mp3", as_attachment=False)
        except Exception as e2:
            logger.error(f"Fallback TTS failed: {e2}")
            return jsonify({"error": "Audio synthesis failed"}), 500


@app.route("/translate", methods=["POST"])
def translate():
    """
    POST endpoint to perform text translation.
    Request JSON:
        - text: str (required, non-empty, <= 5000 chars)
        - source_lang: str (optional, default: "auto")
        - target_lang: str (required, non-empty)
        - tone: str (optional: "standard", "casual", "formal", "poetic")
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Invalid request. JSON body is required."}), 400

    text = data.get("text", "")
    if not isinstance(text, str) or not text.strip():
        return jsonify({"error": "Please provide non-empty text to translate."}), 400

    text = text.strip()
    if len(text) > 5000:
        return jsonify({"error": "Text exceeds the maximum limit of 5,000 characters."}), 400

    target_lang = data.get("target_lang", "").strip()
    if not target_lang or target_lang == "auto":
        return jsonify({"error": "Please select a valid target language."}), 400

    source_lang = data.get("source_lang", "auto").strip() or "auto"
    tone = data.get("tone", "standard").strip().lower()
    if tone not in ["standard", "casual", "formal", "poetic"]:
        tone = "standard"

    has_gcp_project = bool(GOOGLE_PROJECT_ID and GOOGLE_PROJECT_ID != "your-google-cloud-project-id")
    use_gcp = has_gcp_project and not MOCK_TRANSLATION

    result = None
    warning_msg = None

    # 1. Try Google Cloud Translation API v3 if configured
    if use_gcp:
        try:
            result = translate_with_google_cloud_v3(text, source_lang, target_lang, tone=tone)
        except Exception as gcp_err:
            logger.warning(f"Google Cloud Translation v3 failed: {gcp_err}. Trying Google Neural Engine.")
            warning_msg = f"GCP notice: {gcp_err}."

    # 2. Try Google Neural Translation (googletrans)
    if not result:
        try:
            result = translate_with_googletrans(text, source_lang, target_lang, tone=tone)
        except Exception as gt_err:
            logger.warning(f"Google Neural translation error: {gt_err}. Trying backup MT engine.")
            try:
                result = translate_with_mymemory_mt(text, source_lang, target_lang, tone=tone)
            except Exception as mt_err:
                logger.warning(f"Backup MT engine error: {mt_err}. Using local fallback.")
                result = translate_with_offline_fallback(text, source_lang, target_lang, tone=tone)
                warning_msg = "Network notice: translated using local fallback."

    response_payload = {
        "success": True,
        "original_text": text,
        "translated_text": result["translated_text"],
        "source_lang": source_lang,
        "detected_source_lang": result.get("detected_source_lang", source_lang),
        "target_lang": target_lang,
        "tone": tone,
        "provider": result.get("provider", "Google Neural Translation Engine 🌐"),
        "is_mock": result.get("is_mock", False),
    }
    if warning_msg:
        response_payload["warning"] = warning_msg

    return jsonify(response_payload)


# =====================================================================
# Database & Authentication (Optional User Accounts & Cloud Sync)
# =====================================================================
import sqlite3
import datetime
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash
import jwt

DB_PATH = os.path.join(os.path.dirname(__file__), "translations.db")
JWT_SECRET = os.getenv("JWT_SECRET", "linguoflow_super_secret_jwt_key_987654321")
JWT_EXPIRES_DAYS = 14


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS translations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                source_text TEXT NOT NULL,
                translated_text TEXT NOT NULL,
                source_language TEXT NOT NULL,
                target_language TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_trans_user ON translations(user_id, created_at DESC)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)")
        conn.commit()


# Initialize database on startup
init_db()


def generate_jwt_token(user_id: int, email: str) -> str:
    payload = {
        "user_id": user_id,
        "email": email,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=JWT_EXPIRES_DAYS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")


def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Authorization token required."}), 401

        token = auth_header.split(" ", 1)[1].strip()
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            user_id = payload.get("user_id")

            with get_db() as conn:
                user = conn.execute("SELECT id, name, email, created_at FROM users WHERE id = ?", (user_id,)).fetchone()
                if not user:
                    return jsonify({"error": "User account not found."}), 404

            request.current_user = dict(user)
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Session expired. Please log in again."}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid authentication token."}), 401
        except Exception as e:
            return jsonify({"error": f"Authentication failure: {str(e)}"}), 401

        return f(*args, **kwargs)
    return decorated


# ---------------------------------------------------------------------
# Auth Endpoints
# ---------------------------------------------------------------------
@app.route("/auth/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "").strip()
    name = data.get("name", "").strip() or None

    if not email or "@" not in email:
        return jsonify({"error": "Please provide a valid email address."}), 400
    if not password or len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters long."}), 400

    password_hash = generate_password_hash(password)

    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
                (name, email, password_hash)
            )
            user_id = cursor.lastrowid
            conn.commit()

        token = generate_jwt_token(user_id, email)
        return jsonify({
            "message": "Account created successfully.",
            "token": token,
            "user": {
                "id": user_id,
                "name": name,
                "email": email
            }
        }), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "An account with this email already exists."}), 400
    except Exception as e:
        logger.exception("Registration error")
        return jsonify({"error": "Failed to create account."}), 500


@app.route("/auth/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "").strip()

    if not email or not password:
        return jsonify({"error": "Email and password are required."}), 400

    with get_db() as conn:
        user = conn.execute(
            "SELECT id, name, email, password_hash FROM users WHERE email = ?",
            (email,)
        ).fetchone()

    if not user or not check_password_hash(user["password_hash"], password):
        return jsonify({"error": "Invalid email or password."}), 401

    token = generate_jwt_token(user["id"], user["email"])
    return jsonify({
        "message": "Login successful.",
        "token": token,
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"]
        }
    }), 200


@app.route("/auth/me", methods=["GET"])
@require_auth
def get_current_user():
    return jsonify({"user": request.current_user}), 200


# ---------------------------------------------------------------------
# Cloud Saved Translations Endpoints
# ---------------------------------------------------------------------
@app.route("/translations", methods=["POST"])
@require_auth
def save_translation():
    data = request.get_json(silent=True) or {}
    source_text = data.get("source_text", "").strip()
    translated_text = data.get("translated_text", "").strip()
    source_language = data.get("source_language", "auto").strip()
    target_language = data.get("target_language", "").strip()

    if not source_text or not translated_text or not target_language:
        return jsonify({"error": "Missing required fields (source_text, translated_text, target_language)."}), 400

    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO translations (user_id, source_text, translated_text, source_language, target_language)
            VALUES (?, ?, ?, ?, ?)
            """,
            (request.current_user["id"], source_text, translated_text, source_language, target_language)
        )
        trans_id = cursor.lastrowid
        conn.commit()

        item = conn.execute("SELECT * FROM translations WHERE id = ?", (trans_id,)).fetchone()

    return jsonify({
        "message": "Translation saved to cloud account! ☁️",
        "translation": dict(item)
    }), 201


@app.route("/translations", methods=["GET"])
@require_auth
def list_saved_translations():
    limit = min(max(int(request.args.get("limit", 20)), 1), 100)
    offset = max(int(request.args.get("offset", 0)), 0)
    user_id = request.current_user["id"]

    with get_db() as conn:
        items = conn.execute(
            """
            SELECT id, source_text, translated_text, source_language, target_language, created_at
            FROM translations
            WHERE user_id = ?
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?
            """,
            (user_id, limit, offset)
        ).fetchall()

        total = conn.execute(
            "SELECT COUNT(*) as cnt FROM translations WHERE user_id = ?",
            (user_id,)
        ).fetchone()["cnt"]

    return jsonify({
        "translations": [dict(row) for row in items],
        "pagination": {
            "total": total,
            "limit": limit,
            "offset": offset,
            "hasMore": offset + len(items) < total
        }
    }), 200


@app.route("/translations/<int:item_id>", methods=["DELETE"])
@require_auth
def delete_saved_translation(item_id):
    user_id = request.current_user["id"]
    with get_db() as conn:
        item = conn.execute(
            "SELECT id FROM translations WHERE id = ? AND user_id = ?",
            (item_id, user_id)
        ).fetchone()

        if not item:
            return jsonify({"error": "Translation not found or unauthorized to delete."}), 404

        conn.execute("DELETE FROM translations WHERE id = ? AND user_id = ?", (item_id, user_id))
        conn.commit()

    return jsonify({"message": "Translation deleted successfully.", "id": item_id}), 200


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("DEBUG", "True").lower() in ("true", "1")
    logger.info(f"Starting Language Translation Web App on http://127.0.0.1:{port}")
    app.run(host="0.0.0.0", port=port, debug=debug)

