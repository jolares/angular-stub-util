import { of as observableOf } from 'rxjs';
import { Stub, WindowProperty } from './stub';


describe('Stub', () => {
  describe('Classes', () => {
    class SampleTargetClass {
      attributeString = 'attribute1Value';
      attributeNumber = 10;
      attributeObservable = observableOf('value');
      attributeNotInitialized: any;
      attributeNeverStubbed = 'neverStubbed';
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

    it('should create a Stub object for the target class', () => {
      // Arrange
      let stub: Stub<SampleTargetClass>;

      // Act
      stub = new Stub(SampleTargetClass) as Stub<SampleTargetClass>;

      // Assert
      expect(stub).toBeDefined();
    });

    it(`should declare the target-object's methods in Stub as bare spies`, () => {
      // Arrange
      const expectedMethods = [
        'constructor',
        'attributeGetter',
        'attributeSetter',
        'methodPublic',
        'methodPrivate',
        'methodProtected',
      ];

      const stub: Stub<SampleTargetClass> = new Stub(SampleTargetClass);
      let actualMethods: string[];

      // Act
      actualMethods = Object.keys(stub);
      (stub as any).attributeGetter();
      stub.attributeSetter('setValue');
      stub.methodPublic();
      stub['methodPrivate']();
      stub['methodProtected']();

      // Assert
      expect(actualMethods).toEqual(expectedMethods);
      expect(stub.attributeGetter).toHaveBeenCalledTimes(1);
      expect(stub.attributeSetter).toHaveBeenCalledTimes(1);
      expect(stub.attributeNotInitialized).toBeUndefined();
      expect(stub.methodPublic).toHaveBeenCalledTimes(1);
      expect(stub['methodPrivate']).toHaveBeenCalledTimes(1);
      expect(stub['methodProtected']).toHaveBeenCalledTimes(1);
    });

    it(`should not initialize Stub attributes`, () => {
      // Arrange
      let stub: Stub<SampleTargetClass>;
      let stubProperties: string[];

      // Act
      stub = new Stub(SampleTargetClass);
      stubProperties = Object.keys(stub);

      // Assert
      expect(stub.attributeString).toBeUndefined();
      expect(stub.attributeNumber).toBeUndefined();
      expect(stub.attributeObservable).toBeUndefined();
      expect(stub.attributeNotInitialized).toBeUndefined();
      expect(stubProperties).not.toContain('attributeNeverStubbed');
      expect(stub['attributePrivate']).toBeUndefined();
      expect(stub['attributeProtected']).toBeUndefined();
      expect(stub.attributeReadOnly).toBeUndefined();
    });

    it(`should initialize the specified Stub attributes`, async () => {
      // Arrange
      let stub: Stub<SampleTargetClass>;
      const valuesToInitialize = {
        attributeString: 'attributeStringValue',
        attributeNumber: 'attributeNumberValue',
        attributeObservable: 'attributeObservableValue',
        attributeNotInitialized: 'attributeNotInitialized',
        attributePrivate: 'attributePrivate',
        attributeProtected: 'attributeProtected',
        attributeReadOnly: 'attributeReadOnly',
        someNewAttribute: 'someNewAttributeValue',
      };
      let stubProperties: string[];

      // Act
      stub = new Stub(SampleTargetClass, valuesToInitialize) as Stub<SampleTargetClass>;
      stubProperties = Object.keys(stub);

      // Assert
      expect(stub.attributeString).toBe('attributeStringValue');
      expect(stub.attributeNumber).toBe('attributeNumberValue');
      expect(stub.attributeObservable).toBe('attributeObservableValue');
      expect(stub.attributeNotInitialized).toBe('attributeNotInitialized');
      expect(stubProperties).not.toContain('attributeNeverStubbed');
      expect(stub['attributePrivate']).toBe('attributePrivate');
      expect(stub['attributeProtected']).toBe('attributeProtected');
      expect(stub['attributeReadOnly']).toBe('attributeReadOnly');
      expect(stub['someNewAttribute']).toBe('someNewAttributeValue');
    });
  });

  describe('objects', () => {
    type TargetType = {
      key1: string;
      key2: Function;
      key3: undefined;
    };

    it(`should declare the target-object's methods in Stub as bare spies`, () => {
      // Arrange
      const targetNotClass: TargetType = {
        key1: 'value1',
        key2: () => 'value2',
        key3: undefined,
      };
      let stub: Stub<TargetType>;

      // Act
      stub = new Stub(targetNotClass);
      stub.key2();

      // Assert
      expect(Object.keys(stub)).toEqual(['key2']);
      expect(stub.key2).toHaveBeenCalledTimes(1);
    });

    it(`should initialize the stub's attributes`, () => {
      // Arrange
      const targetNotClass: TargetType = {
        key1: 'value1',
        key2: () => 'value2',
        key3: undefined,
      };
      const mockValues = {
        key1: 'mockValue1',
        key3: 'mockValue3',
      };
      let stub: Stub<any>;

      // Act
      stub = new Stub(targetNotClass, mockValues) as Stub<TargetType>;
      stub.key2();

      // Assert
      expect(Object.keys(stub)).toEqual(['key2', 'key1', 'key3']);
      expect(stub.key1).toBe('mockValue1');
      expect(stub.key2).toHaveBeenCalledTimes(1);
      expect(stub.key3).toBe('mockValue3');
    });

    it(`should not initialize the stub's attributes`, () => {
      // Arrange
      const targetNotClass: TargetType = {
        key1: 'value1',
        key2: () => 'value2',
        key3: undefined,
      };
      let stub: Stub<TargetType>;

      // Act
      stub = new Stub(targetNotClass) as Stub<TargetType>;
      stub.key2();

      // Assert
      expect(Object.keys(stub)).toEqual(['key2']);
      expect(stub.key1).toBeUndefined();
      expect(stub.key2).toHaveBeenCalledTimes(1);
      expect(stub.key3).toBeUndefined();
    });
  });

  describe('Window Object', () => {
    describe('Session Storage', () => {
      it(`getItem should retrieve an item value from the stubbed session storage object`, () => {
        // Arrange
        let sesionStorageStub = new Stub(WindowProperty.SessionStorage, {
          key1: 'value1',
          key2: 'value2',
        });

        // Act
        const actual = window.sessionStorage.getItem('key1');

        // Assert
        expect(actual).toBe('value1');
      });

      it(`setItem should create an item in the stubbed session storage object`, () => {
        // Arrange
        let sesionStorageStub = new Stub(WindowProperty.SessionStorage);

        // Act
        window.sessionStorage.setItem('key1', 'value1');
        const actual = window.sessionStorage.getItem('key1');

        // Assert
        expect(actual).toEqual('value1');
      });

      it(`setItem should set an item in the stubbed session storage object`, () => {
        // Arrange
        let sesionStorageStub = new Stub(WindowProperty.SessionStorage, {
          key2: 'value2',
        });

        // Act
        window.sessionStorage.setItem('key2', 'key2Value2');

        const actual = window.sessionStorage.getItem('key2');

        // Assert
        expect(actual).toEqual('key2Value2');
      });

      it(`removeItem should remove an item from the stubbed session storage object`, () => {
        // Arrange
        let sesionStorageStub = new Stub(WindowProperty.SessionStorage, {
          key1: 'value1',
          key2: 'value2'
        });

        // Act
        window.sessionStorage.removeItem('key2');

        // Assert
        expect(window.sessionStorage.getItem('key2')).toEqual(undefined);
        expect(window.sessionStorage.getItem('key1')).toEqual('value1');
      });

      it(`clear should remove all item from the stubbed session storage object`, () => {
        // Arrange
        let sesionStorageStub = new Stub(WindowProperty.SessionStorage, {
          key1: 'value1',
          key2: 'value2'
        });

        // Act
        window.sessionStorage.clear();

        // Assert
        expect(window.sessionStorage.getItem('key1')).toEqual(undefined);
        expect(window.sessionStorage.getItem('key1')).toEqual(undefined);
      });

    });

    describe('Navigator', () => {
      it(`should stub the actual window navigator`, () => {
        // Arrange
        let stub: Stub<WindowProperty.Navigator>;

        // Act
        stub = new Stub(WindowProperty.Navigator, { language: 'en-UK' });

        // Assert
        expect(window.navigator.language).toEqual('en-UK');
      });
    });
  });
});
