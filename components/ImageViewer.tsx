import { Image, ImageSourcePropType, StyleSheet } from 'react-native'

type ImageViewerProps = {
  imgSource: ImageSourcePropType
}

export default function ImageViewer({ imgSource }: ImageViewerProps) {
  return <Image source={imgSource} style={styles.image} />
}

const styles = StyleSheet.create({
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
})
