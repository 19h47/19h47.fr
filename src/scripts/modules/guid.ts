/**
 * Toggle layout guides with Cmd/Ctrl+;
 */
export default function guid() {
	document.addEventListener('keydown', (e: KeyboardEvent) => {
		if (!(e.metaKey || e.ctrlKey) || e.key !== ';') {
			return;
		}

		document.querySelector('.Guid')?.classList.toggle('hidden');
	});
}
