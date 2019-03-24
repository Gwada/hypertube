class Validator {

  _value = ''
  _errors = []

  notNull() {
    if (this._value === undefined || this._value === '')
      this.addError('IS_NULL')
    return this
  }

  isString() {
    if (typeof this._value != 'string')
      this.addError('NOT_STRING')
    return this
  }

  isNumeric() {
    if (isNaN(this._value) || !isFinite(this._value))
      this.addError('NOT_NUMERIC')
    return this
  }

  sameAs(x) {
    if (this._value !== x)
      this.addError('DIFFERENT')
    return this
  }

  isEmail() {
    let regex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/
    if (!this._value.match(regex))
      this.addError('INVALID_EMAIL')
    return this
  }

  minLen(n) {
    if (this._value.length > 0 && this._value.length < n)
      this.addError('TOO_SHORT')
    return this
  }

  maxLen(n) {
    if (this._value.length > n)
      this.addError('TOO_LONG')
    return this
  }

  //seters, geters
  set value(v) {
    this._value = v
    this._errors = []
  }

  get errors() {
    return this._errors
  }

  addError(error) {
    this._errors.push(error)
    return this
  }
}

export default new Validator()
