#!/bin/sh
set -e

# Upstream = Docker host where ASR :9000 and TTS :5500 listen (0.0.0.0, not 127.0.0.1-only).
# Default: default route gateway on the container network (Linux bridge -> host).
if [ -n "${NGINX_UPSTREAM_IP:-}" ]; then
  IP="$NGINX_UPSTREAM_IP"
else
  IP=$(ip route show default 2>/dev/null | awk '{print $3}' | head -n1) || true
fi
if [ -z "$IP" ]; then
  echo "docker-fe-entrypoint: could not read default gateway; set NGINX_UPSTREAM_IP on the fe service" >&2
  IP=172.17.0.1
fi

export NGINX_UPSTREAM_IP="$IP"
echo "docker-fe-entrypoint: proxy ASR/TTS to host ${NGINX_UPSTREAM_IP}"

envsubst '${NGINX_UPSTREAM_IP}' < /templates/default.conf.template > /etc/nginx/conf.d/default.conf

exec "$@"
