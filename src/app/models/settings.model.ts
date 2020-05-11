export interface AssetServer {
	assets_filesize_limit: number;
	assets_path: string;
	enabled: boolean;
}

export interface AudioBuffer {
	dynamic_jitter_buffer: boolean;
	max_frames_over_desired: string;
	repetition_with_fade: string;
	static_desired_jitter_buffer_frames: string;
	use_stdev_for_desired_calc: string;
	window_seconds_for_desired_calc_on_too_many_starves: string;
	window_seconds_for_desired_reduction: string;
	window_starve_threshold: string;
}

export interface AudioEnv {
	codec_preference_order: string;
	enable_filter: boolean;
	noise_muting_threshold: string;
}

export interface AudioThreading {
	auto_threads: boolean;
	num_threads: string;
	throttle_backoff: number;
	throttle_start: number;
}

export interface BackupRule {
	Name: string;
	backupInterval: number;
	maxBackupVersions: number;
}

export interface AutomaticContentArchives {
	backup_rules: BackupRule[];
}

export interface AvatarMixer {
	auto_threads: boolean;
	connection_rate: string;
	max_node_send_bandwidth: number;
	num_threads: string;
	priority_fraction: string;
}

export interface Avatars {
	avatar_whitelist: string;
	max_avatar_height: number;
	min_avatar_height: number;
	replacement_avatar: string;
}

export interface Broadcasting {
	downstream_servers: string;
	upstream_servers: string;
	users: string;
}

export interface Descriptors {
	description: string;
	hosts: string;
	maturity: string;
	tags: string;
}

export interface EntityScriptServer {
	entity_pps_per_script: number;
	max_total_entity_pps: number;
}

export interface EntityServerSettings {
	NoBackup: boolean;
	NoPersist: boolean;
	backupDirectoryPath: string;
	clockSkew: string;
	debugReceiving: boolean;
	debugSending: boolean;
	debugTimestampNow: boolean;
	dynamicDomainVerificationTimeMax: string;
	dynamicDomainVerificationTimeMin: string;
	entityScriptSourceWhitelist: string;
	maxTmpLifetime: string;
	persistFileDownload: boolean;
	persistFilePath: string;
	persistInterval: string;
	statusHost: string;
	statusPort: string;
	verboseDebug: boolean;
	wantEditLogging: boolean;
	wantTerseEditLogging: boolean;
}

export enum AutomaticNetworking {
	full = "full",
	ip = "ip",
	disabled = "disabled",
}

export interface Metaverse {
	access_token: string;
	automatic_networking: AutomaticNetworking;
	enable_packet_verification: boolean;
	id: string;
	local_port: string;
}

export interface Oauth {
	"admin-roles": string;
	"admin-users": string;
	cert: string;
	"cert-fingerprint": string;
	"client-id": string;
	enable: boolean;
	hostname: string;
	key: string;
	provider: string;
}

export interface BasePermission {
	id_can_adjust_locks: boolean;
	id_can_connect: boolean;
	id_can_connect_past_max_capacity: boolean;
	id_can_get_and_set_private_user_data: boolean;
	id_can_kick: boolean;
	id_can_replace_content: boolean;
	id_can_rez: boolean;
	id_can_rez_certified: boolean;
	id_can_rez_tmp: boolean;
	id_can_rez_tmp_certified: boolean;
	id_can_write_to_asset_server: boolean; // to be deleted
}

export const NoPermission: BasePermission = {
	id_can_adjust_locks: false,
	id_can_connect: false,
	id_can_connect_past_max_capacity: false,
	id_can_get_and_set_private_user_data: false,
	id_can_kick: false,
	id_can_replace_content: false,
	id_can_rez: false,
	id_can_rez_certified: false,
	id_can_rez_tmp: false,
	id_can_rez_tmp_certified: false,
	id_can_write_to_asset_server: false, // to be deleted
};

export const FullPermission: BasePermission = {
	id_can_adjust_locks: true,
	id_can_connect: true,
	id_can_connect_past_max_capacity: true,
	id_can_get_and_set_private_user_data: true,
	id_can_kick: true,
	id_can_replace_content: true,
	id_can_rez: true,
	id_can_rez_certified: true,
	id_can_rez_tmp: true,
	id_can_rez_tmp_certified: true,
	id_can_write_to_asset_server: true, // to be deleted
};

export const ConnectPermission: BasePermission = {
	id_can_adjust_locks: false,
	id_can_connect: true,
	id_can_connect_past_max_capacity: false,
	id_can_get_and_set_private_user_data: false,
	id_can_kick: false,
	id_can_replace_content: false,
	id_can_rez: false,
	id_can_rez_certified: false,
	id_can_rez_tmp: false,
	id_can_rez_tmp_certified: false,
	id_can_write_to_asset_server: false, // to be deleted
};

export const CreatePermission: BasePermission = {
	id_can_adjust_locks: true,
	id_can_connect: true,
	id_can_connect_past_max_capacity: false,
	id_can_get_and_set_private_user_data: false,
	id_can_kick: false,
	id_can_replace_content: true,
	id_can_rez: true,
	id_can_rez_certified: true,
	id_can_rez_tmp: true,
	id_can_rez_tmp_certified: true,
	id_can_write_to_asset_server: true, // to be deleted
};

export interface UserPermission extends BasePermission {
	permissions_id: string; // username
}

export interface StandardPermission extends BasePermission {
	permissions_id: "anonymous" | "friends" | "localhost" | "logged-in";
}

export interface Security {
	ac_subnet_whitelist: string;
	group_forbiddens: string;
	group_permissions: string;
	http_username: string;
	ip_permissions: string;
	mac_permissions: string;
	machine_fingerprint_permissions: string;
	maximum_user_capacity: string;
	maximum_user_capacity_redirect_location: string;
	multi_kick_logged_in: boolean;
	permissions: UserPermission[];
	standard_permissions: StandardPermission[];
}

export interface Wizard {
	cloud_domain: boolean;
	completed_once: boolean;
	steps_completed: number;
}

export interface Settings {
	asset_server: AssetServer;
	audio_buffer: AudioBuffer;
	audio_env: AudioEnv;
	audio_threading: AudioThreading;
	automatic_content_archives: AutomaticContentArchives;
	avatar_mixer: AvatarMixer;
	avatars: Avatars;
	broadcasting: Broadcasting;
	descriptors: Descriptors;
	entity_script_server: EntityScriptServer;
	entity_server_settings: EntityServerSettings;
	metaverse: Metaverse;
	oauth: Oauth;
	security: Security;
	wizard: Wizard;
}
