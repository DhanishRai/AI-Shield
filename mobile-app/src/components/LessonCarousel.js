import React, { useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Dimensions, TouchableOpacity, Text } from 'react-native';
import LessonCard from './LessonCard';

const { width } = Dimensions.get('window');
const CARD_HORIZONTAL_PADDING = 16;
const ITEM_WIDTH = width;
const CARD_WIDTH = width - CARD_HORIZONTAL_PADDING * 2;

const LessonCarousel = ({ lessons, t, onIndexChange, initialIndex = 0 }) => {
  const safeInitialIndex = Math.max(0, Math.min(initialIndex, lessons.length - 1));
  const listRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(safeInitialIndex);

  const viewabilityConfig = useMemo(
    () => ({
      itemVisiblePercentThreshold: 60,
    }),
    []
  );

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const newIndex = viewableItems[0].index;
      if (newIndex === null || newIndex === undefined) {
        return;
      }
      setCurrentIndex(newIndex);
      if (onIndexChange) {
        onIndexChange(newIndex);
      }
    }
  }).current;

  const goToIndex = (nextIndex) => {
    if (!listRef.current || nextIndex < 0 || nextIndex >= lessons.length) {
      return;
    }
    listRef.current.scrollToIndex({ index: nextIndex, animated: true });
  };

  const renderItem = ({ item, index }) => {
    const inputRange = [
      (index - 1) * ITEM_WIDTH,
      index * ITEM_WIDTH,
      (index + 1) * ITEM_WIDTH,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.96, 1, 0.96],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.72, 1, 0.72],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.slide}>
        <Animated.View style={[styles.itemContainer, { transform: [{ scale }], opacity }]}>
        <LessonCard lesson={item} t={t} />
        </Animated.View>
      </View>
    );
  };

  const renderPagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {lessons.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index ? styles.activeDot : styles.inactiveDot
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.carouselContainer}>
        <Animated.FlatList
          ref={listRef}
          data={lessons}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          nestedScrollEnabled
          directionalLockEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={ITEM_WIDTH}
          snapToAlignment="start"
          decelerationRate="fast"
          contentContainerStyle={styles.flatListContent}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          initialScrollIndex={safeInitialIndex}
          getItemLayout={(_, index) => ({
            length: ITEM_WIDTH,
            offset: ITEM_WIDTH * index,
            index,
          })}
          onScrollToIndexFailed={() => {}}
          renderItem={renderItem}
        />
      </View>
      {renderPagination()}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          onPress={() => goToIndex(currentIndex - 1)}
          disabled={currentIndex === 0}
          style={[styles.controlButton, currentIndex === 0 && styles.controlButtonDisabled]}
          activeOpacity={0.8}
        >
          <Text style={[styles.controlLabel, currentIndex === 0 && styles.controlLabelDisabled]}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => goToIndex(currentIndex + 1)}
          disabled={currentIndex === lessons.length - 1}
          style={[styles.controlButton, currentIndex === lessons.length - 1 && styles.controlButtonDisabled]}
          activeOpacity={0.8}
        >
          <Text style={[styles.controlLabel, currentIndex === lessons.length - 1 && styles.controlLabelDisabled]}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  carouselContainer: {
    flex: 1,
  },
  flatListContent: {
    alignItems: 'stretch',
  },
  slide: {
    width: ITEM_WIDTH,
    height: '100%',
    paddingHorizontal: CARD_HORIZONTAL_PADDING,
    paddingBottom: 8,
    justifyContent: 'flex-start',
  },
  itemContainer: {
    width: CARD_WIDTH,
    height: '100%',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#0066FF',
    width: 16,
  },
  inactiveDot: {
    backgroundColor: '#CBD5E1',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingHorizontal: 20,
  },
  controlButton: {
    backgroundColor: '#EEF2FF',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  controlButtonDisabled: {
    backgroundColor: '#F1F5F9',
  },
  controlLabel: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '700',
  },
  controlLabelDisabled: {
    color: '#94A3B8',
  },
});

export default LessonCarousel;
