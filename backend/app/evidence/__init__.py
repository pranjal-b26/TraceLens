from .base_parser import BaseParser
from .pdf_parser import PDFParser
from .url_parser import URLParser
from .text_parser import TextParser

def get_parser(file_type: str) -> BaseParser:
    if file_type == "pdf":
        return PDFParser()
    elif file_type == "url":
        return URLParser()
    else:
        return TextParser()

def process_evidence(file_path: str, file_type: str) -> tuple[str, list]:
    parser = get_parser(file_type)
    return parser.parse(file_path)
