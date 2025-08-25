import { Link } from "expo-router";
import { Text, StyleSheet, View } from "react-native";
import Screen from "@/components/ui/Screen";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { colors } from "@/theme";

export default function Start() {
	return (
		<Screen>
			<View style={{ flex: 1, justifyContent: 'center' }}>
				<Text style={styles.title}>Välkommen till fotbollsresan</Text>
				<Card>
					<Link href="/profile" asChild>
						<Button title="Skapa spelare" onPress={() => {}} />
					</Link>
					<Link href="/(home)" asChild>
						<Button title="Fortsätt spela" onPress={() => {}} variant="secondary" style={{ marginTop: 12 }} />
					</Link>
				</Card>
			</View>
		</Screen>
	);
}

const styles = StyleSheet.create({
	title: { fontSize: 24, fontWeight: "800", color: colors.text, textAlign: "center", marginBottom: 12 },
});