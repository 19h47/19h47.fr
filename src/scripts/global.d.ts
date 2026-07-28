type Theme = {
	template_directory_uri: string;
	base_url: string;
	home_url: string;
	ajax_url: string;
	nonce: string;
	api_url: string;
	text_domain: string;
};

type AppInstance = {
	disableScroll(): void;
	enableScroll(position?: number | boolean): void;
	resetScroll(positionX?: number | string, positionY?: number | string): void;
	addState(state: string): void;
	removeState(state: string): Promise<void>;
};

declare global {
	interface Window {
		app: AppInstance;
		theme: Theme;
	}
}

export {};
