import React, { useEffect, useRef, useState } from "react";
import {
  View, Text, Image, Alert, ScrollView,
  StyleSheet, ImageBackground, TouchableOpacity, Modal
} from "react-native";

import * as Device from "expo-device";
import * as ImagePicker from "expo-image-picker";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

import { CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system";

import {
  getSummary, predictFruit,
  registerExpoToken, unregisterExpoToken
} from "./lib/api";

const BG_URL =
  "https://i.pinimg.com/originals/3d/91/51/3d9151870044e69f2d93a9d0311275dd.gif";

/* --- show alerts for foreground notifications --- */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, shouldPlaySound: false, shouldSetBadge: false
  })
});

export default function HomeScreen() {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [pred, setPred] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [registered, setRegistered] = useState(false);
  const [showCam, setShowCam] = useState(false);

  /* ---------- Push registration ---------- */
  useEffect(() => {
    (async () => {
      if (!Device.isDevice) return;
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") return;

      const projectId = (Constants?.expoConfig?.extra as any)?.easProjectId;
      const tokenResp = await Notifications.getExpoPushTokenAsync(
        projectId ? { projectId } : undefined
      );
      setPushToken(tokenResp.data);
    })();
  }, []);

  async function onRegisterPush() {
    try {
      if (!pushToken) {
        Alert.alert("Notifications", "No push token yet. Make sure permissions are granted.");
        return;
      }
      await registerExpoToken(pushToken);
      setRegistered(true);
      Alert.alert("Registered", "This device will receive spoilage alerts.");
    } catch (e: any) {
      Alert.alert("Register failed", String(e?.message || e));
    }
  }

  async function onUnregisterPush() {
    try {
      if (!pushToken) return;
      await unregisterExpoToken(pushToken);
      setRegistered(false);
      Alert.alert("Unregistered", "Device will not receive alerts.");
    } catch (e: any) {
      Alert.alert("Unregister failed", String(e?.message || e));
    }
  }

  /* ---------- Image actions ---------- */
  async function pickImage() {
    try {
      const lib = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (lib.status !== "granted") throw new Error("Photo library permission denied");
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.9
      });
      if (res.canceled || !res.assets?.length) return;
      setPhotoUri(res.assets[0].uri);
      setPred(null);
    } catch (e: any) {
      Alert.alert("Picker error", String(e?.message || e));
    }
  }

  async function takePhotoSystem() {
    try {
      const cam = await ImagePicker.requestCameraPermissionsAsync();
      if (cam.status !== "granted") throw new Error("Camera permission denied");
      const res = await ImagePicker.launchCameraAsync({ quality: 0.9 });
      if (res.canceled || !res.assets?.length) return;
      setPhotoUri(res.assets[0].uri);
      setPred(null);
    } catch (e: any) {
      Alert.alert("Camera error", String(e?.message || e));
    }
  }

  async function predict() {
    try {
      if (!photoUri) return Alert.alert("Select an image first");
      const out = await predictFruit({ uri: photoUri });
      setPred(out);
      await refreshSummary();
    } catch (e: any) {
      Alert.alert("Predict failed", String(e?.message || e));
    }
  }

  async function refreshSummary() {
    try {
      const s = await getSummary();
      setSummary(s);
    } catch (e: any) {
      Alert.alert("Summary failed", String(e?.message || e));
    }
  }

  useEffect(() => {
    refreshSummary();
    const id = setInterval(refreshSummary, 4000);
    return () => clearInterval(id);
  }, []);

  /* ---------- Embedded Camera Modal ---------- */
  function CameraModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
    const [permission, requestPermission] = useCameraPermissions();
    const camRef = useRef<CameraView>(null);

    useEffect(() => {
      if (visible && !permission?.granted) requestPermission();
    }, [visible]);

    const take = async () => {
      try {
        const photo = await camRef.current?.takePictureAsync({ quality: 0.9, skipProcessing: true });
        if (photo?.uri) {
          const dest = FileSystem.cacheDirectory + `shot_${Date.now()}.jpg`;
          await FileSystem.copyAsync({ from: photo.uri, to: dest });
          setPhotoUri(dest);
          setPred(null);
          onClose();
        }
      } catch (e: any) {
        Alert.alert("Camera error", String(e?.message || e));
      }
    };

    if (!visible) return null;

    if (!permission?.granted) {
      return (
        <Modal visible transparent animationType="slide">
          <View style={styles.modalDim}>
            <View style={styles.modalBox}>
              <Text style={{ fontWeight: "800", marginBottom: 8 }}>Camera permission</Text>
              <TouchableOpacity onPress={() => requestPermission()} style={[styles.btn, styles.btnPrimary]}>
                <Text style={styles.btnTextPrimary}>Grant</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={[styles.btn, styles.btnDefault]}>
                <Text style={styles.btnTextDefault}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      );
    }

    return (
      <Modal visible animationType="slide">
        <View style={{ flex: 1, backgroundColor: "black" }}>
          <CameraView style={{ flex: 1 }} ref={camRef} facing="back" />
          <View style={{ position: "absolute", bottom: 40, width: "100%", alignItems: "center", gap: 16 }}>
            <TouchableOpacity
              onPress={take}
              style={{ width: 72, height: 72, borderRadius: 999, backgroundColor: "#fff", borderWidth: 4, borderColor: "#22c55e" }}
            />
            <TouchableOpacity onPress={onClose} style={[styles.btn, styles.btnDefault]}>
              <Text style={styles.btnTextDefault}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  /* ---------- UI ---------- */
  const card = (title: string, children: React.ReactNode) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  );

  return (
    <ImageBackground source={{ uri: BG_URL }} resizeMode="cover" style={styles.bg}>
      <View style={styles.overlay} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.h1}>🍏 Fruit Freshness & Gas</Text>
        <Text style={styles.subtitle}>Upload/predict and view sensor readings</Text>

        {/* Notifications */}
        <View style={styles.row}>
          <TouchableOpacity onPress={onRegisterPush} style={[styles.btn, styles.btnDefault]}>
            <Text style={styles.btnTextDefault}>{registered ? "Registered ✅" : "Register for Alerts"}</Text>
          </TouchableOpacity>
          {registered && (
            <TouchableOpacity onPress={onUnregisterPush} style={[styles.btn, styles.btnDefault]}>
              <Text style={styles.btnTextDefault}>Unregister</Text>
            </TouchableOpacity>
          )}
        </View>

        {card("1) Image", (
          <>
            <View style={styles.imageBox}>
              {photoUri ? <Image source={{ uri: photoUri }} style={styles.image} /> : <Text style={styles.muted}>No image</Text>}
            </View>
            <View style={styles.row}>
              <Btn text="Pick image" onPress={pickImage} />
              <Btn text="Take photo" onPress={takePhotoSystem} />
              <Btn text="Live camera" onPress={() => setShowCam(true)} />
              <Btn text="Predict" onPress={predict} type="primary" />
            </View>
            {pred && (
              <View style={styles.badgeWrap}>
                <Badge
                  text={`${pred.label} • ${pred.confidence?.toFixed?.(1) ?? pred.confidence}%`}
                  type={/spoiled|rotten/i.test(pred.label) ? "danger" : "success"}
                />
              </View>
            )}
          </>
        ))}

        {card("2) Gas Reading", (
          <>
            {summary?.gas_ppm ? (
              <View style={styles.badgeRow}>
                <GasBadge
                  label="CO₂"
                  value={`${summary.gas_ppm.co2 ?? "—"} ppm`}
                  high={summary?.gas_flags?.co2_high}
                />
                <GasBadge
                  label="NH₃"
                  value={`${summary.gas_ppm.nh3 ?? "—"} ppm`}
                  high={summary?.gas_flags?.nh3_high}
                />
                <GasBadge
                  label="VOC"
                  value={`${summary.gas_ppm.alcohol ?? "—"} eq`}
                  high={summary?.gas_flags?.voc_high}
                />
              </View>
            ) : (
              <Text style={styles.muted}>Waiting for sensor data…</Text>
            )}

            <View style={styles.row}>
              <Btn text="Refresh Summary" onPress={refreshSummary} />
            </View>
          </>
        ))}

        {card("3) Summary", (
          <View>
            {!summary ? (
              <Text style={styles.muted}>No summary yet</Text>
            ) : (
              <Text style={styles.summaryLine}>
                Decision:{" "}
                <Text style={{ fontWeight: "800", color: summary.decision === "SPOILED" ? "#b91c1c" : "#065f46" }}>
                  {summary.decision}
                </Text>
              </Text>
            )}
          </View>
        ))}

        <Text style={styles.footer}>© 2025 • FruitGuard</Text>
      </ScrollView>

      <CameraModal visible={showCam} onClose={() => setShowCam(false)} />
    </ImageBackground>
  );
}

/* ---------- UI helpers ---------- */
function Btn({
  text, onPress, type = "default"
}: { text: string; onPress: () => void; type?: "default" | "primary" }) {
  const style = [styles.btn, type === "primary" ? styles.btnPrimary : styles.btnDefault];
  return (
    <TouchableOpacity onPress={onPress} style={style}>
      <Text style={type === "primary" ? styles.btnTextPrimary : styles.btnTextDefault}>{text}</Text>
    </TouchableOpacity>
  );
}

function Badge({ text, type = "neutral" }:{
  text: string; type?: "neutral"|"success"|"danger"|"warn"
}) {
  const base = [styles.badge];
  if (type === "success") base.push({ backgroundColor: "#ecfdf5", borderColor: "#a7f3d0" } as any);
  if (type === "danger")  base.push({ backgroundColor: "#fef2f2", borderColor: "#fecaca" } as any);
  if (type === "warn")    base.push({ backgroundColor: "#fffbeb", borderColor: "#fde68a" } as any);
  return (
    <View style={base}>
      <Text style={{ fontWeight: "700" }}>{text}</Text>
    </View>
  );
}

function GasBadge({
  label,
  value,
  high
}: {
  label: string;
  value: string | number;
  high?: boolean;
}) {
  return (
    <View
      style={[
        styles.badge,
        high
          ? { backgroundColor: "#fef2f2", borderColor: "#fecaca" } // red
          : { backgroundColor: "#ecfdf5", borderColor: "#a7f3d0" } // green
      ]}
    >
      <Text
        style={{
          fontWeight: "700",
          color: high ? "#991b1b" : "#065f46"
        }}
      >
        {label} {value}
      </Text>
    </View>
  );
}

/* ---------- styles ---------- */
const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.25)" },
  container: { padding: 16 },
  h1: { color: "#fff", fontSize: 22, fontWeight: "900", marginTop: 8, marginBottom: 4 },
  subtitle: { color: "#d1fae5", marginBottom: 10, fontWeight: "700" },

  card: { backgroundColor: "rgba(255,255,255,0.9)", borderRadius: 16, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: "rgba(0,0,0,0.06)" },
  cardTitle: { fontWeight: "900", color: "#065f46", marginBottom: 8 },

  imageBox: { height: 220, borderRadius: 12, backgroundColor: "#f3f4f6", alignItems: "center", justifyContent: "center", overflow: "hidden", borderWidth: 1, borderColor: "#e5e7eb" },
  image: { width: "100%", height: "100%" },
  muted: { color: "#6b7280", fontWeight: "700" },

  row: { flexDirection: "row", gap: 10, marginTop: 10, flexWrap: "wrap" },

  btn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10 },
  btnDefault: { backgroundColor: "#e7fff1", borderWidth: 1, borderColor: "#b9f3d2" },
  btnPrimary: { backgroundColor: "#22c55e" },
  btnTextDefault: { color: "#0b3d2e", fontWeight: "800" },
  btnTextPrimary: { color: "#fff", fontWeight: "900" },

  badgeWrap: { marginTop: 10 },
  badgeRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  badge: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 999, borderWidth: 1, borderColor: "#d1d5db", backgroundColor: "#fff" },

  summaryLine: { fontWeight: "700", color: "#111827", marginTop: 6 },
  footer: { textAlign: "center", color: "#e5e7eb", marginTop: 10, marginBottom: 20, fontWeight: "700" },

  modalDim: { flex: 1, backgroundColor: "#0009", alignItems: "center", justifyContent: "center" },
  modalBox: { backgroundColor: "#fff", padding: 16, borderRadius: 12, width: 260, alignItems: "center", gap: 10 },
});
