import { Typography } from "@/components/ui/typography";

type CTAStyleProps = {
	borderRadius: number;
	cornerShapeStyle: string;
	speed: number;
};

type CTAProps = {
	name: string;
	index: number;
	Component: React.FC<CTAStyleProps>;
	bevelRadius: number;
	cornerShapeStyle: string;
	speed: number;
};

const CTA = ({
	name,
	index,
	Component,
	bevelRadius,
	cornerShapeStyle,
	speed,
}: CTAProps) => {
	return (
		<div key={name}>
			<Typography variant="label5" className="mb-sm">
				{index + 1}. {name}
			</Typography>
			<Component
				borderRadius={bevelRadius}
				cornerShapeStyle={cornerShapeStyle}
				speed={speed}
			/>
		</div>
	);
};

export default CTA;
