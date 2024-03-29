# deno-py-websocket
Deno React websocket client with Python server

* Deno code is based on: https://aralroca.com/blog/learn-deno-chat-app
* Python code is based on: https://websockets.readthedocs.io/en/stable/intro.html

Read the articles to learn more about it.

# Run Project

```
$ deno run -c tsconfig.json --allow-net --allow-read server.tsx
```

# If Prefer hot reload

```
$ denon start
```

# Bundle it
```
$ deno bundle -c ./tsconfig.json .\server.tsx > server.js
```

# MakeFile Script for Linux

```
make dev
make mon
```

# Task runner for Powershell
```
.\runTask.ps1
```

# Run and capture errors
```
deno run -c tsconfig.json --allow-net --allow-read server.tsx 2>&1 | tee -filePath error.log
```

# Test

```
deno test -c .\tsconfig.json
```

# Getting started

```
> git clone git@github.com:Bidek56/deno-py-websocket.git
> cd deno-py-websocket
> make dev