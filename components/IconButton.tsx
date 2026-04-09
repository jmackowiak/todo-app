import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { Pressable, StyleSheet, Text } from 'react-native'

type IconButtonProps = {
	onPress: () => void
	icon: keyof typeof MaterialIcons.glyphMap
	label: string
}

export default function IconButton({ onPress, icon, label }: IconButtonProps) {
	return (
		<Pressable onPress={onPress} style={styles.iconButton}>
			<MaterialIcons color="#fff" name={icon} size={24} />
			<Text style={styles.iconButtonLabel}>{label}</Text>
		</Pressable>
	)
}

const styles = StyleSheet.create({
	iconButton: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	iconButtonLabel: {
		color: '#fff',
		marginTop: 12,
	},
})
