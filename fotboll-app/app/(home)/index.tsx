import { Link } from "expo-router";
import { Text, StyleSheet, View } from "react-native";
import Screen from "@/components/ui/Screen";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import XpBadge from "@/components/ui/XpBadge";
import { colors } from "@/theme";
import { useAppStore } from "@/store/useAppStore";

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return 'God natt';
  if (h < 11) return 'God morgon';
  if (h < 17) return 'God dag';
  if (h < 21) return 'God kväll';
  return 'God natt';
}

const CATEGORY_LABELS: Record<string, string> = {
  spelregler: 'Spelregler',
  forsvar: 'Försvar',
  anfall: 'Anfall',
  fasta: 'Fasta',
  teknik: 'Teknik',
  spelforstaelse: 'Spelförståelse',
  lagarbete: 'Lagarbete',
  malvakt: 'Målvakt',
};

export default function HomeIndex() {
  const setTeamColor = useAppStore((s) => s.actions.setTeamColor);
  const avatar = useAppStore((s) => s.profile.avatar) || {};
  const color = avatar.shirtColor || '#4da3ff';
  const stats = useAppStore((s) => s.stats.byCategory);
  const badges = useAppStore((s) => s.badges);
  const correctTs = useAppStore((s) => s.stats.correctAnswerTimestamps);
  const hours = new Date().getHours();
  const sleepTime = hours >= 21;

  const atk = stats['anfall'] || { attempts: 0, correct: 0 };
  const def = stats['forsvar'] || { attempts: 0, correct: 0 };
  const atkAcc = atk.attempts ? Math.round((atk.correct / atk.attempts) * 100) : 0;
  const defAcc = def.attempts ? Math.round((def.correct / def.attempts) * 100) : 0;
  const suggestDefense = def.attempts >= 3 && atkAcc - defAcc >= 10;
  const autoCategory = suggestDefense ? 'forsvar' : 'spelforstaelse';

  const now = Date.now();
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const weeklyCorrect = (correctTs || []).filter((t) => t >= weekAgo).length;
  const weeklyGoal = 10;
  const tired = weeklyCorrect < weeklyGoal;

  // Dynamic strengths/weaknesses across categories
  const entries = Object.entries(stats).map(([key, v]) => ({ key, attempts: v.attempts, acc: v.attempts ? (v.correct / v.attempts) : 0 }));
  const reliable = entries.filter((e) => e.attempts >= 3);
  const sorted = (reliable.length ? reliable : entries).sort((a, b) => b.acc - a.acc);
  const strongest = sorted.slice(0, 2);
  const weakest = sorted.length ? sorted[sorted.length - 1] : undefined;
  const weakestCat = weakest?.key;
  const summaryText = strongest.length && weakest
    ? `Stark i ${strongest.map(s => CATEGORY_LABELS[s.key] || s.key).join(' & ')} men svagare i ${(CATEGORY_LABELS[weakest.key] || weakest.key)}.`
    : `Fortsätt träna och lås upp fler kategorier.`;
  const showWeakestBadge = !!(weakest && weakest.attempts >= 5 && weakest.acc < 0.5);

  const orderedForBars = Object.keys(CATEGORY_LABELS)
    .map((k) => ({ key: k, attempts: stats[k]?.attempts || 0, acc: stats[k]?.attempts ? (stats[k].correct / stats[k].attempts) : 0 }))
    .filter((e) => e.attempts > 0);

  return (
    <Screen>
      <XpBadge />
      <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: avatar.skinTone || '#f5d6c6', borderWidth: 1, borderColor: '#e7ebf3' }} />
          <View style={{ paddingHorizontal: 8, paddingVertical: 6, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.06)', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ width: 28, height: 22, borderRadius: 6, backgroundColor: color, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#e7ebf3' }}>
              <Text style={{ color: 'white', fontWeight: '800', fontSize: 12 }}>{avatar.jerseyNumber || '10'}</Text>
            </View>
            <Text style={{ color: colors.text, fontWeight: '700' }}>{avatar.name || 'Spelare'}</Text>
          </View>
          <Link href="/profile" asChild>
            <Button title="Ändra" onPress={() => {}} variant="secondary" />
          </Link>
        </View>
      </View>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={styles.title}>{greeting()} {avatar.name || 'Spelare'}</Text>
        <Card>
          <Text style={{ color: colors.muted, marginBottom: 8 }}>Aktuell XP:</Text>
          <View style={{ marginBottom: 12 }}>
            <XpBadge />
          </View>

          {/* Weekly goal & Tamagotchi */}
          <View style={{ marginBottom: 12, padding: 10, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }}>
            <Text style={{ color: colors.text, fontWeight: '800' }}>Veckomål</Text>
            <Text style={{ color: colors.text }}>Rätt denna vecka: {weeklyCorrect} / {weeklyGoal}</Text>
            {tired ? (
              <Text style={{ color: '#ff6b6b', marginTop: 4 }}>
                Jag börjar bli trött om vi inte tränar mer den här veckan… Ska vi köra?
              </Text>
            ) : (
              <Text style={{ color: '#34c759', marginTop: 4 }}>
                Grymt! Du håller målet uppe den här veckan.
              </Text>
            )}
          </View>

          {sleepTime ? (
            <Text style={{ color: colors.text }}>
              Sover du inte nu? Vi kan inte träna. För att bli bättre behöver du sömn.
            </Text>
          ) : (
            <Link href={{ pathname: '/player/quiz', params: { category: autoCategory } } as any} asChild>
              <Button title="Jag vill träna" onPress={() => {}} />
            </Link>
          )}

          {/* Badges */}
          <View style={{ marginTop: 16 }}>
            <Text style={{ color: colors.muted, marginBottom: 8 }}>Mina badges</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
              {(badges.length ? badges : ['Startklar']).map((b) => (
                <View key={b} style={{ paddingHorizontal: 10, paddingVertical: 6, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
                  <Text style={{ color: colors.text, fontWeight: '700' }}>{b}</Text>
                </View>
              ))}
              {showWeakestBadge && weakestCat && (
                <View key="svagast"
                  style={{ paddingHorizontal: 10, paddingVertical: 6, backgroundColor: 'rgba(255,100,100,0.12)', borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255,100,100,0.4)' }}>
                  <Text style={{ color: '#ff6b6b', fontWeight: '900' }}>Svagast just nu: {CATEGORY_LABELS[weakestCat] || weakestCat} {Math.round((weakest?.acc || 0) * 100)}% ({weakest?.attempts} försök)</Text>
                </View>
              )}
            </View>
          </View>

          {/* Category Progress Bars */}
          {orderedForBars.length > 0 && (
            <View style={{ marginTop: 16 }}>
              <Text style={{ color: colors.muted, marginBottom: 6 }}>Kategoriprogress</Text>
              <View style={{ gap: 8 }}>
                {orderedForBars.map((e) => (
                  <View key={e.key} style={{ gap: 4 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ color: colors.text, fontWeight: '700' }}>{CATEGORY_LABELS[e.key] || e.key}</Text>
                      <Text style={{ color: colors.muted }}>{Math.round(e.acc * 100)}% ({e.attempts})</Text>
                    </View>
                    <View style={{ height: 6, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                      <View style={{ height: 6, borderRadius: 999, width: `${Math.max(2, Math.round(e.acc * 100))}%`, backgroundColor: e.acc >= 0.6 ? '#34c759' : e.acc >= 0.4 ? '#ffd400' : '#ff6b6b' }} />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Dynamic Strength Summary */}
          <View style={{ marginTop: 16 }}>
            <Text style={{ color: colors.muted, marginBottom: 6 }}>Din utveckling</Text>
            <Text style={{ color: colors.text }}>
              {summaryText}
            </Text>
            {weakestCat && !sleepTime && (
              <Link href={{ pathname: '/player/quiz', params: { category: weakestCat } } as any} asChild>
                <Button title={`Träna ${CATEGORY_LABELS[weakestCat] || weakestCat}`} onPress={() => {}} style={{ marginTop: 10 }} />
              </Link>
            )}
          </View>

          <Text style={{ color: colors.muted, marginTop: 16 }}>Välj lagfärg:</Text>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
            {['#4da3ff', '#ffd400', '#00ffd1', '#ff6b6b', '#7a7cff'].map((c) => (
              <Button key={c} title={c === color ? 'Vald' : ' '} onPress={() => setTeamColor(c)} style={{ backgroundColor: c, width: 48, height: 36 }} />
            ))}
          </View>
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: "800", color: colors.text, textAlign: "center", marginBottom: 8 },
});
