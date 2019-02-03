import { useState } from 'react';
import { runForever, forEvent, emit } from './index';

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

const redirectTo = (url: string) => emit('REDIRECT_TO', url);

const authBouncer = async () => {
  const user = await forEvent('signin') as User;
  setCurrentUser(user);
  await redirectTo('/');

  await forEvent('signout');
  setCurrentUser(null);
  await redirectTo('/signin');
};

const authPersistor = async () => {
  const user = await forEvent('signin') as User;
  sessionStorage.setItem('currentUser', JSON.stringify(user));

  await forEvent('signout');
  sessionStorage.removeItem('currentUser');
}

const authenticator = async () => {
  const { username, password } = await forEvent('signin-request') as AuthCreds;

  try {
    const user: User = await api.get('/token', { username, password });
    emit('signin-success', user);
  } catch (error) {
    emit('signin-failure', error);
  }
}

const rehidrateUser = async () => {
  try {
    const data = sessionStorage.getItem('currentUser');
    const payload = JSON.parse(data);
  } catch (error) {
    emit('rehidration-failure', error);
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
