import { gql } from '@apollo/client';

// El móvil habla GraphQL con el Core (NestJS); éste hace de proxy REST hacia el
// microservicio documental (Spring Boot), que guarda/recupera los PDFs en S3.

export const GET_PATIENT_DOCUMENTS = gql`
  query GetPatientDocuments($patientId: ID!) {
    patientDocuments(patientId: $patientId) {
      id
      fileName
      type
      resourceId
      url
      status
      createdAt
    }
  }
`;

export const REQUEST_DIET_PDF = gql`
  mutation RequestDietPdf($dietId: ID!) {
    requestDietPdf(dietId: $dietId) {
      documentId
      url
      fileName
      expiresIn
      generated
    }
  }
`;

export interface GqlPatientDocument {
  id: string;
  fileName: string;
  type: string; // DIETA_PDF | INVOICE_PDF | ...
  resourceId?: string | null;
  url?: string | null;
  status?: string | null;
  createdAt?: string | null;
}

export interface GqlDietPdfDocument {
  documentId?: string | null;
  url: string;
  fileName: string;
  expiresIn?: number | null;
  generated: boolean;
}

// ─── Helpers de presentación ────────────────────────────────────────────────────

export interface DocumentTypeMeta {
  label: string;
  icon: string;
}

/** Etiqueta + icono legibles según el `tipoDocumento` del backend. */
export function documentTypeMeta(type: string): DocumentTypeMeta {
  switch (type) {
    case 'DIETA_PDF':
      return { label: 'Plan de dieta', icon: 'restaurant-outline' };
    case 'INVOICE_PDF':
      return { label: 'Factura', icon: 'receipt-outline' };
    default:
      return { label: 'Documento', icon: 'document-text-outline' };
  }
}

/** Nombre amigable a partir del key de S3 (`pdfs/dieta-juan-ab12cd.pdf`). */
export function prettyFileName(fileName: string): string {
  return fileName.split('/').pop() ?? fileName;
}
