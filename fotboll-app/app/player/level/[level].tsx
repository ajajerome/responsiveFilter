import { useLocalSearchParams, Link } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import Screen from "@/components/ui/Screen";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Tag from "@/components/ui/Tag";
import ProgressBar from "@/components/ui/ProgressBar";
import { useAppStore } from "@/store/useAppStore";

const CATEGORIES = [
  { key: 'spelregler', label: '🧠 Spelregler' },
  { key: 'forsvar', label: '🛡️ Försvarsspel' },
  { key: 'anfall', label: '🚀 Anfallsspel' },
  { key: 'fasta', label: '🎯 Fasta situationer' },
  { key: 'teknik', label: '👟 Teknikträning' },
  { key: 'spelforstaelse', label: '🧩 Spelförståelse' },
  { key: 'lagarbete', label: '🤝 Lagarbete & kommunikation' },
  { key: 'malvakt', label: '🧍‍♂️ Målvaktsspel' },
];

function motivationalMessage(level: string) {
  if (level?.includes('7')) return 'Du är inne i Juniorlaget – nu växer din speluppfattning!';
  if (level?.includes('9')) return 'Stjärnlaget väntar – dags att finslipa taktiken!';
  return 'Ungdomsakademin – bygg grunden stark!';
}

export default function LevelScreen() {
  const { level } = useLocalSearchParams<{ level: string }>();
  const progress = useAppStore((s) => s.progress as any);
  const catProgress = progress?.[String(level)]?.categoryProgress || {};
  return (
    <Screen>
      <Tag label={String(level)} />
      <Text style={styles.title}>{motivationalMessage(String(level))}</Text>
      <Card>
        <View style={{ gap: 10 }}>
          {CATEGORIES.map((c) => (
            <Link key={c.key} href={{ pathname: '/player/quiz', params: { level, category: c.key } }} asChild>
              <Button title={c.label} onPress={() => {}} />
            </Link>
          ))}
        </View>
      </Card>
      <View style={{ gap: 12, marginTop: 12 }}>
        {CATEGORIES.map((c) => {
          const total = (catProgress as any)?.[c.key]?.total ?? 10;
          const done = (catProgress as any)?.[c.key]?.completed ?? 0;
          const val = total > 0 ? done / total : 0;
          return (
            <View key={`p-${c.key}`} style={{ gap: 6 }}>
              <Text>{c.label}</Text>
              <ProgressBar value={val} />
            </View>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 12 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 16, textTransform: "capitalize" },
});