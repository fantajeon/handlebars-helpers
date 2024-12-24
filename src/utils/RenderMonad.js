'use strict';

export const RenderMonad = {
  of: (value) => 
    value === null || value === undefined 
      ? NullMonad.of(null)
      : ValueMonad.of(value)
};

const ValueMonad = {
  of: (value) => ({
    value,
    chain: function(fn) {
      const result = fn(this.value);
      return result && typeof result.chain === 'function' 
        ? result 
        : RenderMonad.of(result);
    },
    map: function(fn) {
      return this.chain(value => RenderMonad.of(fn(value)));
    },
    getValue: function() {
      return this.value;
    }
  })
};

const NullMonad = {
  of: () => ({
    value: null,
    chain: function() {
      return this;
    },
    map: function() {
      return this;
    },
    getValue: function() {
      return null;
    }
  })
}; 