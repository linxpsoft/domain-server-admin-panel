import { MdcTextField } from "@angular-mdc/web";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
	AbstractControl,
	FormControl,
	FormGroup,
	ValidatorFn,
	Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import {
	ConnectPermission,
	FullPermission,
	NoPermission,
	StandardPermission,
	UserPermission,
} from "../models/settings.model";
import { SettingsService } from "../settings.service";
import { take } from "rxjs/operators";

@Component({
	selector: "app-wizard",
	templateUrl: "./wizard.component.html",
	styleUrls: ["./wizard.component.scss"],
})
export class WizardComponent implements OnInit {
	private readonly jwt = new JwtHelperService();

	@ViewChild("accessTokenStep")
	private readonly accessTokenStepRef: ElementRef;

	constructor(
		private readonly settingsService: SettingsService,
		private readonly router: Router,
	) {}

	closeStep(el: HTMLElement) {
		el.style.opacity = "0";
		setTimeout(() => {
			el.style.display = "none";
		}, 200);
	}

	private accessTokenValidator: ValidatorFn = (control: AbstractControl) => {
		try {
			// domain tokens can't expire but they can still be invalid
			// if (this.jwt.isTokenExpired(control.value))
			// return { expired: true };

			const { id } = this.jwt.decodeToken(control.value);
			if (id == null) return { invalid: true };

			return null;
		} catch (err) {
			return { invalid: true };
		}
	};

	accessTokenForm = new FormGroup({
		accessToken: new FormControl("", [
			Validators.required,
			this.accessTokenValidator,
		]),
	});

	permissionsForm = new FormGroup({
		public: new FormControl(false),
	});

	admins: string[] = [];

	addAdmin(input: MdcTextField, event?: KeyboardEvent) {
		if (event && event.code != "Enter") return;

		const username = input.value;

		if (
			this.admins.some(
				queryUsername =>
					queryUsername.toLowerCase() == username.toLowerCase(),
			) == false
		)
			this.admins.push(username);

		input.value = "";
	}

	loading = false;

	onComplete() {
		const { accessToken } = this.accessTokenForm.value;
		const { id: domainId } = this.jwt.decodeToken(accessToken);
		const isPublic: boolean = this.permissionsForm.value.public;

		const permissions: UserPermission[] = this.admins.map(username => ({
			...FullPermission,
			permissions_id: username,
		}));

		let standard_permissions: StandardPermission[] = [
			{
				...NoPermission,
				permissions_id: "anonymous",
			},
			{
				...FullPermission,
				permissions_id: "localhost",
			},
		];

		if (isPublic)
			standard_permissions.push({
				...ConnectPermission,
				permissions_id: "logged-in",
			});

		this.loading = true;
		this.settingsService
			.updateSettings({
				metaverse: {
					access_token: accessToken,
					id: domainId,
				},
				security: {
					permissions,
					standard_permissions,
				},
				wizard: {
					completed_once: true,
				},
			})
			.subscribe(() => {});
	}

	ngOnInit(): void {
		this.accessTokenForm.statusChanges.subscribe(result => {
			if (result == "INVALID") return;
			if (this.accessTokenForm.invalid) return;

			this.closeStep(this.accessTokenStepRef.nativeElement);
		});

		const sub = this.settingsService.settings$.subscribe(settings => {
			if (settings.wizard.completed_once) {
				this.router.navigate(["overview"]);
				sub.unsubscribe();
			}
		});
	}
}
