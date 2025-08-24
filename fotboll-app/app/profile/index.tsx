import { View, Text, StyleSheet, TextInput } from "react-native";
import Screen from "@/components/ui/Screen";
import Button from "@/components/ui/Button";
import { colors } from "@/theme";
import { useAppStore } from "@/store/useAppStore";

export default function Profile() {
	const avatar = useAppStore((s) => s.profile.avatar) || {};
	const setName = useAppStore((s) => s.actions.setAvatarName);
	const setNum = useAppStore((s) => s.actions.setJerseyNumber);
	const setSkin = useAppStore((s) => s.actions.setSkinTone);
	const setTeamColor = useAppStore((s) => s.actions.setTeamColor);
	const favorite = useAppStore((s) => s.profile.favoritePosition);
	const teamColor = avatar.shirtColor || '#4da3ff';
	const skin = avatar.skinTone || '#f5d6c6';
	return (
		<Screen>
			<View style={styles.container}>
				<Text style={styles.title}>Din Avatar</Text>
				{/* Live preview */}
				<View style={styles.previewWrap}>
					<View style={[styles.head, { backgroundColor: skin }]} />
					<View style={[styles.shirt, { backgroundColor: teamColor }]}> 
						<Text style={styles.numText}>{avatar.jerseyNumber || '10'}</Text>
					</View>
					<Text style={styles.nameText}>{avatar.name || 'Spelare'}</Text>
					{favorite ? <Text style={styles.posText}>{favorite}</Text> : null}
				</View>
				{/* Inputs */}
				<View style={{ width: '100%', gap: 10 }}>
					<Text style={styles.label}>Namn</Text>
					<TextInput
						style={styles.input}
						placeholder="Ditt namn"
						placeholderTextColor="#9aa4b2"
						defaultValue={avatar.name || ''}
						onChangeText={setName}
					/>
					<Text style={styles.label}>Tröjnummer</Text>
					<TextInput
						style={styles.input}
						keyboardType="number-pad"
						placeholder="t.ex. 7"
						placeholderTextColor="#9aa4b2"
						maxLength={2}
						defaultValue={avatar.jerseyNumber || ''}
						onChangeText={setNum}
					/>
					<Text style={styles.label}>Hudton</Text>
					<View style={{ flexDirection: 'row', gap: 10 }}>
						{['#f5d6c6', '#eac1a8', '#cf9772', '#a26e44', '#6d4b2d'].map((c) => (
							<Button key={c} title={c === skin ? 'Vald' : ' '} onPress={() => setSkin(c)} style={{ backgroundColor: c, width: 40, height: 32 }} />
						))}
					</View>
					<Text style={styles.label}>Tröjfärg</Text>
					<View style={{ flexDirection: 'row', gap: 10 }}>
						{['#4da3ff', '#ffd400', '#00ffd1', '#ff6b6b', '#7a7cff'].map((c) => (
							<Button key={c} title={c === teamColor ? 'Vald' : ' '} onPress={() => setTeamColor(c)} style={{ backgroundColor: c, width: 40, height: 32 }} />
						))}
					</View>
					<Text style={styles.label}>Egen färg (hex, t.ex. #1abc9c)</Text>
					<TextInput
						style={styles.input}
						placeholder="#RRGGBB"
						placeholderTextColor="#9aa4b2"
						defaultValue={teamColor}
						onChangeText={(txt) => {
							const v = txt.trim();
							if (/^#[0-9a-fA-F]{6}$/.test(v)) setTeamColor(v);
						}}
					/>
				</View>
			</View>
		</Screen>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16, gap: 16 },
	title: { fontSize: 22, fontWeight: "700", color: colors.text },
	previewWrap: { alignItems: 'center', gap: 6 },
	head: { width: 52, height: 52, borderRadius: 26, borderWidth: 2, borderColor: '#e7ebf3' },
	shirt: { width: 72, height: 64, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#e7ebf3' },
	numText: { color: 'white', fontSize: 20, fontWeight: '900' },
	nameText: { color: colors.text, fontWeight: '800', marginTop: 4 },
	posText: { color: colors.muted, fontSize: 12 },
	label: { color: colors.muted },
	input: { backgroundColor: 'rgba(255,255,255,0.06)', color: colors.text, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 },
});
