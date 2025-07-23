from datetime import datetime, timedelta
from evento_cldr.py import criar_evento_google_calendar  # substitua pelo caminho certo

titulo = "Evento de Teste"
inicio = datetime.now() + timedelta(minutes=5)
fim = inicio + timedelta(hours=1)

evento_id = criar_evento_google_calendar(titulo, inicio, fim)
print(f"Evento criado com ID: {evento_id}")