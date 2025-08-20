import { Link } from "expo-router";
import { Text, StyleSheet } from "react-native";
import Screen from "@/components/ui/Screen";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import XpBadge from "@/components/ui/XpBadge";
import { colors } from "@/theme";

export default function PlayerHome() {
  return (
    <Screen>
      <XpBadge />
      <Text style={styles.title}>Välj nivå</Text>
      <Card>
        <Link href="/player/level/5-manna" asChild>
          <Button title="5-manna" onPress={() => {}} />
        </Link>
        <Link href="/player/level/7-manna" asChild>
          <Button title="7-manna" onPress={() => {}} style={{ marginTop: 12 }} />
        </Link>
        <Link href="/player/level/9-manna" asChild>
          <Button title="9-manna" onPress={() => {}} style={{ marginTop: 12 }} />
        </Link>
        <Link href="/player/repetition" asChild>
          <Button title="Repetitionsläge" onPress={() => {}} variant="secondary" style={{ marginTop: 12 }} />
        </Link>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: "800", color: colors.text, textAlign: "center" },
});
