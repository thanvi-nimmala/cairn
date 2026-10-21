# Retired — canvas mockups

`cairn2.js` / `cairn2.html` drew all fifteen screens a second time in canvas,
purely to produce stills. Once the React prototype carried the full Cairn
design, keeping them meant maintaining two implementations of every screen,
and they drifted apart within a day (stones first, then whole layouts).

Stills now come from the prototype itself:

```bash
npm run dev        # one shell
./capture.sh       # another — writes shots/*.png at 780×1688
```

`stonegen.*` rendered the 3-D lit stone PNGs that preceded the 2-D vector
stones; `stone2d.html` was the sheet used to tune the 2-D silhouettes.
Kept for reference, not wired to anything.
