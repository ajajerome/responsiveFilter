import { View, Text, StyleSheet, TextInput, Keyboard, TouchableOpacity } from "react-native";
import Screen from "@/components/ui/Screen";
import Button from "@/components/ui/Button";
import { colors } from "@/theme";
import { useAppStore } from "@/store/useAppStore";
import { useEffect, useMemo, useState } from "react";
// Removed HSVPicker
import { useRouter } from "expo-router";

export default function Profile() {
	const router = useRouter();
	const avatar = useAppStore((s) => s.profile.avatar) || {};
	const ageStore = useAppStore((s) => s.profile.age);
	const setNameStore = useAppStore((s) => s.actions.setAvatarName);
	const setNumStore = useAppStore((s) => s.actions.setJerseyNumber);
	const setSkinStore = useAppStore((s) => s.actions.setSkinTone);
	const setTeamColorStore = useAppStore((s) => s.actions.setTeamColor);
	const setAgeStore = useAppStore((s) => s.actions.setAge);
	const favorite = useAppStore((s) => s.profile.favoritePosition);
	const [name, setName] = useState(avatar.name || '');
	const [jerseyNumber, setJerseyNumber] = useState(avatar.jerseyNumber || '');
	const [skinTone, setSkinTone] = useState(avatar.skinTone || '#f5d6c6');
	const [shirtColor, setShirtColor] = useState(avatar.shirtColor || '#4da3ff');
	const [age, setAge] = useState(String(ageStore || ''));
	const [saved, setSaved] = useState(false);
	const [errors, setErrors] = useState<{ name?: string; age?: string; jersey?: string }>({});
	const wasEmptyBefore = !(avatar?.name) || !ageStore;
	useEffect(() => {
		setName(avatar.name || '');
		setJerseyNumber(avatar.jerseyNumber || '');
		setSkinTone(avatar.skinTone || '#f5d6c6');
		setShirtColor(avatar.shirtColor || '#4da3ff');
		setAge(String(ageStore || ''));
	}, [avatar.name, avatar.jerseyNumber, avatar.skinTone, avatar.shirtColor, ageStore]);

	useEffect(() => {
		const next: { name?: string; age?: string; jersey?: string } = {};
		const trimmed = name.trim();
		if (!trimmed) next.name = 'Ange ett namn';
		const a = parseInt(age, 10);
		if (isNaN(a) || a < 7 || a > 13) next.age = 'Ålder måste vara 7–13';
		const j = parseInt(jerseyNumber || '', 10);
		if (isNaN(j) || j < 1 || j > 99) next.jersey = 'Nummer 1–99';
		setErrors(next);
	}, [name, age, jerseyNumber]);

	const onSave = () => {
		const trimmed = (name || '').trim();
		const finalName = trimmed.length ? trimmed : 'Spelare';
		const a = parseInt(age, 10);
		const finalAge = !isNaN(a) && a >= 7 && a <= 13 ? a : 10;
		const jParsed = parseInt(jerseyNumber || '10', 10);
		const finalJersey = Math.max(1, Math.min(99, isNaN(jParsed) ? 10 : jParsed));
		setNameStore(finalName);
		setNumStore(String(finalJersey));
		setSkinStore(skinTone);
		setTeamColorStore(shirtColor);
		setAgeStore(finalAge);
		setSaved(true);
		Keyboard.dismiss();
		// Navigate immediately
		router.replace('/(home)' as any);
	};

	const presetKitColors = ['#4da3ff', '#ffd400', '#00ffd1', '#ff6b6b', '#7a7cff', '#34c759', '#ff9f0a'];

	return (
		<Screen>
			<View style={styles.container}>
				<Text style={styles.title}>Din Avatar</Text>
				{/* Live preview */}
				<View style={styles.previewWrap}>
					<View style={[styles.head, { backgroundColor: skinTone }]} />
					<View style={[styles.shirt, { backgroundColor: shirtColor }]}> 
						<Text style={styles.numText}>{jerseyNumber || '10'}</Text>
					</View>
					<Text style={styles.nameText}>{name || 'Spelare'}</Text>
					{favorite ? <Text style={styles.posText}>{favorite}</Text> : null}
				</View>
				{/* Inputs */}
				<View style={{ width: '100%', gap: 10 }}>
					<Text style={styles.label}>Namn</Text>
					<TextInput
						style={styles.input}
						placeholder="Ditt namn"
						placeholderTextColor="#9aa4b2"
						value={name}
						onChangeText={(t) => setName(t.replace(/\s{2,}/g, ' ').slice(0, 24))}
						returnKeyType="done"
						onSubmitEditing={() => Keyboard.dismiss()}
					/>
					{errors.name ? <Text style={{ color: '#ff6b6b' }}>{errors.name}</Text> : null}
					<Text style={styles.label}>Ålder (7-13)</Text>
					<TextInput
						style={styles.input}
						keyboardType="number-pad"
						placeholder="t.ex. 10"
						placeholderTextColor="#9aa4b2"
						maxLength={2}
						value={age}
						onChangeText={(t) => setAge(t.replace(/[^0-9]/g, ''))}
						returnKeyType="done"
						onSubmitEditing={() => Keyboard.dismiss()}
					/>
					{errors.age ? <Text style={{ color: '#ff6b6b' }}>{errors.age}</Text> : null}
					<Text style={styles.label}>Tröjnummer</Text>
					<View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
						<TextInput
							style={[styles.input, { flex: 1 }]}
							keyboardType="number-pad"
							placeholder="t.ex. 7"
							placeholderTextColor="#9aa4b2"
							maxLength={2}
							value={jerseyNumber}
							onChangeText={(t) => setJerseyNumber(t.replace(/[^0-9]/g, ''))}
						/>
						<TouchableOpacity onPress={() => Keyboard.dismiss()} style={{ paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, backgroundColor: colors.card }}>
							<Text style={{ color: colors.text, fontWeight: '700' }}>Klart</Text>
						</TouchableOpacity>
					</View>
					{errors.jersey ? <Text style={{ color: '#ff6b6b' }}>{errors.jersey}</Text> : null}
					<Text style={styles.label}>Hudton</Text>
					<View style={{ flexDirection: 'row', gap: 10 }}>
						{['#f5d6c6', '#eac1a8', '#cf9772', '#a26e44', '#6d4b2d'].map((c) => (
							<Button key={c} title={c === skinTone ? 'Vald' : ' '} onPress={() => setSkinTone(c)} style={{ backgroundColor: c, width: 40, height: 32 }} />
						))}
					</View>
					<Text style={styles.label}>Tröjfärg</Text>
					<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
						{presetKitColors.map((c) => (
							<Button key={c} title={c === shirtColor ? 'Vald' : ' '} onPress={() => setShirtColor(c)} style={{ backgroundColor: c, width: 40, height: 32 }} />
						))}
					</View>
					<View style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
						<Button title="Spara och fortsätt" onPress={onSave} />
						{saved && <Text style={{ color: '#34c759', fontWeight: '700' }}>Sparat!</Text>}
					</View>
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
