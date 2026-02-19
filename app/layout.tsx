import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
	variable: "--font-poppins",
	weight: ["400", "500", "600", "700"],
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "heat·dith·er",
	description: "A playground for visual heatmap dithering",
	openGraph: {
		title: "Visual Heatmap Dithering Playground",
		description: "A playground for visual heatmap dithering",
		url: "https://visual-heatmap-dithering-playground.vercel.app",
		siteName: "Visual Heatmap Dithering Playground",
		images: {
			url: "/og-image.png",
			width: 1200,
			height: 630,
		},

		locale: "en_US",
		type: "website",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${poppins.className} antialiased dark`}>
				{children}
			</body>
		</html>
	);
}
