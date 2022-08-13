/**
 * This is complete user-script template, doesn't including:
 * - user-script header
 */
export interface IUserScript {
  matches: RegExp[],
  fx: () => void
}

(async () => {
	const scripts: IUserScript[] = [
		// @ts-expect-error
		'__composer_positioner__scripts',
	];

	// Use allSettled to run fast as possible
	await Promise.allSettled(
		scripts.map(async script => {
			for (const pattern of script.matches) {
				if (pattern.test(document.location.href)) {
					script.fx();

					break;
				}
			}
		}),
	);
})();
