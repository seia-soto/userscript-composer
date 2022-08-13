export enum EUserScriptHeaderTokens {
  /* eslint-disable no-unused-vars */
  START = '// ==UserScript==',
  END = '// ==/UserScript=='
  /* eslint-enable no-unused-vars */
}

/**
 * Get head from user-script
 * @param source The user-script source
 * @returns The text only including user-script header
 */
export const head = async (source: string) => {
	const range = [
		source.indexOf(EUserScriptHeaderTokens.START),
		source.indexOf(EUserScriptHeaderTokens.END),
	] as const;

	if (range.indexOf(-1) >= 0) {
		throw new Error('Unexpected user-script header definition: ' + range.join(', '));
	}

	return source.slice(range[0], range[1] + EUserScriptHeaderTokens.END.length);
};

export interface IUserScriptHeaderHints extends Record<string, string | string[]> {
  // eslint-disable-next-line no-undef
  encoding: BufferEncoding,
  name: string,
  description: string,
  author: string,
  version: string,
  grant: string,
  'run-at': string,
  match: string,
  namespace: string,
  homepageURL: string,
  supportURL: string,
  updateURL: string,
  downloadURL: string
}

export type TUserScriptHeader = Partial<IUserScriptHeaderHints>

export const parse = (header: string) => {
	const config: TUserScriptHeader = {};
	const lines = header.split('\n');

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const prefix = line.indexOf('@');

		if (prefix < 0) {
			continue;
		}

		const suffix = line.indexOf(' ', prefix);

		const key = line.slice(prefix + 1, suffix - 1);
		let value = line.slice(suffix + 1).trim();

		if (!key) {
			continue;
		}

		if (suffix < 0) {
			value = '';
		}

		if (config[key]) {
			if (Array.isArray(config[key])) {
				(config[key] as string[]).push(value);
			} else {
				config[key] = [(config[key] as string), value];
			}

			continue;
		}

		config[key] = value;
	}

	return config;
};

export const stringify = (config: TUserScriptHeader) => {
	const keys = Object.keys(config);
	const result: (readonly [string, string])[] = [];

	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		const value = config[key] as string | string[];

		if (Array.isArray(value)) {
			for (const v of value) {
				result.push([key, v]);
			}
		} else {
			result.push([key, value]);
		}
	}

	return [
		EUserScriptHeaderTokens.START,
		result
			.map(entry => '// @' + entry[0] + ' ' + entry[1])
			.join('\n'),
		EUserScriptHeaderTokens.END,
	]
		.join('\n');
};
