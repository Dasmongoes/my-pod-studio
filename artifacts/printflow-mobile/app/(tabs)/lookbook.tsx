import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

const { width, height } = Dimensions.get("window");
const CARD_H = height * 0.65;

const EDITORIAL = [
  {
    id: "1",
    title: "One Tee.\nDone Right.",
    subtitle: "The Tee / FW26",
    desc: "Premium 280gsm heavyweight cotton. Garment dyed, washed for a worn-in hand, printed with archival inks.",
    bgColor: "#121212",
    textColor: "#f9f9f9",
    accent: "#333333",
  },
  {
    id: "2",
    title: "Printed\nOn Demand.",
    subtitle: "Process / FW26",
    desc: "Every tee is printed only after it's ordered. No inventory. No waste. No compromise on quality.",
    bgColor: "#f5f5f5",
    textColor: "#121212",
    accent: "#e0e0e0",
  },
  {
    id: "3",
    title: "Shipped\nWorldwide.",
    subtitle: "Delivery / FW26",
    desc: "Packed and dispatched within 72 hours. Free shipping on orders over $150. Delivered to your door.",
    bgColor: "#1a1a1a",
    textColor: "#f9f9f9",
    accent: "#2a2a2a",
  },
  {
    id: "4",
    title: "FW26\nCollection.",
    subtitle: "Shop / FW26",
    desc: "Four silhouettes. Graphic, typography, oversized, and vintage wash. Each one a statement.",
    bgColor: "#ebebeb",
    textColor: "#121212",
    accent: "#d5d5d5",
  },
];

interface EditorialItem {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  bgColor: string;
  textColor: string;
  accent: string;
}

function EditorialCard({ item }: { item: EditorialItem }) {
  return (
    <View style={[styles.editCard, { backgroundColor: item.bgColor }]}>
      {/* Abstract geometric accent */}
      <View
        style={[
          styles.geoAccent,
          { backgroundColor: item.accent },
        ]}
      />
      <View
        style={[
          styles.geoAccent2,
          { borderColor: item.accent },
        ]}
      />
      {/* Content */}
      <View style={styles.editContent}>
        <Text style={[styles.editEyebrow, { color: item.textColor, opacity: 0.5 }]}>
          {item.subtitle.toUpperCase()}
        </Text>
        <Text style={[styles.editTitle, { color: item.textColor }]}>{item.title}</Text>
        <View style={[styles.editDivider, { backgroundColor: item.textColor, opacity: 0.2 }]} />
        <Text style={[styles.editDesc, { color: item.textColor, opacity: 0.75 }]}>
          {item.desc}
        </Text>
      </View>
    </View>
  );
}

export default function LookbookScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatRef = useRef<FlatList>(null);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: topPad + 12,
            borderBottomColor: colors.border,
            backgroundColor: colors.background,
          },
        ]}
      >
        <Text style={[styles.headerEyebrow, { color: colors.mutedForeground }]}>LOOKBOOK</Text>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>FW26 Stories</Text>
      </View>

      {/* Cards */}
      <FlatList
        ref={flatRef}
        data={EDITORIAL}
        keyExtractor={(item) => item.id}
        horizontal={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: bottomPad + 100, gap: 16 }}
        onViewableItemsChanged={({ viewableItems }) => {
          if (viewableItems[0]) setActiveIndex(Number(viewableItems[0].index));
        }}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        renderItem={({ item }) => <EditorialCard item={item} />}
      />

      {/* Progress dots */}
      <View style={[styles.dotsRow, { bottom: bottomPad + 110 }]}>
        {EDITORIAL.map((_, i) => (
          <Pressable
            key={i}
            onPress={() => {
              Haptics.selectionAsync();
              setActiveIndex(i);
              flatRef.current?.scrollToIndex({ index: i, animated: true });
            }}
          >
            <View
              style={[
                styles.dot,
                {
                  backgroundColor: i === activeIndex ? colors.foreground : colors.border,
                  width: i === activeIndex ? 20 : 6,
                },
              ]}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerEyebrow: {
    fontSize: 10,
    letterSpacing: 2.5,
    fontFamily: "Inter_500Medium",
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    letterSpacing: -1,
  },
  editCard: {
    width: width - 40,
    height: CARD_H,
    overflow: "hidden",
    position: "relative",
  },
  geoAccent: {
    position: "absolute",
    width: 200,
    height: 200,
    top: -60,
    right: -60,
    borderRadius: 0,
    opacity: 0.5,
  },
  geoAccent2: {
    position: "absolute",
    width: 150,
    height: 150,
    bottom: 40,
    left: -30,
    borderRadius: 0,
    borderWidth: 1,
    opacity: 0.3,
  },
  editContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 28,
  },
  editEyebrow: {
    fontSize: 10,
    letterSpacing: 2.5,
    fontFamily: "Inter_500Medium",
    marginBottom: 12,
  },
  editTitle: {
    fontSize: 44,
    fontFamily: "Inter_700Bold",
    letterSpacing: -2.5,
    lineHeight: 42,
    marginBottom: 20,
  },
  editDivider: {
    height: 1,
    width: 40,
    marginBottom: 16,
  },
  editDesc: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
    maxWidth: "85%",
  },
  dotsRow: {
    position: "absolute",
    right: 24,
    flexDirection: "column",
    gap: 6,
    alignItems: "center",
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
});
