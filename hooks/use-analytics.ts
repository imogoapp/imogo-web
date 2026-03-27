import { useCallback } from 'react';
import { browserName, osName, osVersion } from 'react-device-detect';
import { getMe, getSession, decodeJwtPayload } from '@/services/auth';
import { usePwaInstalled } from './use-pwa-installed';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_ANALYTICS;
const DEVICE_INFO = `${osName}-${osVersion}-${browserName}`;

// Cache global para evitar chamadas de API repetitivas
let lastToken: string | null = null;
let cachedPublicId: string | null = null;

export interface TrackEventPayload {
  channel: 'pwa' | 'website';
  identify: string;
  public_id?: string;
  device?: string;
  pwa_install?: string;
  url?: string;
  page?: string;
  properties?: Record<string, any>;
}

/**
 * Hook para disparar eventos de analytics.
 * Simplifica o envio de eventos capturando automaticamente dados de contexto.
 */
export function useAnalytics() {
  const pwaStatus = usePwaInstalled();

  /**
   * Envia um evento de tracking.
   * @param page Nome da página ou identificador do evento (ex: "sucesso-simulador")
   * @param properties Propriedades adicionais do evento (ex: { action: "success" })
   */
  const trackEvent = useCallback(
    async (page?: string, properties?: Record<string, any>) => {
      if (!API_BASE_URL) return false;

      const session = getSession();
      const currentToken = session?.token || null;

      // Se o token mudou, limpamos o cache para garantir o public_id correto
      if (currentToken !== lastToken) {
        lastToken = currentToken;
        cachedPublicId = null;
      }

      // Tenta obter o public_id se houver sessão e não estiver no cache
      if (!cachedPublicId && currentToken) {
        try {
          // 1. Tenta decodificar o JWT (instantâneo)
          const payload = decodeJwtPayload(currentToken);
          if (payload?.public_id && typeof payload.public_id === 'string') {
            cachedPublicId = payload.public_id;
          } else if (session?.key) {
            // 2. Fallback: Busca via API getMe se o JWT não tiver o campo
            const user = await getMe(session.key);
            if (user?.public_id) {
              cachedPublicId = user.public_id;
            }
          }
        } catch (error) {
          console.error('[Analytics] Falha ao obter identificador do usuário:', error);
        }
      }

      const payload: TrackEventPayload = {
        channel: 'pwa',
        identify: 'pwa-v2',
        public_id: cachedPublicId || 'anonymous',
        device: DEVICE_INFO,
        pwa_install: pwaStatus,
        url: window.location.href,
        page: page || window.location.pathname,
        properties: properties || {},
      };

      try {
        const response = await fetch(`${API_BASE_URL}/track/event`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const data = await (response.ok ? response.json() : {});
        return data?.success || response.status === 200;
      } catch (error) {
        console.error('Erro ao enviar analytics:', error);
        return false;
      }
    },
    [pwaStatus]
  );

  return { trackEvent };
}
