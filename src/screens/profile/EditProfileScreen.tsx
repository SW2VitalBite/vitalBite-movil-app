import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import GradientHeader from '../../components/common/GradientHeader';
import GradientButton from '../../components/common/GradientButton';
import InputField from '../../components/common/InputField';
import type { MainStackScreenProps } from '../../navigation/types';
import { mockUser } from '../../mocks/data';
import { colors, fonts } from '../../constants/theme';

export default function EditProfileScreen({ navigation }: MainStackScreenProps<'EditProfile'>) {
  const [form, setForm] = useState({
    firstName: mockUser.firstName,
    lastName: mockUser.lastName,
    phone: mockUser.phone ?? '',
    birthDate: mockUser.birthDate ?? '',
    heightCm: String(mockUser.heightCm ?? ''),
  });

  const update = (key: keyof typeof form) => (val: string) => setForm({ ...form, [key]: val });

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <GradientHeader
        title="Editar perfil"
        onBack={() => navigation.goBack()}
        rightIcon="checkmark-outline"
        onRightPress={() => navigation.goBack()}
      />

      <ScrollView
        style={{ flex: 1, backgroundColor: colors.white }}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.sectionLabel}>Información personal</Text>

        <View style={styles.nameRow}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <InputField label="Nombre" placeholder="Nombre" value={form.firstName} onChangeText={update('firstName')} />
          </View>
          <View style={{ flex: 1 }}>
            <InputField label="Apellido" placeholder="Apellido" value={form.lastName} onChangeText={update('lastName')} />
          </View>
        </View>

        <InputField
          label="Teléfono"
          icon="call-outline"
          placeholder="+591 71234567"
          keyboardType="phone-pad"
          value={form.phone}
          onChangeText={update('phone')}
        />
        <InputField
          label="Fecha de nacimiento"
          icon="calendar-outline"
          placeholder="AAAA-MM-DD"
          value={form.birthDate}
          onChangeText={update('birthDate')}
        />
        <InputField
          label="Altura (cm)"
          icon="resize-outline"
          placeholder="165"
          keyboardType="numeric"
          value={form.heightCm}
          onChangeText={update('heightCm')}
        />

        <GradientButton label="Guardar cambios" onPress={() => navigation.goBack()} style={{ marginTop: 8 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 24, paddingBottom: 48 },
  sectionLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.textDark,
    marginBottom: 16,
    marginTop: 8,
  },
  nameRow: { flexDirection: 'row' },
});
