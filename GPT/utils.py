from huggingface_hub import InferenceClient
import os 

HF_TOKEN = os.getenv("HF_TOKEN")
client = InferenceClient(api_key = HF_TOKEN)


def query_huggingface(prompt,model="mistralai/Mistral-7B-Instruct-v0.3"):
    response = client.chat_completion(
        model = model,
        messages = [{"role" : "user" , "content" : prompt}],
        max_tokens=1000,
    )
    try :
        return response.choices[0].message.content
    except TypeError:
        return response.choices[0].message.content