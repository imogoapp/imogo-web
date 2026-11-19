import Ionicons from '@expo/vector-icons/Ionicons';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';

import { AppTheme } from '@/constants/app-theme';
import {
  RemoteSessionInfo,
  listSessions,
  logoutAllSessions,
  revokeRemoteSession,
} from '@/services/auth';

type SessionsSectionProps = {
  onLogout: () => void;
  rowStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
};

function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
}

function isMobileSession(ua: string | null, device: number): boolean {
  if (ua) {
    return /iPhone|iPad|iPod|Android|Mobile|iOS/i.test(ua);
  }
  return device === 10;
}

function summarizeUserAgent(ua: string | null, device: number): string {
  if (!ua) {
    return device === 10 ? 'Dispositivo Móvel' : 'Navegador / Desktop';
  }

  let os = '';
  if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/Mac OS X|Macintosh/i.test(ua)) os = 'macOS';
  else if (/Windows/i.test(ua)) os = 'Windows';
  else if (/Linux/i.test(ua)) os = 'Linux';

  let browser = '';
  if (/Edg\//i.test(ua)) browser = 'Edge';
  else if (/OPR\/|Opera/i.test(ua)) browser = 'Opera';
  else if (/Chrome\//i.test(ua)) browser = 'Chrome';
  else if (/Firefox\//i.test(ua)) browser = 'Firefox';
  else if (/Safari\//i.test(ua)) browser = 'Safari';

  if (browser && os) return `${browser} · ${os}`;
  if (browser) return browser;
  if (os) return os;
  return device === 10 ? 'App / Mobile' : 'Navegador Web';
}

export function SessionsSection({
  onLogout,
  rowStyle,
  labelStyle,
  containerStyle,
}: SessionsSectionProps) {
  const { width } = useWindowDimensions();
  const isCompact = width < 400;

  const [expanded, setExpanded] = useState(false);
  const [sessions, setSessions] = useState<RemoteSessionInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [revokingAll, setRevokingAll] = useState(false);
  const [error, setError] = useState('');

  const loadSessions = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listSessions();
      setSessions(data);
    } catch {
      setError('Não foi possível carregar as sessões ativas.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (expanded) {
      void loadSessions();
    }
  }, [expanded, loadSessions]);

  const handleRevokeSession = useCallback(
    async (session: RemoteSessionInfo) => {
      if (session.is_current) {
        onLogout();
        return;
      }

      setBusyId(session.id);
      setError('');
      try {
        await revokeRemoteSession(session.id);
        setSessions((prev) => prev.filter((item) => item.id !== session.id));
      } catch {
        setError('Não foi possível encerrar esta sessão.');
      } finally {
        setBusyId(null);
      }
    },
    [onLogout]
  );

  const handleRevokeAll = useCallback(async () => {
    setRevokingAll(true);
    setError('');
    try {
      await logoutAllSessions();
      onLogout();
    } catch {
      setError('Não foi possível encerrar todas as sessões.');
      setRevokingAll(false);
    }
  }, [onLogout]);

  return (
    <View>
      <Pressable style={rowStyle ?? styles.navRow} onPress={() => setExpanded((prev) => !prev)}>
        <Text style={labelStyle ?? styles.navLabel}>Sessões ativas</Text>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-forward'}
          size={20}
          color="#C4C4C4"
        />
      </Pressable>

      {expanded ? (
        <View style={[styles.container, containerStyle]}>
          <View style={styles.headerRow}>
            <Text style={styles.subtitle}>
              Dispositivos conectados ({sessions.length})
            </Text>
            <Pressable onPress={() => void loadSessions()} disabled={loading} hitSlop={8}>
              <Text style={styles.refreshText}>{loading ? 'Atualizando...' : 'Atualizar'}</Text>
            </Pressable>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {loading && sessions.length === 0 ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="small" color={AppTheme.colors.primary} />
            </View>
          ) : null}

          {!loading && sessions.length === 0 && !error ? (
            <Text style={styles.emptyText}>Nenhuma sessão ativa encontrada.</Text>
          ) : null}

          {sessions.map((item) => {
            const isMobile = isMobileSession(item.user_agent, item.device);
            const isBusy = busyId === item.id;
            return (
              <View
                key={item.id}
                style={[styles.sessionCard, isCompact && styles.sessionCardCompact]}
              >
                <View style={styles.sessionInfo}>
                  <View style={styles.sessionTitleRow}>
                    <Ionicons
                      name={isMobile ? 'phone-portrait-outline' : 'laptop-outline'}
                      size={18}
                      color={AppTheme.colors.primary}
                    />
                    <Text style={styles.sessionTitle} numberOfLines={1}>
                      {summarizeUserAgent(item.user_agent, item.device)}
                    </Text>
                    {item.is_current ? (
                      <View style={styles.currentBadge}>
                        <Text style={styles.currentBadgeText}>Atual</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={styles.sessionMeta} numberOfLines={1}>
                    IP: {item.ip_address || 'Desconhecido'}
                  </Text>
                  <Text style={styles.sessionMeta} numberOfLines={1}>
                    Último acesso: {formatDateTime(item.last_seen_at)}
                  </Text>
                </View>

                <Pressable
                  style={[
                    styles.revokeButton,
                    isCompact && styles.revokeButtonCompact,
                    isBusy && styles.buttonDisabled,
                  ]}
                  onPress={() => void handleRevokeSession(item)}
                  disabled={isBusy || revokingAll}
                  hitSlop={6}
                >
                  <Text style={styles.revokeButtonText}>
                    {isBusy ? 'Saindo...' : item.is_current ? 'Sair' : 'Deslogar'}
                  </Text>
                </Pressable>
              </View>
            );
          })}

          {sessions.length > 0 ? (
            <Pressable
              style={[styles.logoutAllButton, revokingAll && styles.buttonDisabled]}
              onPress={() => void handleRevokeAll()}
              disabled={revokingAll}
            >
              <Ionicons name="log-out-outline" size={16} color="#D9534F" />
              <Text style={styles.logoutAllText}>
                {revokingAll ? 'Encerrando todas...' : 'Deslogar de todos os dispositivos'}
              </Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  navLabel: {
    fontSize: 15,
    color: AppTheme.colors.text,
    fontFamily: AppTheme.typography.fontBold,
  },
  container: {
    gap: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  subtitle: {
    fontSize: 13,
    color: '#9B9DA6',
    fontFamily: AppTheme.typography.fontRegular,
    flexShrink: 1,
  },
  refreshText: {
    fontSize: 13,
    color: AppTheme.colors.primary,
    fontFamily: AppTheme.typography.fontBold,
    textDecorationLine: 'underline',
  },
  loadingBox: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: '#9B9DA6',
    fontFamily: AppTheme.typography.fontRegular,
    paddingVertical: 8,
  },
  errorText: {
    fontSize: 13,
    color: '#D9534F',
    fontFamily: AppTheme.typography.fontRegular,
  },
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    backgroundColor: AppTheme.colors.background,
  },
  sessionCardCompact: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 10,
  },
  sessionInfo: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  sessionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
    flexWrap: 'wrap',
  },
  sessionTitle: {
    fontSize: 14,
    color: AppTheme.colors.text,
    fontFamily: AppTheme.typography.fontBold,
    flexShrink: 1,
  },
  currentBadge: {
    backgroundColor: '#F3E5F5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  currentBadgeText: {
    fontSize: 11,
    color: AppTheme.colors.primary,
    fontFamily: AppTheme.typography.fontBold,
  },
  sessionMeta: {
    fontSize: 12,
    color: '#9B9DA6',
    fontFamily: AppTheme.typography.fontRegular,
  },
  revokeButton: {
    minHeight: 36,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F2B8B5',
    backgroundColor: '#FFF5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  revokeButtonCompact: {
    alignSelf: 'flex-start',
  },
  revokeButtonText: {
    fontSize: 12,
    color: '#D9534F',
    fontFamily: AppTheme.typography.fontBold,
  },
  logoutAllButton: {
    marginTop: 4,
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#F2B8B5',
    backgroundColor: '#FFF5F5',
  },
  logoutAllText: {
    fontSize: 13,
    color: '#D9534F',
    fontFamily: AppTheme.typography.fontBold,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
