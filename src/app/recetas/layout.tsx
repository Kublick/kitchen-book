import Header from "@/components/header/TopBar";
export default function RecipeRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />
      <div className="container mx-auto my-8">{children}</div>
    </div>
  );
}
