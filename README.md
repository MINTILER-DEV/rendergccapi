# gccapi

**gccapi** is a simple online API that allows users to compile and execute C/C++ code remotely using the GCC (GNU Compiler Collection). No local setup is required – simply send HTTP requests to the provided API endpoint to compile and run your code!

## Features

- Compile and execute C/C++ code remotely
- Lightweight and easy-to-use API for code execution
- JSON-based responses with output and error handling
- Suitable for educational platforms, online compilers, or automation scripts

## Usage

You can start using **gccapi** right away! There is **no installation** required. Just send your requests to:

```
https://gccapi.onrender.com
```

### Example: Compiling and Running C++ Code

Send a `POST` request to the `/compile` endpoint with your C/C++ code in the request body.

#### Request Example:

```json
POST https://gccapi.onrender.com/compile
{
  "language": "cpp",
  "code": "#include <iostream>\nint main() { std::cout << 'Hello, World!'; return 0; }"
}
```

#### Response Example:

```json
{
  "output": "Hello, World!\n",
  "error": "",
  "status": "success"
}
```

### Error Handling

If there are any issues with the code (such as compilation errors), the API returns a detailed error message in the `error` field of the response.

#### Example Error Response:

```json
{
  "output": "",
  "error": "main.cpp: In function ‘int main()’: ...",
  "status": "error"
}
```

## API Endpoints

- **POST /compile**: Compiles and runs the provided C or C++ code. It expects a JSON body with two fields:
  - `language`: Either `c` or `cpp`, specifying whether the code is in C or C++.
  - `code`: The actual source code as a string.

- **GET /status**: Returns the current status of the API, useful for health checks.

## Example Request Using `curl`

```bash
curl -X POST https://gccapi.onrender.com/compile \
  -H "Content-Type: application/json" \
  -d '{"language": "cpp", "code": "#include <iostream>\nint main() { std::cout << \"Hello, World!\"; return 0; }"}'
```

## Contributing

Feel free to open issues or submit pull requests if you'd like to contribute or improve **gccapi**!

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---
