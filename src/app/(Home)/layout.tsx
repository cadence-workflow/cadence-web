import AppNavBar from "@/layout/app-nav-bar/app-nav-bar";


export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <AppNavBar />
        {children}
    </main>
  );
}
