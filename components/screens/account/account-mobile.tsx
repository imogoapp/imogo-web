import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AppInput } from '@/components/ui/app-input';
import {
  Alert,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import { AuthUser, changePassword, getSession, renewToken, updateMe } from '@/services/auth';

import { createAccountMobileStyles } from './styles/account-mobile-styles';

/* ── Types ──────────────────────────────────────────────── */

type AccountMobileProps = {
  user: AuthUser | null;
  onLogout: () => void;
  onRefresh: () => void;
};

type EditingField = 'nome' | 'telefone' | 'senha' | null;

/* ── Constants ──────────────────────────────────────────── */

const MIN_PASSWORD_LENGTH = 6;
const DEFAULT_AVATAR = 'https://juca.eu.org/img/icon_dafault.jpg';

/* ── Helpers ────────────────────────────────────────────── */

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function resolveUser(user: AuthUser | null) {
  return {
    name: typeof user?.name === 'string' ? user.name : 'Usuário',
    email: typeof user?.email === 'string' ? user.email : '',
    phone: typeof user?.phone === 'string' ? user.phone : '',
    photo: typeof user?.photo === 'string' ? user.photo : '',
    publicId: typeof user?.public_id === 'string' ? user.public_id : '',
  };
}

/* ── Component ──────────────────────────────────────────── */

export default function AccountMobile({ user, onLogout, onRefresh }: AccountMobileProps) {
  const { width, height } = useWindowDimensions();
  const styles = useMemo(() => createAccountMobileStyles(width, height), [width, height]);
  const [u, setU] = useState(() => resolveUser(user));

  /* ── State ──────────────────────────────────── */
  const [editing, setEditing] = useState<EditingField>(null);
  const [name, setName] = useState(u.name);
  const [phone, setPhone] = useState(u.phone);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  /* ── Sync ───────────────────────────────────── */
  useEffect(() => {
    const resolved = resolveUser(user);
    setU(resolved);
    setName(resolved.name);
    setPhone(resolved.phone);
  }, [user]);

  /* ── Validation ─────────────────────────────── */
  const canSaveName = name.trim().length > 0 && name !== u.name;
  const canSavePhone = phone.replace(/\D/g, '').length === 11 && phone !== u.phone;
  const canSavePassword =
    currentPassword.length > 0 &&
    newPassword.length >= MIN_PASSWORD_LENGTH &&
    newPassword === confirmPassword;

  const passwordError = confirmPassword.length > 0 && newPassword !== confirmPassword
    ? 'As senhas não coincidem.'
    : '';

  /* ── Handlers ───────────────────────────────── */
  const handleEdit = useCallback((field: EditingField) => {
    setEditing((prev) => (prev === field ? null : field));
    setSuccessMsg('');
  }, []);

  const handleCancel = useCallback(() => {
    setEditing(null);
    setName(u.name);
    setPhone(u.phone);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  }, [u.name, u.phone]);

  const handleSave = useCallback(async () => {
    const session = getSession();
    if (!session?.key) {
      Alert.alert('Erro', 'Sessão expirada. Por favor, faça login novamente.');
      onLogout();
      return;
    }

    setSaving(true);
    setSuccessMsg('');

    try {
      if (editing === 'nome') {
        await updateMe(session.key, { campo: 'nome', value: name });
        setSuccessMsg('Nome atualizado com sucesso!');
      } else if (editing === 'telefone') {
        // Enviar com máscara conforme solicitado
        await updateMe(session.key, { campo: 'telefone', value: phone });
        setSuccessMsg('Telefone atualizado com sucesso!');
      } else if (editing === 'senha') {
        await changePassword(session.key, {
          current_password: currentPassword,
          new_password: newPassword,
        });
        setSuccessMsg('Senha alterada com sucesso!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }

      // Renew token to get updated info in JWT
      await renewToken(session.key);

      // Trigger refresh in parent to update u prop
      onRefresh();

      setEditing(null);
      Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
    } catch (error: any) {
      console.error('Account update error:', error);
      const msg = error?.response?.data?.message || error?.response?.data?.detail || 'Não foi possível atualizar os dados.';
      Alert.alert('Erro', msg);
    } finally {
      setSaving(false);
    }
  }, [editing, name, phone, currentPassword, newPassword, onLogout, onRefresh]);

  const inputFontSize = Platform.OS === 'web' ? 16 : styles.editInput.fontSize;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />

      <View style={styles.headerContainer}>
        <Pressable onPress={() => router.push("/")} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#730d83" />
        </Pressable>
        <Text allowFontScaling={false} style={styles.headerTitle}>
          Minha conta
        </Text>
      </View>


      <View style={styles.headerDivider} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* ── Success ──────────────────────────── */}
        {successMsg ? (
          <View style={styles.successBanner}>
            <Ionicons name="checkmark-circle" size={20} color="#065F46" />
            <Text style={styles.successText}>{successMsg}</Text>
          </View>
        ) : null}

        {/* ── Profile ──────────────────────────── */}
        <View style={styles.profileSection}>
          <Image source={{ uri: u.photo || DEFAULT_AVATAR }} style={styles.avatar} contentFit="cover" />
          <Text style={styles.profileName}>{u.name}</Text>
          <Text style={styles.profileEmail}>{u.email}</Text>
        </View>

        <View style={styles.divider} />

        {/* ── Nome ─────────────────────────────── */}
        <View style={styles.fieldRow}>
          <View style={styles.fieldHeader}>
            <Text style={styles.fieldLabel}>Nome</Text>
            <Pressable onPress={() => (editing === 'nome' ? handleCancel() : handleEdit('nome'))} hitSlop={8}>
              <Text style={styles.fieldAction}>{editing === 'nome' ? 'Cancelar' : 'Editar'}</Text>
            </Pressable>
          </View>
          {editing === 'nome' ? (
            <View style={styles.editArea}>
              <AppInput
                value={name}
                onChangeText={setName}
                placeholder="Seu nome completo"
                autoCapitalize="words"
                radius={12}
                inputSize={inputFontSize}
              />
              <Pressable
                style={[styles.saveButton, (!canSaveName || saving) && styles.saveButtonDisabled]}
                onPress={handleSave}
                disabled={!canSaveName || saving}
              >
                <Text style={styles.saveButtonText}>{saving ? 'Salvando...' : 'Salvar'}</Text>
              </Pressable>
            </View>
          ) : (
            <Text style={styles.fieldValue}>{name}</Text>
          )}
        </View>
        <View style={styles.divider} />

        {/* ── Telefone ─────────────────────────── */}
        <View style={styles.fieldRow}>
          <View style={styles.fieldHeader}>
            <Text style={styles.fieldLabel}>Telefone</Text>
            <Pressable onPress={() => (editing === 'telefone' ? handleCancel() : handleEdit('telefone'))} hitSlop={8}>
              <Text style={styles.fieldAction}>{editing === 'telefone' ? 'Cancelar' : 'Editar'}</Text>
            </Pressable>
          </View>
          {editing === 'telefone' ? (
            <View style={styles.editArea}>
              <AppInput
                value={phone}
                onChangeText={(v) => setPhone(formatPhone(v))}
                placeholder="(00) 00000-0000"
                keyboardType="phone-pad"
                radius={12}
                inputSize={inputFontSize}
              />
              <Pressable
                style={[styles.saveButton, (!canSavePhone || saving) && styles.saveButtonDisabled]}
                onPress={handleSave}
                disabled={!canSavePhone || saving}
              >
                <Text style={styles.saveButtonText}>{saving ? 'Salvando...' : 'Salvar'}</Text>
              </Pressable>
            </View>
          ) : (
            <Text style={styles.fieldValue}>{phone || '—'}</Text>
          )}
        </View>
        <View style={styles.divider} />

        {/* ── E-mail (read-only) ───────────────── */}
        <View style={styles.fieldRow}>
          <View style={styles.fieldHeader}>
            <Text style={styles.fieldLabel}>E-mail</Text>
          </View>
          <Text style={styles.fieldValue}>{u.email}</Text>
        </View>
        <View style={styles.divider} />

        {/* ── Alterar senha ────────────────────── */}
        <Pressable style={styles.navRow} onPress={() => handleEdit('senha')}>
          <Text style={styles.navLabel}>Alterar senha</Text>
          <Ionicons name={editing === 'senha' ? 'chevron-up' : 'chevron-forward'} size={20} color="#C4C4C4" />
        </Pressable>

        {editing === 'senha' ? (
          <View style={styles.passwordSection}>
            <AppInput
              label="Senha Atual"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Senha atual"
              secureToggle
              autoCorrect={false}
              radius={12}
              inputSize={inputFontSize}
            />
            <AppInput
              label="Nova Senha"
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Nova senha"
              secureToggle
              autoCorrect={false}
              radius={12}
              inputSize={inputFontSize}
            />
            <AppInput
              label="Confirmar"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirmar nova senha"
              secureToggle
              autoCorrect={false}
              radius={12}
              inputSize={inputFontSize}
              errorMessage={passwordError}
            />
            <Pressable
              style={[styles.saveButton, (!canSavePassword || saving) && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={!canSavePassword || saving}
            >
              <Text style={styles.saveButtonText}>{saving ? 'Salvando...' : 'Salvar'}</Text>
            </Pressable>
          </View>
        ) : null}

        <View style={styles.divider} />

        {/* ── Sair ─────────────────────────────── */}
        <Pressable style={styles.navRow} onPress={onLogout}>
          <Text style={[styles.navLabel, styles.navLabelDanger]}>Sair</Text>
          <Ionicons name="chevron-forward" size={20} color="#D9534F" />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
