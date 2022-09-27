export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  emailAlert: boolean;
  textAlert: boolean;
  mountains: mountainsObj;
}

export interface AuthProps {
  user: User | undefined;
  getUser?: Function;
}

export interface LoginProps {
  getUser: Function;
}

export interface mountainsObj {
  Breckenridge?: number;
  Keystone?: number;
  Vail?: number;
  Monarch?: number;
  'Arapahoe Basin'?: number;
  Copper?: number;
  'Winter Park'?: number;
  Steamboat?: number;
  'Beaver Creek'?: number;
  'Crested Butte'?: number;
  Eldora?: number;
  Aspen?: number;
}

export interface daysObj {
  sunday: boolean;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
}

export interface WeatherProps {
  name: string;
  location: number;
  completeLoading: Function;
}

export interface NavbarProps {
  user: User | undefined;
  logout: Function;
}

export interface timesObj {
  0: boolean;
  1: boolean;
  2: boolean;
  3: boolean;
  4: boolean;
  5: boolean;
  6: boolean;
  7: boolean;
  8: boolean;
  9: boolean;
  10: boolean;
  11: boolean;
  12: boolean;
  13: boolean;
  14: boolean;
  15: boolean;
  16: boolean;
  17: boolean;
  18: boolean;
  19: boolean;
  20: boolean;
  21: boolean;
  22: boolean;
  23: boolean;
}

export interface WeatherData {
  today: forecastObj;
  tomorrow: forecastObj;
}

export interface forecastObj {
  condition: string;
  icon: string;
  avgtemp_f: number;
  daily_chance_of_snow: number;
  totalprecip_in: number;
}
