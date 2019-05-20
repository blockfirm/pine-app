import AutoSyncService from './AutoSyncService';
import BackgroundFetchService from './BackgroundFetchService';
import ConnectionStatusService from './ConnectionStatusService';
import FiatRatesService from './FiatRatesService';
import NotificationService from './NotificationService';

const serviceClasses = [
  AutoSyncService,
  BackgroundFetchService,
  ConnectionStatusService,
  FiatRatesService,
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
