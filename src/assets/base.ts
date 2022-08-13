/**
 * This is complete user-script template, doesn't including:
 * - user-script header
 */

import picomatch from 'picomatch';

export interface IUserScript {
  matches: string[],
  fx: () => void
}

(async () => {
	const scripts: IUserScript[] = [/* __composer_positioner__scripts */];

	// Use allSettled to run fast as possible
	await Promise.allSettled(
		scripts.map(script => (async () => {
			for (const pattern of script.matches) {
				if (picomatch(pattern)(document.location.href)) {
					script.fx();

					break;
				}
			}
		})),
	);
})();
