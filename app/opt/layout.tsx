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
      {children}
      <FooterNav />
    </main>
  );
}
