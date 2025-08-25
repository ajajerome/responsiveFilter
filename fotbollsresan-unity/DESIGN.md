## Design System: Miami Vice Fotbollsplan

### Färgpalett
- Primär: Neonblå `#00CFFF`
- Sekundär: Neonrosa `#FF2DAA`
- Bakgrund: Mörk lila `#1A0033`
- Text: Vit `#FFFFFF`
- Komplement: Grön `#4CAF50`

### Typografi
- Rubriker: Orbitron/Audiowide (TMP Font Asset)
- Brödtext: Roboto/Montserrat (TMP Font Asset)
- Glow på rubriker: 0.5

### Komponenter
- NeonButton: primär CTA med glow (rosa) och bakgrund (blå)
- NeonGlow: outline + shadow för ikoner/rubriker
- ThemeApplicator: applicerar bakgrund, rubriker och textfärger globalt

### Layoutidéer
- Hem: bakgrundsbild (nedtonad/blur), rubrik i neonrosa med glow, bottennav i neonblå
- Dashboard: kort med mörk bakgrund och neonramar, progress bars i gradient (blå→rosa)
- Profil: avatar med neonram, halvtransparent overlay med temaelement

### Interaktioner
- Hover/press: ökad glow
- Övergångar: fade/slide med neonspår
- Laddning: snurrande fotboll med neontrails

### Implementationsnoter
- ThemeConfig (ScriptableObject) håller tokens
- Prefabs: skapa knappar/kort med NeonButton + NeonGlow
- Använd Addressables för bakgrundsbilder och ikoner

