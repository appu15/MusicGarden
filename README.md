# Music Garden

A garden you play with your hands. Your webcam tracks your fingers; each one
carries a flower with its own note. Touch a fingertip to your thumb and that
note plays and its flower is planted, until the screen is a garden.

Everything runs on your own computer. The camera video is never recorded or
sent anywhere.

## Setup (once)

You need a laptop or desktop with a webcam and speakers, and Chrome or Edge.

1. Install **Node.js** (the LTS version) from https://nodejs.org.
2. Open a terminal in this folder (the one containing `package.json`).
3. Run these two commands, one at a time. They need internet.

   ```
   npm install
   ```

   ```
   npm run fetch-model
   ```

   The second one downloads the hand-tracking model (about 8 MB) from Google.

## Run it (every time)

```
npm run dev
```

Then open http://localhost:5174 in Chrome or Edge, click **Start the garden**
and allow the camera. Keep the terminal open while you play.

## How to play

- **Each fingertip carries a flower**, except the thumb. A small icon floats
  just beyond the index, middle, ring and pinky of each hand.
- **Touch a fingertip to your thumb to play it.** The thumb is the trigger: a
  finger meeting it plays that finger's note, once. Lift the finger away and
  touch again to play it again. A quicker touch is louder.
- **Each note plants its flower** where the icon was, on a thin stem down to
  the soil. Play low for short flowers and high for tall ones. Planted flowers
  stay after your hands leave.
- **Moving your hands does nothing by itself**, so you can position them
  freely before you play.
- **Butterflies arrive** as the garden fills, and a caption appears once it
  has grown.
- **N** changes the instrument. **K** changes the scale.
- **V** cycles the camera picture: dim, clear (like a mirror) or off. **M** mutes. **C** clears the
  garden. **S** saves a picture of it.

### The notes

Pitch rises left to right across the screen like a piano.

| Hand  | Pinky | Ring | Middle | Index |
| ----- | ----- | ---- | ------ | ----- |
| Left  | 🌷 1  | 🌸 2 | ✨ 3   | 🌹 4  |
| Right | 🌺 8  | 💎 7 | 🌼 6   | 🌻 5  |

Three scales, switched with **K**:

| Scale  | Notes 1 to 8            | Character                                   |
| ------ | ----------------------- | ------------------------------------------- |
| Sunny  | C4 D4 E4 G4 A4 C5 D5 E5 | Major pentatonic: bright, nothing clashes   |
| Dreamy | A3 C4 D4 E4 G4 A4 C5 D5 | Minor pentatonic: wistful, nothing clashes  |
| Mystic | A3 B3 C4 E4 F4 A4 B4 C5 | Japanese hirajoshi: tense, some notes clash |

Four instruments, switched with **N**: Kalimba (warm, the default), Music box
(bright, an octave up), Harp (plucked) and Dream (a slow, soft pad).

## How it works

- `src/hands/` runs Google's MediaPipe Hand Landmarker in a Web Worker and
  returns 21 points per hand.
- `src/geometry/coverFit.ts` maps those points onto the mirrored,
  cropped-to-fit camera picture, so flowers sit on your fingertips.
- `src/garden/Garden.ts` keeps the eight fingertip flowers and the planted
  garden, and decides when a finger has touched the thumb (`pinchTrigger.ts`).
- `src/garden/GardenRenderer.ts` draws the scene on a 2D canvas.
- `src/music/` holds the scales and a small additive synthesiser built on the
  Web Audio API, with an echo and a generated reverb.

## Tuning

| Constant           | File                         | Value | Meaning                                           |
| ------------------ | ---------------------------- | ----- | ------------------------------------------------- |
| `PINCH_ON`         | `src/garden/pinchTrigger.ts` | 0.3   | Fingertip-to-thumb distance (hand sizes) to play  |
| `PINCH_OFF`        | `src/garden/pinchTrigger.ts` | 0.45  | Distance to release, so the finger can play again |
| `FLOAT_DISTANCE`   | `src/garden/Garden.ts`       | 0.26  | How far past the fingertip the icon floats        |
| `PLANT_SPACING_PX` | `src/garden/Garden.ts`       | 10    | Closest two planted flowers can be                |
| `CAMERA_MODES`     | `src/app/GardenApp.ts`       | -     | Camera picture opacity for each V mode            |
| `SCALES`           | `src/music/scale.ts`         | -     | The scales                                        |
| `INSTRUMENTS`      | `src/music/Synth.ts`         | -     | The instrument recipes                            |
| `NOTE_ICONS`       | `src/garden/flowerIcons.ts`  | -     | The eight flowers                                 |

If notes fire too easily, lower `PINCH_ON`. If touches are missed, raise it.

## Hosting on Vercel

The project includes a `vercel.json`, so no dashboard settings are needed.
From this folder:

```
npx vercel
```

The first run asks you to log in and name the project, then gives you a
preview link. When that works, publish it at the main address:

```
npx vercel --prod
```

Vercel runs `npm install` (which copies the MediaPipe WASM), then
`npm run fetch-model && npm run build`, and serves the `dist` folder. The
site is served over https, which browsers require for camera access.

## Scripts

`npm test`, `npm run typecheck`, `npm run lint`, `npm run build`.
