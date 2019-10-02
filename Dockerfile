FROM alpine

LABEL "name"="arduino-ide"
LABEL "maintainer"="Hristo Gochkov <hristo@espressif.com>"
LABEL "version"="0.0.1"

LABEL "com.github.actions.name"="Arduino IDE for GitHub Actions"
LABEL "com.github.actions.description"="Installs ArduinoIDE and adds some cool tools to build your sketches"
LABEL "com.github.actions.icon"="upload-cloud"
LABEL "com.github.actions.color"="green"

COPY README.md LICENSE install_arduino_ide.sh /

RUN apk add --no-cache git python3 curl wget untar gzip gunzip

CMD ["/install_arduino_ide.sh"]
