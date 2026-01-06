import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1 container py-8">{children}</main>
      <Footer />
    </>
  );
}
