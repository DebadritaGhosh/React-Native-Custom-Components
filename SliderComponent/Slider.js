import React, { useState } from 'react'
import { Dimensions, Image, ScrollView, StyleSheet, Text, View, StatusBar } from 'react-native';

const { width } = Dimensions.get("window");
const height = width * 0.4;


const imageURL = [
    'https://images.pexels.com/photos/139398/thermometer-headache-pain-pills-139398.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
    'https://images.pexels.com/photos/5327648/pexels-photo-5327648.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
    'https://images.pexels.com/photos/3985163/pexels-photo-3985163.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
    'https://images.pexels.com/photos/2324837/pexels-photo-2324837.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
    'https://images.pexels.com/photos/163944/pexels-photo-163944.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
    'https://images.pexels.com/photos/1350560/pexels-photo-1350560.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260'
]


const Slider = () => {
    const [active, setActive] = useState(0);

    const change = ({ nativeEvent }) => {
        const slide = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width);
        if (slide !== active) {
            setActive(slide);
        }
    }
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f9faf7" translucent={true} />

            <ScrollView
                pagingEnabled
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={styles.scroll}
                onScroll={change}
            >
                {
                    imageURL.map((image, i) => (
                        <Image
                            key={i}
                            source={{ uri: image }}
                            style={styles.image} />
                    ))

                }
            </ScrollView>
            <View style={styles.pagination}>
                {
                    imageURL.map((i, k) => (
                        <Text key={k} style={k == active ? styles.pagingActiveText : styles.pagingText}>⬤</Text>
                    ))
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { marginTop: 15, width, height, justifyContent: 'center', alignItems: 'center' },
    scroll: { width: width / 1.1, height },
    image: { width: width / 1.1, height, resizeMode: 'cover', borderRadius: 15 },
    pagination: { flexDirection: 'row', position: 'absolute', bottom: 0, alignSelf: 'center' },
    pagingText: { fontSize: width / 30, color: "#888", margin: 3 },
    pagingActiveText: { fontSize: width / 30, color: "#c7c9ff", margin: 3 },
})


export default Slider;
