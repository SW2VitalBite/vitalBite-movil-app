import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, KeyboardAvoidingView,
  Platform, Alert, ActivityIndicator,
} from 'react-native';
import { useQuery, useMutation } from '@apollo/client/react';
import GradientHeader from '../../components/common/GradientHeader';
import GradientButton from '../../components/common/GradientButton';
import InputField from '../../components/common/InputField';
import type { MainStackScreenProps } from '../../navigation/types';
import { GET_MY_PROFILE, UPDATE_MY_PROFILE, GqlMyProfile } from '../../services/nutritionist.service';
import { colors, fonts } from '../../constants/theme';

export default function EditProfileScreen({ navigation }: MainStackScreenProps<'EditProfile'>) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    birthDate: '',
    heightCm: '',
  });

  const { data, loading: loadingProfile } = useQuery<{ myProfile: GqlMyProfile }>(GET_MY_PROFILE, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    const p = data?.myProfile;
    if (p) {
      setForm({
        firstName: p.firstName,
        lastName: p.lastName,
        phone: p.phone ?? '',
        birthDate: p.birthDate ? p.birthDate.split('T')[0] : '',
        heightCm: p.heightCm != null ? String(p.heightCm) : '',
      });
    }
  }, [data]);

  const [updateProfile, { loading: saving }] = useMutation(UPDATE_MY_PROFILE, {
    onCompleted: () => {
      Alert.alert('Guardado', 'Tu perfil ha sido actualizado.');
      navigation.goBack();
    },
    onError: (err) => {
      Alert.alert('Error', err.message ?? 'No se pudo actualizar el perfil.');
    },
  });

  const update = (key: keyof typeof form) => (val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleSave = () => {
    const input: Record<string, any> = {};
    if (form.firstName.trim()) input.firstName = form.firstName.trim();
    if (form.lastName.trim()) input.lastName = form.lastName.trim();
    if (form.phone.trim()) input.phone = form.phone.trim();
    if (form.birthDate.trim()) {
      const parsed = new Date(form.birthDate.trim());
      if (!isNaN(parsed.getTime())) input.birthDate = parsed.toISOString();
      else { Alert.alert('Error', 'Fecha inválida. Usa el formato AAAA-MM-DD.'); return; }
    }
    if (form.heightCm.trim()) {
      const h = parseFloat(form.heightCm);
      if (isNaN(h) || h <= 0) { Alert.alert('Error', 'Altura inválida.'); return; }
      input.heightCm = h;
    }
    updateProfile({ variables: { input } });
  };

  if (loadingProfile && !data) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <GradientHeader title="Editar perfil" onBack={() => navigation.goBack()} />
        <ActivityIndicator color={colors.gradientEnd} style={{ marginTop: 40 }} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <GradientHeader
        title="Editar perfil"
        onBack={() => navigation.goBack()}
        rightIcon="checkmark-outline"
        onRightPress={handleSave}
      />

      <ScrollView
        style={{ flex: 1, backgroundColor: colors.white }}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.sectionLabel}>Información personal</Text>

        <View style={styles.nameRow}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <InputField
              label="Nombre"
              placeholder="Nombre"
              value={form.firstName}
              onChangeText={update('firstName')}
            />
          </View>
          <View style={{ flex: 1 }}>
            <InputField
              label="Apellido"
              placeholder="Apellido"
              value={form.lastName}
              onChangeText={update('lastName')}
            />
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

        <GradientButton
          label={saving ? 'Guardando…' : 'Guardar cambios'}
          onPress={handleSave}
          style={{ marginTop: 8 }}
        />
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
