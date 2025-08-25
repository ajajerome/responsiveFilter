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

export default function HomeIndex() {
  const setTeamColor = useAppStore((s) => s.actions.setTeamColor);
  const avatar = useAppStore((s) => s.profile.avatar) || {};
  const color = avatar.shirtColor || '#4da3ff';
  const stats = useAppStore((s) => s.stats.byCategory);
  const badges = useAppStore((s) => s.badges);
  const hours = new Date().getHours();
  const sleepTime = hours >= 21;

  const atk = stats['anfall'] || { attempts: 0, correct: 0 };
  const def = stats['forsvar'] || { attempts: 0, correct: 0 };
  const atkAcc = atk.attempts ? Math.round((atk.correct / atk.attempts) * 100) : 0;
  const defAcc = def.attempts ? Math.round((def.correct / def.attempts) * 100) : 0;
  const suggestDefense = def.attempts >= 3 && atkAcc - defAcc >= 10;
  const autoCategory = suggestDefense ? 'forsvar' : 'spelforstaelse';

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
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {(badges.length ? badges : ['Startklar']).map((b) => (
                <View key={b} style={{ paddingHorizontal: 10, paddingVertical: 6, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
                  <Text style={{ color: colors.text, fontWeight: '700' }}>{b}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Suggestion */}
          <View style={{ marginTop: 16 }}>
            <Text style={{ color: colors.muted, marginBottom: 6 }}>Din utveckling</Text>
            <Text style={{ color: colors.text }}>
              {suggestDefense
                ? `Du är stark i anfall (${atkAcc}%) men lite svagare i försvar (${defAcc}%). Vill du träna mer försvar?`
                : `Fortsätt träna! Anfall: ${atkAcc}% · Försvar: ${defAcc}%`}
            </Text>
            {suggestDefense && !sleepTime && (
              <Link href={{ pathname: '/player/quiz', params: { category: 'forsvar' } } as any} asChild>
                <Button title="Ja, träna försvar" onPress={() => {}} style={{ marginTop: 10 }} />
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
