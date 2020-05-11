import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ReplaySubject } from "rxjs";
import { filter, map, mergeMap, tap, take } from "rxjs/operators";
import { Assignments } from "./models/assignments.model";
import { Node, Nodes } from "./models/nodes.model";
import { Settings } from "./models/settings.model";
import { MdcSnackbar } from "@angular-mdc/web";

type VeryPartial<T> = {
	[P in keyof T]?: Partial<T[P]>;
};

export interface Domain {
	id: string;
	label: string;
	username: string;
	description: string;
	restriction: "acl" | "hifi";
	online: boolean;
	numUsers: number;
	likes: number;
	liked: boolean;
	networkAddress: string;
	networkPort: number;
	path: string;
}

export interface UpdateDomain {
	id: string;
	ice_server_address: string;
	cloud_domain: boolean;
	network_address: string;
	network_port: number;
	online: boolean;
	default_place_name: string;
	owner_places: string[];
	label: string;
	description: string;
	capacity: number;
	restriction: "acl" | "hifi";
	maturity: string;
	hosts: string[];
	tags: string[];
	version: string;
	protocol: string;
	online_users: number;
	online_anonymous_users: null;
}

@Injectable({
	providedIn: "root",
})
export class SettingsService {
	private readonly domainUrl = "http://127.0.0.1:40100";
	private metaverseUrl = null;

	settings$ = new ReplaySubject<Settings>();
	domain$ = new ReplaySubject<Domain>();
	nodes$ = new ReplaySubject<Nodes>();
	assignments$ = new ReplaySubject<Assignments>();

	refreshSettings() {
		this.http
			.get<{ values: Settings }>(this.domainUrl + "/settings.json")
			.pipe(map(res => res.values))
			.subscribe(settings => {
				this.settings$.next(settings);
			});
	}

	refreshDomain() {
		this.http
			.get<Domain>(this.domainUrl + "/api/domain")
			.subscribe(domain => {
				this.domain$.next(domain);
			});
	}

	refreshNodes() {
		this.http
			.get<{ nodes: Nodes }>(this.domainUrl + "/nodes.json")
			.pipe(map(res => res.nodes))
			.subscribe(nodes => {
				this.nodes$.next(nodes);
			});
	}

	refreshAssignments() {
		this.http
			.get<Assignments>(this.domainUrl + "/assignments.json")
			.subscribe(assignments => {
				this.assignments$.next(assignments);
			});
	}

	public$ = this.settings$.pipe(
		map(settings => settings.security.standard_permissions),
		map(perms => {
			const perm = perms.find(perm => perm.permissions_id == "logged-in");
			return perm == null ? false : perm.id_can_connect;
		}),
	);

	constructor(
		private readonly http: HttpClient,
		private readonly snackbar: MdcSnackbar,
	) {
		this.http
			.get<{ metaverse_url: string }>(
				this.domainUrl + "/api/metaverse_info",
			)
			.pipe(map(res => res.metaverse_url))
			.subscribe(metaverseUrl => {
				this.metaverseUrl = metaverseUrl;

				this.refreshSettings();
				this.refreshDomain();
			});
	}

	successSnackbar(success: boolean) {
		this.snackbar.open(
			success
				? "Successfully updated settings"
				: "Failed to update settings",
			" ",
			{
				trailing: true,
				dismiss: true,
				classes: success ? "" : "snackbar-fail",
			},
		);
	}

	updateSettings(settings: VeryPartial<Settings>) {
		return this.http
			.post<{ status: "success" }>(
				this.domainUrl + "/settings.json",
				settings,
			)
			.pipe(
				map(res => res.status == "success"),
				mergeMap(() => {
					this.refreshSettings();
					return this.settings$.pipe(take(1));
				}),
				// tap(this.successSnackbar),
			);
	}

	updateDomain(settings: VeryPartial<UpdateDomain>) {
		const params = new URLSearchParams();
		for (const key of Object.keys(settings)) {
			params.set(key, settings[key]);
		}

		return this.http
			.put<{ status: "success"; domain: UpdateDomain }>(
				this.domainUrl + "/api/domain",
				params.toString(),
				{
					headers: new HttpHeaders().set(
						"Content-Type",
						"application/x-www-form-urlencoded; charset=UTF-8",
					),
				},
			)
			.pipe(
				// tap(res => this.successSnackbar(res.status == "success")),
				filter(res => res.status == "success"),
				// map(res => res.domain),
				// tap(domain => {
				// 	this.domain$.next(domain);
				// }),
				mergeMap(() => {
					this.refreshDomain();
					return this.domain$.pipe(take(1));
				}),
			);
	}

	killNode(node: Node) {
		return this.http.delete(this.domainUrl + "/nodes/" + node.uuid).pipe(
			tap(() => {
				this.refreshNodes();
				this.refreshAssignments();
			}),
		);
	}
}
