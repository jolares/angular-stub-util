// tslint:disable
import 'jest';


/*
 * This Type allows the Stub and the target object keep signature type discrepancies
 * without raising linting errors, while still allowing the Stub to extend the target object.
 */
export type Stub<T> = { [P in keyof T]: T[P] extends (...args: infer U) => infer R ? jest.Mock<R, U> : T[P] } & T;

/*
 * the web browser's Window properties supported by Stub.
 */
export enum WindowProperty {
  SessionStorage = 'sessionStorage',
  LocalStorage = 'localStorage',
  Navigator = 'navigator',
}

/**
 * Creates a stub of the target object and mocks its attributes.
 * @param { T } target the object to be stubbed.
 * @param { { [ attribute: string ]: any } } initialValues the properties to be initialized in the stub.
 */
export function Stub<T>(target: T | WindowProperty, initialValues?: { [attribute: string]: any }) {
  if (!target) {
    return;
  }
  // handles Window properties.
  if (Object.values(WindowProperty).includes(target as WindowProperty)) {
    stubWindowProperty.call(this, target as WindowProperty, initialValues);
    return;
  }
  // handles all other objects.
  setStubMethods.call(this, target);
  setStubAttributes.call(this, initialValues);
}

/**
 * Declares the Stub's methods as bare spies.
 * @param { ObjectConstructor } object the stubbed object.
 */
function setStubMethods(object: ObjectConstructor) {
  if (!object) {
    return;
  }

  // handles objects without prototype chain.
  if (!object.prototype) {
    Object.keys(object).forEach((key: string) => {
      if (typeof object[key] === 'function') {
        this[key] = jest.fn();
      }
    });
    return;
  }

  // handles objects with prototype chain.
  Object.getOwnPropertyNames(object.prototype).forEach((methodName: string) => (this[methodName] = jest.fn()));
}

/**
 * Initializes the stub attributes with the provided values.
 * @param { { [ attribute: string ]: any } } initValues the properties to be initialized in the parent object.
 */
function setStubAttributes(initValues: { [attribute: string]: any }) {
  if (!initValues) {
    return;
  }

  Object.keys(initValues).forEach((attribute: string) => (this[attribute] = initValues[attribute]));
}

/**
 * Stubs the Window property methods.
 * @param { WindowProperty} property the Window Object property to stub.
 * @param initValues the values to initialize the Stub Window object's property.
 */
function stubWindowProperty(property: WindowProperty, initValues = {}) {
  if (!property) {
    return;
  }

  if (property === WindowProperty.Navigator) {
    Object.keys(initValues).forEach((key: string) => {
      jest.spyOn(window.navigator, key as any, 'get').mockReturnValue(initValues[key]);
    });
    return;
  }

  if (property === WindowProperty.LocalStorage || property === WindowProperty.SessionStorage) {
    this.items = { ...initValues };
    Object.defineProperty(window, property, {
      configurable: true,
      writable: true,
      value: {
        setItem: jest.fn().mockImplementation((item: string, value: string) => {
          this.items = { ...this.items, [item]: value };
        }),
        getItem: jest.fn().mockImplementation((item: string) => this.items[item]),
        removeItem: jest.fn().mockImplementation((item: string) => delete this.items[item]),
        clear: jest.fn().mockImplementation(() => this.items = {})
      }
    });
    return;
  }
}