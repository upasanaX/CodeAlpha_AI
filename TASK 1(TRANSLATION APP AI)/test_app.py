import json
import unittest
from app import app

class TranslationAppTestCase(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()

    def test_index_route(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"LinguoFlow", response.data)

    def test_languages_route_with_flags(self):
        response = self.client.get('/api/languages')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn("languages", data)
        self.assertGreater(len(data["languages"]), 10)
        # Verify flag emojis are present
        self.assertIn("flag", data["languages"][1])

    def test_status_route(self):
        response = self.client.get('/api/status')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data["status"], "online")

    def test_translate_empty(self):
        response = self.client.post('/translate', json={
            "text": "",
            "source_lang": "en",
            "target_lang": "es"
        })
        self.assertEqual(response.status_code, 400)

    def test_translate_missing_target(self):
        response = self.client.post('/translate', json={
            "text": "Hello",
            "source_lang": "en",
            "target_lang": "auto"
        })
        self.assertEqual(response.status_code, 400)

    def test_translate_valid_standard_tone(self):
        response = self.client.post('/translate', json={
            "text": "Hello",
            "source_lang": "auto",
            "target_lang": "es",
            "tone": "standard"
        })
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertTrue(data["success"])
        self.assertEqual(data["translated_text"], "Hola")
        self.assertEqual(data["tone"], "standard")

    def test_translate_casual_tone(self):
        response = self.client.post('/translate', json={
            "text": "Hello",
            "source_lang": "auto",
            "target_lang": "es",
            "tone": "casual"
        })
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertTrue(data["success"])
        self.assertIn("😊", data["translated_text"])
        self.assertEqual(data["tone"], "casual")

    def test_translate_poetic_tone(self):
        response = self.client.post('/translate', json={
            "text": "Hello",
            "source_lang": "auto",
            "target_lang": "es",
            "tone": "poetic"
        })
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertTrue(data["success"])
        self.assertIn("«", data["translated_text"])
        self.assertEqual(data["tone"], "poetic")

if __name__ == '__main__':
    unittest.main()
