"use client";

import { useActionState } from "react";
import { media } from "@/lib/media";
import { subscribe, type SubscribeState } from "./subscribe";

const initialState: SubscribeState = { status: "idle" };

const fieldType =
  "font-sans text-[12px] leading-[1.5] font-[442] tracking-[0.15px]";

export function SubscribeForm() {
  const [state, formAction, pending] = useActionState(subscribe, initialState);
  const subscribed = state.status === "subscribed";

  return (
    <form action={formAction} className="flex w-[400px] flex-col items-center">
      <div className="flex w-full items-center justify-between rounded-[20px] bg-[rgba(215,215,215,0.75)] p-1">
        {subscribed ? (
          <p className={`px-5 py-[10px] text-black ${fieldType}`}>You're subscribed</p>
        ) : (
          <>
            <label htmlFor="exhibition-email" className="sr-only">
              Email
            </label>
            <input
              id="exhibition-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="Enter your email to subscribe"
              aria-invalid={state.status === "invalid"}
              className={`min-w-0 flex-1 bg-transparent px-5 py-[10px] text-black outline-none placeholder:text-black ${fieldType}`}
            />
          </>
        )}
        <button
          type="submit"
          aria-label="Subscribe"
          disabled={pending || subscribed}
          className="flex size-[35px] shrink-0 items-center justify-center rounded-full bg-[#FFF645] disabled:opacity-100"
        >
          <img alt="" src={media("/ace/enquire-arrow.svg")} width={7.49553} height={7.5} />
        </button>
      </div>
      {state.status === "invalid" ? (
        <p role="alert" className={`mt-2 text-white ${fieldType}`}>
          Enter a valid email.
        </p>
      ) : null}
    </form>
  );
}
