import proj4 from 'proj4';
import type { CreateMapOptions } from './types';
import { getMapPoints } from './helpers';

export const createMap = ({
	height,
	width,
	countries,
	region,
	markers,
	mapSamples = 6000
}: CreateMapOptions) => {
	const aspect = width / height;
	const rows = Math.round(Math.sqrt(mapSamples / aspect));
	const columns = Math.round(rows * aspect);

	const { points, X_MIN, Y_MAX, X_RANGE, Y_RANGE } = getMapPoints({
		height,
		width,
		countries,
		region,
		rows,
		columns
	});

	const markerPoints = markers.map((marker) => {
		const { lat, lng, size, ...markerData } = marker;
		const [googleX, googleY] = proj4('GOOGLE', [lng, lat]);

		const normalizedX = (googleX - X_MIN) / X_RANGE;
		const normalizedY = (Y_MAX - googleY) / Y_RANGE;

		const col = Math.round(normalizedX * (columns - 1));
		const row = Math.round(normalizedY * (rows - 1));

		const margin = 12;

		const localx = margin + (col / (columns - 1)) * (width - 2 * margin);
		const localy = margin + (row / (rows - 1)) * (height - 2 * margin);

		const key = `${Math.round(localx)};${Math.round(localy)}`;
		if (!points[key]) {
			points[key] = {
				x: localx,
				y: localy
			};
		}

		return {
			x: localx,
			y: localy,
			...markerData
		};
	});

	return {
		points: Object.values(points),
		markers: markerPoints
	};
};
