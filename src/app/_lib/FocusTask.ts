import {randomUUID, UUID} from "node:crypto";

export default class FocusTask {
	private readonly _id: string
	private _name: string
	private _totalFocusSeconds: number

	constructor(name: string) {
		this._id = randomUUID().toString()
		this._name = name;
		this._totalFocusSeconds = 0
	}

	get id(): string {
		return this._id;
	}

	get name(): string {
		return this._name;
	}

	set name(value: string) {
		this._name = value;
	}

	get totalFocusSeconds(): number {
		return this._totalFocusSeconds;
	}

	addFocusSeconds(seconds: number) {
		this._totalFocusSeconds += seconds
	}
}