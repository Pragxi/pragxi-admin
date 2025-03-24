import type {Metadata} from "next";
import {Poppins} from "next/font/google";
import "./globals.css";
import {ReactNode} from "react";
import {ThemeProvider} from "@/components/theme-provider";
import {Toaster} from "react-hot-toast";
import {ViewTransitions} from 'next-view-transitions'

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
        <ViewTransitions>
            <html lang="en" suppressHydrationWarning>
            <body
                className={`${poppins.className} antialiased dark:bg-zinc-900`}
            >
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                {children}
                <Toaster/>
            </ThemeProvider>
            </body>
            </html>
        </ViewTransitions>
    );
}
