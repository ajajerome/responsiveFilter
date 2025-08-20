import { useLocalSearchParams, Link } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import Screen from "@/components/ui/Screen";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Tag from "@/components/ui/Tag";

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
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 12 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 16, textTransform: "capitalize" },
});
