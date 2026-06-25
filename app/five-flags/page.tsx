import { cookies } from "next/headers";
import PasscodeForm from "./passcode-form";

export default function FiveFlagsPage() {
  const hasAccess =
    cookies().get("five_flags_access")?.value === "true";

  if (!hasAccess) {
    return <PasscodeForm />;
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold">Five Flags Tool</h1>
      <p className="mt-4 text-slate-600 dark:text-slate-300">
        Access granted. The crypto tax jurisdiction tool will go here.
      </p>
    </main>
  );
}
