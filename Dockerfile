FROM node:18-alpine

WORKDIR /usr/src

COPY . /usr/src

RUN apk update

RUN apk add make curl

RUN apk add --virtual build-dependencies build-base gcc musl-dev

RUN curl https://sh.rustup.rs -sSf | sh -s -- -y

ENV PATH="/root/.cargo/bin:${PATH}"

RUN rustup default nightly-2023-04-25 && rustup target add wasm32-unknown-unknown

ARG WS_ADDRESS \
    PATH_TO_STATE_WASM \
    PROGRAM_ID
ENV WS_ADDRESS=${WS_ADDRESS} \
    PATH_TO_STATE_WASM=${PATH_TO_STATE_WASM} \
    PROGRAM_ID=${PROGRAM_ID}

RUN make init

RUN make build_js

CMD ["make", "run_server"]
