import { useState } from 'react';

const api = {
  get(path: string, payload?: any): Promise<any> {
    return Promise.resolve({ path, payload })
  }
}

interface Post {
  id: string,
  title: string,
  text: string
}

const [post, setCurrentPost] = useState(null);

const fetch = async (url: string, payload?: any) => {
  const metadata = { url, payload, method: 'GET' }
  emit('fetch-request', metadata);

  try {
    const result = api.get(url, payload);    
    emit('fetch-success', { ...metadata, result });
    return result;
  } catch (error) {
    emit('fetch-failure', { ...metadata, error });
    throw error;
  }
}

const fetchPost = async (id: string): Promise<Post> => {
  emit('post-fetch-request', id);

  try {
    const post = await fetch(`/posts/${id}`) as Post;
    emit('post-fetch-success', post);
    setCurrentPost(post);
  } catch (error) {
    emit('post-fetch-failure', error);
    throw error;
  }
}

const boot = () => Promise.all([
  onlyLastEvent('post-request', fetchPost)
])
