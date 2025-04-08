
export class ModalModel {
	protected _currentData: any = null;
	constructor() {
		this._currentData = {};
	}
	set currentData(data: any) {
		this._currentData = data;
	}
	get currentData() {
		return this._currentData;
	}
}