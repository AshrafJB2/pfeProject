import PyPDF2
from docx import Document as DocxDocument
import google.generativeai as genai

# Configure Gemini
genai.configure(api_key='AIzaSyB8wROhYarpnzPbmE1tUwNJuX1Uhj35-40')
model = genai.GenerativeModel('gemini-1.5-flash')

def extract_text(file, filename):
    """Extract text from different file types"""
    ext = filename.split('.')[-1].lower()
    
    if ext == 'pdf':
        reader = PyPDF2.PdfReader(file)
        return " ".join([page.extract_text() for page in reader.pages])
    elif ext in ['docx', 'doc']:
        doc = DocxDocument(file)
        return "\n".join([para.text for para in doc.paragraphs])
    else:  # txt and fallback
        if hasattr(file, 'read'):
            return file.read().decode('utf-8')
        return str(file)

def process_with_gemini(text, length=25):
    """Handle all Gemini processing with better length control"""
    # Calculate target word count based on percentage
    word_count = len(text.split())
    
    if isinstance(length, str):
        length = length.lower()
        if length == 'short':
            target_words = max(20, int(word_count * 0.1))  # 10% but min 20 words
        elif length == 'medium':
            target_words = int(word_count * 0.25)  # 25%
        elif length == 'long':
            target_words = int(word_count * 0.5)  # 50%
        else:
            target_words = int(word_count * 0.25)  # default
    else:
        # Ensure percentage is between 5-90%
        percentage = max(5, min(90, int(length)))
        target_words = int(word_count * (percentage/100))
    
    # First get the full analysis
    analysis_prompt = f"""
    Analyze this text and:
    1. Identify the 5-10 most important keywords (comma-separated)
    2. Create a concise 3-7 word title
    
    Return in this format:
    KEYWORDS: [comma, separated, keywords]
    TITLE: [title text here]
    
    Text: {text[:10000]}  # Limit to first 10k chars to avoid token limits
    """
    
    # Then get the summary with explicit word count control
    summary_prompt = f"""
    Write a comprehensive summary of the following text in exactly {target_words} words.
    Focus on the main ideas and key points.
    
    Text: {text[:10000]}  # Limit to first 10k chars
    """
    
    try:
        # Get analysis results
        analysis_response = model.generate_content(analysis_prompt)
        analysis_parts = analysis_response.text.split('\n')
        
        results = {}
        for part in analysis_parts:
            if part.startswith('KEYWORDS:'):
                results['keywords'] = part.replace('KEYWORDS:', '').strip()
            elif part.startswith('TITLE:'):
                results['title'] = part.replace('TITLE:', '').strip()
        
        # Get summary with controlled length
        summary_response = model.generate_content(summary_prompt)
        results['summary'] = summary_response.text.strip()
        
        return results
    except Exception as e:
        return {
            'summary': f"Error generating content: {str(e)}",
            'keywords': "",
            'title': "Content Summary"
        }