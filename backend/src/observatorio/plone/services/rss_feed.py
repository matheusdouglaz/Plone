"""Proxy seguro de feeds RSS/Atom para o frontend Volto."""

from ipaddress import ip_address
from urllib.parse import urlparse

from AccessControl import getSecurityManager
from plone.restapi.services import Service
from zExceptions import Unauthorized

import requests


USER_AGENT = "ObservatorioPloneRSS/1.0"
REQUEST_TIMEOUT = 25

# SSRF: apenas HTTPS e hosts governamentais ou lista explícita.
ALLOWED_HOST_SUFFIXES = (".gov.br",)
ALLOWED_HOSTS_EXACT = frozenset()


def _host_is_literal_ip(host: str) -> bool:
    try:
        ip_address(host)
    except ValueError:
        return False
    return True


def validate_feed_url(url: str) -> tuple[bool, str]:
    """Valida URL do feed. Retorna (ok, mensagem_erro)."""
    if not url or not isinstance(url, str):
        return False, "Parâmetro url ausente ou inválido."
    url = url.strip()
    if len(url) > 8192:
        return False, "URL excede o tamanho máximo permitido."

    parsed = urlparse(url)
    if parsed.scheme.lower() != "https":
        return False, "Apenas URLs HTTPS são permitidas."
    if parsed.username is not None or parsed.password is not None:
        return False, "URL não pode conter credenciais."

    host = (parsed.hostname or "").lower()
    if not host:
        return False, "Host da URL é obrigatório."
    if _host_is_literal_ip(host):
        return False, "Endereços IP não são permitidos."

    if not (
        any(host.endswith(suffix) for suffix in ALLOWED_HOST_SUFFIXES)
        or host in ALLOWED_HOSTS_EXACT
    ):
        return False, "Host não permitido para este serviço."

    path = (parsed.path or "").lower()
    query = (parsed.query or "").lower()
    combined = f"{path}?{query}"
    if "rss" not in combined:
        return False, "O caminho da URL deve indicar um feed RSS (ex.: conter 'rss')."

    return True, ""


class ObservatorioRSSFeedGet(Service):
    """GET /@observatorio-rss-feed?url=... — retorna JSON {"raw": "..."}."""

    def check_permission(self):
        sm = getSecurityManager()
        if not sm.checkPermission("View", self.context):
            raise Unauthorized()

    def reply(self):
        raw = self.request.form.get("url")
        if raw is None:
            self.request.response.setStatus(400)
            return {"message": "Parâmetro obrigatório ausente: url."}

        ok, err = validate_feed_url(raw)
        if not ok:
            self.request.response.setStatus(400)
            return {"message": err}

        headers = {"User-Agent": USER_AGENT}
        try:
            resp = requests.get(
                raw,
                timeout=REQUEST_TIMEOUT,
                headers=headers,
            )
        except requests.Timeout:
            self.request.response.setStatus(502)
            return {"message": "Tempo esgotado ao obter o feed."}
        except requests.RequestException:
            self.request.response.setStatus(502)
            return {"message": "Falha de rede ao obter o feed."}

        if resp.status_code >= 400:
            self.request.response.setStatus(502)
            return {
                "message": (
                    f"O servidor do feed respondeu com status HTTP {resp.status_code}."
                )
            }

        body = resp.text
        lower = body.lower()
        if "<item" not in lower and "<entry" not in lower:
            self.request.response.setStatus(502)
            return {"message": "A resposta não é um feed RSS/Atom reconhecível."}

        self.request.response.setStatus(200)
        return {"raw": body}
