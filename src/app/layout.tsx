import "./globals.css";
import { Toaster } from "./components/ui/sonner";
import Provider from "./context/provider";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Client Health Journey",
  description: "Track and manage your health journey",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <Provider>
          {children}
        </Provider>
        <Toaster />
      </body>
    </html>
  );
}
