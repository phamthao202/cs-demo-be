module.exports = exports = isDeletedFalse = function (schema, options) {
    schema.pre(/^find/, function (next) {
      if (this._conditions["isDeleted"] === undefined)
        this._conditions["isDeleted"] = false;
      next();
    });
  };
  //schema.pre la gi?
  //this._conditions la gi (
  //da hoc false, true la dang boolean, co them dang undefirned??)