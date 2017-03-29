export class App {
  configureRouter(config, router) {
    config.title = 'Sentimental.ly';
    config.map([
      {
        route: '',
        name: 'lookup-form',
        moduleId: 'containers/lookup-form/lookup-form'
      },
      {
        route: 'lookups/:lookupId',
        name: 'lookup-detail',
        moduleId: 'containers/lookup-detail/lookup-detail'
      }
    ]);

    this.router = router;
  }
}
