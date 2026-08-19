import React, { useEffect, useState } from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

export type AggregateState =
  | "operational"
  | "downtime"
  | "degraded"
  | "maintenance";

type StatusConfig = {
  label: string;
  color: string; // dot fill color
  bgColor: string; // pill background
  textColor: string; // pill text color
};

const STATUS_MAP: Record<AggregateState, StatusConfig> = {
  operational: {
    label: "Todos os serviços online",
    color: "#22c55e",
    bgColor: "rgba(34, 197, 94, 0.10)",
    textColor: "#16a34a",
  },
  downtime: {
    label: "Serviço indisponível",
    color: "#ef4444",
    bgColor: "rgba(239, 68, 68, 0.10)",
    textColor: "#dc2626",
  },
  degraded: {
    label: "Desempenho degradado",
    color: "#f59e0b",
    bgColor: "rgba(245, 158, 11, 0.10)",
    textColor: "#d97706",
  },
  maintenance: {
    label: "Em manutenção",
    color: "#3b82f6",
    bgColor: "rgba(59, 130, 246, 0.10)",
    textColor: "#2563eb",
  },
};

const FALLBACK: StatusConfig = {
  label: "Ver status",
  color: "#8E92A2",
  bgColor: "#F4F4F7",
  textColor: "#5E6272",
};

export function StatusBadge() {
  const [state, setState] = useState<AggregateState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch("https://status.imogo.com.br/index.json", { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        const raw = json?.data?.attributes?.aggregate_state as AggregateState;
        if (raw && raw in STATUS_MAP) {
          setState(raw);
        }
      })
      .catch(() => {
        // Silently fall back to fallback
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const config = state ? STATUS_MAP[state] : FALLBACK;

  const handleOpenStatus = () => {
    Linking.openURL("https://status.imogo.com.br").catch(() => {});
  };

  return (
    <Pressable
      onPress={handleOpenStatus}
      accessibilityLabel={`Status dos serviços imoGo: ${config.label}`}
      style={({ pressed }) => [
        styles.pill,
        {
          backgroundColor: loading ? "#F4F4F7" : config.bgColor,
          borderColor: loading ? "#E5E7EB" : config.color + "33",
        },
        pressed && styles.pressed,
      ]}
    >
      {/* Dot with animated glow */}
      <View style={styles.dotWrapper}>
        {!loading && (
          <View
            style={[
              styles.dotPing,
              { backgroundColor: config.color },
            ]}
          />
        )}
        <View
          style={[
            styles.dotCore,
            { backgroundColor: loading ? "#9CA3AF" : config.color },
          ]}
        />
      </View>

      {/* Label */}
      <Text
        style={[
          styles.label,
          { color: loading ? "#6B7280" : config.textColor },
        ]}
      >
        {loading ? "Carregando..." : config.label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 9999,
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.8,
  },
  dotWrapper: {
    width: 8,
    height: 8,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  dotPing: {
    position: "absolute",
    width: 14,
    height: 14,
    borderRadius: 7,
    opacity: 0.35,
  },
  dotCore: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 14,
  },
});
