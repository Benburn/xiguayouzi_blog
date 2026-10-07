# -*- coding: utf-8 -*-
"""为《CT 诊断影像书库》生成文章封面：6 本 PDF 第 1 页拼成 3x2 网格。"""
import os
import fitz  # PyMuPDF
from PIL import Image, ImageDraw

SRC = r"E:/Book2Know/CT upload/CT_books_2020plus"
OUT_DIR = r"E:/Web/xiguayouzi_blog/public/images/imaging/ct-diagnostic-imaging-library"
OUT = os.path.join(OUT_DIR, "cover.jpg")

PDFS = [
    "IAEA Atlas of Cardiac PET-CT A Case-Study Approach (2022 OA).pdf",
    "Diseases of the Abdomen and Pelvis 2023-2026 Diagnostic Imaging (IDKD 2023 OA).pdf",
    "Radiology‐Nuclear Medicine Diagnostic Imaging - 2023 - Gholamrezanezhad.pdf",
    "Diseases of the Brain, Head and Neck, Spine 2024-2027 Diagnostic Imaging (IDKD 2024 OA).pdf",
    "Diseases of the Chest, Heart and Vascular System 2025-2028 Diagnostic Imaging (IDKD 2025 OA).pdf",
    "Musculoskeletal Diseases 2026-2029 Diagnostic Imaging (IDKD 2026 OA).pdf",
]

CELL_W, CELL_H = 420, 580   # 单元格内容区
GAP = 16                    # 网格间距
PAD = 22                    # 外边距
BG = (247, 250, 252)        # 站点纸色

os.makedirs(OUT_DIR, exist_ok=True)

covers = []
for name in PDFS:
    p = os.path.join(SRC, name)
    assert os.path.exists(p), f"缺少 PDF：{name}"
    doc = fitz.open(p)
    pix = doc[0].get_pixmap(matrix=fitz.Matrix(1.2, 1.2))
    tmp = os.path.join(OUT_DIR, "_tmp.png")
    pix.save(tmp)
    im = Image.open(tmp).convert("RGB")
    doc.close()
    im.thumbnail((CELL_W, CELL_H), Image.LANCZOS)
    covers.append(im)
    print(f"  提取 {name[:44]}…  -> {im.size}")
os.remove(tmp)

cols, rows = 3, 2
W = PAD * 2 + cols * CELL_W + (cols - 1) * GAP
H = PAD * 2 + rows * CELL_H + (rows - 1) * GAP
canvas = Image.new("RGB", (W, H), BG)
draw = ImageDraw.Draw(canvas)

for idx, im in enumerate(covers):
    r, c = divmod(idx, cols)
    x = PAD + c * (CELL_W + GAP) + (CELL_W - im.width) // 2
    y = PAD + r * (CELL_H + GAP) + (CELL_H - im.height) // 2
    canvas.paste(im, (x, y))
    # 细边框
    draw.rectangle([x - 1, y - 1, x + im.width, y + im.height], outline=(210, 218, 228))

canvas.save(OUT, "JPEG", quality=88)
print(f"封面完成：{OUT}  {canvas.size}")
