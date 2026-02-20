import {
	DitheredMatrix,
	type DitheringShape,
	type DitheringType,
} from "@/components/dithering/dithered-matrix";
import { Typography } from "@/components/ui/typography";

type ShaderVariantProps = {
	name: string;
	index: number;
	shape: DitheringShape;
	type: DitheringType;
	pxSize: number;
	speed: number;
	interactive: boolean;
	bevelRadius: number;
	cornerShapeStyle: string;
};

const ShaderVariant = ({
	name,
	index,
	shape,
	type,
	pxSize,
	speed,
	interactive,
	bevelRadius,
	cornerShapeStyle,
}: ShaderVariantProps) => {
	return (
		<div key={name}>
			<Typography variant="label5" className="mb-sm">
				{index + 1}. {name}
			</Typography>
			<div
				className="overflow-hidden h-[460px] w-full"
				style={
					{
						borderRadius: `${bevelRadius}px`,
						cornerShape: cornerShapeStyle,
					} as React.CSSProperties
				}
			>
				<DitheredMatrix
					shape={shape}
					type={type}
					pxSize={pxSize}
					speed={speed}
					interactive={interactive}
				/>
			</div>
		</div>
	);
};

export default ShaderVariant;
