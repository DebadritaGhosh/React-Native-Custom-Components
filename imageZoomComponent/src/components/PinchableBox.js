// Importing libraries
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, View, StyleSheet, Animated, Pressable } from 'react-native';
import { PanGestureHandler, PinchGestureHandler } from "react-native-gesture-handler";

// Importing configs
import { screenSize } from '../configs/configs';

// Importing dummy data
import { data as ImageData } from '../data/data';

 // Configs
const BATCH_SIZE = 10;
const MAX_TRANSLATION_X = 80;
const doubleTapDelay = 300;


const PinchableBox = () => {

  // States required for Image data
  const [visibleData, setVisibleData] = useState([]);
  const [loadedUntilIndex, setLoadedUntilIndex] = useState(BATCH_SIZE);

  // State for Image scroll
  const [isScrollable, setIsScrollable] = useState(true);
  const [isPanScrollable, setIsPanScrollable] = useState(false);

  // State double tap functionality
  const [tapCount, setTapCount] = useState(0);

  // Ref required for pinch gesture
  const scale = useRef(new Animated.Value(1)).current;

  // Ref required for pan gesture
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;



  // Methods and sideeffect required for image data

  useEffect(() => {
    loadMoreItems();
  }, []);

  const loadMoreItems = () => {
    const newData = ImageData.slice(0, loadedUntilIndex);
    setVisibleData(newData);
    setLoadedUntilIndex(loadedUntilIndex + 10);
  };

  // Methods required for pinch gesture

  const handlePinchGesture = Animated.event(
    [{ nativeEvent: { scale: scale } }],
    { useNativeDriver: true }
  );

  const onPinchHandlerStateChange = event => {

    if (event.nativeEvent.scale < 1) {
      scale.setValue(1)
      setIsPanScrollable(false);
      setIsScrollable(true);
    }
  };

  const onPinchHandlerEnded = (event) => {

    if (event.nativeEvent.scale === 1) {
      setIsPanScrollable(false);
      setIsScrollable(true);
    } else {
      setIsScrollable(false);
      setIsPanScrollable(true);
    }

    if (event.nativeEvent.scale < 1) {
      scale.setValue(1)
      translateX.setValue(0);
      translateY.setValue(0);
      setIsPanScrollable(false);
      setIsScrollable(true);
    }
  }


  // Methods required for pan gesture
  const handlePanGesture = Animated.event(
    [{ nativeEvent: { translationX: translateX, translationY: translateY } }],
    {
      listener: (e) => {
        const clampedTranslationX = Math.min(Math.max(e.nativeEvent.translationX, -MAX_TRANSLATION_X), MAX_TRANSLATION_X);
        translateX.setValue(clampedTranslationX);
      },
      useNativeDriver: true
    }
  );


  // Methods & sideeffects required for double Tap 

  const handleTap = () => {
    setTapCount(tapCount + 1);
  };

  useEffect(() => {
    const singleTapTimer = setTimeout(() => {
      if (tapCount === 1) {
        setTapCount(0);
      }
    }, doubleTapDelay);

    if (tapCount === 2) {
      let newScale = 0;

      if (scale._value > 1) {
        newScale = 1;
        setIsPanScrollable(false);
        setIsScrollable(true);
        translateX.setValue(0);
        translateY.setValue(0);
      } else {
        newScale = 2;
        setIsScrollable(false);
        setIsPanScrollable(true);
      }

      scale.setValue(newScale);
      setTapCount(0);
    }

    return () => {
      clearTimeout(singleTapTimer);
    };
  }, [tapCount]);


  // Required for flatlist
  const renderItem = ({ item }) => (

    <Pressable onPress={handleTap}>
      <Animated.View style={styles.itemContainer}>
        <PinchGestureHandler
          onGestureEvent={handlePinchGesture}
          onHandlerStateChange={onPinchHandlerStateChange}
          minPointers={2}
          maxPointers={2}
          onEnded={onPinchHandlerEnded}
        >
          <Animated.View style={styles.itemContainer}>
            <PanGestureHandler
              onGestureEvent={handlePanGesture}
              minPointers={1}
              maxPointers={1}
              enabled={isPanScrollable}
            >
              <Animated.View style={styles.itemContainer}>
                <Animated.Image
                  source={{ uri: item.url }}
                  style={[styles.image, { transform: [{ scale }, { translateX }, { translateX }] }]}
                />
              </Animated.View>
            </PanGestureHandler>
          </Animated.View>
        </PinchGestureHandler>
      </Animated.View>
    </Pressable>
  );

  return (

    <View style={styles.itemContainer}>
      <FlatList
        data={visibleData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        scrollEnabled={isScrollable}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    minHeight: screenSize.height,
    minWidth: screenSize.width,
    backgroundColor: "#EAF0F1"
  },
  image: {
    minHeight: "100%",
    resizeMode: "contain"
  },
});

export default PinchableBox;