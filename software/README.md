

# Testing the UI (without MCU)

### 1. Clone or download this repo.
### 2. Open the file "../software/index.html" and add the following lines at the top of the setInterval() function:

```js
let voltage = Math.random()*36; // generate random value between 0-36 (V)
let current = Math.random()*15; // generate random value between 0-15 (A)
```
### 3. In the same function uncomment the line. 
```js
// getData();
```

### 4. In a terminal navigate to the "/www" folder and type:
```
$ cd software/www/
$ python -m http.server
```
### 5. Open your favourite browser and enter localhost:8000 in the url field.