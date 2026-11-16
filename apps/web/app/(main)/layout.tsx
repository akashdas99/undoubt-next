import Header from "@/components/common/header";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className="flex w-full flex-1 flex-col">{children}</div>
    </>
  );
}
