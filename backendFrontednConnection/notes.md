### Key points :
1. Port can be taken by env file or a default one can be given using || 
``` js
const PORT = process.env.PORT || 3000;
```

2. In production it is compulsory to have port given in env file. 
3. There are two ways of importing a module : commonjs and module (Study about it)
4. To create react front end files in the current folder add . at the last 
```
npm create vite@latest .
```
5. study about Cross Origin Request Error (CORS), in short it happens when backend and frontedn has different ports.
6. Proxy is one method to solve this problem, it creates a proxy by which it looks like that the request has been sent with the port set in the proxy (read more).
7. CORS error can be fixed on server side too, CORS module is also there. We can whitelist our frontend url from backend side.