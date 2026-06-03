from PIL import Image, ImageDraw

img = Image.new('RGBA', (240, 240), (26, 27, 36, 255))
draw = ImageDraw.Draw(img)

# Grid texture
for x in range(0, 240, 15):
    draw.line([(x, 0), (x, 240)], fill=(30, 31, 41, 128), width=1)
for y in range(0, 240, 15):
    draw.line([(0, y), (240, y)], fill=(30, 31, 41, 128), width=1)

# Border
draw.rounded_rectangle([0, 0, 239, 239], radius=12, outline=(42, 43, 54), width=2)

b = 15
ox, oy = 55, 30

green1 = (34, 197, 94)
green2 = (29, 185, 84)
blue1 = (59, 130, 246)
blue2 = (37, 99, 235)

# Vertical bar (11 blocks)
for i in range(11):
    c = green2 if i % 3 == 2 else green1
    draw.rectangle([ox, oy + i*b, ox+b-1, oy+(i+1)*b-1], fill=c)

# Top horizontal (5 blocks)
for i, c in enumerate([green1, green2, green1, green1, green2]):
    draw.rectangle([ox+(i+1)*b, oy, ox+(i+2)*b-1, oy+b-1], fill=c)

# Top-right curve (3 blocks)
for i in range(3):
    c = green2 if i == 1 else green1
    draw.rectangle([ox+6*b, oy+(i+1)*b, ox+7*b-1, oy+(i+2)*b-1], fill=c)

# Middle connect back
draw.rectangle([ox+4*b, oy+4*b, ox+5*b-1, oy+5*b-1], fill=green2)
draw.rectangle([ox+5*b, oy+4*b, ox+6*b-1, oy+5*b-1], fill=green1)

# Middle horizontal (blue)
for i, c in enumerate([blue1, blue2, blue1, blue1, blue2]):
    draw.rectangle([ox+(i+1)*b, oy+5*b, ox+(i+2)*b-1, oy+6*b-1], fill=c)

# Bottom-right curve
draw.rectangle([ox+6*b, oy+6*b, ox+7*b-1, oy+7*b-1], fill=blue1)
draw.rectangle([ox+7*b, oy+7*b, ox+8*b-1, oy+8*b-1], fill=blue1)
draw.rectangle([ox+7*b, oy+8*b, ox+8*b-1, oy+9*b-1], fill=blue2)
draw.rectangle([ox+7*b, oy+9*b, ox+8*b-1, oy+10*b-1], fill=blue1)
draw.rectangle([ox+6*b, oy+10*b, ox+7*b-1, oy+11*b-1], fill=blue1)

# Bottom horizontal
for i, c in enumerate([green1, green2, green1, green1, green2]):
    draw.rectangle([ox+(i+1)*b, oy+10*b, ox+(i+2)*b-1, oy+11*b-1], fill=c)

# Pickaxe accent
pk = 4
pkx, pky = 190, 200
amber = (245, 158, 11)
gray1 = (156, 163, 175)
gray2 = (107, 114, 128)
draw.rectangle([pkx, pky, pkx+pk, pky+pk], fill=amber)
draw.rectangle([pkx+pk, pky-pk, pkx+2*pk, pky], fill=amber)
draw.rectangle([pkx+2*pk, pky-2*pk, pkx+3*pk, pky-pk], fill=gray1)
draw.rectangle([pkx+3*pk, pky-3*pk, pkx+4*pk, pky-2*pk], fill=gray1)
draw.rectangle([pkx+4*pk, pky-4*pk, pkx+5*pk, pky-3*pk], fill=gray1)
draw.rectangle([pkx+3*pk, pky-pk, pkx+4*pk, pky], fill=gray2)
draw.rectangle([pkx+2*pk, pky, pkx+3*pk, pky+pk], fill=gray2)

out = "C:/Users/Ctrai/Desktop/heuremen-specbook/bitcraft-thumbnail.png"
img.save(out)
print(f"Saved {out}")
