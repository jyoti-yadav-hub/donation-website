import options from './options';
import { isServer } from './isServer';

export function getDefaultPath() {
  const getParent = lastRoute => {
    const parent = [];
    if (!lastRoute) return parent;
    parent.push(lastRoute);
    options.forEach(option => {
      if (option.children) {
        option.children.forEach(child => {
          if (child.key === lastRoute) {
            parent.push(option.key);
          }
        });
      }
    });
    return parent;
  };
  if (!isServer && window.location.pathname) {
    const routes = window.location.pathname.split('/');
    if (routes.length > 1) {
      const lastRoute = routes[routes.length - 1];
      return getParent(lastRoute);
    }
  }
  return [];
}
