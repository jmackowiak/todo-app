import domtoimage from 'dom-to-image'
import * as ImagePicker from 'expo-image-picker'
import * as MediaLibrary from 'expo-media-library'
import { useEffect, useRef, useState } from 'react'
import {
	type ImageSourcePropType,
	Platform,
	StyleSheet,
	View,
} from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { captureRef } from 'react-native-view-shot'
import Button from '@/components/Button'
import CircleButton from '@/components/CircleButton'
import EmojiList from '@/components/EmojiList'
import EmojiPicker from '@/components/EmojiPicker'
import EmojiSticker from '@/components/EmojiSticker'
import IconButton from '@/components/IconButton'
import ImageViewer from '@/components/ImageViewer'

const PlaceHolderImage = require('@/assets/images/background-image.png')

export default function Index() {
	const [selectedImage, setSelectedImage] = useState<string | undefined>(
		undefined,
	)
	const [showAppOptions, setShowAppOptions] = useState(false)
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [pickedEmoji, setPickedEmoji] = useState<
		ImageSourcePropType | undefined
	>(undefined)

	const [permissionResponse, requestPermission] = MediaLibrary.usePermissions()

	const imageRef = useRef<View>(null)

	useEffect(() => {
		if (!permissionResponse?.granted) {
			requestPermission()
		}
	}, [permissionResponse?.granted, requestPermission])

	const pickImageAsync = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ['images'],
			allowsEditing: true,
			quality: 1,
		})

		if (!result.canceled) {
			setSelectedImage(result.assets[0].uri)
			setShowAppOptions(true)
		} else {
			alert('You did not select any image.')
		}
	}

	const onReset = () => {
		setShowAppOptions(false)
	}

	const onAddSticker = () => {
		setIsModalVisible(true)
	}

	const onModalClose = () => {
		setIsModalVisible(false)
	}

	const onSaveImageAsync = async () => {
		try {
			if (Platform.OS === 'web') {
				const dataUrl = await domtoimage.toJpeg(imageRef.current, {
					quality: 0.95,
					width: 320,
					height: 440,
				})

				const link = document.createElement('a')
				link.download = 'sticker-smash.jpeg'
				link.href = dataUrl
				link.click()
			} else {
				const localUri = await captureRef(imageRef, {
					height: 440,
					quality: 1,
				})

				await MediaLibrary.saveToLibraryAsync(localUri)
				if (localUri) {
					alert('Saved!')
				}
			}
		} catch (e) {
			console.log(e)
		}
	}

	return (
		<GestureHandlerRootView style={styles.container}>
			<View style={styles.imageContainer}>
				<View collapsable={false} ref={imageRef}>
					<ImageViewer
						imgSource={PlaceHolderImage}
						selectedImage={selectedImage}
					/>
					{pickedEmoji && (
						<EmojiSticker imageSize={40} stickerSource={pickedEmoji} />
					)}
				</View>
			</View>
			{showAppOptions ? (
				<View style={styles.optionsContainer}>
					<View style={styles.optionsRow}>
						<IconButton icon="refresh" label="Reset" onPress={onReset} />
						<CircleButton onPress={onAddSticker} />
						<IconButton
							icon="save-alt"
							label="Save"
							onPress={onSaveImageAsync}
						/>
					</View>
				</View>
			) : (
				<View style={styles.footerContainer}>
					<Button
						label="Choose a photo"
						onPress={pickImageAsync}
						theme="primary"
					/>
					<Button
						label="Use this photo"
						onPress={() => setShowAppOptions(true)}
					/>
				</View>
			)}
			<EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
				<EmojiList onCloseModal={onModalClose} onSelect={setPickedEmoji} />
			</EmojiPicker>
		</GestureHandlerRootView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#25292e',
		alignItems: 'center',
	},
	imageContainer: {
		flex: 1,
	},
	footerContainer: {
		flex: 1 / 3,
		alignItems: 'center',
	},
	optionsContainer: {
		position: 'absolute',
		bottom: 80,
	},
	optionsRow: {
		alignItems: 'center',
		flexDirection: 'row',
	},
})
