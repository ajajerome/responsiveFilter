import { Link } from "expo-router";
import { Text, StyleSheet } from "react-native";
import Screen from "@/components/ui/Screen";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { colors } from "@/theme";

export default function AuthIndex() {
  return (
    <Screen>
      <Text style={styles.title}>Välj inloggning</Text>
      <Card>
        <Link href="/(home)" asChild>
          <Button title="Fortsätt utan konto" onPress={() => {}} />
        </Link>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: "800", color: colors.text, textAlign: "center" },
});
