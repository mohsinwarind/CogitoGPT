from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.files.storage import default_storage
from django.shortcuts import render 
import markdown2
import os
import PyPDF2
import docx
from .utils import *
from io import BytesIO
def index(request):
    return render(request , "GPT/index.html")


@api_view(['POST'])
def upload_file(request):
    try:
        file = request.FILES.get('file')
        question = request.data.get("question")

        # Case: use existing extracted text from session
        if not file and "extracted_text" in request.session:
            extracted_text = request.session["extracted_text"]

        elif file:
            ext = os.path.splitext(file.name)[1].lower()
            text = ""

            try:
                if ext == ".pdf":
                    pdf_reader = PyPDF2.PdfReader(BytesIO(file.read()))
                    for page in pdf_reader.pages:
                        text += page.extract_text() + "\n"

                elif ext == ".docx":
                    doc = docx.Document(BytesIO(file.read()))
                    for para in doc.paragraphs:
                        text += para.text + "\n"

                elif ext == ".txt":
                    text = file.read().decode("utf-8")

                else:
                    return Response({"error": "Unsupported file format"}, status=400)

            except Exception as e:
                return Response({"error": f"Failed to process file: {str(e)}"}, status=500)

            extracted_text = text.strip()
            request.session["extracted_text"] = extracted_text

        else:
            return Response({"error": "No file or content available"}, status=400)

    except Exception as e:
        return Response({"error": f"An error occurred: {str(e)}"}, status=500)

    # Ask question from document
    answer = None
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

    return Response({
        "filename": file.name if file else "Previously uploaded file",
        "answer": answer
    })
