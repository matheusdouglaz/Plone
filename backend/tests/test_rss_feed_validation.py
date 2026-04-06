from observatorio.plone.services.rss_feed import validate_feed_url


def test_valid_gov_br_feed_url():
    ok, _ = validate_feed_url(
        "https://www.gov.br/mds/pt-br/assuntos/noticias/RSS",
    )
    assert ok is True


def test_rejects_http():
    ok, msg = validate_feed_url("http://www.gov.br/foo/rss")
    assert ok is False
    assert "HTTPS" in msg


def test_rejects_non_gov_host():
    ok, msg = validate_feed_url("https://evil.com/path/rss")
    assert ok is False
    assert "Host" in msg


def test_rejects_ip():
    ok, msg = validate_feed_url("https://127.0.0.1/foo/rss")
    assert ok is False


def test_rejects_path_without_rss_hint():
    ok, msg = validate_feed_url("https://www.gov.br/mds/pt-br/assuntos/noticias/")
    assert ok is False
