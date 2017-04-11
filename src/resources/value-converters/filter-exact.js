export class FilterExactValueConverter {
  toView(array, value, property) {
    return (array || []).filter(item => item[property] === value);
  }
}
