import json
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")


templates = Jinja2Templates(directory="templates")


@app.get("/", response_class=HTMLResponse)
async def read_items(request: Request, language: str = "ru"):
    if language == "ru":
        with open('jsons/data_ru.json') as json_file:
            json_language = json.load(json_file)
    else:
        with open('jsons/data_en.json') as json_file:
            json_language = json.load(json_file)
    json_language["request"] = request
    return templates.TemplateResponse("item.html", json_language)
