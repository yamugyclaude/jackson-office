from http.server import BaseHTTPRequestHandler
from io import BytesIO
from pathlib import Path
from xml.sax.saxutils import escape

from hwpx.document import HwpxDocument
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer

FONT_PATH = Path(__file__).parent / "fonts" / "NotoSansKR-Regular.ttf"
pdfmetrics.registerFont(TTFont("NotoSansKR", str(FONT_PATH)))
STYLE = ParagraphStyle("kr", fontName="NotoSansKR", fontSize=11, leading=16)


def hwpx_to_pdf(hwpx_bytes: bytes) -> bytes:
    doc = HwpxDocument.open(hwpx_bytes)
    story = []
    for paragraph in doc.paragraphs:
        text = paragraph.text.strip()
        if not text:
            story.append(Spacer(1, 8))
            continue
        story.append(Paragraph(escape(text), STYLE))
        story.append(Spacer(1, 4))

    buffer = BytesIO()
    SimpleDocTemplate(buffer, pagesize=A4).build(story)
    return buffer.getvalue()


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        length = int(self.headers.get("Content-Length", 0))
        hwpx_bytes = self.rfile.read(length)

        try:
            pdf_bytes = hwpx_to_pdf(hwpx_bytes)
        except Exception as exc:
            self.send_response(400)
            self.send_header("Content-Type", "text/plain; charset=utf-8")
            self.end_headers()
            self.wfile.write(f"변환 실패: {exc}".encode("utf-8"))
            return

        self.send_response(200)
        self.send_header("Content-Type", "application/pdf")
        self.send_header("Content-Disposition", 'attachment; filename="converted.pdf"')
        self.end_headers()
        self.wfile.write(pdf_bytes)
