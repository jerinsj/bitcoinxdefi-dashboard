import { cookies } from "next/headers";
import PasscodeForm from "./passcode-form";

export default function FiveFlagsPage() {
  const hasAccess =
    cookies().get("five_flags_access")?.value === "true";

  if (!hasAccess) {
    return <PasscodeForm />;
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <iframe
        src="/five-flags-tool/index.html"
        className="h-[950px] w-full rounded-xl border border-slate-300 dark:border-slate-700"
      />
    </main>
  );
}
