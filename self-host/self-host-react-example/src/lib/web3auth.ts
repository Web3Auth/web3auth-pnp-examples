import ThresholdKey from '@tkey/default';
import WebStorageModule from '@tkey/web-storage';
import SecurityQuestionsModule from '@tkey/security-questions';

// Configuration of Service Provider
const customAuthArgs = {
	baseUrl: `${window.location.origin}/serviceworker`,
	network: 'cyan',
};
// Configuration of Modules
const webStorageModule = new WebStorageModule(); // For 2/2
const securityQuestionsModule = new SecurityQuestionsModule(); // For 2/3

// Instantiation of tKey
export const tKey = new ThresholdKey({
	modules: {
		webStorage: webStorageModule,
		securityQuestions: securityQuestionsModule,
	},
	customAuthArgs: customAuthArgs as any,
});