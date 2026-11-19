"use server";

export type SubscribeState = {
  status: "idle" | "subscribed" | "invalid";
};

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function subscribe(
  _state: SubscribeState,
  formData: FormData,
): Promise<SubscribeState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!isEmail(email)) return { status: "invalid" };
  return { status: "subscribed" };
}
