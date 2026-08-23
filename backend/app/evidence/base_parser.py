import re
from abc import ABC, abstractmethod

class BaseParser(ABC):
    @abstractmethod
    def extract_text(self, file_path: str) -> str:
        pass
        
    def extract_entities(self, text: str) -> list:
        entities = []
        
        # Extract IPs
        ips = re.findall(r'\b(?:\d{1,3}\.){3}\d{1,3}\b', text)
        for ip in ips:
            entities.append({"entity_type": "ip", "entity_value": ip, "confidence": 0.9})
            
        # Extract emails
        emails = re.findall(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', text)
        for email in emails:
            entities.append({"entity_type": "email", "entity_value": email, "confidence": 0.95})
            
        # Extract URLs
        urls = re.findall(r'https?://[^\s]+', text)
        for url in urls:
            entities.append({"entity_type": "url", "entity_value": url, "confidence": 0.9})
            
        # Extract phone numbers
        phones = re.findall(r'\b[\+]?[\d]{10,13}\b', text)
        for phone in phones:
            entities.append({"entity_type": "phone", "entity_value": phone, "confidence": 0.8})
            
        return entities

    def parse(self, file_path: str) -> tuple[str, list]:
        text = self.extract_text(file_path)
        entities = self.extract_entities(text)
        return text, entities
