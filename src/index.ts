export const runForever = async (func: Function): Promise<void> => {
  while (true) {
    await func();
  }
}

export const forEvent = (event: string) => {
  return Promise.resolve({})
}

export const emit = (event: string, payload: any): void => {
  
}
