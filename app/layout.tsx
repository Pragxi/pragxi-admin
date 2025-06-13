import type {Metadata} from "next";
import {Poppins} from "next/font/google";
import "./globals.css";
import {ReactNode} from "react";
import {ViewTransitions} from 'next-view-transitions'
import {Providers} from "@/lib/providers";
import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    variable: "--font-poppins",
});

export const metadata: Metadata = {
    title: "Pragxi Admin",
    description: "Manage Pragxi Operations",
};

export default async function RootLayout({children}: Readonly<{ children: ReactNode }>) {

    const supabase = await createClient();

    const {data: {user}} = await supabase.auth.getUser()

    if (user) {
        redirect('/dashboard')
    }

    return (
        <ViewTransitions>
            <html lang="en" suppressHydrationWarning>
            <body
                className={`${poppins.className} antialiased dark:bg-zinc-900`}
            >
            <Providers>
                {children}
            </Providers>
            </body>
            </html>
        </ViewTransitions>
    );
}
