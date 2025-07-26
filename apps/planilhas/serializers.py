from django.forms.models import model_to_dict

def serialize_turma(turma):
    return {
        'id': turma.id,
        'numero': turma.numero,
        'cursoModulo': turma.curso_modulo,
        'periodo': turma.periodo,
        'diasSemana': turma.dias_semana,
        'totalAlunos': turma.alunos.count()
    }

def serialize_aluno(aluno):
    return {
        'id': aluno.id,
        'turmaId': aluno.turma.id,
        'nome': aluno.nome,
        'email': aluno.email,
        'telefone': aluno.telefone,
        'dataNascimento': aluno.data_nascimento.isoformat() if aluno.data_nascimento else None,
        'endereco': aluno.endereco,
        'dataCadastro': aluno.data_cadastro.isoformat()
    }

