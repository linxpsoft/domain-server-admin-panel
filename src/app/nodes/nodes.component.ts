import { Component, OnInit } from "@angular/core";
import { interval, Subscription, zip } from "rxjs";
import { Node, Nodes } from "../models/nodes.model";
import { SettingsService } from "../settings.service";

interface QueuedAssignment {
	uuid: string;
	type: string;
}

@Component({
	selector: "app-nodes",
	templateUrl: "./nodes.component.html",
	styleUrls: ["./nodes.component.scss"],
})
export class NodesComponent implements OnInit {
	nodes: Nodes = [];
	queuedAssignments: QueuedAssignment[] = [];

	subs: Subscription[] = [];

	constructor(public readonly settingsService: SettingsService) {}

	renderUptime(uptimeStr: string) {
		const uptime = parseFloat(uptimeStr);

		if (uptime < 60) return Math.floor(uptime) + " seconds";
		if (uptime < 60 * 60) return Math.floor(uptime / 60) + " minutes";
		return Math.floor(uptime / 60 / 60) + " hours";
	}

	killAllNodes() {
		zip(
			...this.nodes.map(node => this.settingsService.killNode(node)),
		).subscribe(() => {
			// only when all complete
			this.settingsService.refreshNodes();
		});
	}

	ngOnInit() {
		this.settingsService.refreshNodes();
		this.settingsService.refreshAssignments();

		this.subs.push(
			this.settingsService.nodes$.subscribe(nodes => {
				this.nodes = nodes;
			}),
			this.settingsService.assignments$.subscribe(assignments => {
				this.queuedAssignments = Object.keys(assignments.queued).map(
					uuid => ({
						uuid,
						type: assignments.queued[uuid].type,
					}),
				);
			}),
			interval(1000).subscribe(() => {
				this.settingsService.refreshNodes();
				this.settingsService.refreshAssignments();
			}),
		);
	}

	ngOnDestroy() {
		for (const sub of this.subs) {
			sub.unsubscribe();
		}
	}
}
