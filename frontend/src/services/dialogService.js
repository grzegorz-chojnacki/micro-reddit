import { Subject } from "@/common";

const componentSource = Subject({ component: null, data: null });
const nullResolve = () => {
  throw new Error();
};

let resolveHandle = nullResolve;

export const dialogService = {
  open(component, data = null) {
    if (resolveHandle !== nullResolve) {
      resolveHandle(null);
    }

    componentSource.next({ component, data });
    return new Promise(resolve => (resolveHandle = resolve));
  },

  resolve(value) {
    resolveHandle(value);
    resolveHandle = nullResolve;
  },

  get component() {
    return componentSource.asObservable();
  },
};
