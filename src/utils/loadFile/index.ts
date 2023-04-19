/**
 * 动态创建 script 
 * @param files 
 * @returns 
 */
export const loadJS = (files:string | string[]) => {
	const head = document.getElementsByTagName('head')[0];
	files = typeof files ==='object' ? files : [files];
	return Promise.all(files.map(file => {
    return new Promise(resolve => {
      const s = document.createElement('script');
      s.type = "text/javascript";
      s.async = true;
      s.src = file;
      s.addEventListener('load', (e) => resolve(''), false);
      head.appendChild(s);
    });
  }))
}

