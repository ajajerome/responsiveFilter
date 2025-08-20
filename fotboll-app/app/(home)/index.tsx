import { Link } from "expo-router";
import { Text, StyleSheet, View } from "react-native";
import Screen from "@/components/ui/Screen";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import XpBadge from "@/components/ui/XpBadge";
import { colors } from "@/theme";

export default function HomeIndex() {
  return (
    <Screen>
      <XpBadge />
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={styles.title}>Fotbollsteori – Resan börjar</Text>
        <Card>
          <Link href="/player" asChild>
            <Button title="Starta som spelare" onPress={() => {}} />
          </Link>
          <Link href="/trainer" asChild>
            <Button title="Förälder/Tränare" onPress={() => {}} variant="secondary" style={{ marginTop: 12 }} />
          </Link>
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: "800", color: colors.text, textAlign: "center" },
});
