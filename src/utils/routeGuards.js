export const authGuard = (to, from, next) => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      next('/connexion');
    } else {
      next();
    }
};