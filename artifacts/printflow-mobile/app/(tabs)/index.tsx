import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

const { width } = Dimensions.get("window");

const PRODUCTS = [
  { id: "1", title: "Bird Form", subtitle: "Graphic Tee", price: "USD 45", tag: "NEW" },
  { id: "2", title: "Manifest", subtitle: "Typography Tee", price: "USD 42", tag: null },
  { id: "3", title: "Mono", subtitle: "Oversized Tee", price: "USD 48", tag: "BEST" },
  { id: "4", title: "001", subtitle: "Vintage Wash", price: "USD 50", tag: null },
];

const CATEGORIES = ["All", "Graphics", "Typography", "Oversized", "Vintage"];

function ProductCard({ product, index }: { product: typeof PRODUCTS[0]; index: number }) {
  const colors = useColors();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const [inBag, setInBag] = useState(false);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.97, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
  };

  const handleBag = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setInBag((v) => !v);
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, styles.cardOuter]}>
      <Pressable onPress={handlePress} style={[styles.card, { borderColor: colors.border }]}>
        {/* Product image placeholder */}
        <View
          style={[
            styles.cardImage,
            { backgroundColor: index % 2 === 0 ? colors.muted : colors.accent },
          ]}
        >
          {product.tag ? (
            <View style={[styles.tag, { backgroundColor: colors.foreground }]}>
              <Text style={[styles.tagText, { color: colors.primaryForeground }]}>
                {product.tag}
              </Text>
            </View>
          ) : null}
        </View>
        {/* Info row */}
        <View style={styles.cardInfo}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.cardSubtitle, { color: colors.mutedForeground }]}>
              {product.subtitle.toUpperCase()}
            </Text>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>{product.title}</Text>
          </View>
          <Text style={[styles.cardPrice, { color: colors.foreground }]}>{product.price}</Text>
        </View>
        {/* Add to bag */}
        <Pressable
          onPress={handleBag}
          style={[
            styles.bagBtn,
            {
              backgroundColor: inBag ? colors.foreground : "transparent",
              borderColor: colors.foreground,
            },
          ]}
        >
          <Text
            style={[
              styles.bagBtnText,
              { color: inBag ? colors.primaryForeground : colors.foreground },
            ]}
          >
            {inBag ? "IN BAG" : "ADD TO BAG"}
          </Text>
          <Feather
            name={inBag ? "check" : "shopping-bag"}
            size={12}
            color={inBag ? colors.primaryForeground : colors.foreground}
          />
        </Pressable>
      </Pressable>
    </Animated.View>
  );
}

export default function ShopScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState("All");

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPad + 100 }}
      >
        {/* Hero */}
        <View
          style={[
            styles.hero,
            {
              backgroundColor: colors.foreground,
              paddingTop: topPad + 24,
            },
          ]}
        >
          <Text style={[styles.heroEyebrow, { color: colors.primaryForeground, opacity: 0.6 }]}>
            FW 26 / Vol. 01
          </Text>
          <Text style={[styles.heroTitle, { color: colors.primaryForeground }]}>ON{"\n"}DEMAND</Text>
          <Text style={[styles.heroSub, { color: colors.primaryForeground, opacity: 0.7 }]}>
            Premium print-on-demand t-shirts.{"\n"}No inventory. No minimums.
          </Text>
          <View style={styles.heroBadgeRow}>
            <View style={[styles.heroBadge, { borderColor: "rgba(255,255,255,0.3)" }]}>
              <Text style={[styles.heroBadgeText, { color: colors.primaryForeground }]}>
                FREE SHIPPING $150+
              </Text>
            </View>
            <View style={[styles.heroBadge, { borderColor: "rgba(255,255,255,0.3)" }]}>
              <Text style={[styles.heroBadgeText, { color: colors.primaryForeground }]}>
                280GSM COTTON
              </Text>
            </View>
          </View>
        </View>

        {/* Category filter */}
        <View style={[styles.filterWrap, { borderBottomColor: colors.border }]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {CATEGORIES.map((cat) => (
              <Pressable
                key={cat}
                onPress={() => {
                  Haptics.selectionAsync();
                  setActiveCategory(cat);
                }}
                style={[
                  styles.filterPill,
                  {
                    backgroundColor:
                      activeCategory === cat ? colors.foreground : "transparent",
                    borderColor: colors.foreground,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    {
                      color:
                        activeCategory === cat
                          ? colors.primaryForeground
                          : colors.foreground,
                    },
                  ]}
                >
                  {cat.toUpperCase()}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Section header */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
            LATEST DROP
          </Text>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>FW26 Essentials</Text>
        </View>

        {/* Product grid */}
        <View style={styles.grid}>
          {PRODUCTS.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  heroEyebrow: {
    fontSize: 11,
    letterSpacing: 2.5,
    fontFamily: "Inter_500Medium",
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 56,
    fontFamily: "Inter_700Bold",
    letterSpacing: -3,
    lineHeight: 52,
    marginBottom: 16,
  },
  heroSub: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
    marginBottom: 20,
  },
  heroBadgeRow: {
    flexDirection: "row",
    gap: 8,
  },
  heroBadge: {
    borderWidth: 1,
    borderRadius: 0,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  heroBadgeText: {
    fontSize: 10,
    letterSpacing: 1.5,
    fontFamily: "Inter_600SemiBold",
  },
  filterWrap: {
    borderBottomWidth: 1,
  },
  filterScroll: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  filterPill: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 0,
  },
  filterPillText: {
    fontSize: 10,
    letterSpacing: 1.5,
    fontFamily: "Inter_600SemiBold",
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  sectionLabel: {
    fontSize: 10,
    letterSpacing: 2.5,
    fontFamily: "Inter_500Medium",
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    letterSpacing: -1,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 12,
  },
  cardOuter: {
    width: (width - 44) / 2,
  },
  card: {
    borderWidth: 1,
    borderRadius: 0,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    aspectRatio: 4 / 5,
    position: "relative",
  },
  tag: {
    position: "absolute",
    top: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: {
    fontSize: 9,
    letterSpacing: 1.5,
    fontFamily: "Inter_700Bold",
  },
  cardInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 10,
    gap: 8,
  },
  cardSubtitle: {
    fontSize: 9,
    letterSpacing: 1.5,
    fontFamily: "Inter_500Medium",
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.3,
    marginTop: 2,
  },
  cardPrice: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  bagBtn: {
    borderTopWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    gap: 6,
    borderRadius: 0,
  },
  bagBtnText: {
    fontSize: 9,
    letterSpacing: 1.5,
    fontFamily: "Inter_600SemiBold",
  },
});
