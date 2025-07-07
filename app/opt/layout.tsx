import { ProtectedRoute } from "@/components/auth/protected-page";
import Nav from "@/components/layout/nav";
import FooterNav from "@/components/layout/footer-nav";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col items-center w-full min-h-screen">
      <Nav />
      <ProtectedRoute>{children} </ProtectedRoute>
      <FooterNav />
    </main>
  );
}
