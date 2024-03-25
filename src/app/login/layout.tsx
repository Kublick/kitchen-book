import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ingresar",
  description: "Recetario de mi ama - Ingresar",
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      {children}
    </div>
  );
}
