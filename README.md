# Гайд по установки и использованию emscripten для компиляции wasm.

1. Установить choco. В powershall выполняем команды
```
Set-ExecutionPolicy AllSigned
```

```
Set-ExecutionPolicy Bypass -Scope Process
```

```
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
```
Если установился то команда `choco` покажет версию.

2. Устанавливаем **esdk** c помощью **choco**
```
choco install emscripten
```
После установки потребует перезагрузку. 

3. Далее можно посмотреть гайд от MDN Web Docs https://developer.mozilla.org/ru/docs/WebAssembly/C_to_Wasm

	У нас становится доступна в powershall команда `emcc` в опциях которой можно указывать *с* или  *с++* файлы, а на выходе получать wasm, html и js.

4. Для того чтобы можно было в своём js code делать `fetch("file.wasm")` wasm кода, а после при использовании `new WebAssembly.Instance()` не было ошибки:

	*TypeError: WebAssembly.instantiate(): Import #0 module="wasi_snapshot_preview1" error: module is not an object or function*

	Нужно в команду компиляции добавить флаг **-s SIDE_MODULE=1**

5. `emcc -O2 ./cpp/index.cpp -o index.wasm -s WASM=1 -s STANDALONE_WASM -s SIDE_MODULE=1` - Этой командой делал компиляция я.


5. Полезные ссылки 
	- https://metanit.com/cpp/webassembly/1.5.php
	- https://rdevelab.ru/blog/web-assembly/post/example-wasm-sdl-canvas-float-cube


