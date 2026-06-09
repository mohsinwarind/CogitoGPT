from pathlib import Path
import os

from dotenv import load_dotenv
from huggingface_hub import InferenceClient


BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

HF_TOKEN = os.getenv("HF_TOKEN") or os.getenv("HUGGINGFACEHUB_API_TOKEN")
HF_MODEL = os.getenv("HF_MODEL", "openai/gpt-oss-120b")


def _get_client():
    if not HF_TOKEN:
        raise ValueError(
            "Missing HF_TOKEN. Add HF_TOKEN=hf_... to the project root .env file."
        )
    return InferenceClient(api_key=HF_TOKEN)

def query_huggingface(prompt, model=None):
    client = _get_client()
    selected_model = model or HF_MODEL
    response = client.chat_completion(
        messages=[{"role": "user", "content": prompt}],
        model=selected_model,
        max_tokens=1000,
    )
    return response.choices[0].message.content or ""