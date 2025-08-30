import { FC25 } from '@/app/components/Theme';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import type { ActionType } from '@/types/content';

type Props = {
	allowed: ActionType[];
	onSelect: (action: ActionType) => void;
};

export default function ActionBar({ allowed, onSelect }: Props) {
	return (
		<View style={styles.bar}>
			{(['pass', 'dribble', 'shoot', 'defend'] as ActionType[]).map((a) => (
				<Pressable key={a} disabled={!allowed.includes(a)} style={[styles.btn, !allowed.includes(a) && styles.btnDisabled]} onPress={() => onSelect(a)}>
					<Text style={styles.btnText}>{a.toUpperCase()}</Text>
				</Pressable>
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	bar: { flexDirection: 'row', gap: 8, padding: 12, backgroundColor: FC25.colors.card, borderRadius: FC25.radius, borderWidth: 1, borderColor: FC25.colors.border },
	btn: { flex: 1, backgroundColor: FC25.colors.primary, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
	btnDisabled: { backgroundColor: '#2b2c33' },
	btnText: { color: '#0a0a0f', fontWeight: '800' },
});

