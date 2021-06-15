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
      get value() {
        return value;
      }
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

export const Range = (count) => new Array(count).fill().map((n, i) => i);

export const getYoutubeVideoId = url => {
  const split = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/|\/e\/)/);
  return (split[2] !== undefined)
    ? split[2].split(/[^0-9a-z_-]/i)[0]
    : split[0];
};

export const testYoutubeVideoId = async id => {
  const { data } = await axios.get(
    `https://www.youtube.com/oembed?format=json&url=https://www.youtube.com/watch?v=${id}`);
  console.log(data);
  return data !== "Not Found";
};
