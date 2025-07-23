from google.oauth2 import service_account
from googleapiclient.discovery import build
import datetime
from google.oauth2.service_account import Credentials
from django.conf import settings
import os

CAMINHO_CREDENCIAIS = os.path.join(settings.BASE_DIR, 'infinityboard-calendario.json')
CALENDARIO_ID = 'yuumizinham@gmail.com'

def criar_evento_google_calendar(titulo, inicio, fim, color_id='8'):
    credenciais = Credentials.from_service_account_file(
        'infinityboard-calendario.json',
        scopes=['https://www.googleapis.com/auth/calendar']
    )

    service = build('calendar', 'v3', credentials=credenciais)

    evento = {
        'summary': titulo,
        'start': {'dateTime': inicio.isoformat(), 'timeZone': 'America/Sao_Paulo'},
        'end': {'dateTime': fim.isoformat(), 'timeZone': 'America/Sao_Paulo'},
        'colorId': color_id,
    }

    evento_criado = service.events().insert(
        calendarId=CALENDARIO_ID,
        body=evento
    ).execute()

    return evento_criado['id']
    
def deletar_evento_google_calendar(evento_id):
    try:
        credenciais = Credentials.from_service_account_file(
            'infinityboard-calendario.json',
            scopes=['https://www.googleapis.com/auth/calendar']
        )

        service = build('calendar', 'v3', credentials=credenciais)
        service.events().delete(calendarId=CALENDARIO_ID, eventId=evento_id).execute()
    except Exception as e:
        print(f'Erro ao deletar evento no Google: {e}')