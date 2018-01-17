# coding: utf-8
from __future__ import unicode_literals

def	app(environ, start_response):
	status = '200 OK'
	response_body = """<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="x-ua-compatible" content="ie=edge">
<title>vlc vod</title>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<style>
	*{margin: 0; padding: 0; box-sizing: border-box;}
	*:before, *:after { box-sizing: inherit; }
	main{width: 100%; background-color: #f8f8f8; position: relative;}
	main p{font-size: 14px; text-align: center; }
	main section{width: 100%; height: 1000px;}
	header, footer{width: 100%; background-color: #dd3333; color: #ffffff;}
	header{height: 44px;}
	header h2{text-align: center; height: 44px; line-height: 44px; font-size: 16px; font-weight: 500;}
</style>
</head>
<body>
	<header>
		<h2>vod list</h2>
	</header>
	<main>
		<p>main zoom</p>
		<section>more section</section>
	</main>
</body>
</html>"""

	response_headers = [('Content-Type', 'text/html'),('Content-Length', str(len(response_body)))]
	start_response(status, response_headers)
	
	return [response_body]
