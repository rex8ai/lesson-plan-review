import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lesson Plan Response Tester',
  description: 'Review lesson plan API responses stored in Supabase',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
