import { useState } from 'react';
import { runForever, pop, push } from './index';

interface User {
  id: string;
  name: string;
}

interface AuthCreds {
  username: string,
  password: string  
}

const api = {
  get(path: string, payload: any): Promise<any> {
    return Promise.resolve({ path, payload })
  }
}

const [user, setCurrentUser] = useState<User>(null);

const redirectTo = (url: string) => push('REDIRECT_TO', url);

const authBouncer = async () => {
  const user = await pop('signin') as User;
  setCurrentUser(user);
  await redirectTo('/');

  await pop('signout');
  setCurrentUser(null);
  await redirectTo('/signin');
};

const authPersistor = async () => {
  const user = await pop('signin') as User;
  sessionStorage.setItem('currentUser', JSON.stringify(user));

  await pop('signout');
  sessionStorage.removeItem('currentUser');
}

const authenticator = async () => {
  const { username, password } = await pop('signin-request') as AuthCreds;

  try {
    const user: User = await api.get('/token', { username, password });
    push('signin-success', user);
  } catch (error) {
    push('signin-failure', error);
  }
}

const rehidrateUser = async () => {
  try {
    const data = sessionStorage.getItem('currentUser');
    const payload = JSON.parse(data);
  } catch (error) {
    push('rehidration-failure', error);
  }
}

const boot = async () => {
  await Promise.all([
    rehidrateUser(),
    runForever(authenticator),
    runForever(authBouncer),
    runForever(authPersistor)
  ])
}
