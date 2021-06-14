import axios from "axios";

export const baseURL = "https://localhost:8080/api";

export const api = axios.create({ withCredentials: true, baseURL });

export const Subject = value => {
  let observers = [];
  return {
    asObservable: () => ({
      subscribe: observer => {
        observers = [...observers, observer];
        observer(value);
        return {
          unsubscribe: () => {
            observers = observers.filter(o => o !== observer);
          }
        };
      },
    }),
    next: newValue => {
      value = newValue;
      observers.forEach(o => o(value));
    },
    get value() {
      return value;
    }
  };
};
