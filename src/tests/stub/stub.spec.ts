import { of as observableOf } from 'rxjs';

import { Stub } from './stub';


describe('Stub', () => {
  class SampleRealClass {
    attributeString = 'attribute1Value';
    attributeNumber = 10;
    attributeObservable = observableOf('value');
    attributeNotInitialized: any;
    private attributePrivate = 'attributePrivateValue';
    protected attributeProtected = 'attributePrivateValue';
    readonly attributeReadOnly = 'attributeReadOnlyValue';

    get attributeGetter() {
      return 'attributeGetterValue';
    }

    set attributeSetter(value: any) {
      this.attributeNotInitialized = value;
    }

    methodPublic() {
      return 'methodPublicOutput';
    }

    private methodPrivate() {
      return 'methodPrivateOutput';
    }

    protected methodProtected() {
      return 'methodProtectedOutput';
    }
  }

  it('should create a stub for the provided class', () => {
    // Arrange
    const realClass: SampleRealClass = new SampleRealClass();
    let stub: Stub<SampleRealClass>;

    // Act
    stub = new Stub(SampleRealClass) as Stub<SampleRealClass>;

    // Assert
    expect(stub).toBeDefined();
  });

  it('should stub regular objects as empty objects', () => {
    // Arrange
    const notAClass = {
      key1: 'value1',
      key2: () => 'value2',
      key3: undefined
    };

    let stub: Stub<any>;

    // Act
    stub = new Stub(notAClass) as Stub<any>;

    // Assert
    expect(stub).toEqual({});
  });

  it('should set stubbed methods as blank actionless spies', () => {
      // Arrange
      const realClass: SampleRealClass = new SampleRealClass();
      const realClassPrototype = Object.getPrototypeOf(realClass);

      let stub: Stub<SampleRealClass> = new Stub(SampleRealClass) as Stub<SampleRealClass>;
      const expectedMethods = [
        'constructor',
        'attributeGetter',
        'attributeSetter',
        'methodPublic',
        'methodPrivate',
        'methodProtected',
      ];

      // Act
      stub.attributeGetter();
      stub.attributeSetter('setValue');
      stub.methodPublic();
      stub['methodPrivate']();
      stub['methodProtected']();

      // Assert
      expect(Object.keys(stub)).toEqual(expectedMethods);
      expect(stub.attributeGetter).toHaveBeenCalledTimes(1);
      expect(stub.attributeSetter).toHaveBeenCalledTimes(1);
      expect(stub.attributeNotInitialized).toBeUndefined();
      expect(stub.methodPublic).toHaveBeenCalledTimes(1);
      expect(stub['methodPrivate']).toHaveBeenCalledTimes(1);
      expect(stub['methodProtected']).toHaveBeenCalledTimes(1);
  });

  it(`should not initialize stub attributes`, async () => {
    // Arrange
    const realClass: SampleRealClass = new SampleRealClass();
    let stub: Stub<SampleRealClass>;

    // Act
    stub = new Stub(SampleRealClass) as Stub<SampleRealClass>;

    // Assert
    expect(stub.attributeString).toBeUndefined();
    expect(stub.attributeNumber).toBeUndefined();
    expect(stub.attributeObservable).toBeUndefined();
    expect(stub.attributeNotInitialized).toBeUndefined();
    expect(stub['attributePrivate']).toBeUndefined();
    expect(stub['attributeProtected']).toBeUndefined();
    expect(stub.attributeReadOnly).toBeUndefined();
  });

  it(`should initialize specified stub attributes`, async () => {
    // Arrange
    const realClass: SampleRealClass = new SampleRealClass();
    let stub: Stub<SampleRealClass>;
    const valuesToInitialize = {
      attributeString: 'attributeStringValue',
      attributeNumber: 'attributeNumberValue',
      attributeObservable: 'attributeObservableValue',
      attributeNotInitialized: 'attributeNotInitialized',
      attributePrivate: 'attributePrivate',
      attributeProtected: 'attributeProtected',
      attributeReadOnly: 'attributeReadOnly',
      someNewAttribute: 'someNewAttributeValue'
    };

    // Act
    stub = new Stub(SampleRealClass, valuesToInitialize) as Stub<SampleRealClass>;

    // Assert
    expect(stub.attributeString).toBe('attributeStringValue');
    expect(stub.attributeNumber).toBe('attributeNumberValue');
    expect(stub.attributeObservable).toBe('attributeObservableValue');
    expect(stub.attributeNotInitialized).toBe('attributeNotInitialized');
    expect(stub['attributePrivate']).toBe('attributePrivate');
    expect(stub['attributeProtected']).toBe('attributeProtected');
    expect(stub['attributeReadOnly']).toBe('attributeReadOnly');
    expect(stub['someNewAttribute']).toBe('someNewAttributeValue');
  });
});