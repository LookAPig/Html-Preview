"""Build cut-out bike layers for the hot-products canvas.

Outputs per bike (Images/hot/):
  <name>.webp        transparent bike; wheel hubs cleared, tyre band free of frame
  <name>-frame.webp  everything inside the wheels except spokes, plus frame crossing the tyre
and prints wheel geometry (fractions of image width) for js/hot-data.js.
"""
import json
import math
import os

import cv2
import numpy as np

SRC = os.path.join(os.path.dirname(__file__), '..', 'Images')
OUT = os.path.join(SRC, 'hot')
BIKES = {'bike-dual': True, 'bike-trail': True, 'bike-city': True, 'bike-family': False, 'bike-cargo': False}


def key(img):
    border = np.concatenate([img[:12].reshape(-1, 3), img[-12:].reshape(-1, 3),
                             img[:, :12].reshape(-1, 3), img[:, -12:].reshape(-1, 3)])
    bg = np.median(border, axis=0)
    diff = np.abs(img.astype(np.float32) - bg).max(axis=2)
    a = np.clip((diff - 7) / 38, 0, 1)
    a = a * a * (3 - 2 * a)
    safe = np.maximum(a, 1e-3)[..., None]
    fg = np.clip(bg + (img.astype(np.float32) - bg) / safe, 0, 255)
    return fg.astype(np.uint8), a


def find_wheels(gray, w):
    blur = cv2.medianBlur(gray, 5)
    c = cv2.HoughCircles(blur, cv2.HOUGH_GRADIENT, dp=1.2, minDist=w * 0.35, param1=80, param2=40,
                         minRadius=int(w * 0.10), maxRadius=int(w * 0.2))
    pts = sorted([p for p in c[0] if p[1] > gray.shape[0] * 0.45], key=lambda p: p[0])[:2]
    return [(float(p[0]), float(p[1])) for p in pts]


def radial(dark, cx, cy, r, n=720):
    t = np.linspace(0, 2 * np.pi, n, endpoint=False)
    xs = np.clip((cx + r * np.cos(t)).astype(int), 0, dark.shape[1] - 1)
    ys = np.clip((cy + r * np.sin(t)).astype(int), 0, dark.shape[0] - 1)
    return dark[ys, xs]


def tire(dark, cx, cy, w):
    rs = np.arange(int(w * 0.06), int(w * 0.2))
    frac = np.array([radial(dark, cx, cy, r).mean() for r in rs])
    band = rs[frac > 0.82]
    r_out = int(band.max())
    r_in = int(band[band > r_out - w * 0.06].min())
    return r_in, r_out


def masks(solid, thin, cx, cy, r_in, r_out):
    h, w = solid.shape
    yy, xx = np.mgrid[0:h, 0:w]
    rr = np.hypot(xx - cx, yy - cy)
    ang = (np.degrees(np.arctan2(yy - cy, xx - cx)) + 360) % 360
    hub = rr < r_in - 1
    inner = hub & (solid > 0)
    inside = radial(thin, cx, cy, r_in - 9) > 0
    outside = radial(thin, cx, cy, r_out + 10) > 0
    band = np.zeros_like(hub)
    for a in np.where(inside & outside)[0] * 0.5:
        d = np.abs((ang - a + 180) % 360 - 180)
        band |= (d < 1.8) & (rr >= r_in - 3) & (rr <= r_out + 4)
    band = cv2.dilate(band.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
    inner = cv2.dilate(inner.astype(np.uint8), np.ones((3, 3), np.uint8)) > 0
    return hub, inner & hub, band & (rr <= r_out + 4) & ~hub


def fill(rgba, mask, cx, cy):
    h, w = mask.shape
    out = rgba.copy()
    todo = mask.copy()
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    for deg in (37, -37, 74, -74, 111, -111, 148, -148, 180):
        t = math.radians(deg)
        mx = cx + (xx - cx) * math.cos(t) - (yy - cy) * math.sin(t)
        my = cy + (xx - cx) * math.sin(t) + (yy - cy) * math.cos(t)
        src = cv2.remap(rgba, mx, my, cv2.INTER_LINEAR)
        ok = cv2.remap(mask.astype(np.uint8), mx, my, cv2.INTER_NEAREST) == 0
        use = todo & ok
        out[use] = src[use]
        todo &= ~use
        if not todo.any():
            break
    return out


def build(name, flip):
    img = cv2.imread(os.path.join(SRC, name + '.jpg'))
    if flip:
        img = cv2.flip(img, 1)
    h, w = img.shape[:2]
    fg, a = key(img)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    dark = (gray < 115).astype(np.uint8)
    solid = cv2.morphologyEx((a > 0.35).astype(np.uint8), cv2.MORPH_OPEN,
                             cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (4, 4)))
    thin = cv2.morphologyEx((a > 0.3).astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    rgba = np.dstack([fg, (a * 255).astype(np.uint8)])
    body = rgba.copy()
    frame = np.zeros_like(rgba)
    wheels = []
    for cx, cy in find_wheels(gray, w):
        r_in, r_out = tire(dark, cx, cy, w)
        hub, inner, band = masks(solid, thin, cx, cy, r_in, r_out)
        body = fill(body, band, cx, cy)
        body[hub] = 0
        keep = cv2.GaussianBlur((inner | band).astype(np.float32), (0, 0), 0.8)
        layer = rgba.copy()
        layer[..., 3] = (rgba[..., 3] * np.clip(keep * 1.3, 0, 1)).astype(np.uint8)
        frame = np.where(layer[..., 3:4] > frame[..., 3:4], layer, frame)
        wheels.append({'x': round(cx / w, 4), 'y': round(cy / h, 4),
                       'r': round((r_out + 2) / w, 4), 'rim': round((r_in - 1) / w, 4)})
    os.makedirs(OUT, exist_ok=True)
    cv2.imwrite(os.path.join(OUT, name + '.webp'), body, [cv2.IMWRITE_WEBP_QUALITY, 88])
    cv2.imwrite(os.path.join(OUT, name + '-frame.webp'), frame, [cv2.IMWRITE_WEBP_QUALITY, 90])
    return wheels


if __name__ == '__main__':
    print(json.dumps({n: build(n, f) for n, f in BIKES.items()}, indent=1))
