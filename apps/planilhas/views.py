from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
import json
import csv
import io
from datetime import datetime
from .models import Turma, Aluno
from .serializers import serialize_turma, serialize_aluno

@login_required
def planilhas_view(request):
    return render(request, "planilhas/planilhas.html")

# APIs para Turmas
@csrf_exempt
@require_http_methods(["GET", "POST"])
def turmas_api(request):
    if not request.user.is_authenticated:
        return JsonResponse({"success": False, "error": "Autenticação necessária"}, status=401)

    if request.method == "GET":
        turmas = Turma.objects.all().order_by("numero")
        data = [serialize_turma(turma) for turma in turmas]
        return JsonResponse({"turmas": data})
    
    elif request.method == "POST":
        try:
            data = json.loads(request.body)
            turma = Turma.objects.create(
                numero=data["numero"],
                curso_modulo=data["curso_modulo"],
                periodo=data["periodo"],
                dias_semana=data["dias_semana"]
            )
            return JsonResponse({
                "success": True,
                "turma": serialize_turma(turma)
            })
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=400)

@csrf_exempt
@require_http_methods(["PUT", "DELETE"])
def turma_detail_api(request, turma_id):
    if not request.user.is_authenticated:
        return JsonResponse({"success": False, "error": "Autenticação necessária"}, status=401)

    turma = get_object_or_404(Turma, id=turma_id)
    
    if request.method == "PUT":
        try:
            data = json.loads(request.body)
            turma.numero = data["numero"]
            turma.curso_modulo = data["curso_modulo"]
            turma.periodo = data["periodo"]
            turma.dias_semana = data["dias_semana"]
            turma.save()
            return JsonResponse({
                "success": True,
                "turma": serialize_turma(turma)
            })
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=400)
    
    elif request.method == "DELETE":
        try:
            turma.delete()
            return JsonResponse({"success": True})
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=400)

# APIs para Alunos
@csrf_exempt
@require_http_methods(["GET", "POST"])
def alunos_api(request):
    if not request.user.is_authenticated:
        return JsonResponse({"success": False, "error": "Autenticação necessária"}, status=401)

    if request.method == "GET":
        turma_id = request.GET.get("turma_id")
        if turma_id:
            alunos = Aluno.objects.filter(turma_id=turma_id).order_by("nome")
        else:
            alunos = Aluno.objects.all().order_by("nome")
        
        data = [serialize_aluno(aluno) for aluno in alunos]
        return JsonResponse({"alunos": data})
    
    elif request.method == "POST":
        try:
            data = json.loads(request.body)
            turma = get_object_or_404(Turma, id=data["turma_id"])
            
            aluno = Aluno.objects.create(
                turma=turma,
                nome=data["nome"],
                email=data["email"],
                telefone=data.get("telefone", ""),
                data_nascimento=datetime.fromisoformat(data["data_nascimento"]).date() if data.get("data_nascimento") else None,
                endereco=data.get("endereco", "")
            )
            return JsonResponse({
                "success": True,
                "aluno": serialize_aluno(aluno)
            })
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=400)

@csrf_exempt
@require_http_methods(["PUT", "DELETE"])
def aluno_detail_api(request, aluno_id):
    if not request.user.is_authenticated:
        return JsonResponse({"success": False, "error": "Autenticação necessária"}, status=401)

    aluno = get_object_or_404(Aluno, id=aluno_id)
    
    if request.method == "PUT":
        try:
            data = json.loads(request.body)
            aluno.nome = data["nome"]
            aluno.email = data["email"]
            aluno.telefone = data.get("telefone", "")
            aluno.data_nascimento = datetime.fromisoformat(data["data_nascimento"]).date() if data.get("data_nascimento") else None
            aluno.endereco = data.get("endereco", "")
            aluno.save()
            return JsonResponse({
                "success": True,
                "aluno": serialize_aluno(aluno)
            })
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=400)
    
    elif request.method == "DELETE":
        try:
            aluno.delete()
            return JsonResponse({"success": True})
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=400)

# Exportação de planilha
@login_required
def exportar_planilha(request, turma_id):
    turma = get_object_or_404(Turma, id=turma_id)
    alunos = turma.alunos.all().order_by("nome")
    
    response = HttpResponse(content_type="text/csv")
    response["Content-Disposition"] = f"attachment; filename=\"{turma.numero}_{turma.curso_modulo}_alunos.csv\""
    
    writer = csv.writer(response)
    writer.writerow(["Nome", "Email", "Telefone", "Data de Nascimento", "Endereço"])
    
    for aluno in alunos:
        writer.writerow([
            aluno.nome,
            aluno.email,
            aluno.telefone or "",
            aluno.data_nascimento.strftime("%d/%m/%Y") if aluno.data_nascimento else "",
            aluno.endereco or ""
        ])
    
    return response

# Importação de planilha
@csrf_exempt
@login_required
def importar_planilha(request, turma_id):
    if request.method != "POST":
        return JsonResponse({"success": False, "error": "Método não permitido"}, status=405)
    
    turma = get_object_or_404(Turma, id=turma_id)
    
    if "arquivo" not in request.FILES:
        return JsonResponse({"success": False, "error": "Nenhum arquivo enviado"}, status=400)
    
    arquivo = request.FILES["arquivo"]
    
    if not arquivo.name.endswith(".csv"):
        return JsonResponse({"success": False, "error": "Apenas arquivos CSV são suportados"}, status=400)
    
    try:
        decoded_file = arquivo.read().decode("utf-8")
        io_string = io.StringIO(decoded_file)
        reader = csv.DictReader(io_string)
        
        alunos_criados = 0
        erros = []
        
        for row_num, row in enumerate(reader, start=2):
            try:
                if Aluno.objects.filter(email=row.get("Email", "").strip()).exists():
                    erros.append(f"Linha {row_num}: Email {row.get('Email', '')} já existe")
                    continue
                
                data_nascimento = None
                if row.get("Data de Nascimento"):
                    try:
                        data_nascimento = datetime.strptime(row["Data de Nascimento"].strip(), "%d/%m/%Y").date()
                    except ValueError:
                        try:
                            data_nascimento = datetime.strptime(row["Data de Nascimento"].strip(), "%Y-%m-%d").date()
                        except ValueError:
                            erros.append(f"Linha {row_num}: Data de nascimento inválida")
                            continue
                
                Aluno.objects.create(
                    turma=turma,
                    nome=row.get("Nome", "").strip(),
                    email=row.get("Email", "").strip(),
                    telefone=row.get("Telefone", "").strip(),
                    data_nascimento=data_nascimento,
                    endereco=row.get("Endereço", "").strip()
                )
                alunos_criados += 1
                
            except Exception as e:
                erros.append(f"Linha {row_num}: {str(e)}")
        
        return JsonResponse({
            "success": True,
            "alunos_criados": alunos_criados,
            "erros": erros
        })
        
    except Exception as e:
        return JsonResponse({"success": False, "error": f"Erro ao processar arquivo: {str(e)}"}, status=400)

