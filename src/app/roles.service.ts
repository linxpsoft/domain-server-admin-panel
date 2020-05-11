import { Injectable } from "@angular/core";
import { UserPermission } from "./models/settings.model";
import { FormGroup, FormControl, FormArray } from "@angular/forms";

export enum AbstractPermission {
	connect = "connect",
	connectWhenFull = "connectWhenFull",
	kick = "kick",
	create = "create",
	createTemp = "createTemp",
	adjustLocks = "adjustLocks",
	privateUserData = "privateUserData",
}

const abstractPermissionMap: Record<
	keyof UserPermission,
	AbstractPermission
> = {
	id_can_adjust_locks: AbstractPermission.adjustLocks,
	id_can_connect: AbstractPermission.connect,
	id_can_connect_past_max_capacity: AbstractPermission.connectWhenFull,
	id_can_get_and_set_private_user_data: AbstractPermission.privateUserData,
	id_can_kick: AbstractPermission.kick,
	id_can_rez: AbstractPermission.create,
	id_can_rez_tmp: AbstractPermission.createTemp,
	// to be deleted
	id_can_rez_certified: AbstractPermission.create,
	id_can_rez_tmp_certified: AbstractPermission.createTemp,
	id_can_replace_content: AbstractPermission.create, // atp
	id_can_write_to_asset_server: AbstractPermission.create, // atp
	// not a permission
	permissions_id: null,
};

export class UserPermissions {
	username: string;
	permissions: AbstractPermission[] = [];

	isAdmin = false;
	isCreator = false;
	// isModerator = false;
	isBanned = false;

	recalculate() {
		this.isAdmin =
			this.permissions.length >= Object.keys(AbstractPermission).length;

		this.isCreator = this.isAdmin
			? false
			: this.permissions.includes(AbstractPermission.create) ||
			  this.permissions.includes(AbstractPermission.createTemp);

		// this.isModerator = this.isAdmin
		// 	? false
		// 	: this.permissions.includes(AbstractPermission.kick);

		this.isBanned = this.permissions.length == 0;
	}

	import(userPermission: UserPermission, overwrite = false) {
		if (overwrite) this.permissions = [];

		this.username = userPermission.permissions_id;

		for (const [key, enabled] of Object.entries(userPermission)) {
			if (!enabled) continue;

			const abstractPermission = abstractPermissionMap[key];
			if (abstractPermission == null) continue;

			if (this.permissions.includes(abstractPermission)) continue;
			this.permissions.push(abstractPermission);
		}

		this.recalculate();
	}

	constructor(userPermission: UserPermission) {
		this.import(userPermission);
	}

	toFormControls() {
		const controls: { key: string; control: FormControl }[] = [];

		for (const key of Object.keys(AbstractPermission)) {
			const control = new FormControl(
				this.permissions.includes(key as any),
			);

			control.valueChanges.subscribe(() => {
				const enabled = control.value;

				if (this.permissions.includes(key as any) && !enabled) {
					this.permissions.splice(
						this.permissions.indexOf(key as any),
						1,
					);
				} else if (!this.permissions.includes(key as any) && enabled) {
					this.permissions.push(key as any);
				}

				this.recalculate();
			});

			controls.push({
				key,
				control,
			});
		}

		return controls;
	}

	export(): UserPermission {
		const userPermission: UserPermission = {} as any;

		for (const [key, abstractPermission] of Object.entries(
			abstractPermissionMap,
		)) {
			userPermission[key] = this.permissions.includes(abstractPermission);
		}
		userPermission.permissions_id = this.username;

		return userPermission;
	}
}

@Injectable({
	providedIn: "root",
})
export class RolesService {
	constructor() {}
}
