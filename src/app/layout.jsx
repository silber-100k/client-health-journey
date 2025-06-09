import "./globals.css";
import { Toaster } from "./components/ui/sonner";
import Provider from "./context/provider";

export default function RootLayout({ children }) {
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
