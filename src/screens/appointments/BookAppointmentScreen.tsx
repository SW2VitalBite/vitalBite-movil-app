import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation } from '@apollo/client/react';
import GradientHeader from '../../components/common/GradientHeader';
import GradientButton from '../../components/common/GradientButton';
import type { MainStackScreenProps } from '../../navigation/types';
import { useAuth } from '../../contexts/AuthContext';
import {
  CREATE_APPOINTMENT,
  GET_MY_APPOINTMENTS,
} from '../../services/appointments.service';
import { GET_MY_NUTRITIONIST, GqlNutritionist } from '../../services/nutritionist.service';
import {
  WHATSAPP_BOOKING_NUMBER,
  WHATSAPP_BOOKING_E164,
} from '../../constants/config';
import { colors, fonts, radius, shadow } from '../../constants/theme';

const DURATION_MINUTES = 45;
const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '12:00', '15:00', '16:00', '17:00'];
const DAYS_AHEAD = 14;
const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

type Method = 'app' | 'whatsapp';
type Mode = 'IN_PERSON' | 'VIRTUAL';

interface DayOption {
  date: Date;
  weekday: string;
  day: number;
  month: string;
}

function buildDayOptions(): DayOption[] {
  const options: DayOption[] = [];
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  for (let i = 1; i <= DAYS_AHEAD; i++) {
    const date = new Date(base);
    date.setDate(base.getDate() + i);
    options.push({
      date,
      weekday: WEEKDAYS[date.getDay()],
      day: date.getDate(),
      month: MONTHS[date.getMonth()],
    });
  }
  return options;
}

function combineDateAndTime(day: Date, time: string): Date {
  const [h, m] = time.split(':').map(Number);
  const result = new Date(day);
  result.setHours(h, m, 0, 0);
  return result;
}

export default function BookAppointmentScreen({ navigation }: MainStackScreenProps<'BookAppointment'>) {
  const { patientId, user } = useAuth();
  const [method, setMethod] = useState<Method>('app');
  const [selectedDayIdx, setSelectedDayIdx] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>('IN_PERSON');
  const [reason, setReason] = useState('');

  const days = useMemo(buildDayOptions, []);

  const { data: nutData, loading: nutLoading } = useQuery<{ myNutritionist: GqlNutritionist }>(
    GET_MY_NUTRITIONIST,
  );
  const nutritionist = nutData?.myNutritionist;
  const nutritionistName = nutritionist
    ? `${nutritionist.firstName} ${nutritionist.lastName}`
    : 'tu nutricionista';

  const [createAppointment, { loading: creating }] = useMutation(CREATE_APPOINTMENT, {
    refetchQueries: patientId
      ? [{ query: GET_MY_APPOINTMENTS, variables: { patientId } }]
      : [],
  });

  const selectedDate =
    selectedDayIdx !== null && selectedTime
      ? combineDateAndTime(days[selectedDayIdx].date, selectedTime)
      : null;

  const canSubmitApp = !!(patientId && nutritionist?.id && selectedDate);

  const handleConfirmApp = async () => {
    if (!canSubmitApp || !selectedDate) {
      Alert.alert('Datos incompletos', 'Selecciona una fecha y una hora para tu cita.');
      return;
    }
    try {
      await createAppointment({
        variables: {
          input: {
            patientId,
            nutritionistId: nutritionist!.id,
            scheduledAt: selectedDate.toISOString(),
            durationMinutes: DURATION_MINUTES,
            mode,
            reason: reason.trim() || undefined,
          },
        },
      });
      Alert.alert(
        '¡Cita agendada!',
        `Tu cita con ${nutritionistName} quedó registrada. Recibirás una confirmación pronto.`,
        [{ text: 'Listo', onPress: () => navigation.goBack() }],
      );
    } catch (e: any) {
      const message =
        e?.message?.includes('conflict') || e?.message?.includes('active appointment')
          ? 'Ese horario ya no está disponible. Elige otro, por favor.'
          : 'No se pudo agendar la cita. Intenta de nuevo.';
      Alert.alert('Error', message);
    }
  };

  const handleWhatsApp = async () => {
    const dateText = selectedDate
      ? ` el ${selectedDate.toLocaleDateString('es-ES', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        })} a las ${selectedTime}`
      : '';
    const patientName = user ? `${user.firstName} ${user.lastName}` : '';
    const message =
      `Hola, soy ${patientName}. Me gustaría agendar una cita con ${nutritionistName}` +
      `${dateText}. ¿Hay disponibilidad?`;
    const url = `https://wa.me/${WHATSAPP_BOOKING_E164}?text=${encodeURIComponent(message)}`;

    try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        Alert.alert(
          'WhatsApp no disponible',
          `No se pudo abrir WhatsApp. Puedes escribirnos al ${WHATSAPP_BOOKING_NUMBER}.`,
        );
        return;
      }
      await Linking.openURL(url);
    } catch {
      Alert.alert(
        'WhatsApp no disponible',
        `No se pudo abrir WhatsApp. Puedes escribirnos al ${WHATSAPP_BOOKING_NUMBER}.`,
      );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <GradientHeader title="Agendar Cita" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Selector de método */}
        <View style={styles.methodRow}>
          <MethodChip
            active={method === 'app'}
            icon="phone-portrait-outline"
            label="En la app"
            onPress={() => setMethod('app')}
          />
          <MethodChip
            active={method === 'whatsapp'}
            icon="logo-whatsapp"
            label="Por WhatsApp"
            onPress={() => setMethod('whatsapp')}
          />
        </View>

        {/* Nutricionista */}
        <View style={styles.nutCard}>
          <View style={styles.nutAvatar}>
            <Ionicons name="person" size={22} color={colors.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.nutLabel}>Nutricionista</Text>
            {nutLoading ? (
              <Text style={styles.nutName}>Cargando…</Text>
            ) : (
              <Text style={styles.nutName}>{nutritionistName}</Text>
            )}
          </View>
        </View>

        {method === 'app' ? (
          <>
            {/* Fecha */}
            <Text style={styles.sectionTitle}>Elige una fecha</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.daysRow}
            >
              {days.map((d, i) => {
                const active = selectedDayIdx === i;
                return (
                  <TouchableOpacity
                    key={d.date.toISOString()}
                    style={[styles.dayChip, active && styles.dayChipActive]}
                    onPress={() => setSelectedDayIdx(i)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.dayWeekday, active && styles.dayTextActive]}>{d.weekday}</Text>
                    <Text style={[styles.dayNumber, active && styles.dayTextActive]}>{d.day}</Text>
                    <Text style={[styles.dayMonth, active && styles.dayTextActive]}>{d.month}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Hora */}
            <Text style={styles.sectionTitle}>Elige una hora</Text>
            <View style={styles.slotsWrap}>
              {TIME_SLOTS.map((t) => {
                const active = selectedTime === t;
                return (
                  <TouchableOpacity
                    key={t}
                    style={[styles.slot, active && styles.slotActive]}
                    onPress={() => setSelectedTime(t)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.slotText, active && styles.slotTextActive]}>{t}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Modalidad */}
            <Text style={styles.sectionTitle}>Modalidad</Text>
            <View style={styles.modeRow}>
              <ModeChip
                active={mode === 'IN_PERSON'}
                icon="business-outline"
                label="Presencial"
                onPress={() => setMode('IN_PERSON')}
              />
              <ModeChip
                active={mode === 'VIRTUAL'}
                icon="videocam-outline"
                label="Virtual"
                onPress={() => setMode('VIRTUAL')}
              />
            </View>

            {/* Motivo */}
            <Text style={styles.sectionTitle}>Motivo (opcional)</Text>
            <TextInput
              style={styles.reasonInput}
              placeholder="Ej. Control mensual y ajuste de dieta"
              placeholderTextColor={colors.textMuted}
              value={reason}
              onChangeText={setReason}
              multiline
              maxLength={200}
            />

            <View style={styles.summaryCard}>
              <Ionicons name="information-circle-outline" size={18} color={colors.gradientEnd} />
              <Text style={styles.summaryText}>
                {selectedDate
                  ? `${selectedDate.toLocaleDateString('es-ES', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                    })} · ${selectedTime} · ${DURATION_MINUTES} min`
                  : 'Selecciona fecha y hora para continuar.'}
              </Text>
            </View>

            <GradientButton
              label={creating ? 'Agendando…' : 'Confirmar cita'}
              onPress={handleConfirmApp}
              loading={creating}
              disabled={!canSubmitApp}
              style={{ marginTop: 8 }}
            />
          </>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Coordina por WhatsApp</Text>
            <View style={styles.waCard}>
              <Ionicons name="logo-whatsapp" size={40} color="#25D366" />
              <Text style={styles.waNumber}>{WHATSAPP_BOOKING_NUMBER}</Text>
              <Text style={styles.waHint}>
                Escríbenos y nuestro equipo coordinará contigo el día y la hora de tu cita.
              </Text>
            </View>

            {/* Fecha/hora opcional para prellenar el mensaje */}
            <Text style={styles.sectionTitle}>Sugerir fecha (opcional)</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.daysRow}
            >
              {days.map((d, i) => {
                const active = selectedDayIdx === i;
                return (
                  <TouchableOpacity
                    key={d.date.toISOString()}
                    style={[styles.dayChip, active && styles.dayChipActive]}
                    onPress={() => setSelectedDayIdx(active ? null : i)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.dayWeekday, active && styles.dayTextActive]}>{d.weekday}</Text>
                    <Text style={[styles.dayNumber, active && styles.dayTextActive]}>{d.day}</Text>
                    <Text style={[styles.dayMonth, active && styles.dayTextActive]}>{d.month}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {selectedDayIdx !== null && (
              <>
                <Text style={styles.sectionTitle}>Sugerir hora (opcional)</Text>
                <View style={styles.slotsWrap}>
                  {TIME_SLOTS.map((t) => {
                    const active = selectedTime === t;
                    return (
                      <TouchableOpacity
                        key={t}
                        style={[styles.slot, active && styles.slotActive]}
                        onPress={() => setSelectedTime(active ? null : t)}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.slotText, active && styles.slotTextActive]}>{t}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </>
            )}

            <TouchableOpacity style={styles.waButton} onPress={handleWhatsApp} activeOpacity={0.85}>
              <Ionicons name="logo-whatsapp" size={22} color={colors.white} style={{ marginRight: 8 }} />
              <Text style={styles.waButtonText}>Abrir WhatsApp</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

function MethodChip({
  active,
  icon,
  label,
  onPress,
}: {
  active: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.methodChip, active && styles.methodChipActive]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Ionicons name={icon} size={18} color={active ? colors.gradientEnd : colors.textMuted} />
      <Text style={[styles.methodLabel, active && styles.methodLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function ModeChip({
  active,
  icon,
  label,
  onPress,
}: {
  active: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.modeChip, active && styles.modeChipActive]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Ionicons name={icon} size={18} color={active ? colors.white : colors.textMuted} />
      <Text style={[styles.modeLabel, active && styles.modeLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 48,
  },
  methodRow: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.lg,
    padding: 4,
    marginBottom: 20,
  },
  methodChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: radius.md,
  },
  methodChipActive: {
    backgroundColor: colors.white,
    ...shadow.sm,
  },
  methodLabel: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textMuted,
  },
  methodLabelActive: {
    fontFamily: fonts.semiBold,
    color: colors.gradientEnd,
  },
  nutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.lg,
    padding: 14,
    marginBottom: 20,
    gap: 12,
  },
  nutAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.gradientEnd,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nutLabel: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
  },
  nutName: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.textDark,
    marginTop: 2,
  },
  sectionTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.textDark,
    marginBottom: 12,
    marginTop: 4,
  },
  daysRow: {
    gap: 10,
    paddingBottom: 8,
    marginBottom: 12,
  },
  dayChip: {
    width: 62,
    paddingVertical: 12,
    borderRadius: radius.md,
    backgroundColor: colors.inputBackground,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
  },
  dayChipActive: {
    backgroundColor: colors.gradientEnd,
    borderColor: colors.gradientEnd,
  },
  dayWeekday: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.textMuted,
  },
  dayNumber: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.textDark,
    marginVertical: 2,
  },
  dayMonth: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textMuted,
  },
  dayTextActive: {
    color: colors.white,
  },
  slotsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  slot: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: radius.md,
    backgroundColor: colors.inputBackground,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  slotActive: {
    backgroundColor: colors.gradientEnd,
    borderColor: colors.gradientEnd,
  },
  slotText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textDark,
  },
  slotTextActive: {
    color: colors.white,
  },
  modeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  modeChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: radius.md,
    backgroundColor: colors.inputBackground,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  modeChipActive: {
    backgroundColor: colors.gradientEnd,
    borderColor: colors.gradientEnd,
  },
  modeLabel: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textMuted,
  },
  modeLabelActive: {
    fontFamily: fonts.semiBold,
    color: colors.white,
  },
  reasonInput: {
    backgroundColor: colors.inputBackground,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: 14,
    minHeight: 80,
    textAlignVertical: 'top',
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.textDark,
    marginBottom: 16,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.md,
    padding: 14,
    marginBottom: 16,
  },
  summaryText: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textDark,
  },
  waCard: {
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.lg,
    padding: 24,
    marginBottom: 20,
    gap: 8,
  },
  waNumber: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.textDark,
  },
  waHint: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 19,
  },
  waButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#25D366',
    borderRadius: radius.xl,
    paddingVertical: 16,
    marginTop: 8,
    ...shadow.md,
  },
  waButtonText: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.white,
  },
});
