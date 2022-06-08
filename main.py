import json
from typing import List

from fastapi import FastAPI, Request, BackgroundTasks
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi_mail import FastMail, MessageSchema,ConnectionConfig

app = FastAPI()

conf = ConnectionConfig(
    MAIL_USERNAME = "levakuz@yandex.ru",
    MAIL_PASSWORD = "ashrjtxthqrfggyl",
    MAIL_FROM = " innovation@rufilms-avt.com",
    MAIL_PORT = 465,
    MAIL_SERVER = "smtp.yandex.ru",
    MAIL_FROM_NAME="RuFilms innovation",
    MAIL_TLS = False,
    MAIL_SSL = True,
    USE_CREDENTIALS = True,
    VALIDATE_CERTS = False
)



app.mount("/static", StaticFiles(directory="static"), name="static")


templates = Jinja2Templates(directory="templates")


@app.get("/{language}", response_class=HTMLResponse)
async def read_items(request: Request, language: str = "ru"):
    if language == "ru":
        other_language_ref = '/en'
        other_language = 'Ru'
        with open('jsons/data_ru.json') as json_file:
            json_language = json.load(json_file)
    else:
        other_language_ref = '/ru'
        other_language = 'En'
        with open('jsons/data_en.json') as json_file:
            json_language = json.load(json_file)
    json_language["other_language_ref"] = other_language_ref
    json_language["other_language"] = other_language
    json_language["request"] = request
    return templates.TemplateResponse("index.html", json_language)


@app.post("/form_data")
async def get_form(request: Request):
    data = await request.json()
    email = data.get('email')
    with open('./forms.json', 'a') as f:
        json.dump(await request.json(), f)
    html = f'Здравствуйте, {data["name"]}!\n\n Спасибо за оставленную обратную связь!\n Скоро мы с Вами свяжемся.\n\n С уваэением,\n Команда MyoMouse'
    message = MessageSchema(
        subject="MyoMouse",
        recipients=[email],  # List of recipients, as many as you can pass
        body=html,
        subtype="string"
    )
    fm = FastMail(conf)
    await fm.send_message(message)
    html = f'Поступил запрос на обратную связь. \n\n Данные клиента: \n Имя:{data["name"]},\n Телефон: {data["phone"]},\n Email: {data["email"]}. '
    message = MessageSchema(
        subject="Обратная связь",
        recipients=[conf.MAIL_USERNAME],  # List of recipients, as many as you can pass
        body=html,
        subtype="string"
    )
    await fm.send_message(message)
    return 'True'

