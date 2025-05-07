import PyPDF2
from docx import Document as DocxDocument
import google.generativeai as genai
import re

# Configure Gemini
genai.configure(api_key='AIzaSyB8wROhYarpnzPbmE1tUwNJuX1Uhj35-40')
model = genai.GenerativeModel('gemini-1.5-flash')

def extract_text(file, filename):
    """Extract text from different file types with encoding fallback"""
    ext = filename.split('.')[-1].lower()
    
    try:
        if ext == 'pdf':
            reader = PyPDF2.PdfReader(file)
            return " ".join([page.extract_text() or "" for page in reader.pages])
        elif ext in ['docx', 'doc']:
            doc = DocxDocument(file)
            return "\n".join([para.text for para in doc.paragraphs])
        else:  # txt and fallback
            if hasattr(file, 'read'):
                try:
                    return file.read().decode('utf-8')
                except UnicodeDecodeError:
                    file.seek(0)
                    return file.read().decode('latin-1')
            return str(file)
    except Exception as e:
        raise ValueError(f"Error extracting text: {str(e)}")

def detect_language(text_sample):
    """Detect the primary language of the text"""
    if not text_sample.strip():
        return "en"  # default to English
    
    # Look for common language patterns
    sample = text_sample[:500]  # Use first 500 chars for detection
    
    # Check for common non-Latin scripts
    if re.search(r'[\u4e00-\u9fff]', sample):  # Chinese characters
        return "zh"
    if re.search(r'[\u3040-\u309f\u30a0-\u30ff]', sample):  # Japanese
        return "ja"
    if re.search(r'[\uac00-\ud7a3]', sample):  # Korean
        return "ko"
    if re.search(r'[\u0600-\u06FF]', sample):  # Arabic
        return "ar"
    
    # For European languages, look for common words
    common_words = {
        'en': ['the', 'and', 'to', 'of', 'in'],
        'es': ['el', 'la', 'de', 'que', 'y'],
        'fr': ['le', 'la', 'de', 'et', 'à'],
        'de': ['der', 'die', 'das', 'und', 'zu'],
        'ru': ['и', 'в', 'не', 'на', 'я']  # Cyrillic
    }
    
    text_lower = sample.lower()
    for lang, words in common_words.items():
        if any(word in text_lower for word in words):
            return lang
    
    return "en"  # default to English if uncertain

def process_with_gemini(text, length=25):
    """Handle all Gemini processing with multi-language support"""
    if not text.strip():
        return {
            'summary': "No text content found to summarize",
            'keywords': "",
            'title': "Empty Document"
        }
    
    # Detect language from the text sample
    language = detect_language(text[:1000])
    
    # Calculate target word count based on percentage
    word_count = len(text.split())
    
    if isinstance(length, str):
        length = length.lower()
        if length == 'short':
            target_words = max(20, int(word_count * 0.1))
        elif length == 'medium':
            target_words = int(word_count * 0.25)
        elif length == 'long':
            target_words = int(word_count * 0.5)
        else:
            target_words = int(word_count * 0.25)
    else:
        percentage = max(5, min(90, int(length)))
        target_words = int(word_count * (percentage/100))
    
    # System instructions for better language handling
    system_instruction = f"""
    You are a professional multilingual summarization assistant. 
    Always maintain the original language of the text in your responses.
    For Asian languages (Chinese, Japanese, Korean), be particularly careful with character-level summarization.
    For right-to-left languages (Arabic, Hebrew), maintain proper text direction.
    """
    
    # First get the full analysis with language awareness
    analysis_prompt = f"""
    Analyze this text and:
    1. Identify the 5-10 most important keywords (comma-separated)
    2. Create a concise 3-7 word title
    3. Detect the document type (article, report, email, etc.)
    
    Return in this format:
    KEYWORDS: [comma, separated, keywords]
    TITLE: [title text here]
    TYPE: [document type]
    LANGUAGE: [detected language code]
    
    Text: {text[:15000]}  # Increased limit for better language detection
    """
    
    # Then get the summary with explicit word count control
    summary_prompt = f"""
    Write a comprehensive summary of the following text in exactly {target_words} words.
    Maintain the original language of the text.
    Focus on the main ideas and key points.
    For technical documents, preserve important technical terms.
    For creative writing, maintain the tone and style.
    
    Text: {text[:15000]}
    """
    
    try:
        # Get analysis results with system instruction
        analysis_response = model.generate_content(
            analysis_prompt,
            system_instruction=system_instruction
        )
        analysis_parts = analysis_response.text.split('\n')
        
        results = {
            'keywords': "",
            'title': "Untitled Document",
            'type': "Unknown",
            'language': language
        }
        
        for part in analysis_parts:
            if part.startswith('KEYWORDS:'):
                results['keywords'] = part.replace('KEYWORDS:', '').strip()
            elif part.startswith('TITLE:'):
                results['title'] = part.replace('TITLE:', '').strip()
            elif part.startswith('TYPE:'):
                results['type'] = part.replace('TYPE:', '').strip()
            elif part.startswith('LANGUAGE:'):
                detected_lang = part.replace('LANGUAGE:', '').strip().lower()
                if len(detected_lang) == 2:  # Only update if valid language code
                    results['language'] = detected_lang
        
        # Get summary with controlled length
        summary_response = model.generate_content(
            summary_prompt,
            system_instruction=system_instruction
        )
        results['summary'] = summary_response.text.strip()
        
        # Add word count information
        results['original_word_count'] = word_count
        results['summary_word_count'] = len(results['summary'].split())
        
        return results
    except Exception as e:
        return {
            'summary': f"Error generating content: {str(e)}",
            'keywords': "",
            'title': "Content Summary",
            'error': str(e)
        }