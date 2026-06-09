import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GradientHeader from '../../components/common/GradientHeader';
import type { MainStackScreenProps } from '../../navigation/types';
import { INFO_PAGES } from '../../constants/legalContent';
import { colors, fonts, radius, shadow } from '../../constants/theme';

export default function InfoPageScreen({ navigation, route }: MainStackScreenProps<'InfoPage'>) {
  const content = INFO_PAGES[route.params.page];

  const contactSupport = () => {
    if (!content.contactEmail) return;
    const url = `mailto:${content.contactEmail}?subject=${encodeURIComponent('Soporte VitalBite')}`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Contacto', `Escríbenos a ${content.contactEmail}`),
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <GradientHeader title={content.title} onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {content.updated && <Text style={styles.updated}>Última actualización: {content.updated}</Text>}
        {content.intro && <Text style={styles.intro}>{content.intro}</Text>}

        {content.sections.map((section, i) => (
          <View key={i} style={styles.section}>
            <Text style={styles.heading}>{section.heading}</Text>
            <Text style={styles.body}>{section.body}</Text>
          </View>
        ))}

        {content.contactEmail && (
          <TouchableOpacity style={styles.contactBtn} onPress={contactSupport} activeOpacity={0.85}>
            <Ionicons name="mail-outline" size={18} color={colors.gradientEnd} style={{ marginRight: 8 }} />
            <Text style={styles.contactBtnText}>Contactar soporte</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 48 },
  updated: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 12,
  },
  intro: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textDark,
    lineHeight: 21,
    marginBottom: 20,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 12,
    ...shadow.card,
  },
  heading: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.textDark,
    marginBottom: 6,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: 13.5,
    color: colors.textMuted,
    lineHeight: 20,
  },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.gradientEnd,
    borderRadius: radius.xl,
    paddingVertical: 13,
    marginTop: 8,
    backgroundColor: colors.surfaceLight,
  },
  contactBtnText: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.gradientEnd,
  },
});
