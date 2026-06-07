import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { gql } from '@apollo/client';
import { apolloClient } from '../lib/apolloClient';

// ─── GraphQL documents ────────────────────────────────────────────────────────

const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      user {
        id
        tenantId
        email
        firstName
        lastName
        roleCode
      }
    }
  }
`;

const JOIN_TENANT_MUTATION = gql`
  mutation JoinTenant($input: JoinTenantInput!) {
    joinTenant(input: $input) {
      accessToken
      user {
        id
        tenantId
        email
        firstName
        lastName
        roleCode
      }
    }
  }
`;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  tenantId: string;
  email: string;
  firstName: string;
  lastName: string;
  roleCode: string;
}

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  officeCode: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  patientId: string | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<boolean>;
  hasStoredSession: boolean;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [patientId, setPatientId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasStoredSession, setHasStoredSession] = useState(false);

  // Detectar si hay sesión guardada; la restauración real la hace restoreSession()
  // para que la autenticación biométrica actúe como puerta de entrada.
  useEffect(() => {
    (async () => {
      try {
        const savedToken = await AsyncStorage.getItem('authToken');
        const savedUser = await AsyncStorage.getItem('authUser');
        if (savedToken && savedUser) {
          setHasStoredSession(true);
        }
      } catch {
        await AsyncStorage.multiRemove(['authToken', 'authUser', 'patientId']);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const persistSession = async (accessToken: string, authUser: AuthUser, pid: string | null) => {
    await Promise.all([
      AsyncStorage.setItem('authToken', accessToken),
      AsyncStorage.setItem('authUser', JSON.stringify(authUser)),
      pid
        ? AsyncStorage.setItem('patientId', pid)
        : AsyncStorage.removeItem('patientId'),
    ]);
    setToken(accessToken);
    setUser(authUser);
    setPatientId(pid);
    setHasStoredSession(true);
  };

  const login = async (email: string, password: string) => {
    const { data } = await apolloClient.mutate<{
      login: { accessToken: string; user: AuthUser };
    }>({
      mutation: LOGIN_MUTATION,
      variables: { input: { email, password } },
    });

    const { accessToken, user: authUser } = data!.login;

    // Persistir token antes de cualquier query para que authLink lo use
    await AsyncStorage.setItem('authToken', accessToken);
    setToken(accessToken);

    // Para pacientes, user.id ya es el patientId (sub del JWT = patient.id)
    const resolvedPatientId =
      authUser.roleCode === 'PACIENTE' ? authUser.id : null;

    await persistSession(accessToken, authUser, resolvedPatientId);
  };

  const register = async (input: RegisterInput) => {
    const { data } = await apolloClient.mutate<{
      joinTenant: { accessToken: string; user: AuthUser };
    }>({
      mutation: JOIN_TENANT_MUTATION,
      variables: {
        input: {
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          password: input.password,
          officeCode: input.officeCode,
        },
      },
    });

    const { accessToken, user: authUser } = data!.joinTenant;
    // joinTenant devuelve un paciente: user.id = patientId
    await persistSession(accessToken, authUser, authUser.id);
  };

  // Confirma la sesión almacenada (llamado desde BiometricAuthScreen tras éxito)
  const restoreSession = async (): Promise<boolean> => {
    const savedToken = await AsyncStorage.getItem('authToken');
    const savedUser = await AsyncStorage.getItem('authUser');
    if (!savedToken || !savedUser) return false;

    if (!token || !user) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      const savedPatientId = await AsyncStorage.getItem('patientId');
      setPatientId(savedPatientId);
    }
    return true;
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['authToken', 'authUser', 'patientId']);
    apolloClient.clearStore();
    setToken(null);
    setUser(null);
    setPatientId(null);
    setHasStoredSession(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        patientId,
        token,
        isLoading,
        login,
        register,
        logout,
        restoreSession,
        hasStoredSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
