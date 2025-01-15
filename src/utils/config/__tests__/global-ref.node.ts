import GlobalRef from '../global-ref';

describe('GlobalRef', () => {
  let originalGlobal: any;

  beforeEach(() => {
    originalGlobal = global;
    global = { ...global };
  });

  afterEach(() => {
    global = originalGlobal;
  });

  it('should set and get the value correctly', () => {
    const globalRef = new GlobalRef<number>('test-unique-name');
    globalRef.value = 42;
    expect(globalRef.value).toBe(42);
  });

  it('should return undefined if value is not set', () => {
    const globalRef = new GlobalRef<number>('another-unique-name');
    expect(globalRef.value).toBeUndefined();
  });

  it('should handle different types of values', () => {
    const stringRef = new GlobalRef<string>('string-unique-name');
    stringRef.value = 'test string';
    expect(stringRef.value).toBe('test string');

    const objectRef = new GlobalRef<{ key: string }>('object-unique-name');
    objectRef.value = { key: 'value' };
    expect(objectRef.value).toEqual({ key: 'value' });
  });

  it('should use the same symbol for the same unique name', () => {
    const ref1 = new GlobalRef<number>('shared-unique-name');
    const ref2 = new GlobalRef<number>('shared-unique-name');
    ref1.value = 100;
    expect(ref2.value).toBe(100);
  });

  it('should use different symbols for different unique names', () => {
    const ref1 = new GlobalRef<number>('unique-name-1');
    const ref2 = new GlobalRef<number>('unique-name-2');
    ref1.value = 100;
    ref2.value = 200;
    expect(ref1.value).toBe(100);
    expect(ref2.value).toBe(200);
  });
});
