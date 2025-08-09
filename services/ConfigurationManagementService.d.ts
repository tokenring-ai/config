export class ConfigurationManagementService extends Service {
	constructor(initialConfig?: {});
	_events: any;
	store: any;
	getConfiguration(): any;
	getConfigurationValue(keyPath: any): any;
	setConfigurationValue(keyPath: any, value: any): void;
	updateConfiguration(newConfig: any): void;
	getStore(): any;
	on(eventName: any, listener: any): void;
	off(eventName: any, listener: any): void;
	emit(eventName: any, ...args: any[]): void;
}
export default ConfigurationManagementService;
import { Service } from "@token-ring/registry";
