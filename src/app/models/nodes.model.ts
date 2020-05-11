export interface Node {
	local: {
		ip: string;
		port: number;
	};
	pool: string;
	public: {
		ip: string;
		port: number;
	};
	type: string;
	uptime: string;
	username: string;
	uuid: string;
	version: string;
}

export type Nodes = Node[];
