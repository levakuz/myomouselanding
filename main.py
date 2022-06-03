import json
from fastapi import FastAPI, Request, BackgroundTasks
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")


templates = Jinja2Templates(directory="templates")


@app.get("/{language}", response_class=HTMLResponse)
async def read_items(request: Request, language: str = "ru"):
    if language == "ru":
        other_language_ref = '/en'
        other_language = 'En'
        with open('jsons/data_ru.json') as json_file:
            json_language = json.load(json_file)
    else:
        other_language_ref = '/ru'
        other_language = 'Ru'
        with open('jsons/data_en.json') as json_file:
            json_language = json.load(json_file)
    json_language["other_language_ref"] = other_language_ref
    json_language["other_language"] = other_language
    json_language["request"] = request
    return templates.TemplateResponse("index.html", json_language)

@app.post("/form_data")
async def get_form(request: Request):
    with open('./forms.json', 'a') as f:
        json.dump(await request.json(), f)
    return 'True'

