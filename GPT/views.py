from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.files.storage import default_storage
from django.shortcuts import render 
import markdown2
import os
import PyPDF2
import docx
from .utils import *

def index(request):
    return render(request , "GPT/index.html")


@api_view(['POST'])
def upload_file(request):
    file = request.FILES['file']
    question = request.data.get("question")

    if not file and "extracted_text" in request.session:
        extracted_text = request.session["extracted_text"]
    elif file:
        file_path = default_storage.save(file.name,file)
        ext = os.path.splitext(file.name)[1].lower()
        text =""


        try:
            if ext == ".pdf":
                with open(file_path,'rb') as pdf_file:
                    reader = PyPDF2.PdfReader(pdf_file)
                    for page in reader.pages:
                        text += page.extract_text()+ "\n"
                        print(text)
            elif ext ==".docx":
                doc = docx.Document(file_path)
                for para in doc.paragraphs:
                    text += para.text+"\n"
                    print(text)

            elif ext == ".txt":
                with open(file_path , "r", encoding="utf-8") as txt_file :
                    text = txt_file.read()
            else:
                return Response({"error" : "Unsupported Filf format unfortunately"},status=400)
        finally:
            default_storage.delete(file_path)
        
        extracted_text = text.strip()
        request.session["extracted_text"] = extracted_text

    else:
        return Response({"Error" : "No file or content availbale" },status=400)
    
            
            
    answer= None
    if question:
        prompt = f"""
You are a polite and respectful assistant. 
Answer the user's question **only based on the provided document**. 
Use **numbered points, bullet points, and short paragraphs** to make the answer clear. 

Document:
\"\"\"
{extracted_text}
\"\"\"

Question: {question}

Answer:
"""

        raw_answer = query_huggingface(prompt)
        answer = markdown2.markdown(raw_answer)
    
    return Response({"filename" : file.name if file else "Previously uploaded file", "answer" : answer})
            
    