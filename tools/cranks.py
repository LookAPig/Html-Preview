"""Split the crank arm + pedal out of each hot-products bike so the canvas can spin it.

Reads Images/hot/<name>.webp (built by wheels.py) and writes:
  <name>-base.webp   bike with the crank area inpainted
  <name>-crank.webp  near-side crank, drawn above the frame layer
Coordinates are pixels of the 1152x864 source; prints bb data for js/hot-data.js.
"""
import json
import os

import cv2
import numpy as np

OUT = os.path.join(os.path.dirname(__file__), '..', 'Images', 'hot')

BIKES = {
    'bike-dual': {'bb': (643, 554), 'hub': 11,
                  'near': [(521, 548), (600, 540), (650, 540), (654, 568), (600, 572), (521, 575)]},
    'bike-trail': {'bb': (664, 536), 'hub': 11,
                   'near': [(565, 528), (660, 522), (679, 525), (679, 549), (660, 551), (565, 549)]},
    'bike-family': {'bb': (617, 588), 'hub': 13,
                    'near': [(606, 575), (692, 573), (700, 575), (700, 598), (692, 599), (606, 600)],
                    'erase': [(521, 576), (546, 576), (546, 594), (521, 594)]},
    'bike-cargo': {'bb': (592, 565), 'hub': 13,
                   'near': [(582, 553), (630, 560), (652, 567), (704, 567), (704, 585), (655, 586), (620, 576), (582, 580)]},
}


def region(shape, poly, bb=None, hub=0):
    m = np.zeros(shape, np.uint8)
    cv2.fillPoly(m, [np.array(poly, np.int32)], 255)
    if bb:
        cv2.circle(m, bb, hub, 255, -1)
    return m


def layer(rgba, mask):
    soft = cv2.GaussianBlur(mask, (0, 0), 0.7).astype(np.float32) / 255
    out = rgba.copy()
    out[..., 3] = (rgba[..., 3] * soft).astype(np.uint8)
    return out


def build(name, cfg):
    rgba = cv2.imread(os.path.join(OUT, name + '.webp'), cv2.IMREAD_UNCHANGED)
    h, w = rgba.shape[:2]
    near = region((h, w), cfg['near'], cfg['bb'], cfg['hub'])
    hole = near.copy()
    cv2.imwrite(os.path.join(OUT, name + '-crank.webp'), layer(rgba, near), [cv2.IMWRITE_WEBP_QUALITY, 92])
    if 'erase' in cfg:
        hole |= region((h, w), cfg['erase'])
    hole = cv2.dilate(hole, np.ones((5, 5), np.uint8))
    color = cv2.inpaint(rgba[..., :3], hole, 6, cv2.INPAINT_TELEA)
    alpha = cv2.inpaint(rgba[..., 3], hole, 6, cv2.INPAINT_TELEA).astype(np.float32)
    alpha = np.clip((alpha - 110) * 2.2, 0, 255).astype(np.uint8)
    base = np.dstack([color, alpha])
    base[hole == 0] = rgba[hole == 0]
    cv2.imwrite(os.path.join(OUT, name + '-base.webp'), base, [cv2.IMWRITE_WEBP_QUALITY, 88])
    bx, by = cfg['bb']
    return {'x': round(bx / w, 4), 'y': round(by / h, 4)}


if __name__ == '__main__':
    print(json.dumps({n: build(n, c) for n, c in BIKES.items()}, indent=1))
