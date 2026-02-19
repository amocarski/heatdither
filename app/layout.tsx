import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Typography } from "@/components/ui/typography";

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
				<footer className="flex flex-row gap-3xl p-4 justify-center bg-black">
					<Typography variant="p3" color="secondary-200">
						<Link
							className="hover:underline"
							href="https://github.com/amocarski/heatdither"
							target="_blank"
						>
							GitHub
						</Link>
					</Typography>
					<Typography variant="p3" color="secondary-200">
						<Link
							className="hover:underline"
							href="https://mocarski.design/"
							target="_blank"
						>
							mocarski.design
						</Link>
					</Typography>
				</footer>
			</body>
		</html>
	);
}
