from .base_parser import BaseParser

class PDFParser(BaseParser):
    def extract_text(self, file_path: str) -> str:
        import PyPDF2
        text = ""
        with open(file_path, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            for page in reader.pages:
                text += page.extract_text() or ""
        return text
