FROM node:18-alpine

WORKDIR /usr/src

COPY . /usr/src

RUN apk update

RUN apk add make

ARG WS_ADDRESS \
    PATH_TO_STATE_WASM \
    PROGRAM_ID
ENV WS_ADDRESS=${WS_ADDRESS} \
    PATH_TO_STATE_WASM=${PATH_TO_STATE_WASM} \
    PROGRAM_ID=${PROGRAM_ID}

RUN make init

RUN make build_js

CMD ["make", "run_server"]
