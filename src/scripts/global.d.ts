type Theme = {
	template_directory_uri: string;
	base_url: string;
	home_url: string;
	api_url: string;
	text_domain: string;
};

declare global {
	interface Window {
		theme: Theme;
	}
}

export {};
