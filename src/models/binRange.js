import { ArgumentNullError, NullReferenceError } from '@/utils/errors';

export class BinRange {
  _id;
  _startRange;
  _endRange;

  constructor(id, startRange, endRange) {
    if (typeof id !== 'number')
      throw new TypeError("Property 'id' has to be a string");

    if (typeof startRange !== 'string')
      throw new TypeError("Property 'startRange' has to be a string");
    if (startRange === '')
      throw new ArgumentNullError(
        "Cannot set null or empty string to property 'startRange'"
      );

    if (typeof endRange !== 'string')
      throw new TypeError("Property 'endRange' has to be a string");
    if (endRange === '')
      throw new ArgumentNullError(
        "Cannot set null or empty string to property 'endRange'"
      );

    this._id = id;
    this._startRange = startRange;
    this._endRange = endRange;
  }

  get id() {
    return this._id;
  }

  get startRange() {
    if (this._startRange === '')
      throw new NullReferenceError("Property 'startRange' is null or empty");
    return this._startRange;
  }

  get endRange() {
    if (this._endRange === '')
      throw new NullReferenceError("Property 'endRange' is null or empty");
    return this._endRange;
  }
}
