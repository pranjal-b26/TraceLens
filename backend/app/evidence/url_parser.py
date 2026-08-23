from .base_parser import BaseParser

class URLParser(BaseParser):
    def extract_text(self, url: str) -> str:
        import requests
        # pyrefly: ignore [missing-import]
        from bs4 import BeautifulSoup
        try:
            response = requests.get(url, timeout=10)
            soup = BeautifulSoup(response.text, "html.parser")
            return soup.get_text()
        except Exception:
            return ""
