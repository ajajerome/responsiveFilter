## Fotbollsresan (Unity)

En Unity-baserad app för barn och ungdomar som tränar fotboll. Appen innehåller avatar/profil, åldersbaserade övningsrekommendationer, levelsystem, fritt spelläge per position, quiz och interaktiva sekvenser. Förberedd för iOS-distribution via TestFlight.

### Funktioner (MVP)
- Profil och avatar: hudfärg, namn, födelsedag, position
- Ålderslogik: beräknar ålder, åldersgrupp (U7/U9/...), spelsystem (5v5/7v7/9v9/11v11)
- Rekommendationer: övningar filtrerade på ålder, position och spelsystem
- Levelsystem: XP och nivåprogression
- Fritt spelläge: träna position-specifikt
- Quiz/Interaktivt: frågor med svarsalternativ, interaktiva förlopp
- Ändlöst: streaks, dagliga/veckovisa quests, säsonger/tiers och prestige

### Krav
- Unity 2022 LTS (t.ex. 2022.3.x) med iOS Build Support
- Xcode på macOS för iOS-bygge
- Fastlane (Ruby) för TestFlight-distribution
 - Addressables (Unity) för skalbart innehåll

### Komma igång
1) Öppna projektet i Unity: `File > Open` och välj mappen `fotbollsresan-unity`
2) Kontrollera `Packages/manifest.json` (TextMeshPro, Input System)
3) Skapa en scen `Assets/Scenes/Main.unity` och lägg till lämpliga GameObjects:
   - `ProfileService`, `LevelSystem`, `ExerciseRecommender` (som komponenter)
   - UI för avatar/quiz vid behov
4) Spela i Editorn

### Export till iOS och TestFlight
1) Unity: `File > Build Settings... > iOS` och `Switch Platform`
2) Ställ in `Player Settings`:
   - Company/Organization Identifier (ex: com.dittbolag)
   - Product Name: Fotbollsresan
   - Bundle Identifier (ex: com.dittbolag.fotbollsresan)
   - Version och Build
3) `Build` till t.ex. `build/ios/FotbollsresanXcode`
4) Öppna Xcode-projektet, kontrollera Signing & Capabilities (team, provisioning)
5) Kör på enhet för test

#### CLI-bygge (macOS)
Sätt miljövariabler och kör skriptet för att bygga Xcode-projektet:
```
export APPLE_TEAM_ID="ABCDE12345"
export APP_VERSION="1.0.0"
export APP_BUILD="1"
UNITY_PATH="/Applications/Unity/Hub/Editor/2022.3.0f1/Unity.app/Contents/MacOS/Unity" \
bash BuildScripts/build_ios.sh
```

##### Staging/Production
- Staging: sätt `APP_ENV=staging` och basidentifierare via `BUNDLE_BASE=com.dittbolag.fotbollsresan`
- Production: `APP_ENV=production` (ingen suffix), uppdatera signing/provisioning

#### Fastlane (TestFlight)
Förbered:
- Redigera `fastlane/Appfile` (app_identifier, apple_id, team_id)
- I iOS-projektmappen (exporterad av Unity), kör `fastlane beta`

Snabbstart (exempel):
```
cd build/ios/FotbollsresanXcode
bundle exec fastlane beta
```
Staging:
```
bundle exec fastlane beta_staging
```

`fastlane beta` förutsätter att Xcode-arkivet byggs via gym/scan (se `fastlane/Fastfile`). Anpassa sökvägar/target-namn efter projektets namn.

### Kodstruktur
- `Assets/Scripts/Core` – profil, ålder, rekommendationer, levelsystem, persistens
- `Assets/Scripts/Core/Events` – centrala händelser (XP, aktivitet)
- `Assets/Scripts/Core/Progression` – nivåer, streaks, säsonger
- `Assets/Scripts/Core/Quests` – dagliga/veckovisa mål
- `Assets/Scripts/UI` – avatar-/UI-kontrollers, fritt spelläge
- `Assets/Scripts/Quiz` – quiz och interaktiva flöden

### Data/Persistens
- JSON under `Application.persistentDataPath`
- Nycklar: `profile.json`, `level.json`
 - StreamingAssets: `quiz_*.json`, `formations.json`, `passing_sequence.json`, `quests.json`

### Licens
Proprietär/Intern under utveckling.

