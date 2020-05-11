import { Component, OnInit } from "@angular/core";
import { Domain, SettingsService } from "../settings.service";

@Component({
	selector: "app-sidebar",
	templateUrl: "./sidebar.component.html",
	styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
	domain: Domain = null;
	public: boolean = null;

	constructor(private readonly settingsService: SettingsService) {}

	ngOnInit() {
		// dont need to unsubscribe because this is always showing

		this.settingsService.public$.subscribe(isPublic => {
			this.public = isPublic;
		});

		this.settingsService.domain$.subscribe(domain => {
			this.domain = domain;
		});
	}
}
