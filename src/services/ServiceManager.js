import ConnectionStatusService from './ConnectionStatusService';

const serviceClasses = [
  ConnectionStatusService
];

export default class ServiceManager {
  constructor(store) {
    this._services = serviceClasses.map((ServiceClass) => {
      return new ServiceClass(store);
    });
  }

  start() {
    this._services.forEach((service) => service.start());
  }

  stop() {
    this._services.forEach((service) => service.stop());
  }
}
