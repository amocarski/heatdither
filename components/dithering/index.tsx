"use client";

import { useEffect, useRef, useState } from "react";
import { Pane } from "tweakpane";
import CTA from "@/components/cta";
import {
	type CtaStyleProps,
	ctaVariants,
} from "@/components/dithering/cta-variants";
import type {
	DitheringShape,
	DitheringType,
} from "@/components/dithering/dithered-matrix";
import ShaderVariant from "@/components/shader-variant";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

type Tab = "variants" | "ctas";

const matrixConfigs: {
	name: string;
	shape: DitheringShape;
	type: DitheringType;
	defaultSpeed: number;
}[] = [
	{ name: "Gradient", shape: "gradient", type: "8x8", defaultSpeed: 0.5 },
	{ name: "Simplex", shape: "simplex", type: "4x4", defaultSpeed: 0.2 },
	{ name: "Wave", shape: "wave", type: "8x8", defaultSpeed: 0.3 },
	{ name: "Swirl", shape: "swirl", type: "8x8", defaultSpeed: 0.4 },
	{ name: "Warp", shape: "warp", type: "4x4", defaultSpeed: 0.8 },
	{ name: "Ripple", shape: "ripple", type: "8x8", defaultSpeed: 0.1 },
	{ name: "Scroll", shape: "scroll", type: "8x8", defaultSpeed: 0.8 },
	{ name: "Flow", shape: "flow", type: "8x8", defaultSpeed: 1.0 },
];

const params = {
	size: 12,
	interactive: true,
	radius: 9,
	superellipse: false,
	superellipseVal: 2.5,
};

const Dithering = () => {
	const paneRef = useRef<Pane | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	const [activeTab, setActiveTab] = useState<Tab>("variants");

	const [pixelSize, setPixelSize] = useState(params.size);
	const [interactive, setInteractive] = useState(params.interactive);
	const [bevelRadius, setBevelRadius] = useState(params.radius);
	const [useSuperellipse, setUseSuperellipse] = useState(params.superellipse);
	const [superellipseValue, setSuperellipseValue] = useState(
		params.superellipseVal,
	);

	const [speeds, setSpeeds] = useState<number[]>(
		matrixConfigs.map((c) => c.defaultSpeed),
	);

	const [ctaSpeeds, setCtaSpeeds] = useState<number[]>([0.5, 0.8, 0.5]);

	const cornerShapeStyle = useSuperellipse
		? `superellipse(${superellipseValue})`
		: "bevel";

	useEffect(() => {
		if (!containerRef.current) return;

		const pane = new Pane({
			container: containerRef.current,
			title: "Controls",
			expanded: window.innerWidth >= 768,
		}) as Pane & {
			addBinding: (
				obj: Record<string, unknown>,
				key: string,
				opts?: { label?: string; min?: number; max?: number; step?: number },
			) => {
				on: (event: string, cb: (ev: { value: unknown }) => void) => void;
			};
		};

		paneRef.current = pane as Pane;

		pane
			.addBinding(params, "size", {
				label: "Size",
				min: 4,
				max: 64,
				step: 1,
			})
			.on("change", (ev) => {
				setPixelSize(ev.value as number);
			});

		pane
			.addBinding(params, "interactive", {
				label: "Hover Interaction",
			})
			.on("change", (ev) => {
				setInteractive(ev.value as boolean);
			});

		pane
			.addBinding(params, "radius", {
				label: "Radius",
				min: 0,
				max: 100,
				step: 1,
			})
			.on("change", (ev) => {
				setBevelRadius(ev.value as number);
			});

		pane
			.addBinding(params, "superellipse", {
				label: "Superellipse",
			})
			.on("change", (ev) => {
				setUseSuperellipse(ev.value as boolean);
			});

		pane
			.addBinding(params, "superellipseVal", {
				label: "Curve",
				min: 1,
				max: 4.4,
				step: 0.1,
			})
			.on("change", (ev) => {
				setSuperellipseValue(ev.value as number);
			});

		const speedParams: Record<string, number> = {};
		for (const config of matrixConfigs) {
			speedParams[config.name] = config.defaultSpeed;
		}

		matrixConfigs.forEach((config, i) => {
			pane
				.addBinding(speedParams, config.name, {
					label: `${i + 1}. ${config.name} speed`,
					min: 0.1,
					max: 3,
					step: 0.1,
				})
				.on("change", (ev) => {
					setSpeeds((prev) => {
						const next = [...prev];
						next[i] = ev.value as number;
						return next;
					});
				});
		});

		const ctaSpeedParams: Record<string, number> = {
			"CTA 1": 0.5,
			"CTA 2": 0.8,
			"CTA 3": 0.5,
			"CTA 4": 0.5,
		};

		const ctaNames = ["CTA 1", "CTA 2", "CTA 3", "CTA 4"];
		ctaNames.forEach((name, i) => {
			pane
				.addBinding(ctaSpeedParams, name, {
					label: `${name} speed`,
					min: 0.1,
					max: 3,
					step: 0.1,
				})
				.on("change", (ev) => {
					setCtaSpeeds((prev) => {
						const next = [...prev];
						next[i] = ev.value as number;
						return next;
					});
				});
		});

		return () => {
			pane.dispose();
		};
	}, []);

	return (
		<div className="flex-1 self-stretch overflow-y-auto py-5xl">
			<div ref={containerRef} className="fixed top-4 right-4 z-50" />

			<div className="mx-auto max-w-[1000px] w-full px-3xl mb-2xl">
				<div className="mb-5xl space-y-2 max-w-[600px]">
					<Typography variant="h2">heat·dith·er </Typography>
					<Typography variant="h4" color="secondary-300">
						/ˈhiːtˌdɪðər/
					</Typography>
					<Typography variant="p3" color="secondary-200">
						Visual exploration tool that turns heatmaps and dithering into a
						controllable design system letting experiment with density, signal,
						and noise to prototype new brand textures, motion cues, and
						interaction states.{" "}
					</Typography>
				</div>
				<div className="mb-7xl flex gap-xl">
					<Button
						onClick={() => setActiveTab("variants")}
						variant={activeTab === "variants" ? "default" : "ghost"}
						borderRadius={bevelRadius}
						cornerShapeStyle={cornerShapeStyle}
					>
						Variants
					</Button>
					<Button
						onClick={() => setActiveTab("ctas")}
						variant={activeTab === "ctas" ? "default" : "ghost"}
						borderRadius={bevelRadius}
						cornerShapeStyle={cornerShapeStyle}
					>
						CTAs
					</Button>
				</div>

				{activeTab === "variants" && (
					<div className="flex flex-col gap-7xl">
						{matrixConfigs.map((config, index) => (
							<ShaderVariant
								key={config.name}
								name={config.name}
								index={index}
								shape={config.shape}
								type={config.type}
								pxSize={pixelSize}
								speed={speeds[index]}
								interactive={interactive}
								bevelRadius={bevelRadius}
								cornerShapeStyle={cornerShapeStyle}
							/>
						))}
					</div>
				)}

				{activeTab === "ctas" && (
					<div className="flex flex-col gap-7xl">
						{ctaVariants.map((cta, index) => (
							<CTA
								key={cta.name}
								name={cta.name}
								index={index}
								Component={cta.component as React.FC<CtaStyleProps>}
								bevelRadius={bevelRadius}
								cornerShapeStyle={cornerShapeStyle}
								speed={ctaSpeeds[index] ?? 0.5}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default Dithering;
