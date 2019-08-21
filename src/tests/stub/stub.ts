import { Type } from '@angular/core';
import 'jest';


export type Stub<T> = { [P in keyof T]: any } & T;

/**
 * Creates a stub object.
 * @param { Type<T> | Object } object the class to be stubbed.
 * @param { { [ attribute: string ]: any } } initialValues the class properties to be initialized in the stub.
 */
export function Stub<T>(object: Type<T> | Object, initialValues?: { [ attribute: string ]: any }) {
  setStubMethods.call(this, object);
  setStubAttributes.call(this, initialValues);
}

/**
 * Sets an object's methods as unimplemented jest spies.
 * @param { ObjectConstructor } object the parent object.
 */
function setStubMethods(object: ObjectConstructor) {
  if (!(object && object.prototype)) {
    return;
  }

  Object.getOwnPropertyNames(object.prototype).forEach(method => this[method] = jest.fn());
}

/**
 * Initializes the provided properties in a parent object.
 * @param { { [ attribute: string ]: any } } initialValues the properties to be initialized in the parent object.
 */
function setStubAttributes(initialValues: { [ attribute: string ]: any }) {
  if (!initialValues) {
    return;
  }

  Object.keys(initialValues).forEach(attribute => this[attribute] = initialValues[attribute]);
}

export function stubWindowStorage(property: 'sessionStorage' | 'localStorage', values = {}) {
  Object.defineProperty(window, property, {
      configurable: true,
      writable: true,
      value: {
        setItem: jest.fn(),
        getItem: jest.fn(),
        removeItem: jest.fn(),
      }
  });

  Object.keys(values).forEach(key => {
    const value = values[key];
    window[property][key] = jest.fn().mockReturnValue(value);
  })
}

export function stubWindowNavigator(key: string, value: string) {
  jest.spyOn(global['navigator'], key, 'get').mockReturnValue(value);
}
