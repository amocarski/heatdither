"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

import { DitheredMatrix } from "./dithered-matrix";

export type CtaStyleProps = {
	borderRadius: number;
	cornerShapeStyle: string;
	speed: number;
};

export const CtaSideBySide = ({
	borderRadius,
	cornerShapeStyle,
	speed,
}: CtaStyleProps) => {
	return (
		<div
			className="w-full overflow-hidden bg-primary-200"
			style={
				{
					borderRadius: `${borderRadius}px`,
					cornerShape: cornerShapeStyle,
				} as React.CSSProperties
			}
		>
			<div className="flex flex-col lg:flex-row lg:items-stretch">
				<div className="flex-1 p-8 lg:p-12 flex flex-col justify-center">
					<Typography variant="h2">Ready to get started?</Typography>
					<Typography variant="p2" color="primary-200" className="mt-xl">
						Join thousands of developers building amazing experiences with our
						platform.
					</Typography>
					<div className="flex flex-wrap gap-3 mt-4xl">
						<Button
							borderRadius={borderRadius}
							cornerShapeStyle={cornerShapeStyle}
						>
							Get Started
						</Button>
						<Button
							variant="ghost"
							borderRadius={borderRadius}
							cornerShapeStyle={cornerShapeStyle}
						>
							Learn More
						</Button>
					</div>
				</div>
				<div className="h-[100px] lg:h-auto lg:w-[300px] shrink-0">
					<DitheredMatrix
						shape="gradient"
						type="8x8"
						pxSize={16}
						speed={speed}
						interactive
					/>
				</div>
			</div>
		</div>
	);
};

export const CtaTopStrip = ({
	borderRadius,
	cornerShapeStyle,
	speed,
}: CtaStyleProps) => {
	return (
		<div
			className="w-full overflow-hidden bg-[#5C246E]"
			style={
				{
					borderRadius: `${borderRadius}px`,
					cornerShape: cornerShapeStyle,
				} as React.CSSProperties
			}
		>
			<div className="p-8 lg:p-12">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
					<div>
						<Typography variant="h3" color="fixed-primary-100">
							Limited time offer
						</Typography>
						<Typography
							variant="p2"
							color="fixed-primary-100"
							className="mt-xl"
						>
							Get 50% off your first year when you sign up today.
						</Typography>
					</div>
					<div className="flex gap-3 shrink-0">
						<Button
							size="lg"
							borderRadius={borderRadius}
							cornerShapeStyle={cornerShapeStyle}
						>
							Claim Offer
						</Button>
					</div>
				</div>
			</div>
			<div className="h-[80px] w-full">
				<DitheredMatrix
					shape="wave"
					type="8x8"
					pxSize={10}
					speed={speed}
					interactive
				/>
			</div>
		</div>
	);
};

export const CtaSplitLarge = ({
	borderRadius,
	cornerShapeStyle,
	speed,
}: CtaStyleProps) => {
	return (
		<div
			className="w-full overflow-hidden bg-primary-200"
			style={
				{
					borderRadius: `${borderRadius}px`,
					cornerShape: cornerShapeStyle,
				} as React.CSSProperties
			}
		>
			<div className="flex flex-col lg:flex-row">
				<div className="h-[250px] lg:h-[350px] lg:w-1/2">
					<DitheredMatrix
						shape="simplex"
						type="8x8"
						pxSize={20}
						speed={speed}
						interactive
					/>
				</div>

				<div className="flex-1 p-8 lg:p-12 flex flex-col justify-center">
					<Typography
						variant="label5"
						color="fixed-secondary-100"
						className="mb-2"
					>
						New Release
					</Typography>
					<Typography variant="h2" className="mb-4">
						Version 2.0 is here
					</Typography>
					<Typography variant="p2" color="primary-200" className="mb-6">
						Packed with new features, performance improvements, and a completely
						redesigned interface.
					</Typography>
					<div className="flex flex-wrap gap-3 mt-4xl">
						<Button
							size="lg"
							borderRadius={borderRadius}
							cornerShapeStyle={cornerShapeStyle}
						>
							Upgrade Now
						</Button>
						<Button
							variant="ghost"
							size="lg"
							borderRadius={borderRadius}
							cornerShapeStyle={cornerShapeStyle}
						>
							See What&apos;s New
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export const CtaRipple = ({
	borderRadius,
	cornerShapeStyle,
	speed,
}: CtaStyleProps) => {
	return (
		<div
			className="w-full overflow-hidden bg-primary-200"
			style={
				{
					borderRadius: `${borderRadius}px`,
					cornerShape: cornerShapeStyle,
				} as React.CSSProperties
			}
		>
			<div className="relative flex flex-col lg:flex-row">
				<div className="h-[250px] lg:h-[350px] w-full">
					<DitheredMatrix
						shape="ripple"
						type="8x8"
						pxSize={20}
						speed={speed}
						interactive
					/>
				</div>
				<div
					className="bg-primary-200 absolute flex-1 p-8 flex flex-col justify-center items-center max-w-[650px] transform left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
					style={
						{
							borderRadius: `${borderRadius}px`,
							cornerShape: cornerShapeStyle,
						} as React.CSSProperties
					}
				>
					<Typography variant="h2" className="mb-4">
						Get Started
					</Typography>
					<Typography variant="p2" color="primary-200" className=" text-center">
						Join thousands of developers building amazing experiences with our
						platform.
					</Typography>
					<div className="flex flex-wrap gap-3 mt-4xl">
						<Button
							borderRadius={borderRadius}
							cornerShapeStyle={cornerShapeStyle}
						>
							Get Started
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export const ctaVariants: {
	name: string;
	component: React.ComponentType<CtaStyleProps>;
}[] = [
	{ name: "Side by Side", component: CtaSideBySide },
	{ name: "Top Strip", component: CtaTopStrip },
	{ name: "Split Large", component: CtaSplitLarge },
	{ name: "Ripple", component: CtaRipple },
];
