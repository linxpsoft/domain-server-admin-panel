import { Component, OnDestroy, OnInit } from "@angular/core";
import {
	AbstractControl,
	FormGroup,
	FormControl,
	FormArray,
	NgControlStatus,
} from "@angular/forms";
import { Subscription } from "rxjs";
import { AbstractPermission, UserPermissions } from "../roles.service";
import { SettingsService } from "../settings.service";

@Component({
	selector: "app-permissions",
	templateUrl: "./permissions.component.html",
	styleUrls: ["./permissions.component.scss"],
})
export class PermissionsComponent implements OnInit, OnDestroy {
	subs: Subscription[] = [];

	abstractPermissionKeys: string[] = [];

	form: FormGroup;
	users: { user: UserPermissions; controls: FormControl[] }[] = [];

	constructor(private readonly settingsService: SettingsService) {
		this.abstractPermissionKeys = Object.keys(AbstractPermission);
	}

	ngOnInit() {
		this.subs.push(
			this.settingsService.settings$.subscribe(settings => {
				this.users = [];
				this.form = new FormGroup({});

				for (const userPermission of settings.security.permissions) {
					const user = new UserPermissions(userPermission);
					const controls = user.toFormControls();

					this.form.addControl(
						user.username,
						new FormGroup(
							controls.reduce((obj, _) => {
								obj[_.key] = _.control;
								return obj;
							}, {}),
						),
					);

					this.users.push({
						user,
						controls: controls.map(_ => _.control),
					});
				}

				this.users.sort(
					(a, b) =>
						b.user.permissions.length - a.user.permissions.length,
				);

				this.form.valueChanges.subscribe(test => {
					this.form.pending;
					console.log(this.form.value.Caitlyn);
				});
			}),
		);
	}

	ngOnDestroy() {
		for (const sub of this.subs) {
			sub.unsubscribe();
		}
	}
}
