FROM alpine

COPY . .

RUN apk add --no-cache wget gzip bash

ENTRYPOINT ["/bin/bash", "/install_arduino_ide.sh"]
