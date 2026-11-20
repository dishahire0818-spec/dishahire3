import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | DishaHire Admin" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <div className="flex min-h-dvh flex-col bg-[#f4f5f2]">{children}</div>;
}
