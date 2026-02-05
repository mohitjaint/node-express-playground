1. We have characters in database
2. The nameing convention used in industry is in the format : charName.models.js.
3. The name we give to model when initializing it.
```js
export const User = mongoose.model('User', userSchema);
```
- mongoose changes it to plural form and lowercase letters when storing it in DB. 
    User -> users
    Todo -> todos
