export declare class Address {
    protected _address: string | undefined;
    protected _types: string[];
    constructor(address?: string);
    set(address?: string): void;
    toString(): string;
    toErc20(): string;
    isEmpty(): boolean;
    static from(address?: string): Address;
}
