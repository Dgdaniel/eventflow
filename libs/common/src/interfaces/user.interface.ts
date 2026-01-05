export interface IUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserAuth extends Pick<IUser, 'id' | 'email'> {
  roles: string[];
  accessToken: string;
  refreshToken: string;
}
