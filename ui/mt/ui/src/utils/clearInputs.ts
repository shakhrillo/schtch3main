type InputSetter = (value: string) => void;

export const clearInputs = (setters: InputSetter[]) => {
  setters.forEach((set) => {
    set('');
  });
};
