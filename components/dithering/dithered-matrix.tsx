"use client";

import { useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// GLSL utility functions
const declarePI = `
#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846
`;

const proceduralHash11 = `
float hash11(float p) {
  p = fract(p * 0.3183099) + 0.1;
  p *= p + 19.19;
  return fract(p * p);
}
`;

const proceduralHash21 = `
float hash21(vec2 p) {
  p = fract(p * vec2(0.3183099, 0.3678794)) + 0.1;
  p += dot(p, p + 19.19);
  return fract(p.x * p.y);
}
`;

const simplexNoise = `
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
    -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
      dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
`;

// Vertex shader
const vertexShaderSource = `#version 300 es
precision mediump float;

layout(location = 0) in vec4 a_position;

void main() {
  gl_Position = a_position;
}
`;

const fragmentShaderSource = `#version 300 es
precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_shape;
uniform float u_type;
uniform float u_pxSize;
uniform vec2 u_mouse;
uniform float u_interactive;

out vec4 fragColor;

${simplexNoise}
${declarePI}
${proceduralHash11}
${proceduralHash21}

// Warm to cool color palette
vec3 getGradientColor(float t) {
  vec3 yellow = vec3(1.0, 0.85, 0.24);
  vec3 orange = vec3(1.0, 0.62, 0.26);
  vec3 red = vec3(0.91, 0.30, 0.24);
  vec3 pink = vec3(0.91, 0.26, 0.58);
  vec3 purple = vec3(0.56, 0.27, 0.68);
  vec3 deepPurple = vec3(0.36, 0.14, 0.43);
  
  if (t < 0.2) {
    return mix(yellow, orange, t / 0.2);
  } else if (t < 0.4) {
    return mix(orange, red, (t - 0.2) / 0.2);
  } else if (t < 0.6) {
    return mix(red, pink, (t - 0.4) / 0.2);
  } else if (t < 0.8) {
    return mix(pink, purple, (t - 0.6) / 0.2);
  } else {
    return mix(purple, deepPurple, (t - 0.8) / 0.2);
  }
}

float getSimplexNoise(vec2 uv, float t) {
  float noise = .5 * snoise(uv - vec2(0., .3 * t));
  noise += .5 * snoise(2. * uv + vec2(0., .32 * t));
  return noise;
}

const int bayer2x2[4] = int[4](0, 2, 3, 1);
const int bayer4x4[16] = int[16](
  0,  8,  2, 10,
 12,  4, 14,  6,
  3, 11,  1,  9,
 15,  7, 13,  5
);

const int bayer8x8[64] = int[64](
   0, 32,  8, 40,  2, 34, 10, 42,
  48, 16, 56, 24, 50, 18, 58, 26,
  12, 44,  4, 36, 14, 46,  6, 38,
  60, 28, 52, 20, 62, 30, 54, 22,
   3, 35, 11, 43,  1, 33,  9, 41,
  51, 19, 59, 27, 49, 17, 57, 25,
  15, 47,  7, 39, 13, 45,  5, 37,
  63, 31, 55, 23, 61, 29, 53, 21
);

float getBayerValue(vec2 uv, int size) {
  ivec2 pos = ivec2(mod(uv, float(size)));
  int index = pos.y * size + pos.x;

  if (size == 2) {
    return float(bayer2x2[index]) / 4.0;
  } else if (size == 4) {
    return float(bayer4x4[index]) / 16.0;
  } else if (size == 8) {
    return float(bayer8x8[index]) / 64.0;
  }
  return 0.0;
}

void main() {
  float t = .5 * u_time;
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv.y = 1.0 - uv.y;
  
  // Apply pixelization
  float pxSize = u_pxSize;
  vec2 pxSizeUv = gl_FragCoord.xy;
  pxSizeUv -= .5 * u_resolution;
  pxSizeUv /= pxSize;
  vec2 pixelizedUv = floor(pxSizeUv) * pxSize / u_resolution.xy;
  pixelizedUv += .5;
  pixelizedUv.y = 1.0 - pixelizedUv.y;
  
  vec2 shape_uv = pixelizedUv - 0.5;
  vec2 dithering_uv = pxSizeUv;
  vec2 ditheringNoise_uv = uv * u_resolution;

  // Mouse interaction - calculate distance from mouse
  vec2 mouseUv = u_mouse / u_resolution;
  // Don't flip mouseUv.y - mouse coords are already in screen space (top=0)
  // and pixelizedUv.y is flipped to match screen space
  float mouseDist = length(pixelizedUv - mouseUv);
  float mouseInfluence = u_interactive * smoothstep(0.3, 0.0, mouseDist);

  float shape = 0.;
  int shapeType = int(floor(u_shape));
  
  if (shapeType == 1) {
    shape_uv *= 2.0;
    shape = 0.5 + 0.5 * getSimplexNoise(shape_uv, t);
    shape = smoothstep(0.2, 0.8, shape);
  } else if (shapeType == 2) {
    shape_uv *= 3.0;
    for (float i = 1.0; i < 6.0; i++) {
      shape_uv.x += 0.6 / i * cos(i * 2.5 * shape_uv.y + t);
      shape_uv.y += 0.6 / i * cos(i * 1.5 * shape_uv.x + t);
    }
    shape = .15 / abs(sin(t - shape_uv.y - shape_uv.x));
    shape = smoothstep(0.02, 1., shape);
  } else if (shapeType == 3) {
    shape_uv *= 4.;
    float wave = cos(.5 * shape_uv.x - 2. * t) * sin(1.5 * shape_uv.x + t) * (.75 + .25 * cos(3. * t));
    shape = 1. - smoothstep(-1., 1., shape_uv.y + wave);
  } else if (shapeType == 4) {
    float dist = length(shape_uv);
    float waves = sin(pow(dist, 1.7) * 7. - 3. * t) * .5 + .5;
    shape = waves;
  } else if (shapeType == 5) {
    float l = length(shape_uv);
    float angle = 6. * atan(shape_uv.y, shape_uv.x) + 4. * t;
    float twist = 1.2;
    float offset = pow(l, -twist) + angle / TWO_PI;
    float mid = smoothstep(0., 1., pow(l, twist));
    shape = mix(0., fract(offset), mid);
  } else if (shapeType == 6) {
    // Horizontal scroll - blocks moving left to right with wave
    float scrollSpeed = 0.3;
    float bands = 5.0;
    // Create scrolling vertical bands
    float scrollX = fract(pixelizedUv.x * bands - t * scrollSpeed);
    // Add some vertical wave variation
    float waveY = 0.15 * sin(pixelizedUv.y * 8.0 + t * 0.5);
    shape = fract(scrollX + waveY);
    // Add subtle noise for organic feel
    shape += 0.1 * getSimplexNoise(shape_uv * 2.0, t * 0.3);
    shape = clamp(shape, 0.0, 1.0);
  } else if (shapeType == 7) {
    // Smooth horizontal flow - gradient moving left to right
    float scrollSpeed = 0.15;
    // Smooth horizontal scroll based on X position
    float scrollX = fract(pixelizedUv.x - t * scrollSpeed);
    // Add slight vertical offset for diagonal flow effect
    float verticalShift = pixelizedUv.y * 0.2;
    shape = fract(scrollX + verticalShift);
  } else {
    shape = pixelizedUv.y;
    shape += 0.1 * getSimplexNoise(shape_uv * 3.0, t * 0.5);
    shape = clamp(shape, 0.0, 1.0);
  }

  // Apply mouse influence to shift shape value
  shape = clamp(shape - mouseInfluence * 0.3, 0.0, 1.0);

  // Apply dithering
  int type = int(floor(u_type));
  float dithering = 0.0;

  if (type == 1) {
    dithering = step(hash21(ditheringNoise_uv), shape);
  } else if (type == 2) {
    dithering = getBayerValue(dithering_uv, 2);
  } else if (type == 3) {
    dithering = getBayerValue(dithering_uv, 4);
  } else {
    dithering = getBayerValue(dithering_uv, 8);
  }

  dithering -= .5;
  
  // Get two adjacent colors from gradient based on position
  float baseT = floor(shape * 5.0) / 5.0;
  float nextT = min(baseT + 0.2, 1.0);
  
  vec3 color1 = getGradientColor(baseT);
  vec3 color2 = getGradientColor(nextT);
  
  // Use dithering to blend between adjacent colors
  float localShape = fract(shape * 5.0);
  float localDither = step(0.5, localShape + dithering);
  vec3 finalColor = mix(color1, color2, localDither);

  // Apply brightness boost near mouse
  finalColor += mouseInfluence * 0.15;

  fragColor = vec4(finalColor, 1.0);
}
`;

export const DitheringShapes = {
	gradient: 0,
	simplex: 1,
	warp: 2,
	wave: 3,
	ripple: 4,
	swirl: 5,
	scroll: 6,
	flow: 7,
} as const;

export const DitheringTypes = {
	random: 1,
	"2x2": 2,
	"4x4": 3,
	"8x8": 4,
} as const;

export type DitheringShape = keyof typeof DitheringShapes;
export type DitheringType = keyof typeof DitheringTypes;

type DitheredMatrixProps = {
	className?: string;
	shape?: DitheringShape;
	type?: DitheringType;
	pxSize?: number;
	speed?: number;
	interactive?: boolean;
};

function createShader(
	gl: WebGL2RenderingContext,
	type: number,
	source: string,
): WebGLShader | null {
	const shader = gl.createShader(type);
	if (!shader) return null;

	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		gl.deleteShader(shader);
		return null;
	}

	return shader;
}

function createProgram(
	gl: WebGL2RenderingContext,
	vertexSource: string,
	fragmentSource: string,
): WebGLProgram | null {
	const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
	const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

	if (!vertexShader || !fragmentShader) return null;

	const program = gl.createProgram();
	if (!program) return null;

	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);

	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		gl.deleteProgram(program);
		return null;
	}

	return program;
}

export const DitheredMatrix = ({
	className,
	shape = "gradient",
	type = "8x8",
	pxSize = 8,
	speed = 1,
	interactive = false,
}: DitheredMatrixProps) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const animationRef = useRef<number>(0);
	const programRef = useRef<WebGLProgram | null>(null);
	const glRef = useRef<WebGL2RenderingContext | null>(null);
	const uniformsRef = useRef<Record<string, WebGLUniformLocation | null>>({});
	const startTimeRef = useRef<number>(Date.now());
	const mouseRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });

	const handleMouseMove = useCallback(
		(e: React.MouseEvent<HTMLCanvasElement>) => {
			if (!interactive) return;
			const canvas = canvasRef.current;
			if (!canvas) return;
			const rect = canvas.getBoundingClientRect();
			const dpr = window.devicePixelRatio || 1;
			mouseRef.current = {
				x: (e.clientX - rect.left) * dpr,
				y: (e.clientY - rect.top) * dpr,
			};
		},
		[interactive],
	);

	const handleMouseLeave = useCallback(() => {
		mouseRef.current = { x: -1000, y: -1000 };
	}, []);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const rect = canvas.getBoundingClientRect();
		const dpr = window.devicePixelRatio || 1;
		canvas.width = rect.width * dpr;
		canvas.height = rect.height * dpr;

		const gl = canvas.getContext("webgl2");
		if (!gl) {
			console.error("WebGL2 not supported");
			return;
		}

		glRef.current = gl;

		const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
		if (!program) return;

		programRef.current = program;

		uniformsRef.current = {
			u_time: gl.getUniformLocation(program, "u_time"),
			u_resolution: gl.getUniformLocation(program, "u_resolution"),
			u_shape: gl.getUniformLocation(program, "u_shape"),
			u_type: gl.getUniformLocation(program, "u_type"),
			u_pxSize: gl.getUniformLocation(program, "u_pxSize"),
			u_mouse: gl.getUniformLocation(program, "u_mouse"),
			u_interactive: gl.getUniformLocation(program, "u_interactive"),
		};

		const positionLocation = gl.getAttribLocation(program, "a_position");
		const positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
			gl.STATIC_DRAW,
		);
		gl.enableVertexAttribArray(positionLocation);
		gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

		gl.viewport(0, 0, canvas.width, canvas.height);

		const render = () => {
			const currentTime = (Date.now() - startTimeRef.current) * 0.001 * speed;
			const context = glRef.current;
			const shaderProgram = programRef.current;

			if (!context || !shaderProgram || !canvas) return;

			context.clear(context.COLOR_BUFFER_BIT);
			// biome-ignore lint/correctness/useHookAtTopLevel: This is WebGL API, not a React hook
			context.useProgram(shaderProgram);

			const locs = uniformsRef.current;
			if (locs.u_time) context.uniform1f(locs.u_time, currentTime);
			if (locs.u_resolution)
				context.uniform2f(locs.u_resolution, canvas.width, canvas.height);
			if (locs.u_shape) context.uniform1f(locs.u_shape, DitheringShapes[shape]);
			if (locs.u_type) context.uniform1f(locs.u_type, DitheringTypes[type]);
			if (locs.u_pxSize)
				context.uniform1f(
					locs.u_pxSize,
					pxSize * (window.devicePixelRatio || 1),
				);
			if (locs.u_mouse)
				context.uniform2f(locs.u_mouse, mouseRef.current.x, mouseRef.current.y);
			if (locs.u_interactive)
				context.uniform1f(locs.u_interactive, interactive ? 1.0 : 0.0);

			context.drawArrays(context.TRIANGLES, 0, 6);

			animationRef.current = requestAnimationFrame(render);
		};

		render();

		const handleResize = () => {
			if (!canvas || !gl) return;
			const newRect = canvas.getBoundingClientRect();
			const newDpr = window.devicePixelRatio || 1;
			canvas.width = newRect.width * newDpr;
			canvas.height = newRect.height * newDpr;
			gl.viewport(0, 0, canvas.width, canvas.height);
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
			if (glRef.current && programRef.current) {
				glRef.current.deleteProgram(programRef.current);
			}
		};
	}, [shape, type, pxSize, speed, interactive]);

	return (
		<div className={cn("relative w-full h-full", className)}>
			<canvas
				ref={canvasRef}
				className="block w-full h-full"
				onMouseMove={handleMouseMove}
				onMouseLeave={handleMouseLeave}
			/>
		</div>
	);
};
