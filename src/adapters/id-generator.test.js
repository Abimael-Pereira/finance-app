import { IdGeneratorAdapter } from './id-generator';

describe('IdGeneratorAdapter', () => {
    it('should return a random id', () => {
        const sut = new IdGeneratorAdapter();

        const result = sut.execute();

        const uuidRegex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        expect(result).toBeTruthy();
        expect(typeof result).toBe('string');
        expect(result).toMatch(uuidRegex);
    });
});
