import "./globals.css";
import { Toaster } from "./components/ui/sonner";
import Provider from "./context/provider";

export default function RootLayout({ children, session }) {
  return (
    <html lang="en">
      <body>
        <Provider session={session}>
          {children}
        </Provider>
        <Toaster />
      </body>
    </html>
  );
}
