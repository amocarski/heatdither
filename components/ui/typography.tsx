import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { cn } from "@/lib/utils";

export const headingVariantClasses = {
	h1: "text-[40px] font-semibold",
	h2: "text-[32px] font-semibold",
	h3: "text-[24px] font-semibold",
	h4: "text-[20px] font-semibold",
	h5: "text-[16px] font-semibold",
	h6: "text-[14px] font-semibold",
} as const;

export const paragraphVariantClasses = {
	p1: "text-[20px] font-normal",
	p2: "text-[18px] font-normal",
	p3: "text-[16px] font-normal",
	p4: "text-[14px] font-normal",
} as const;

export const richTextProseClasses = {
	h1: "[&_h1]:text-[40px] [&_h1]:font-semibold",
	h2: "[&_h2]:text-[32px] [&_h2]:font-semibold",
	h3: "[&_h3]:text-[24px] [&_h3]:font-semibold",
	h4: "[&_h4]:text-[20px] [&_h4]:font-semibold",
	h5: "[&_h5]:text-[16px] [&_h5]:font-semibold",
	h6: "[&_h6]:text-[14px] [&_h6]:font-semibold",
	p: "[&_p]:text-[20px] [&_p]:font-normal",
} as const;

const TypographyVariants = cva("!leading-[100%] tracking-[0%]", {
	variants: {
		variant: {
			display1: "text-[clamp(72px,6vw,96px)] font-semibold",
			display2: "text-[clamp(56px,4.5vw,72px)] font-semibold",
			display3: "text-[56px] font-semibold",
			...headingVariantClasses,
			label1: "text-[20px] font-semibold",
			label2: "text-[18px] font-semibold",
			label3: "text-[16px] font-semibold",
			label4: "text-[14px] font-semibold",
			label5: "text-[12px] font-semibold",
			...paragraphVariantClasses,
		},
		color: {
			"primary-100": "text-primary-100",
			"primary-200": "text-primary-200",
			"primary-300": "text-primary-300",
			"primary-400": "text-primary-400",
			"primary-500": "text-primary-500",
			"secondary-100": "text-secondary-100",
			"secondary-200": "text-secondary-200",
			"secondary-300": "text-secondary-300",
			"secondary-400": "text-secondary-400",
			"secondary-500": "text-secondary-500",
			"fixed-primary-100": "text-fixed-primary-100",
			"fixed-primary-200": "text-fixed-primary-200",
			"fixed-secondary-100": "text-fixed-secondary-100",
			"fixed-secondary-200": "text-fixed-secondary-200",
			inherit: "text-inherit",
		},
	},
	defaultVariants: {
		variant: "p1",
		color: "primary-100",
	},
});

const variantElementMap = {
	display1: "h1",
	display2: "h1",
	display3: "h1",
	h1: "h1",
	h2: "h2",
	h3: "h3",
	h4: "h4",
	h5: "h5",
	h6: "h6",
	label1: "span",
	label2: "span",
	label3: "span",
	label4: "span",
	label5: "span",
	p1: "p",
	p2: "p",
	p3: "p",
	p4: "p",
} as const;

export interface TypographyProps
	extends Omit<React.HTMLAttributes<HTMLHeadingElement>, "color">,
		VariantProps<typeof TypographyVariants> {}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
	({ className, variant, color, ...props }, ref) => {
		const element = variant ? variantElementMap[variant] : "p";
		const Component = element as React.ElementType;

		return (
			<Component
				className={cn(TypographyVariants({ variant, color, className }))}
				ref={ref}
				{...props}
			/>
		);
	},
);
Typography.displayName = "Typography";

export { Typography, TypographyVariants };
