import uvicorn as uvicorn

if __name__ == '__main__':
    print("Backend service is running...")
    uvicorn.run("main:app", host='127.0.0.1',
                port=int('8000'), reload=True, debug=True, workers=1)

