import { Injectable, NgModule } from "@angular/core";
import {
	ActivatedRouteSnapshot,
	CanActivate,
	Router,
	RouterModule,
	RouterStateSnapshot,
	Routes,
} from "@angular/router";
import { map, take } from "rxjs/operators";
import { NetworkingComponent } from "./networking/networking.component";
import { NodesComponent } from "./nodes/nodes.component";
import { OverviewComponent } from "./overview/overview.component";
import { PermissionsComponent } from "./permissions/permissions.component";
import { SettingsService } from "./settings.service";
import { WizardComponent } from "./wizard/wizard.component";

@Injectable({ providedIn: "root" })
class WizardGuard implements CanActivate {
	constructor(
		private readonly router: Router,
		private readonly settingsService: SettingsService,
	) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		return this.settingsService.settings$.pipe(
			take(1),
			map(settings => !settings.wizard.completed_once),
		);
	}
}

const routes: Routes = [
	{
		path: "",
		pathMatch: "full",
		redirectTo: "overview",
	},
	{
		path: "wizard",
		component: WizardComponent,
		canActivate: [WizardGuard],
	},
	// general
	{ path: "overview", component: OverviewComponent },
	// settings
	{ path: "permissions", component: PermissionsComponent },
	{ path: "networking", component: NetworkingComponent },
	// advanced
	{ path: "nodes", component: NodesComponent },
	{
		path: "**",
		redirectTo: "overview",
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
