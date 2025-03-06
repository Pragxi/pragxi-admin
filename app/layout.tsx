import type {Metadata} from "next";
import {Poppins} from "next/font/google";
import "./globals.css";
import {ReactNode} from "react";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    variable: "--font-poppins",
});

export const metadata: Metadata = {
    title: "Pragxi Admin",
    description: "Manage Pragxi Operations",
};

export default function RootLayout({children}: Readonly<{ children: ReactNode }>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body
            className={`${poppins.className} antialiased bg-gray-50 dark:bg-gray-900`}
        >
        {children}
        </body>
        </html>
    );
}
