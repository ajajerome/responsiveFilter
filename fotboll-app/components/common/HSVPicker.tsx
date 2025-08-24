import { View, PanResponder, GestureResponderEvent, PanResponderGestureState } from 'react-native';
import Svg, { Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useEffect, useMemo, useRef, useState } from 'react';

function hsvToRgb(h: number, s: number, v: number) {
	const c = v * s;
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
	const m = v - c;
	let r = 0, g = 0, b = 0;
	if (h < 60) { r = c; g = x; b = 0; }
	else if (h < 120) { r = x; g = c; b = 0; }
	else if (h < 180) { r = 0; g = c; b = x; }
	else if (h < 240) { r = 0; g = x; b = c; }
	else if (h < 300) { r = x; g = 0; b = c; }
	else { r = c; g = 0; b = x; }
	return {
		r: Math.round((r + m) * 255),
		g: Math.round((g + m) * 255),
		b: Math.round((b + m) * 255),
	};
}

function rgbToHex(r: number, g: number, b: number) {
	const toHex = (n: number) => n.toString(16).padStart(2, '0');
	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hexToRgb(hex: string) {
	const m = /^#?([0-9a-fA-F]{6})$/.exec(hex);
	if (!m) return { r: 77, g: 163, b: 255 };
	const int = parseInt(m[1], 16);
	return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
}

function rgbToHsv(r: number, g: number, b: number) {
	r /= 255; g /= 255; b /= 255;
	const max = Math.max(r, g, b), min = Math.min(r, g, b);
	const d = max - min;
	let h = 0;
	if (d === 0) h = 0;
	else if (max === r) h = 60 * (((g - b) / d) % 6);
	else if (max === g) h = 60 * ((b - r) / d + 2);
	else h = 60 * ((r - g) / d + 4);
	if (h < 0) h += 360;
	const s = max === 0 ? 0 : d / max;
	const v = max;
	return { h, s, v };
}

type Props = {
	value: string; // hex
	onChange: (hex: string) => void;
	width?: number;
};

export default function HSVPicker({ value, onChange, width = 260 }: Props) {
	const height = 200;
	const hueHeight = 16;
	const pad = 6;
	const svSize = { w: width - pad * 2, h: height - hueHeight - pad * 3 };
	const rgb = useMemo(() => hexToRgb(value), [value]);
	const initial = useMemo(() => rgbToHsv(rgb.r, rgb.g, rgb.b), [rgb]);
	const [h, setH] = useState(initial.h);
	const [s, setS] = useState(initial.s);
	const [v, setV] = useState(initial.v);
	useEffect(() => {
		const { r, g, b } = hsvToRgb(h, s, v);
		onChange(rgbToHex(r, g, b));
	}, [h, s, v]);

	// Hue slider pan
	const huePan = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onPanResponderMove: (e: GestureResponderEvent, g: PanResponderGestureState) => {
				const { locationX } = e.nativeEvent;
				const x = Math.max(0, Math.min(svSize.w, locationX - pad));
				const hue = (x / svSize.w) * 360;
				setH(hue);
			},
			onPanResponderRelease: (e) => {
				const { locationX } = e.nativeEvent;
				const x = Math.max(0, Math.min(svSize.w, locationX - pad));
				const hue = (x / svSize.w) * 360;
				setH(hue);
			},
		})
	).current;

	// SV square pan
	const svPan = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onPanResponderMove: (e) => {
				const { locationX, locationY } = e.nativeEvent;
				const x = Math.max(0, Math.min(svSize.w, locationX - pad));
				const y = Math.max(0, Math.min(svSize.h, locationY - pad * 2));
				setS(x / svSize.w);
				setV(1 - y / svSize.h);
			},
			onPanResponderRelease: (e) => {
				const { locationX, locationY } = e.nativeEvent;
				const x = Math.max(0, Math.min(svSize.w, locationX - pad));
				const y = Math.max(0, Math.min(svSize.h, locationY - pad * 2));
				setS(x / svSize.w);
				setV(1 - y / svSize.h);
			},
		})
	).current;

	const hueStops = [
		{ c: '#ff0000' }, { c: '#ffff00' }, { c: '#00ff00' }, { c: '#00ffff' }, { c: '#0000ff' }, { c: '#ff00ff' }, { c: '#ff0000' }
	];
	const hueColor = rgbToHex(...Object.values(hsvToRgb(h, 1, 1)) as unknown as [number, number, number]);

	return (
		<View style={{ width, height }}>
			{/* SV square */}
			<View {...svPan.panHandlers} style={{ margin: pad, width: svSize.w, height: svSize.h }}>
				<Svg width={svSize.w} height={svSize.h}>
					<Defs>
						<LinearGradient id="gradS" x1="0" y1="0" x2="1" y2="0">
							<Stop offset="0" stopColor="#ffffff" />
							<Stop offset="1" stopColor={hueColor} />
						</LinearGradient>
						<LinearGradient id="gradV" x1="0" y1="0" x2="0" y2="1">
							<Stop offset="0" stopColor="rgba(0,0,0,0)" />
							<Stop offset="1" stopColor="#000000" />
						</LinearGradient>
					</Defs>
					<Rect x={0} y={0} width={svSize.w} height={svSize.h} fill="url(#gradS)" />
					<Rect x={0} y={0} width={svSize.w} height={svSize.h} fill="url(#gradV)" />
				</Svg>
				{/* Picker thumb */}
				<View style={{ position: 'absolute', left: Math.max(0, Math.min(svSize.w - 10, s * svSize.w - 5)), top: Math.max(0, Math.min(svSize.h - 10, (1 - v) * svSize.h - 5)), width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: '#fff' }} />
			</View>
			{/* Hue slider */}
			<View {...huePan.panHandlers} style={{ marginHorizontal: pad, marginTop: pad, width: svSize.w, height: hueHeight, borderRadius: 8, overflow: 'hidden' }}>
				<Svg width={svSize.w} height={hueHeight}>
					<Defs>
						<LinearGradient id="gradHue" x1="0" y1="0" x2="1" y2="0">
							{hueStops.map((hs, i) => (
								<Stop key={i} offset={`${i / (hueStops.length - 1)}`} stopColor={hs.c} />
							))}
						</LinearGradient>
					</Defs>
					<Rect x={0} y={0} width={svSize.w} height={hueHeight} fill="url(#gradHue)" />
				</Svg>
				<View style={{ position: 'absolute', left: Math.max(0, Math.min(svSize.w - 6, (h / 360) * svSize.w - 3)), top: -2, width: 8, height: hueHeight + 4, borderRadius: 4, borderWidth: 2, borderColor: '#fff' }} />
			</View>
		</View>
	);
}