#!/usr/bin/env python3
"""Rigenera la griglia delle terre emerse per il globo di HeroCanvas.

Rasterizza Natural Earth 110m (scaricato da sé se manca) in una griglia
240x120 (passo 1,5 gradi) via scanline fill even-odd e la codifica in righe
esadecimali: sono le stringhe dell'array LAND_HEX in
src/components/ui/HeroCanvas.astro (variante 'globe'). Genera anche una
preview PNG del globo con luce e atmosfera, con la stessa matematica del
canvas: guardarla PRIMA di toccare il componente.

Uso:  python3 scripts/build-globe-land.py   (output in cwd)
"""
import json, math, os, urllib.request, zlib, struct

if not os.path.exists("ne_land.json"):
    url = ("https://raw.githubusercontent.com/nvkelso/natural-earth-vector/"
           "master/geojson/ne_110m_land.geojson")
    print("scarico", url)
    urllib.request.urlretrieve(url, "ne_land.json")

COLS, ROWS = 240, 120
STEP = 1.5

d = json.load(open("ne_land.json"))
edges = []                                   # (lat1, lon1, lat2, lon2)
for f in d["features"]:
    g = f["geometry"]
    polys = g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]
    for poly in polys:
        for ring in poly:
            for i in range(len(ring) - 1):
                (lo1, la1), (lo2, la2) = ring[i], ring[i + 1]
                if la1 != la2:
                    edges.append((la1, lo1, la2, lo2))

grid = [[False] * COLS for _ in range(ROWS)]
for row in range(ROWS):
    y = 89.25 - row * STEP                   # latitudine del centro cella
    xs = []
    for la1, lo1, la2, lo2 in edges:
        if (la1 > y) != (la2 > y):
            xs.append(lo1 + (y - la1) / (la2 - la1) * (lo2 - lo1))
    xs.sort()
    # riempi gli intervalli alterni (even-odd su tutti gli anelli insieme)
    for i in range(0, len(xs) - 1, 2):
        a, b = xs[i], xs[i + 1]
        c0 = max(0, math.ceil((a + 179.25) / STEP))
        c1 = min(COLS - 1, math.floor((b + 179.25) / STEP))
        for c in range(c0, c1 + 1):
            grid[row][c] = True

land = sum(r.count(True) for r in grid)
print(f"celle terra: {land} / {COLS*ROWS} ({100*land/(COLS*ROWS):.0f}%)")

# codifica: una riga = 60 caratteri esadecimali (240 bit)
hexrows = []
for row in grid:
    v = 0
    for c, b in enumerate(row):
        if b:
            v |= 1 << (COLS - 1 - c)
    hexrows.append(f"{v:0{COLS//4}x}")
json.dump(hexrows, open("landrows.json", "w"))  # -> LAND_HEX nel componente
print(f"encoding: {ROWS} righe x {COLS//4} hex = {sum(len(r)+3 for r in hexrows)} byte circa")

# ── preview PNG: globo ortografico con luce, atmosfera e archi ──────────
W, H = 760, 760
buf = bytearray(W * H * 3)

def px(x, y, rgb, a=1.0):
    xi, yi = int(x), int(y)
    if 0 <= xi < W and 0 <= yi < H:
        o = (yi * W + xi) * 3
        buf[o]     = min(255, int(buf[o]     * (1 - a) + rgb[0] * a))
        buf[o + 1] = min(255, int(buf[o + 1] * (1 - a) + rgb[1] * a))
        buf[o + 2] = min(255, int(buf[o + 2] * (1 - a) + rgb[2] * a))

# fondo: il near-black del sito
for i in range(0, len(buf), 3):
    buf[i], buf[i+1], buf[i+2] = 10, 11, 15

cx, cy, R = W * 0.5, H * 0.5, W * 0.36
lat0, lonV = 20, 15                          # vista: Europa/Africa al centro
la0 = math.radians(lat0)
# luce fissa in spazio-vista, da alto-sinistra davanti
L = (-0.45, 0.55, 0.70)
Ln = math.sqrt(sum(v*v for v in L)); L = tuple(v / Ln for v in L)

# atmosfera: anello sfumato fuori dal lembo
for yy in range(H):
    for xx in range(W):
        dx, dy = xx - cx, yy - cy
        r = math.hypot(dx, dy)
        if R <= r < R * 1.14:
            t = 1 - (r - R) / (R * 0.14)
            px(xx, yy, (190, 205, 230), 0.05 * t * t)

# volume: riempimento radiale tenue, centro spostato verso la luce
for yy in range(H):
    for xx in range(W):
        dx, dy = xx - cx, yy - cy
        if math.hypot(dx, dy) < R:
            gx = (xx - (cx + L[0] * R * 0.5)) / R
            gy = (yy - (cy - L[1] * R * 0.5)) / R
            g = max(0.0, 1 - math.hypot(gx, gy) * 0.9)
            px(xx, yy, (200, 210, 235), 0.030 * g)

# punti-terra con lambert
for row in range(ROWS):
    lat = math.radians(89.25 - row * STEP)
    for col in range(COLS):
        if not grid[row][col]:
            continue
        lon = math.radians(-179.25 + col * STEP - lonV)
        x = math.cos(lat) * math.sin(lon)
        y = math.cos(la0) * math.sin(lat) - math.sin(la0) * math.cos(lat) * math.cos(lon)
        z = math.sin(la0) * math.sin(lat) + math.cos(la0) * math.cos(lat) * math.cos(lon)
        if z < 0.02:
            continue
        l = max(0.0, x * L[0] + y * L[1] + z * L[2])
        a = 0.06 + 0.34 * (l ** 1.4)
        size = 1 if l < 0.45 else 2
        X, Y = cx + x * R, cy - y * R
        for dy2 in range(size):
            for dx2 in range(size):
                px(X + dx2, Y + dy2, (235, 240, 248), a)

# lembo: cerchio tenue + arco più luminoso verso la luce
for t in range(0, 3600):
    ang = t / 3600 * 2 * math.pi
    nx, ny = math.cos(ang), math.sin(ang)
    facing = max(0.0, nx * L[0] + ny * L[1])
    a = 0.05 + 0.16 * facing ** 2
    px(cx + nx * R, cy - ny * R, (220, 228, 245), a)

def chunk(tag, data):
    c = struct.pack(">I", len(data)) + tag + data
    return c + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)

raw = b"".join(b"\x00" + bytes(buf[r * W * 3:(r + 1) * W * 3]) for r in range(H))
png = (b"\x89PNG\r\n\x1a\n"
       + chunk(b"IHDR", struct.pack(">IIBBBBB", W, H, 8, 2, 0, 0, 0))
       + chunk(b"IDAT", zlib.compress(raw, 6))
       + chunk(b"IEND", b""))
open("globe-preview.png", "wb").write(png)
print("scritto globe-preview.png")
