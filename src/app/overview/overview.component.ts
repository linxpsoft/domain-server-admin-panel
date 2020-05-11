import { Component, OnDestroy, OnInit } from "@angular/core";
import { interval, Subscription } from "rxjs";
import { SettingsService } from "../settings.service";

@Component({
	selector: "app-overview",
	templateUrl: "./overview.component.html",
	styleUrls: ["./overview.component.scss"],
})
export class OverviewComponent implements OnInit, OnDestroy {
	constructor(public readonly settingsService: SettingsService) {}

	renderUptime(uptimeStr: string) {
		const uptime = parseFloat(uptimeStr);

		if (uptime < 60) return Math.floor(uptime) + " seconds";
		if (uptime < 60 * 60) return Math.floor(uptime / 60) + " minutes";
		return Math.floor(uptime / 60 / 60) + " hours";
	}

	intervalSub: Subscription;

	ngOnInit() {
		this.settingsService.refreshNodes();
		this.intervalSub = interval(1000).subscribe(() => {
			this.settingsService.refreshNodes();
		});
	}

	ngOnDestroy() {
		this.intervalSub.unsubscribe();
	}
}
