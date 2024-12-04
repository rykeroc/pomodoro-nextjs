import {MutableRefObject} from "react";

class Rgb {
	r: number
	g: number
	b: number

	constructor(r: number, g: number, b: number) {
		this.r = r;
		this.g = g;
		this.b = b;
	}

	toString = () => `rgb(${this.r}, ${this.g}, ${this.b})`
}

function getAverageRbg(
	imgRef: MutableRefObject<HTMLImageElement | null>,
	scale: number = 0.1
): Rgb | null {
	if (imgRef.current === null)
		return null

	const blockSize = 5; // Only visit every 5 pixels
	const canvas = document.createElement('canvas');
	const context = canvas.getContext && canvas.getContext('2d');
	let data, width, height, i = -4, length;
	const rgb = { r: 0, g: 0, b: 0 };
	let count = 0;

	if (!context) {
		return null;
	}

	// Reduce image resolution
	height = canvas.height = (imgRef.current.naturalHeight || imgRef.current.offsetHeight || imgRef.current.height) * scale;
	width = canvas.width = (imgRef.current.naturalWidth || imgRef.current.offsetWidth || imgRef.current.width) * scale;

	// Draw the scaled-down image onto the canvas
	context.drawImage(imgRef.current, 0, 0, width, height);

	try {
		data = context.getImageData(0, 0, width, height);
	} catch (e) {
		/* security error, img on a different domain */
		return null;
	}

	length = data.data.length;

	while ((i += blockSize * 4) < length) {
		++count;
		rgb.r += data.data[i];
		rgb.g += data.data[i + 1];
		rgb.b += data.data[i + 2];
	}

	// ~~ used to floor values
	rgb.r = ~~(rgb.r / count);
	rgb.g = ~~(rgb.g / count);
	rgb.b = ~~(rgb.b / count);

	return rgb;
}

export {
	getAverageRbg
}

export type {
	Rgb
}