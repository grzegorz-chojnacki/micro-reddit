import axios from "axios";

export const baseURL = (process.env.NODE_ENV === "development")
? "https://localhost:8080/api"
: "/api";

export const api = axios.create({ withCredentials: true, baseURL });

export const Subject = value => {
  console.log();
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

export const Range = (count) => new Array(count).fill().map((_, i) => i);

export const atPageBottom = cb => () => {
  const scrollHeight = window.pageYOffset + window.innerHeight;
  const fullHeight = document.documentElement.offsetHeight;

  if (scrollHeight >= fullHeight - 100) {
    cb();
  }
};

export const getYoutubeVideoId = url => {
  const split = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/|\/e\/)/);
  return (split[2] !== undefined)
    ? split[2].split(/[^0-9a-z_-]/i)[0]
    : split[0];
};

export const testEmail = email => /^\S+@\S+$/.test(email);

export const testYoutubeVideoId = async id => {
  const { data } = await axios.get(
    `https://www.youtube.com/oembed?format=json&url=https://www.youtube.com/watch?v=${id}`);
  return data !== "Not Found";
};

export const urlify = str => str
  .replace(/ /g, "-")
  .replace(/ł/g, "l")
  .normalize("NFKD")                 // Normalize diacritics
  .replace(/[^\w\s.\-_/]/g, "")      // Remove diacritic modifiers
  .replace(/[^a-zA-Z0-9.~_-]/g, ""); // Remove all unallowed characters

export const isWebLink = str => /^http[s]?:\/\/([a-zA-Z0-9.~_-])+/g.test(str);

export const markForm = (refs = {}, errors = []) => {
  for (const ref in refs) {
    refs[ref].classList.remove("is-invalid");
  }

  if (errors.length > 0) {
    for (const input of errors) {
      refs[input].classList.add("is-invalid");
    }
    return false;
  } else {
    return true;
  }
};

export const invalidControlClass = b => `form-control ${b ? "is-invalid" : ""}`;
