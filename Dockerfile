FROM python:3.9.2
ENV TZ=Europe/Moscow
RUN apt-get update

WORKDIR /opt/myomouselanding

# set env variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install dependencies
COPY requirements.txt   .

RUN pip install --upgrade pip \
    && pip install --no-cache -r ./requirements.txt \
