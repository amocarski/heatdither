import Dithering from "@/components/dithering";

export default function Home() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-black font-sans">
			<main className="flex min-h-screen w-full flex-col items-center justify-between md:px-7xl px-sm bg-black sm:items-start">
				<Dithering />
			</main>
		</div>
	);
}
