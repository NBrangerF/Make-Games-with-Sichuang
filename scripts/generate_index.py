#!/usr/bin/env python3
from pathlib import Path

INDEX = """<!doctype html>
<html lang=\"zh-CN\">
  <head>
    <meta charset=\"UTF-8\" />
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />
    <meta name=\"description\" content=\"落桌是一座按设计阶段、分析方法和具体问题整理的中文桌游设计资源馆。\" />
    <meta name=\"robots\" content=\"noindex, nofollow\" />
    <meta name=\"theme-color\" content=\"#031A2B\" />
    <link rel=\"preload\" href=\"/assets/brand/luozhuo-home-banner-image2-1600.webp\" as=\"image\" type=\"image/webp\" fetchpriority=\"high\" imagesrcset=\"/assets/brand/luozhuo-home-banner-image2-640.webp 640w, /assets/brand/luozhuo-home-banner-image2-960.webp 960w, /assets/brand/luozhuo-home-banner-image2-1600.webp 1600w\" imagesizes=\"(max-width: 960px) calc(100vw - 40px), (max-width: 1280px) 44vw, min(46vw, 680px)\" />
    <link rel=\"icon\" href=\"data:,\" />
    <title>落桌 · 桌游设计馆</title>
  </head>
  <body>
    <div id=\"root\"></div>
    <script type=\"module\" src=\"/src/main.tsx\"></script>
  </body>
</html>
"""

Path(__file__).resolve().parents[1].joinpath("index.html").write_text(INDEX, encoding="utf-8")
