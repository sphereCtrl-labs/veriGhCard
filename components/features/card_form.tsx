import { verifyCard } from "@/api/verify_card";
import { Colors } from "@/constants/theme";
import { VerificationResponse } from "@/types/card";
import { formatCardNumber, validateCardNumber } from "@/utils/utils";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type VerificationState = "idle" | "loading" | "success" | "error";

export default function CardForm() {
  const [cardNumber, setCardNumber] = useState("");
  const [state, setState] = useState<VerificationState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [successData, setSuccessData] = useState<
    VerificationResponse["data"] | null
  >(null);

  const handleCardNumberChange = (text: string) => {
    const formatted = formatCardNumber(text);
    setCardNumber(formatted);
  };

  const verifyCardHandler = async () => {
    if (!validateCardNumber(cardNumber)) {
      setState("error");
      setErrorMessage("Invalid Ghana Card format. Use: GHA-XXXXXXXXX-X");
      return;
    }

    setState("loading");
    setErrorMessage("");
    setSuccessData(null);

    try {
      const data = await verifyCard(cardNumber);

      // Check if data exists and is not empty
      const hasValidData = data.data && Object.keys(data.data).length > 0;

      if (data.status === "success" && hasValidData) {
        setState("success");
        setSuccessData(data.data);
      } else if (data.status === "success" && !hasValidData) {
        setState("error");
        setErrorMessage("No data found for this card number.");
      } else {
        setState("error");
        setErrorMessage(data.msg || "Verification failed. Please try again.");
      }
    } catch (error) {
      setState("error");
      if (error instanceof Error) {
        setErrorMessage(
          error.message || "Network error. Please check your connection.",
        );
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
  };

  const resetForm = () => {
    setCardNumber("");
    setState("idle");
    setErrorMessage("");
    setSuccessData(null);
  };

  const renderIdleState = () => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>Ghana Card Number</Text>
      <TextInput
        style={styles.input}
        placeholder="GHA-XXXXXXXXX-X"
        placeholderTextColor={Colors.light.icon}
        value={cardNumber}
        onChangeText={handleCardNumberChange}
        keyboardType="default"
        autoCapitalize="characters"
        maxLength={17}
        editable={state === "idle"}
      />
      <Text style={styles.hint}>Example: GHA-722445560-1</Text>
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={Colors.light.tint} />
      <Text style={styles.loadingText}>Verifying your card...</Text>
      <Text style={styles.loadingSubtext}>
        Please wait while we verify your Ghana Card
      </Text>
    </View>
  );

  const renderSuccessState = () => (
    <View style={styles.resultContainer}>
      <View style={styles.successIconContainer}>
        <Text style={styles.successIcon}>✓</Text>
      </View>
      <Text style={styles.successTitle}>Verification Successful</Text>
      <Text style={styles.successMessage}>
        The Ghana Card number has been verified successfully.
      </Text>
      {successData && (
        <View style={styles.dataContainer}>
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Card Number:</Text>
            <Text style={styles.dataValue}>{successData.national_id}</Text>
          </View>
          {successData.forenames && (
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Name:</Text>
              <Text style={styles.dataValue}>
                {successData.forenames} {successData.surname}
              </Text>
            </View>
          )}
          {successData.region && (
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Location:</Text>
              <Text style={[styles.dataValue, styles.statusValue]}>
                {successData.district}, {successData.region}
              </Text>
            </View>
          )}
          {successData.date_of_birth && (
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Date of Birth:</Text>
              <Text style={styles.dataValue}>{successData.date_of_birth}</Text>
            </View>
          )}
          {successData.gender && (
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Gender:</Text>
              <Text style={styles.dataValue}>{successData.gender}</Text>
            </View>
          )}
          {successData.phone && (
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Phone:</Text>
              <Text style={styles.dataValue}>{successData.phone}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.resultContainer}>
      <View style={styles.errorIconContainer}>
        <Text style={styles.errorIcon}>✕</Text>
      </View>
      <Text style={styles.errorTitle}>Verification Failed</Text>
      <Text style={styles.errorMessage}>{errorMessage}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardView}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Card Visual */}
          <View style={styles.cardVisual}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardType}>GHANA CARD</Text>
              <Text style={styles.cardFlag}>🇬🇭</Text>
            </View>
            <Text style={styles.cardNumberDisplay}>
              {cardNumber || "GHA-_________-_"}
            </Text>
            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.cardLabel}>CARD NUMBER</Text>
              </View>
            </View>
          </View>

          {/* State-based content */}
          {state === "idle" && renderIdleState()}
          {state === "loading" && renderLoadingState()}
          {state === "success" && renderSuccessState()}
          {state === "error" && renderErrorState()}

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            {state === "idle" && (
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={verifyCardHandler}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>Verify Ghana Card</Text>
              </TouchableOpacity>
            )}

            {(state === "success" || state === "error") && (
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={resetForm}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryButtonText}>
                  Verify Another Card
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.securityNote}>
            🔒 Your information is secure and encrypted
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    padding: 24,
    paddingTop: 0,
  },
  cardVisual: {
    backgroundColor: "#1a1a2e",
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  cardType: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 2,
  },
  cardFlag: {
    fontSize: 28,
  },
  cardNumberDisplay: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "600",
    letterSpacing: 4,
    marginBottom: 24,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardLabel: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 10,
    letterSpacing: 1,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.icon,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.light.text,
  },
  hint: {
    fontSize: 12,
    color: Colors.light.icon,
    marginTop: 8,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text,
    marginTop: 16,
  },
  loadingSubtext: {
    fontSize: 14,
    color: Colors.light.icon,
    marginTop: 8,
    textAlign: "center",
  },
  resultContainer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  successIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#22c55e20",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  successIcon: {
    fontSize: 36,
    color: "#22c55e",
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#22c55e",
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 14,
    color: Colors.light.icon,
    textAlign: "center",
    marginBottom: 24,
  },
  errorIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#ef444420",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  errorIcon: {
    fontSize: 36,
    color: "#ef4444",
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ef4444",
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: Colors.light.icon,
    textAlign: "center",
    marginBottom: 24,
  },
  dataContainer: {
    width: "100%",
    backgroundColor: "#22c55e10",
    borderRadius: 12,
    padding: 16,
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#22c55e20",
  },
  dataLabel: {
    fontSize: 14,
    color: Colors.light.icon,
  },
  dataValue: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.text,
  },
  statusValue: {
    color: "#22c55e",
  },
  buttonContainer: {
    marginTop: 8,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: Colors.light.tint,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: Colors.light.tint + "15",
    borderWidth: 1,
    borderColor: Colors.light.tint,
  },
  secondaryButtonText: {
    color: Colors.light.tint,
    fontSize: 16,
    fontWeight: "600",
  },
  securityNote: {
    fontSize: 12,
    color: Colors.light.icon,
    textAlign: "center",
    marginTop: 24,
  },
});
