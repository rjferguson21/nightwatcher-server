export type Sensor = {
  id: string;
  lastUpdated: Date;
  status: string;
};

export type SensorChangeEvent = {
  sensorId: string;
  lastUpdated: Date;
  fromStatus: string;
  toStatus: string;
}