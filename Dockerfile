FROM alpine

COPY . .

RUN apk add --no-cache wget gzip

ENTRYPOINT ["bash", "/install_arduino_ide.sh"]
