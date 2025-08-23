import { Link } from "expo-router";
import { Text, StyleSheet, View } from "react-native";
import Screen from "@/components/ui/Screen";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import XpBadge from "@/components/ui/XpBadge";
import { colors } from "@/theme";
import { useAppStore } from "@/store/useAppStore";

export default function HomeIndex() {
  const setTeamColor = useAppStore((s) => s.actions.setTeamColor);
  const color = useAppStore((s) => s.profile.avatar?.shirtColor) || '#4da3ff';
  return (
    <Screen>
      <XpBadge />
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={styles.title}>Fotbollsteori – Resan börjar</Text>
        <Card>
          <Text style={{ color: colors.muted, marginBottom: 8 }}>Välj lagfärg:</Text>
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
            {['#4da3ff', '#ffd400', '#00ffd1', '#ff6b6b', '#7a7cff'].map((c) => (
              <Button key={c} title={c === color ? 'Vald' : ' '} onPress={() => setTeamColor(c)} style={{ backgroundColor: c, width: 48, height: 36 }} />
            ))}
          </View>
          <Link href="/player" asChild>
            <Button title="Starta som spelare" onPress={() => {}} />
          </Link>
          <Link href="/trainer" asChild>
            <Button title="Förälder/Tränare" onPress={() => {}} variant="secondary" style={{ marginTop: 12 }} />
          </Link>
          <Link href="/profile" asChild>
            <Button title="Redigera Avatar" onPress={() => {}} variant="secondary" style={{ marginTop: 12 }} />
          </Link>
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: "800", color: colors.text, textAlign: "center" },
});
