import type { MatchFreezeQuestion } from '@/types/content';

export const FREEZE_QUESTIONS: MatchFreezeQuestion[] = [
  {
    id: 'fz-5-1',
    type: 'matchscenario',
    level: '5-manna',
    category: 'spelforstaelse',
    question: 'Vem borde få bollen här?',
    players: [
      { id: 'a1', team: 'home', x: 0.28, y: 0.62 },
      { id: 'a2', team: 'home', x: 0.55, y: 0.5 },
      { id: 'a3', team: 'home', x: 0.72, y: 0.42 },
      { id: 'b1', team: 'away', x: 0.5, y: 0.6 },
    ],
    ball: { x: 0.48, y: 0.62 },
    correctPlayerIds: ['a3'],
    explanation: 'Fri ytter i fart på högerkanten.'
  },
  {
    id: 'fz-7-1',
    type: 'matchscenario',
    level: '7-manna',
    category: 'spelforstaelse',
    question: 'Vem borde få bollen här?',
    players: [
      { id: 'a1', team: 'home', x: 0.25, y: 0.68 },
      { id: 'a2', team: 'home', x: 0.45, y: 0.58 },
      { id: 'a3', team: 'home', x: 0.62, y: 0.42 },
      { id: 'b1', team: 'away', x: 0.5, y: 0.6 },
      { id: 'b2', team: 'away', x: 0.68, y: 0.48 },
    ],
    ball: { x: 0.42, y: 0.63 },
    correctPlayerIds: ['a3'],
    explanation: 'Vinkel och yta att hota framåt på kanten.'
  }
  ,
  // Försvarsspel – nya scenarier (7-manna)
  {
    id: 'fz-def-1-kant',
    type: 'matchscenario',
    level: '7-manna',
    category: 'forsvar',
    question: 'Var ska du stå vid kantanfall?',
    players: [
      { id: 'def1', team: 'home', x: 0.45, y: 0.65 },
      { id: 'def2', team: 'home', x: 0.55, y: 0.68 },
      { id: 'opp1', team: 'away', x: 0.85, y: 0.50 },
    ],
    ball: { x: 0.82, y: 0.50 },
    correctZones: [ { id: 'z', rect: { x: 0.62, y: 0.48, width: 0.12, height: 0.18 } } ], // mellan boll och mål
    explanation: 'Ställ dig mellan boll och mål för att täcka ytan.'
  },
  {
    id: 'fz-def-2-inlagg-hoger',
    type: 'matchscenario',
    level: '7-manna',
    category: 'forsvar',
    question: 'Hur positionerar du dig vid inlägg från höger?',
    players: [
      { id: 'def1', team: 'home', x: 0.50, y: 0.60 },
      { id: 'oppW', team: 'away', x: 0.92, y: 0.42 },
    ],
    ball: { x: 0.92, y: 0.42 },
    correctZones: [ { id: 'z', rect: { x: 0.50, y: 0.50, width: 0.12, height: 0.16 } } ], // centralt i boxen
    explanation: 'Positionera dig centralt i boxen för att kunna nicka undan.'
  },
  {
    id: 'fz-def-3-1v1',
    type: 'matchscenario',
    level: '7-manna',
    category: 'forsvar',
    question: 'Hur försvarar du vid 1 mot 1?',
    players: [ { id: 'opp', team: 'away', x: 0.60, y: 0.50 } ],
    ball: { x: 0.60, y: 0.50 },
    correctZones: [ { id: 'z', rect: { x: 0.54, y: 0.54, width: 0.10, height: 0.12 } } ], // stå upp, vinkla bort
    explanation: 'Stå upp och styr bortåt – gå inte ner för tidigt.'
  },
  {
    id: 'fz-def-4-horna',
    type: 'matchscenario',
    level: '7-manna',
    category: 'forsvar',
    question: 'Var står du vid hörna i försvar?',
    players: [ { id: 'opp', team: 'away', x: 0.95, y: 0.20 } ],
    ball: { x: 0.95, y: 0.20 },
    correctZones: [ { id: 'z', rect: { x: 0.55, y: 0.35, width: 0.10, height: 0.20 } } ], // markeringszon
    explanation: 'Markera din spelare i boxen och var beredd.'
  },
  {
    id: 'fz-def-5-spelvandning',
    type: 'matchscenario',
    level: '7-manna',
    category: 'forsvar',
    question: 'Hur försvarar du vid spelvändning?',
    players: [ { id: 'opp', team: 'away', x: 0.20, y: 0.40 } ],
    ball: { x: 0.20, y: 0.40 },
    correctZones: [ { id: 'z', rect: { x: 0.40, y: 0.42, width: 0.18, height: 0.18 } } ],
    explanation: 'Flytta över snabbt och täck ytan på nya kanten.'
  },
  {
    id: 'fz-def-6-djup-lopning',
    type: 'matchscenario',
    level: '7-manna',
    category: 'forsvar',
    question: 'Hur försvarar du vid djupledslöpning?',
    players: [ { id: 'fw', team: 'away', x: 0.60, y: 0.55 } ],
    ball: { x: 0.52, y: 0.60 },
    correctZones: [ { id: 'z', rect: { x: 0.46, y: 0.62, width: 0.12, height: 0.12 } } ], // droppa
    explanation: 'Droppa i tid för att hindra friläge.'
  },
  {
    id: 'fz-def-7-press-mittfalt',
    type: 'matchscenario',
    level: '7-manna',
    category: 'forsvar',
    question: 'Hur försvarar du vid press som mittfältare?',
    players: [ { id: 'oppCM', team: 'away', x: 0.55, y: 0.48 } ],
    ball: { x: 0.55, y: 0.48 },
    correctZones: [ { id: 'z', rect: { x: 0.50, y: 0.52, width: 0.14, height: 0.12 } } ],
    explanation: 'Stäng passningsvägar och styr spelet.'
  },
  {
    id: 'fz-def-8-2v1',
    type: 'matchscenario',
    level: '7-manna',
    category: 'forsvar',
    question: 'Hur försvarar du vid två mot en?',
    players: [ { id: 'opp1', team: 'away', x: 0.60, y: 0.50 }, { id: 'opp2', team: 'away', x: 0.66, y: 0.55 } ],
    ball: { x: 0.60, y: 0.50 },
    correctZones: [ { id: 'z', rect: { x: 0.54, y: 0.56, width: 0.10, height: 0.12 } } ],
    explanation: 'Fördröj och styr utåt – köp tid för laget.'
  },
  {
    id: 'fz-def-9-bolltapp',
    type: 'matchscenario',
    level: '7-manna',
    category: 'forsvar',
    question: 'Hur försvarar du vid bolltapp?',
    players: [ { id: 'opp', team: 'away', x: 0.58, y: 0.48 } ],
    ball: { x: 0.58, y: 0.48 },
    correctZones: [ { id: 'z', rect: { x: 0.50, y: 0.58, width: 0.16, height: 0.16 } } ],
    explanation: 'Fall tillbaka snabbt och täck ytorna centralt.'
  },
  {
    id: 'fz-def-10-frispark',
    type: 'matchscenario',
    level: '7-manna',
    category: 'forsvar',
    question: 'Hur försvarar du vid frispark mot dig?',
    players: [ { id: 'opp', team: 'away', x: 0.62, y: 0.46 } ],
    ball: { x: 0.62, y: 0.46 },
    correctZones: [ { id: 'z', rect: { x: 0.54, y: 0.50, width: 0.14, height: 0.14 } } ],
    explanation: 'Markerar och täcker rätt yta – var redo att kliva.'
  },
  {
    id: 'fz-def-11-inlagg-vanster',
    type: 'matchscenario',
    level: '7-manna',
    category: 'forsvar',
    question: 'Hur försvarar du vid inlägg från vänster som mittback?',
    players: [ { id: 'oppW', team: 'away', x: 0.08, y: 0.40 } ],
    ball: { x: 0.08, y: 0.40 },
    correctZones: [ { id: 'z', rect: { x: 0.50, y: 0.50, width: 0.12, height: 0.16 } } ],
    explanation: 'Lägg dig centralt i boxen för bästa position.'
  },
  {
    id: 'fz-def-12-mellan-lagdelar',
    type: 'matchscenario',
    level: '7-manna',
    category: 'forsvar',
    question: 'Hur försvarar du när motståndare hamnar mellan lagdelar?',
    players: [ { id: 'opp10', team: 'away', x: 0.52, y: 0.44 } ],
    ball: { x: 0.52, y: 0.44 },
    correctZones: [ { id: 'z', rect: { x: 0.50, y: 0.48, width: 0.12, height: 0.12 } } ],
    explanation: 'Var tät och kommunicera – stäng ytan mellan lagdelar.'
  },
  {
    id: 'fz-def-13-omställning',
    type: 'matchscenario',
    level: '7-manna',
    category: 'forsvar',
    question: 'Hur försvarar du vid omställning?',
    players: [ { id: 'opp', team: 'away', x: 0.58, y: 0.42 } ],
    ball: { x: 0.58, y: 0.42 },
    correctZones: [ { id: 'z', rect: { x: 0.50, y: 0.56, width: 0.16, height: 0.16 } } ],
    explanation: 'Fall tillbaka snabbt – minska ytor och risker.'
  },
  {
    id: 'fz-def-14-langboll',
    type: 'matchscenario',
    level: '7-manna',
    category: 'forsvar',
    question: 'Hur försvarar du vid långboll över ditt huvud?',
    players: [ { id: 'opp', team: 'away', x: 0.62, y: 0.36 } ],
    ball: { x: 0.62, y: 0.36 },
    correctZones: [ { id: 'z', rect: { x: 0.52, y: 0.60, width: 0.16, height: 0.16 } } ],
    explanation: 'Droppa och täck – förhindra friläge.'
  },
  {
    id: 'fz-def-15-inspel-centralt',
    type: 'matchscenario',
    level: '7-manna',
    category: 'forsvar',
    question: 'Hur försvarar du vid inspel centralt?',
    players: [ { id: 'opp', team: 'away', x: 0.58, y: 0.48 } ],
    ball: { x: 0.58, y: 0.48 },
    correctZones: [ { id: 'z', rect: { x: 0.52, y: 0.50, width: 0.16, height: 0.16 } } ],
    explanation: 'Täck ytan framför mål och bryt passningen.'
  }
];

