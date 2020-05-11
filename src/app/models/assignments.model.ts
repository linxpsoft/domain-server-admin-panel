export interface Assignments {
	fulfilled: {
		[id: string]: {
			type: string;
		};
	};
	queued: {
		[id: string]: {
			type: string;
		};
	};
}
