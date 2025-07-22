from google.oauth2 import service_account
from googleapiclient.discovery import build
import datetime
from google.oauth2.service_account import Credentials

def criar_evento_google_calendar(titulo, inicio, fim):
    try:
        credenciais = Credentials.from_service_account_file(
            'credentials.json',  # ← coloque o caminho correto
            scopes=['https://www.googleapis.com/auth/calendar']
        )

        service = build('calendar', 'v3', credentials=credenciais)

        evento = {
            'summary': titulo,
            'start': {'dateTime': inicio, 'timeZone': 'America/Sao_Paulo'},
            'end': {'dateTime': fim, 'timeZone': 'America/Sao_Paulo'},
        }

        evento_criado = service.events().insert(calendarId='primary', body=evento).execute()
        return evento_criado.get('id')

    except Exception as e:
        print(f'Erro ao criar evento no Google: {e}')
        return None

def deletar_evento_google_calendar(evento_id):
    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    service = build('calendar', 'v3', credentials=credentials)

    service.events().delete(calendarId='primary', eventId=evento_id).execute()
def criar_evento_google(titulo, tipo, inicio, fim, usuario):
    # Aqui você deve recuperar as credenciais do usuário
    creds = Credentials(...)  # Carregue do banco ou sessão

    service = build('calendar', 'v3', credentials=creds)

    evento = {
        'summary': f"{titulo} ({tipo})",
        'start': {'dateTime': inicio, 'timeZone': 'America/Sao_Paulo'},
        'end': {'dateTime': fim, 'timeZone': 'America/Sao_Paulo'},
    }

    evento_criado = service.events().insert(calendarId='primary', body=evento).execute()
    return evento_criado  # contém o `id` do evento