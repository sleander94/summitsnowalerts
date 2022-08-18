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
  Breckenridge: number;
  Keystone: number;
  Vail: number;
}

export interface WeatherProps {
  name: string;
  location: number;
}

export interface NavbarProps {
  user: User | undefined;
  logout: Function;
}
