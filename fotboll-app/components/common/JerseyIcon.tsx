import { View, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';

type Props = {
	color: string;
	number?: string;
	size?: number; // width in px (height derived)
	borderColor?: string;
};

export default function JerseyIcon({ color, number, size = 28, borderColor = '#e7ebf3' }: Props) {
	const width = size;
	const height = Math.round(size * 1.2);
	// Simple T-shirt silhouette path (normalized to width/height)
	// Points are rough to suggest sleeves and torso
	const w = width, h = height;
	const path = `M ${w * 0.15} ${h * 0.25} L ${w * 0.35} ${h * 0.08} L ${w * 0.65} ${h * 0.08} L ${w * 0.85} ${h * 0.25} L ${w * 0.72} ${h * 0.25} L ${w * 0.72} ${h * 0.92} L ${w * 0.28} ${h * 0.92} L ${w * 0.28} ${h * 0.25} Z`;
	return (
		<View style={{ width, height, alignItems: 'center', justifyContent: 'center' }}>
			<Svg width={width} height={height}>
				<Path d={path} fill={color} stroke={borderColor} strokeWidth={2} />
			</Svg>
			{number ? (
				<Text style={{ position: 'absolute', color: 'white', fontWeight: '900', fontSize: Math.max(10, Math.round(size * 0.42)) }}>
					{number}
				</Text>
			) : null}
		</View>
	);
}