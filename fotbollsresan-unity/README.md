## Fotbollsresan (Unity)

En Unity-baserad app för barn och ungdomar som tränar fotboll. Appen innehåller avatar/profil, åldersbaserade övningsrekommendationer, levelsystem, fritt spelläge per position, quiz och interaktiva sekvenser. Förberedd för iOS-distribution via TestFlight.

### Funktioner (MVP)
- Profil och avatar: hudfärg, namn, födelsedag, position
- Ålderslogik: beräknar ålder, åldersgrupp (U7/U9/...), spelsystem (5v5/7v7/9v9/11v11)
- Rekommendationer: övningar filtrerade på ålder, position och spelsystem
- Levelsystem: XP och nivåprogression
- Fritt spelläge: träna position-specifikt
- Quiz/Interaktivt: frågor med svarsalternativ, interaktiva förlopp

### Krav
- Unity 2022 LTS (t.ex. 2022.3.x) med iOS Build Support
- Xcode på macOS för iOS-bygge
- Fastlane (Ruby) för TestFlight-distribution

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

#### Fastlane (TestFlight)
Förbered:
- Redigera `fastlane/Appfile` (app_identifier, apple_id, team_id)
- I iOS-projektmappen (exporterad av Unity), kör `fastlane beta`

Snabbstart (exempel):
```
cd build/ios/FotbollsresanXcode
bundle exec fastlane beta
```

`fastlane beta` förutsätter att Xcode-arkivet byggs via gym/scan (se `fastlane/Fastfile`). Anpassa sökvägar/target-namn efter projektets namn.

### Kodstruktur
- `Assets/Scripts/Core` – profil, ålder, rekommendationer, levelsystem, persistens
- `Assets/Scripts/UI` – avatar-/UI-kontrollers, fritt spelläge
- `Assets/Scripts/Quiz` – quiz och interaktiva flöden

### Data/Persistens
- JSON under `Application.persistentDataPath`
- Nycklar: `profile.json`, `level.json`

### Licens
Proprietär/Intern under utveckling.

