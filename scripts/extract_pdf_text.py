#!/usr/bin/env python3
"""Extract page-delimited text from a PDF for internal research indexing.

Usage: python extract_pdf_text.py input.pdf output.txt
"""

from pathlib import Path
import sys
import pdfplumber


def main() -> None:
    if len(sys.argv) != 3:
        raise SystemExit("usage: extract_pdf_text.py INPUT.pdf OUTPUT.txt")
    source = Path(sys.argv[1]).expanduser().resolve()
    target = Path(sys.argv[2]).expanduser().resolve()
    target.parent.mkdir(parents=True, exist_ok=True)
    with pdfplumber.open(source) as document:
        pages = []
        for number, page in enumerate(document.pages, start=1):
            text = page.extract_text(x_tolerance=2, y_tolerance=3) or ""
            pages.append(f"===== PAGE {number} =====\n{text.strip()}\n")
    target.write_text("\n".join(pages), encoding="utf-8")
    print(f"extracted {len(pages)} pages to {target}")


if __name__ == "__main__":
    main()

