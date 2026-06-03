from PIL import Image, ImageDraw, ImageFont

try:
    font_sm = ImageFont.truetype("consola.ttf", 10)
    font_md = ImageFont.truetype("consola.ttf", 14)
    font_lg = ImageFont.truetype("consolab.ttf", 22)
    font_xl = ImageFont.truetype("consolab.ttf", 28)
except:
    font_sm = ImageFont.load_default()
    font_md = font_sm
    font_lg = font_sm
    font_xl = font_sm

OUT = "C:/Users/Ctrai/Desktop/heuremen-specbook"

# === MINE THIS NOW ===
img = Image.new("RGBA", (240, 240), (18, 19, 26, 255))
d = ImageDraw.Draw(img)
d.rounded_rectangle([0, 0, 239, 239], radius=12, outline=(42, 43, 54), width=2)
d.rounded_rectangle([12, 12, 228, 100], radius=8, outline=(59, 130, 246), width=1)
d.text((20, 20), "MINE THIS NOW", fill=(59, 130, 246), font=font_sm)
d.text((20, 38), "BTC", fill=(243, 244, 246), font=font_xl)
d.text((85, 48), "SHA-256", fill=(156, 163, 175), font=font_sm)
d.text((20, 72), "+$14.27/day", fill=(34, 197, 94), font=font_md)
d.text((20, 90), "Rev: $38.50  Cool: $4.12", fill=(156, 163, 175), font=font_sm)
d.text((16, 112), "PROFITABILITY RANKING", fill=(156, 163, 175), font=font_sm)
d.line([(16, 126), (224, 126)], fill=(42, 43, 54))
coins = [
    ("1. BTC", "+$14.27", (34, 197, 94), 70),
    ("2. BCH", "+$12.85", (34, 197, 94), 63),
    ("3. FB",  "+$11.02", (34, 197, 94), 54),
    ("4. DGB", "+$2.11",  (245, 158, 11), 10),
    ("5. XEC", "-$0.44",  (239, 68, 68), 3),
]
for i, (name, val, color, barw) in enumerate(coins):
    y = 134 + i * 20
    d.text((20, y), name, fill=(243, 244, 246), font=font_sm)
    d.text((120, y), val, fill=color, font=font_sm)
    d.rectangle([170, y + 2, 170 + barw, y + 12], fill=color)
img.save(f"{OUT}/bitcraft-gallery-mine-now.png")
print("mine-now done")

# === WEATHER ===
img = Image.new("RGBA", (240, 240), (18, 19, 26, 255))
d = ImageDraw.Draw(img)
d.rounded_rectangle([0, 0, 239, 239], radius=12, outline=(42, 43, 54), width=2)
d.text((28, 14), "WEATHER-ADJUSTED", fill=(156, 163, 175), font=font_md)
d.text((60, 32), "COOLING", fill=(156, 163, 175), font=font_md)
temps = [
    ((239, 68, 68),  "45C SHUTDOWN"),
    ((239, 68, 68),  "40C DANGER"),
    ((249, 115, 22), "35C THROTTLE"),
    ((245, 158, 11), "30C MODERATE"),
    ((34, 197, 94),  "25C OPTIMAL"),
    ((6, 182, 212),  "15C PROFIT"),
]
for i, (c, lbl) in enumerate(temps):
    y = 55 + i * 18
    d.rectangle([24, y, 40, y + 14], fill=c)
    d.text((48, y + 2), lbl, fill=c, font=font_sm)
d.text((36, 170), "WET-BULB TEMP", fill=(59, 130, 246), font=font_md)
cyan = (6, 182, 212)
dark_cyan = (8, 145, 178)
for dx in [50, 100, 150]:
    d.polygon([(dx + 6, 192), (dx, 206), (dx + 12, 206)], fill=cyan)
    d.ellipse([dx - 2, 202, dx + 14, 214], fill=dark_cyan)
d.text((12, 222), "Stull 2011 evap effectiveness", fill=(156, 163, 175), font=font_sm)
img.save(f"{OUT}/bitcraft-gallery-weather.png")
print("weather done")

# === RIGS ===
img = Image.new("RGBA", (240, 240), (18, 19, 26, 255))
d = ImageDraw.Draw(img)
d.rounded_rectangle([0, 0, 239, 239], radius=12, outline=(42, 43, 54), width=2)
d.text((46, 8), "YOUR MINING FLEET", fill=(156, 163, 175), font=font_sm)

# Rig 1
d.rounded_rectangle([12, 28, 116, 118], radius=6, outline=(42, 43, 54))
d.text((18, 32), "Antminer S21", fill=(243, 244, 246), font=font_sm)
d.rounded_rectangle([88, 32, 110, 44], radius=3, fill=(34, 197, 94, 50))
d.text((92, 34), "ON", fill=(34, 197, 94), font=font_sm)
d.text((18, 50), "SHA-256", fill=(156, 163, 175), font=font_sm)
d.text((18, 64), "200 TH/s", fill=(243, 244, 246), font=font_sm)
d.text((18, 78), "3550W", fill=(243, 244, 246), font=font_sm)
d.text((18, 98), "+$14.27/day", fill=(34, 197, 94), font=font_sm)

# Rig 2
d.rounded_rectangle([124, 28, 228, 118], radius=6, outline=(42, 43, 54))
d.text((130, 32), "Antminer L9", fill=(243, 244, 246), font=font_sm)
d.rounded_rectangle([200, 32, 222, 44], radius=3, fill=(34, 197, 94, 50))
d.text((204, 34), "ON", fill=(34, 197, 94), font=font_sm)
d.text((130, 50), "Scrypt", fill=(156, 163, 175), font=font_sm)
d.text((130, 64), "16 GH/s", fill=(243, 244, 246), font=font_sm)
d.text((130, 78), "3360W", fill=(243, 244, 246), font=font_sm)
d.text((130, 98), "+$8.91/day", fill=(34, 197, 94), font=font_sm)

# Rig 3 - OFF
d.rounded_rectangle([12, 128, 116, 228], radius=6, outline=(42, 43, 54, 100))
d.text((18, 132), "WhatsMiner", fill=(200, 200, 200, 100), font=font_sm)
d.text((18, 146), "M50S", fill=(200, 200, 200, 100), font=font_sm)
d.rounded_rectangle([88, 132, 110, 144], radius=3, fill=(239, 68, 68, 40))
d.text((90, 134), "OFF", fill=(239, 68, 68), font=font_sm)
d.text((18, 162), "SHA-256", fill=(156, 163, 175, 100), font=font_sm)
d.text((18, 176), "126 TH/s", fill=(200, 200, 200, 100), font=font_sm)
d.text((18, 196), "-$1.20/day", fill=(239, 68, 68, 100), font=font_sm)

# Add rig
d.rounded_rectangle([124, 128, 228, 228], radius=6, outline=(42, 43, 54))
d.text((166, 158), "+", fill=(59, 130, 246), font=font_xl)
d.text((152, 194), "Add Rig", fill=(156, 163, 175), font=font_sm)

img.save(f"{OUT}/bitcraft-gallery-rigs.png")
print("rigs done")
print("ALL DONE")
