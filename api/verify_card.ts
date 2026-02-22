import { VerificationResponse } from "@/types/card";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  "https://www.ssnit.org.gh/api-proxy/member/registration/nia/verify";
const API_CHANNEL_ID = process.env.EXPO_PUBLIC_API_CHANNEL_ID || "2";

export const verifyCard = async (
  cardNumber: string,
): Promise<VerificationResponse> => {
  const url = `${API_BASE_URL}/${cardNumber}?channel_id=${API_CHANNEL_ID}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data: VerificationResponse = await response.json();
  return data;
};
