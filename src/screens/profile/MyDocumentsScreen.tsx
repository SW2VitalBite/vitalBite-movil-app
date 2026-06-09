import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@apollo/client/react';
import GradientHeader from '../../components/common/GradientHeader';
import type { MainStackScreenProps } from '../../navigation/types';
import { useAuth } from '../../contexts/AuthContext';
import {
  GET_PATIENT_DOCUMENTS,
  GqlPatientDocument,
  documentTypeMeta,
  prettyFileName,
} from '../../services/documents.service';
import { colors, fonts, radius, shadow } from '../../constants/theme';

export default function MyDocumentsScreen({ navigation }: MainStackScreenProps<'MyDocuments'>) {
  const { patientId } = useAuth();

  const { data, loading, error, refetch } = useQuery<{
    patientDocuments: GqlPatientDocument[];
  }>(GET_PATIENT_DOCUMENTS, {
    variables: { patientId },
    skip: !patientId,
    fetchPolicy: 'cache-and-network',
  });

  const documents = data?.patientDocuments ?? [];

  const openDocument = async (doc: GqlPatientDocument) => {
    if (!doc.url) {
      Alert.alert('Documento no disponible', 'Este documento aún no tiene un enlace válido.');
      return;
    }
    try {
      const supported = await Linking.canOpenURL(doc.url);
      if (!supported) throw new Error('unsupported');
      await Linking.openURL(doc.url);
    } catch {
      Alert.alert('No se pudo abrir', 'Inténtalo de nuevo en unos segundos.');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <GradientHeader title="Mis documentos" onBack={() => navigation.goBack()} />

      {loading && documents.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.gradientEnd} />
        </View>
      ) : (
        <FlatList
          data={documents}
          keyExtractor={(d) => d.id}
          contentContainerStyle={styles.list}
          refreshing={loading}
          onRefresh={() => refetch()}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Ionicons name="folder-open-outline" size={56} color={colors.border} />
              <Text style={styles.emptyTitle}>Sin documentos</Text>
              <Text style={styles.emptyText}>
                {error
                  ? 'No pudimos cargar tus documentos. Desliza para reintentar.'
                  : 'Aquí aparecerán tus facturas y planes de dieta en PDF.'}
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const meta = documentTypeMeta(item.type);
            const date = item.createdAt
              ? new Date(item.createdAt).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
              : null;

            return (
              <TouchableOpacity
                style={styles.card}
                activeOpacity={0.8}
                onPress={() => openDocument(item)}
              >
                <View style={styles.iconWrap}>
                  <Ionicons name={meta.icon as any} size={22} color={colors.gradientEnd} />
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle}>{meta.label}</Text>
                  <Text style={styles.cardSubtitle} numberOfLines={1}>
                    {prettyFileName(item.fileName)}
                  </Text>
                  {date ? <Text style={styles.cardDate}>{date}</Text> : null}
                </View>
                <Ionicons name="download-outline" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            );
          }}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 64, gap: 10 },
  emptyTitle: { fontFamily: fonts.semiBold, fontSize: 16, color: colors.textDark },
  emptyText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 19,
  },
  list: { padding: 16, paddingBottom: 48, flexGrow: 1 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 14,
    gap: 12,
    ...shadow.card,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: { flex: 1, gap: 2 },
  cardTitle: { fontFamily: fonts.semiBold, fontSize: 15, color: colors.textDark },
  cardSubtitle: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted },
  cardDate: { fontFamily: fonts.regular, fontSize: 11, color: colors.textMuted, marginTop: 2 },
});
