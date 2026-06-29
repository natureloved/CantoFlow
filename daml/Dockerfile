FROM haskell:2.9.8-slim

WORKDIR /app/daml

COPY daml.yaml /app/daml/
COPY src/ /app/daml/src/
COPY test/ /app/daml/test/

RUN apt-get update && apt-get install -y libgmp-dev zlib1g-dev && \
    daml install --sdkver 2.9.8 && \
    cd /app/daml && daml build

CMD ["daml", "test"]
