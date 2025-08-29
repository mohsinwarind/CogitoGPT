import sys
import os

from CogitoGPT.wsgi import application

# Make sure Python finds your project
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

app = application
