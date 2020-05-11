import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable, Subscription, zip } from "rxjs";
import { delay, mergeMap, take } from "rxjs/operators";
import { AutomaticNetworking } from "../models/settings.model";
import { SettingsService } from "../settings.service";

@Component({
	selector: "app-networking",
	templateUrl: "./networking.component.html",
	styleUrls: ["./networking.component.scss"],
})
export class NetworkingComponent implements OnInit, OnDestroy {
	private subs: Subscription[] = [];

	loading = true;

	externalAddressLoading = false;

	externalAddressForm = new FormGroup({
		type: new FormControl(null, [Validators.required]),
		address: new FormControl(null),
		port: new FormControl(null, [Validators.min(0), Validators.max(65535)]),
	});

	onExternalAddressType(event: { index: number }) {
		const { index } = event;
		const control = this.externalAddressForm.controls.type;
		if (control.value == index) return;

		this.externalAddressForm.controls.type.setValue(event.index);
		this.externalAddressForm.markAsDirty();
	}

	onExternalAddressSubmit() {
		if (this.externalAddressForm.invalid) return;
		const value = this.externalAddressForm.value;

		// update domain
		const automatic_networking = Object.keys(AutomaticNetworking)[
			value.type
		] as AutomaticNetworking;
		const network_address = value.address;
		const network_port = value.port;

		const observables: Observable<any>[] = [
			this.settingsService.updateSettings({
				metaverse: {
					automatic_networking,
				},
			}),
		];

		observables.push(
			this.settingsService.updateDomain(
				automatic_networking == "ip"
					? {
							network_port,
					  }
					: {
							network_address,
							network_port,
					  },
			),
		);

		this.externalAddressLoading = true;
		this.externalAddressForm.disable();

		zip(...observables)
			.pipe(
				delay(2000),
				mergeMap(() => {
					this.settingsService.refreshDomain();
					return this.settingsService.domain$.pipe(take(1));
				}),
			)
			.subscribe(() => {
				this.externalAddressLoading = false;
				this.externalAddressForm.enable();
				this.externalAddressForm.markAsPristine();
			});
	}

	internalPortLoading = false;

	internalPortForm = new FormGroup({
		port: new FormControl(null),
	});

	onInternalPortForm() {
		if (this.internalPortForm.invalid) return;

		const local_port = this.internalPortForm.value.port;

		this.internalPortLoading = true;
		this.internalPortForm.disable();

		this.settingsService
			.updateSettings({
				metaverse: {
					local_port,
				},
			})
			.subscribe(() => {
				this.internalPortLoading = false;
				this.internalPortForm.enable();
				this.internalPortForm.markAsPristine();
			});
	}

	constructor(private readonly settingsService: SettingsService) {}

	ngOnInit(): void {
		this.subs.push(
			this.settingsService.domain$.subscribe(domain => {
				console.log(domain);
				this.externalAddressForm.controls.address.setValue(
					domain.networkAddress,
				);
				this.externalAddressForm.controls.port.setValue(
					domain.networkPort,
				);
			}),
			this.settingsService.settings$.subscribe(settings => {
				this.externalAddressForm.controls.type.setValue(
					Object.keys(AutomaticNetworking).indexOf(
						settings.metaverse.automatic_networking,
					),
				);

				this.internalPortForm.controls.port.setValue(
					settings.metaverse.local_port,
				);
			}),
			zip(this.settingsService.domain$, this.settingsService.settings$)
				.pipe(take(1))
				.subscribe(() => {
					this.loading = false;
				}),
		);
	}

	ngOnDestroy() {
		for (const sub of this.subs) {
			sub.unsubscribe();
		}
	}
}
