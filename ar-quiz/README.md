# AR Quiz (WebXR + Three.js)

A minimal AR quiz prototype where creators place quiz markers in the room and players select them to answer questions.

## Requirements

- A mobile device and browser with WebXR AR support
- Android: Chrome w/ WebXR and ARCore services
- iOS: WebXR support is limited in Safari; test on Android for now
- HTTPS hosting (WebXR requires secure context)

## Run locally

```bash
npm install
npm run dev
```

Expose on LAN for device testing:

```bash
npm run dev -- --host
```

## Build

```bash
npm run build
npm run preview
```

## How to use

- Tap Start AR to enter an AR session
- Move device to find a surface (reticle will appear)
- Tap Create Quiz to enter a question and answers
- Submit and then tap on the reticle to place the quiz marker
- Tap a placed marker to answer; buttons show correct/wrong
- Quizzes persist in localStorage between sessions

## Tech

- Three.js WebXR for AR session and hit-test
- Simple sphere-cone marker for quiz objects
- Local persistence via localStorage

## Future (Unity migration)

- Keep quiz data JSON shape (question, answers, correctIndex, color, matrix)
- Y-up meters; reuse transforms in AR Foundation
- Replace WebXR interactions with Unity XR Raycast/AR Foundation taps