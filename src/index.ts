export const runForever = async (func: Function): Promise<void> => {
  while (true) {
    await func();
  }
}

export const pop = (event: string) => {
  return Promise.resolve({})
}

export const push = (event: string, payload: any): void => {
  
}
