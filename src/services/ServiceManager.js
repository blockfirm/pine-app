import AutoSyncService from './AutoSyncService';
import ConnectionStatusService from './ConnectionStatusService';
import NotificationService from './NotificationService';

const serviceClasses = [
  AutoSyncService,
  ConnectionStatusService,
  NotificationService
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
