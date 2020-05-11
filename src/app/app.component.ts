import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Wizard } from "./models/settings.model";
import { SettingsService } from "./settings.service";

@Component({
	selector: "app-root",
	templateUrl: "app.component.html",
	styleUrls: ["app.component.scss"],
})
export class AppComponent implements OnInit {
	loading = true;
	wizard: Wizard;

	constructor(
		private readonly settingsService: SettingsService,
		private readonly router: Router,
	) {}

	ngOnInit() {
		// no need to unsubscribe here
		this.settingsService.settings$.subscribe(settings => {
			this.loading = settings == null;
			if (this.loading) return;

			this.wizard = settings.wizard;
			if (this.wizard.completed_once == false)
				this.router.navigate(["wizard"]);
		});
	}
}
