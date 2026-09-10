"""Generate the committed Book Cart PDFs from the bilingual content specification.

Requires ReportLab (available in the bundled desktop Python runtime). Pass --font
with a CJK-capable TrueType font when Arial Unicode is not installed. This is an
editorial asset generator, not a dependency of the website's production build.
"""
from pathlib import Path
from html import escape
import argparse, json
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

ROOT = Path(__file__).resolve().parents[1]
p = argparse.ArgumentParser()
p.add_argument('--font', default='/System/Library/Fonts/Supplemental/Arial Unicode.ttf')
p.add_argument('--output', type=Path, default=ROOT/'public/print-and-play/book-cart')
a = p.parse_args()
spec = json.loads((ROOT/'content/print-and-play/book-cart.json').read_text())
assert (spec['players'], spec['books'], spec['capacity'], spec['actionLimit'], spec['route']) == (2, 2, 2, 6, [0, 1, 2])
pdfmetrics.registerFont(TTFont('BookCart', a.font))
a.output.mkdir(parents=True, exist_ok=True)
W, H = A4
L, WIDTH = 42, W-84
metrics = {}
for lang, t in spec['languages'].items():
    path = a.output/(lang+'.pdf')
    c = canvas.Canvas(str(path), pagesize=A4, invariant=1, pageCompression=1)
    c.setTitle(t['title']+' · '+spec['contentVersion'])
    c.setAuthor('Luozhuo')
    style = ParagraphStyle('body', fontName='BookCart', fontSize=12, leading=17, wordWrap='CJK' if lang=='zh-CN' else None, spaceAfter=0)
    bottoms=[]
    def para(text, top, x=L, width=WIDTH, size=None, leading=None):
        st=ParagraphStyle('local', parent=style, fontSize=size or style.fontSize, leading=leading or style.leading)
        item=Paragraph(escape(text),st)
        _,height=item.wrap(width,H)
        item.drawOn(c,x,top-height)
        return top-height
    def header(title, subtitle=None):
        c.setFillGray(0.18);c.setFont('BookCart',9);c.drawString(L,H-35,'LUOZHUO / '+spec['contentVersion'])
        y=para(title,H-53,size=23,leading=29)-7
        if subtitle:y=para(subtitle,y,size=10,leading=14)-12
        return y
    def heading(title,y):
        return para(title,y,size=13,leading=18)-6
    def footer(n):
        c.setStrokeGray(.65);c.setLineWidth(.5);c.line(L,38,W-L,38)
        c.setFillGray(.3);c.setFont('BookCart',7.2)
        c.drawString(L,26,t['footer']);c.drawRightString(W-L,26,f'{n} / 3')
        c.drawString(L,15,t['link']);c.setFillGray(.12)
    def table(headers,rows,y,widths,blank_height=None):
        xs=[L]
        for width in widths:xs.append(xs[-1]+width)
        for ri,row in enumerate([headers]+rows):
            ps=[];heights=[]
            for text,width in zip(row,widths):
                st=ParagraphStyle('cell',parent=style,fontSize=10.5,leading=14.6)
                pp=Paragraph(escape(str(text)),st);_,hh=pp.wrap(width-14,H);ps.append(pp);heights.append(hh)
            rh=max(heights)+14
            if ri and blank_height:rh=max(rh,blank_height)
            c.setFillGray(.92 if ri==0 else 1);c.rect(L,y-rh,sum(widths),rh,stroke=0,fill=1)
            c.setStrokeGray(.45);c.setLineWidth(.5)
            for i,(pp,hh) in enumerate(zip(ps,heights)):
                c.rect(xs[i],y-rh,widths[i],rh,stroke=1,fill=0);pp.drawOn(c,xs[i]+7,y-7-hh)
            y-=rh
        return y
    # Page 1: every rule needed for an independent play.
    y=header(t['title'],t['subtitle'])
    y=heading(t['goalTitle'],y);y=para(t['goal'],y)-12
    y=heading(t['setupTitle'],y)
    for i,line in enumerate(t['setup'],1):y=para(f'{i}. '+line,y)-5
    y-=6;y=heading(t['actionsTitle'],y)
    y=table(t['actionHeaders'],t['actions'],y,[105,WIDTH-105])-13
    y=heading(t['turnTitle'],y);y=para(t['turn'],y)-10
    y=para(t['note'],y,size=9,leading=12.5)
    assert y>47,(lang,'rules overflow',y)
    bottoms.append(y);footer(1);c.showPage()
    # Page 2: position, holdings, action counter, optional observation and pieces.
    y=header(t['boardTitle']);y=para(t['boardIntro'],y,size=10,leading=14)
    assert y>718,(lang,'board introduction overflow',y)
    xs=[42,232,422];bw=131
    c.setStrokeGray(.2);c.setLineWidth(1)
    for i,x in enumerate(xs):
        c.rect(x,615,bw,76)
        para(t['places'][i],713,x+7,bw-14,size=12,leading=16)
        c.setFont('BookCart',23);c.drawCentredString(x+bw/2,630,str(i))
        if i<2:
            left=x+bw+7;right=xs[i+1]-7;mid=652
            c.line(left,mid,right,mid)
            c.line(left,mid,left+5,mid+4);c.line(left,mid,left+5,mid-4)
            c.line(right,mid,right-5,mid+4);c.line(right,mid,right-5,mid-4)
    for i,x in enumerate(xs):para(t['areas'][i],597,x,bw,size=10,leading=14)
    c.rect(xs[0],517,bw,58);c.rect(xs[2],517,bw,58)
    c.rect(xs[1],517,59,58);c.rect(xs[1]+72,517,59,58)
    para(t['trackTitle'],495,size=10,leading=14)
    step=WIDTH/7
    for i in range(7):
        x=L+i*step;c.rect(x,425,step,43)
        c.setFont('BookCart',16);c.drawCentredString(x+step/2,446,str(i))
        c.setFont('BookCart',8);c.drawCentredString(x+step/2,431,t['start'] if i==0 else ('A' if i%2 else 'B'))
    para(t['recordTitle'],404,size=10,leading=14)
    y=table(t['recordHeaders'],[[str(i),'','','',''] for i in range(1,7)],380,[50,171,95,95,WIDTH-411],blank_height=25)
    assert y>175,(lang,'record overlaps tokens',y)
    para(t['cut'],153,size=9,leading=13)
    c.setDash(3,3)
    for i,label in enumerate(t['tokens']):
        x=L+i*112;size=32 if i==3 else 55;c.rect(x,67,size,size)
        c.setFillGray(.12);c.setFont('BookCart',8 if i==3 else 12);c.drawCentredString(x+size/2,67+size/2-4,label)
    c.setDash();bottoms.append(67);footer(2);c.showPage()
    # Page 3: a fully specified one-rule variant and both complete action traces.
    y=header(t['compareTitle']);y=para(t['variant'],y)-17
    y=table(t['compareHeaders'],t['compareRows'],y,[52,(WIDTH-52)/2,(WIDTH-52)/2])-18
    y=heading(t['explainTitle'],y)
    for line in t['explain']:y=para(line,y)-8
    y-=4;y=heading(t['checkTitle'],y);y=para(t['check'],y)
    assert y>47,(lang,'comparison overflow',y)
    bottoms.append(y);footer(3);c.save()
    metrics[lang]={'file':str(path),'pages':3,'pageSize':'A4','minimumContentYByPage':bottoms,'bytes':path.stat().st_size}
print(json.dumps(metrics,ensure_ascii=False,indent=2))
