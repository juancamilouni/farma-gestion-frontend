# --- Stage 1: Build JQ static ---
FROM alpine:3.20 AS builder

RUN apk add --no-cache build-base oniguruma-dev autoconf automake libtool git

WORKDIR /src

# Descargar jq 1.7.1
RUN git clone https://github.com/jqlang/jq.git . && \
    git checkout jq-1.7.1

# Compilar estático
RUN autoreconf -fi && \
    ./configure --with-oniguruma --disable-maintainer-mode --enable-all-static && \
    make -j$(nproc)

# --- Stage 2: Final OCI-compatible image ---
FROM alpine:3.20

# Copiar jq estático
COPY --from=builder /src/jq /usr/local/bin/jq

RUN chmod +x /usr/local/bin/jq

ENTRYPOINT ["/usr/local/bin/jq"]
CMD ["--help"]
