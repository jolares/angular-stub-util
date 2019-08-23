import 'jest';

/*
 * Providing this type allows the stub and the target object keep signature type discrepancies
 * without raising linting erros, while still allowing the stub to extend the target object's type.
 */
export type Stub<T> = { [Property in keyof T]: any } & T;

/**
 * Creates a stub of the target object and mocks its attributes.
 * @param { T } target the class to be stubbed.
 * @param { { [ attribute: string ]: any } } initialValues the class properties to be initialized in the stub.
 */
export function Stub<T>(target: T, initialValues?: { [ attribute: string ]: any }) {
  setStubMethods.call(this, target);
  setStubAttributes.call(this, initialValues);
}

/**
 * Declares the stub's methods as bare spies.
 * @param { ObjectConstructor } object the stubbed object.
 */
function setStubMethods(object: ObjectConstructor) {
  if (!object) {
    return;
  }

  // handles objects without prototype chain.
  if (!object.prototype) {
    Object.keys(object)
      .forEach((key: string) => {
        if (typeof object[key] === 'function') {
          this[key] = jest.fn();
        }
      });
    return
  }

  // handles objects with prototype chain.
  Object.getOwnPropertyNames(object.prototype)
    .forEach((methodName: string) => this[methodName] = jest.fn());
}

/**
 * Initializes the stub attributes with the provided values.
 * @param { { [ attribute: string ]: any } } initValues the properties to be initialized in the parent object.
 */
function setStubAttributes(initValues: { [ attribute: string ]: any }) {
  if (!initValues) {
    return;
  }

  Object.keys(initValues)
    .forEach((attribute: string) => this[attribute] = initValues[attribute]);
}

export function stubWindowStorage(property: 'sessionStorage' | 'localStorage', values = {}) {
  if (!property) {
    return;
  }

  Object.defineProperty(window, property, {
      configurable: true,
      writable: true,
      value: {
        setItem: jest.fn(),
        getItem: jest.fn(),
        removeItem: jest.fn(),
      }
  });

  Object.keys(values)
    .forEach((key: string) => {
      const value = values[key];
      window[property][key] = jest.fn().mockReturnValue(value);
    });
}

export function stubWindowNavigator(key: string, value: string) {
  if (!key) {
    return;
  }
  
  jest.spyOn(global['navigator'], key, 'get').mockReturnValue(value);
}
