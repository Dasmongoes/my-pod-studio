import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

const STEPS = [
  {
    n: "01",
    icon: "shopping-bag" as const,
    title: "Pick A Tee",
    desc: "Browse our edit of printed t-shirts — graphics, typography, oversized, washed.",
  },
  {
    n: "02",
    icon: "sliders" as const,
    title: "Choose Size",
    desc: "Heavyweight 280gsm cotton. Unisex sizing from XS to 3XL.",
  },
  {
    n: "03",
    icon: "printer" as const,
    title: "We Print",
    desc: "Each tee is printed to order on premium blanks — never warehoused.",
  },
  {
    n: "04",
    icon: "package" as const,
    title: "Ships Worldwide",
    desc: "Packed and dispatched within 72 hours. Delivered to your door.",
  },
];

export default function ProcessScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;

  const handleSubscribe = () => {
    if (!email.trim()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSubscribed(true);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPad + 100 }}
      >
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
          <Text style={[styles.headerEyebrow, { color: colors.mutedForeground }]}>
            THE PROCESS
          </Text>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>
            Made on{"\n"}demand.
          </Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
            One product. Done properly. Every t-shirt is printed only after it's ordered — no inventory, no waste.
          </Text>
        </View>

        {/* Steps */}
        <View style={styles.stepsWrap}>
          {STEPS.map((step, i) => (
            <View
              key={step.n}
              style={[
                styles.step,
                {
                  borderBottomColor: colors.border,
                  borderBottomWidth: i < STEPS.length - 1 ? 1 : 0,
                },
              ]}
            >
              <View style={[styles.stepIcon, { backgroundColor: colors.muted }]}>
                <Feather name={step.icon} size={20} color={colors.foreground} />
              </View>
              <View style={styles.stepText}>
                <View style={styles.stepTitleRow}>
                  <Text style={[styles.stepNum, { color: colors.mutedForeground }]}>
                    {step.n}
                  </Text>
                  <Text style={[styles.stepTitle, { color: colors.foreground }]}>
                    {step.title}
                  </Text>
                </View>
                <Text style={[styles.stepDesc, { color: colors.mutedForeground }]}>
                  {step.desc}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Quality banner */}
        <View style={[styles.qualityBanner, { backgroundColor: colors.muted }]}>
          {[
            "280GSM COTTON",
            "ARCHIVAL INKS",
            "WORLDWIDE DELIVERY",
            "72HR DISPATCH",
          ].map((tag) => (
            <View key={tag} style={[styles.qualityTag, { borderColor: colors.border }]}>
              <Text style={[styles.qualityTagText, { color: colors.foreground }]}>{tag}</Text>
            </View>
          ))}
        </View>

        {/* Newsletter CTA */}
        <View style={[styles.cta, { backgroundColor: colors.foreground }]}>
          <Text style={[styles.ctaEyebrow, { color: colors.primaryForeground, opacity: 0.5 }]}>
            NEWSLETTER
          </Text>
          <Text style={[styles.ctaTitle, { color: colors.primaryForeground }]}>
            Be first{"\n"}to know.
          </Text>
          <Text style={[styles.ctaSub, { color: colors.primaryForeground, opacity: 0.6 }]}>
            Early access to drops, lookbooks and brand stories.
          </Text>

          {subscribed ? (
            <View style={styles.successRow}>
              <Feather name="check-circle" size={20} color={colors.primaryForeground} />
              <Text style={[styles.successText, { color: colors.primaryForeground }]}>
                You're on the list
              </Text>
            </View>
          ) : (
            <View style={[styles.emailRow, { borderColor: "rgba(255,255,255,0.25)" }]}>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="your@email.com"
                placeholderTextColor="rgba(255,255,255,0.35)"
                keyboardType="email-address"
                autoCapitalize="none"
                style={[styles.emailInput, { color: colors.primaryForeground }]}
              />
              <Pressable
                onPress={handleSubscribe}
                style={[styles.emailBtn, { backgroundColor: colors.primaryForeground }]}
              >
                <Feather name="arrow-right" size={16} color={colors.foreground} />
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
  },
  headerEyebrow: {
    fontSize: 10,
    letterSpacing: 2.5,
    fontFamily: "Inter_500Medium",
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 40,
    fontFamily: "Inter_700Bold",
    letterSpacing: -2,
    lineHeight: 40,
    marginBottom: 14,
  },
  headerSub: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
  },
  stepsWrap: {
    marginHorizontal: 20,
    marginTop: 24,
  },
  step: {
    flexDirection: "row",
    gap: 16,
    paddingVertical: 20,
  },
  stepIcon: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  stepText: {
    flex: 1,
    gap: 6,
  },
  stepTitleRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
  },
  stepNum: {
    fontSize: 10,
    letterSpacing: 1.5,
    fontFamily: "Inter_500Medium",
  },
  stepTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  stepDesc: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
  qualityBanner: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    padding: 20,
    marginTop: 8,
  },
  qualityTag: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  qualityTagText: {
    fontSize: 9,
    letterSpacing: 1.5,
    fontFamily: "Inter_600SemiBold",
  },
  cta: {
    margin: 20,
    padding: 28,
  },
  ctaEyebrow: {
    fontSize: 10,
    letterSpacing: 2.5,
    fontFamily: "Inter_500Medium",
    marginBottom: 12,
  },
  ctaTitle: {
    fontSize: 40,
    fontFamily: "Inter_700Bold",
    letterSpacing: -2,
    lineHeight: 40,
    marginBottom: 12,
  },
  ctaSub: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
    marginBottom: 24,
  },
  emailRow: {
    flexDirection: "row",
    borderWidth: 1,
    height: 48,
  },
  emailInput: {
    flex: 1,
    paddingHorizontal: 14,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  emailBtn: {
    width: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  successRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  successText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
});
