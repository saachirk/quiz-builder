import requests
import json
from django.conf import settings

API_URL = "https://router.huggingface.co/v1/chat/completions"

headers = {
    "Authorization": f"Bearer {settings.HF_API_KEY}",
    "Content-Type": "application/json"
}


def generate_quiz(topic, number_of_questions, difficulty):
    prompt = f"""
Generate {number_of_questions} multiple choice questions about {topic}.
Difficulty level: {difficulty}.

Rules:
- Each question must have exactly 4 options.
- Only ONE option must be correct.
- Ensure the correctAnswer EXACTLY matches one of the options.
- Double-check factual correctness before answering.
- Do NOT guess facts.
- Return ONLY valid JSON.

Format:

[
  {{
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": "Exact option text"
  }}
]
"""

    payload = {
        "model": "meta-llama/Llama-3.1-8B-Instruct",
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 800,
        "temperature": 0.7
    }

    try:
        response = requests.post(API_URL, headers=headers, json=payload)

        print("STATUS CODE:", response.status_code)
        print("RAW RESPONSE:", response.text)

        if response.status_code != 200:
            return None

        result = response.json()
        text = result["choices"][0]["message"]["content"]

        # -------- CLEAN RESPONSE -------- #

        # Remove markdown code blocks if model still adds them
        if "```" in text:
            parts = text.split("```")
            if len(parts) >= 2:
                text = parts[1]

        text = text.replace("json", "").strip()

        # Extract JSON array safely
        start = text.find("[")
        end = text.rfind("]") + 1

        if start == -1 or end == 0:
            print("JSON ARRAY NOT FOUND")
            return None

        json_text = text[start:end]

        quiz_data = json.loads(json_text)

        return quiz_data

    except Exception as e:
        print("ERROR:", str(e))
        return None