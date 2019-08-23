import { of as observableOf } from 'rxjs';

import { Stub } from './stub';


describe('Stub', () => {
  describe('Classes', () => {
    class SampleTargetClass {
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
      const realClass: SampleTargetClass = new SampleTargetClass();
      let stub: Stub<SampleTargetClass>;
  
      // Act
      stub = new Stub(SampleTargetClass) as Stub<SampleTargetClass>;
  
      // Assert
      expect(stub).toBeDefined();
    });
  
    it('should declare the stub methods as bare spies', () => {
        // Arrange
        const realClass: SampleTargetClass = new SampleTargetClass();
        const realClassPrototype = Object.getPrototypeOf(realClass);
  
        let stub: Stub<SampleTargetClass> = new Stub(SampleTargetClass) as Stub<SampleTargetClass>;
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
      const realClass: SampleTargetClass = new SampleTargetClass();
      let stub: Stub<SampleTargetClass>;
  
      // Act
      stub = new Stub(SampleTargetClass) as Stub<SampleTargetClass>;
  
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
      const realClass: SampleTargetClass = new SampleTargetClass();
      let stub: Stub<SampleTargetClass>;
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
      stub = new Stub(SampleTargetClass, valuesToInitialize) as Stub<SampleTargetClass>;
  
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

  describe('object', () => {
    type TargetType = {
      key1: string;
      key2: Function;
      key3: undefined;
    };

    it(`should declare the stub's methods as bare spies`, () => {
      // Arrange
      const targetNotClass: TargetType = {
        key1: 'value1',
        key2: () => 'value2',
        key3: undefined
      };
      let stub: Stub<any>;
  
      // Act
      stub = new Stub(targetNotClass) as Stub<TargetType>;
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
        key3: undefined
      };
      const mockValues = {
        key1: 'mockValue1',
        key3: 'mockValue3'
      }
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
        key3: undefined
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
});
