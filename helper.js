
import Cookies from 'https://cdn.jsdelivr.net/npm/js-cookie@3.0.5/+esm';





export const base = 'https://ec-course-api.hexschool.io';

export const authToken = {
    headers: {
      Authorization: Cookies.get('hexToken') ?? '',
    },
  };

export function debounce(callback,delay=350){
  let timer;
  return (...args)=>{
    if(timer) clearTimeout(timer);
    
    timer = setTimeout(() => {
      callback(...args);
    }, delay);
  } 
}