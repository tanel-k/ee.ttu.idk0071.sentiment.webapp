export function configure(config) {
  config.globalResources([
    './value-converters/filter-by',
    './value-converters/filter-exact',
    './value-converters/order-by',
    './elements/graphs/pie-chart',
    './elements/form-elements/drag-drop-select'
  ]);
}
