import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Header />
            <main className="min-h-[calc(100vh-400px)]">
                {children}
            </main>
            <Footer />
        </>
    );
}
