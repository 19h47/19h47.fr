declare module '@barba/core' {
	type HookData = {
		trigger?: unknown;
		current: { container: HTMLElement; namespace?: string };
		next: { container: HTMLElement; namespace?: string };
	};

	type HookCallback = (data: HookData) => void | Promise<void>;

	type Barba = {
		use: (plugin: unknown) => void;
		hooks: {
			before: (cb: HookCallback) => void;
			beforeEnter: (cb: HookCallback) => void;
			afterEnter: (cb: HookCallback) => void;
			once: (cb: HookCallback) => void;
		};
		init: (options: {
			views?: unknown[];
			transitions?: unknown[];
		}) => void;
	};

	const barba: Barba;
	export default barba;
}

declare module '@barba/prefetch' {
	const prefetch: unknown;
	export default prefetch;
}
