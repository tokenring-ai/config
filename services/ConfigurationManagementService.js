import { Service } from '@token-ring/registry';
import { create } from 'zustand';
import EventEmitter from 'events';

const defaultConfig = {
  defaults: {
    model: 'default-model',
    persona: 'code',
    tools: [],
    resources: [],
    selectedFiles: [],
  },
  models: {},
  personas: {
    "code": {
      instructions: "You are an expert developer assistant...",
      model: "auto:speed>=4,intelligence>=3",
    }
  },
  resources: {},
  // other potential top-level config keys:
  // indexedFiles: [],
  // watchedFiles: [],
  // zoho: {},
};

export class ConfigurationManagementService extends Service {
  name = 'ConfigurationManagementService';
  description = 'Manages application configuration using a Zustand store.';
  _events = new EventEmitter();
  store = null;

  constructor(initialConfig = {}) {
    super();
    const mergedConfig = {
      ...defaultConfig,
      ...initialConfig,
      defaults: { ...defaultConfig.defaults, ...initialConfig.defaults },
      models: { ...defaultConfig.models, ...initialConfig.models },
      personas: { ...defaultConfig.personas, ...initialConfig.personas },
      resources: { ...defaultConfig.resources, ...initialConfig.resources },
    };

    this.store = create((set, get) => ({
      config: mergedConfig,
      getConfiguration: () => get().config,
      getConfigurationValue: (keyPath) => {
        const keys = keyPath.split('.');
        let value = get().config;
        for (const key of keys) {
          if (value && typeof value === 'object' && key in value) {
            value = value[key];
          } else {
            return undefined;
          }
        }
        return value;
      },
      setConfigurationValue: (keyPath, value) => {
        set(state => {
          const keys = keyPath.split('.');
          let current = state.config;
          for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]] || typeof current[keys[i]] !== 'object') {
              current[keys[i]] = {}; // Create nested objects if they don't exist
            }
            current = current[keys[i]];
          }
          current[keys[keys.length - 1]] = value;
          return { config: { ...state.config } };
        });
        this._events.emit('configChanged', get().config);
      },
      updateConfiguration: (newConfig) => {
        set(state => ({
          config: { ...state.config, ...newConfig }
        }));
        this._events.emit('configChanged', get().config);
      }
    }));
  }

  // Methods to be called from outside the store
  getConfiguration() {
    return this.store.getState().getConfiguration();
  }

  getConfigurationValue(keyPath) {
    return this.store.getState().getConfigurationValue(keyPath);
  }

  setConfigurationValue(keyPath, value) {
    this.store.getState().setConfigurationValue(keyPath, value);
  }

  updateConfiguration(newConfig) {
    this.store.getState().updateConfiguration(newConfig);
  }

  getStore() {
    return this.store;
  }

  // Event emitter methods
  on(eventName, listener) {
    this._events.on(eventName, listener);
  }

  off(eventName, listener) {
    this._events.off(eventName, listener);
  }

  emit(eventName, ...args) {
    this._events.emit(eventName, ...args);
  }
}

export default ConfigurationManagementService;
