"use client";

import { useActionState, useState } from "react";
import { media } from "@/lib/media";
import { subscribe, type SubscribeState } from "./subscribe";

const initialState: SubscribeState = { status: "idle" };

const sweepStyles = `
.ace-field-sweep {
  -webkit-mask-image: linear-gradient(90deg, #000 0%, #000 33.333%, transparent 66.666%, transparent 100%);
  mask-image: linear-gradient(90deg, #000 0%, #000 33.333%, transparent 66.666%, transparent 100%);
  -webkit-mask-size: 300% 100%;
  mask-size: 300% 100%;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: 100% 0;
  mask-position: 100% 0;
  transition: mask-position 700ms cubic-bezier(0.22, 1, 0.36, 1), -webkit-mask-position 700ms cubic-bezier(0.22, 1, 0.36, 1);
}
.group:hover > .ace-field-sweep {
  -webkit-mask-position: 0 0;
  mask-position: 0 0;
}
.ace-arrow-hover {
  -webkit-mask-image: linear-gradient(90deg, #000 0%, #000 33.333%, transparent 66.666%, transparent 100%);
  mask-image: linear-gradient(90deg, #000 0%, #000 33.333%, transparent 66.666%, transparent 100%);
  -webkit-mask-size: 300% 100%;
  mask-size: 300% 100%;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: 100% 0;
  mask-position: 100% 0;
  transition: mask-position 700ms cubic-bezier(0.22, 1, 0.36, 1), -webkit-mask-position 700ms cubic-bezier(0.22, 1, 0.36, 1);
}
.ace-arrow:hover:not(:disabled) > .ace-arrow-hover {
  -webkit-mask-position: 0 0;
  mask-position: 0 0;
}
@media (prefers-reduced-motion: reduce) {
  .ace-field-sweep,
  .ace-arrow-hover {
    transition: none;
  }
}
`;

const fieldType = "type-p2";

const messageType = "type-p2 pointer-events-none absolute top-full left-0 mt-1 whitespace-nowrap";

export function SubscribeForm({ className }: { className?: string }) {
  const [state, formAction, pending] = useActionState(subscribe, initialState);
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const invalid = state.status === "invalid";
  const success = state.status === "subscribed";
  const filled = value.trim().length > 0;

  const border = invalid
    ? "border-[#FF4B4B]"
    : success
      ? "border-[#36F592]"
      : focused
        ? "border-[#FFF645]"
        : "border-transparent";
  const resting = !invalid && !success && !focused && !filled;

  return (
    <form
      action={formAction}
      noValidate
      className={`relative z-10 ${className ?? "w-[400px]"}`}
    >      <style>{sweepStyles}</style>
      <div
        className={`${resting ? "group bg-[rgba(215,215,215,0.75)]" : "bg-[#D7D7D7]"} relative flex items-center justify-between overflow-hidden rounded-full border border-solid p-1 ${border}`}
      >
        {resting ? (
          <span aria-hidden className="ace-field-sweep pointer-events-none absolute inset-0 rounded-full bg-[#D7D7D7]" />
        ) : null}
        <label htmlFor="exhibition-email" className="sr-only">
          Email
        </label>
        <input
          id="exhibition-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          spellCheck={false}
          readOnly={success}
          value={value}
          placeholder="Enter your email to subscribe to updates"
          aria-invalid={invalid}
          aria-describedby={invalid || success ? "exhibition-email-status" : undefined}
          onChange={(event) => setValue(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`relative z-10 min-w-0 flex-1 bg-transparent px-[10px] py-2 caret-[#4E4E4E] text-black outline-none placeholder:text-[#4E4E4E] focus:placeholder:text-transparent ${fieldType}`}
        />
        <button
          type="submit"
          aria-label="Subscribe"
          disabled={pending || success}
          className="ace-arrow relative z-10 size-[35px] shrink-0 overflow-hidden rounded-full border-0 bg-[#FFF645] p-0"
        >
          <span className="relative flex size-full items-center justify-center">
            <img alt="" src={media("/ace/enquire-arrow.svg")} width={7.49553} height={7.5} />
          </span>
          <span
            aria-hidden
            className="ace-arrow-hover pointer-events-none absolute inset-0 flex items-center justify-center rounded-full bg-black"
          >
            <img alt="" src={media("/ace/view-arrow.svg")} width={7.49553} height={7.5} />
          </span>
        </button>
      </div>
      {invalid ? (
        <p id="exhibition-email-status" role="alert" className={`${messageType} text-[#FF4B4B]`}>
          Please enter a valid email.
        </p>
      ) : null}
      {success ? (
        <p id="exhibition-email-status" role="status" className={`${messageType} text-[#36F592]`}>
          Success! You’re in the loop.
        </p>
      ) : null}
    </form>
  );
}
