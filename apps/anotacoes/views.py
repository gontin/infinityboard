from django.shortcuts import render
from django.http import JsonResponse
# Create your views here.

from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import Note, NoteImage, NotePDF
from .forms import NoteForm, NoteImageForm, NotePDFForm

@login_required
def note_list(request):
    notes = Note.objects.filter(user=request.user).order_by('-updated_at')
    return render(request, 'anotacoes/note_list.html', {'notes': notes})

@login_required
def note_create(request):
    if request.method == 'POST':
        form = NoteForm(request.POST)
        if form.is_valid():
            note = form.save(commit=False)
            note.user = request.user
            note.save()
            return redirect('note_list')
    else:
        form = NoteForm()
    return render(request, 'anotacoes/note_create.html', {'form': form})

@login_required
def note_edit(request, pk):
    note = get_object_or_404(Note, pk=pk, user=request.user)
    if request.method == 'POST':
        form = NoteForm(request.POST, instance=note)
        if form.is_valid():
            form.save()
            return redirect('note_detail', pk=note.pk)
    else:
        form = NoteForm(instance=note)
    return render(request, 'anotacoes/note_form.html', {'form': form, 'note': note})

@login_required
def note_delete(request, pk):
    if request.method == 'POST' and request.headers.get('x-requested-with') == 'XMLHttpRequest':
        note = get_object_or_404(Note, pk=pk, user=request.user)
        note.delete()
        return JsonResponse({'success': True})
    return JsonResponse({'success': False}, status=400)