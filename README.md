# Fotbollstränaren – Monorepo

Detta repo innehåller:

- Web statics (`index.html`, `css/`, `js/`)
- React Native/Expo-appen i `fotboll-app/`
- Unity-projektet i `fotbollsresan-unity/`

## Setup (Expo)

1) cd `fotboll-app`
2) `npm install`
3) Starta: `npx expo start --tunnel` (Expo Go-länk/QR visas)

Staging-profil för EAS är förkonfad i `fotboll-app/eas.json`:

- Kanal: `staging`
- Runtime/updates pekar mot EAS-projekt `7cae0243-bae5-4dee-b10d-11a4169cbac0`

## app.json (Expo)

- `name/slug`: `fotbollstranaren`
- `ios.bundleIdentifier`: `com.ajagames.learnfotball`
- `extra.eas.projectId`: `7cae0243-bae5-4dee-b10d-11a4169cbac0`
- `updates.url`: `https://u.expo.dev/7cae0243-bae5-4dee-b10d-11a4169cbac0`

## Interaction-modul (RN)

En första version finns i `fotboll-app/app/player/interaction.tsx`:

- Renderar två lag (blå/röd) med enkel formation per nivå
- Åldersval (U7–U13+) påverkar nivå: 5-, 7-, 9-manna
- Frågor filtreras efter nivå från `data/questions.ts`

Nästa steg:

- Utöka till åldersanpassad frågebank och formationsdata
- Lägg till scoring, feedback och sekvenslogik (passing/formation)

## XP och progression (RN)

- XP tilldelas vid giltiga åtgärder i `Interaction` (pass/dribbling/skott/försvar)
- Tilldelningen sker via Zustand: `useAppStore().actions.addXp(level, amount)`
- Aktuell XP per nivå visas i `player/interaction` (hämtas från store)
- Exempel: validerad passning ger +10 XP, dribbling +8, avslut +15

## Unity (översikt)

Se `fotbollsresan-unity/README.md` för iOS/TestFlight och Staging.
