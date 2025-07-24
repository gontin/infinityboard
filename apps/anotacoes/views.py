from django.shortcuts import render

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
            return redirect('note_detail', pk=note.pk)
    else:
        form = NoteForm()
    return render(request, 'anotacoes/', {'form': form})

@login_required
def note_detail(request, pk):
    note = get_object_or_404(Note, pk=pk, user=request.user)
    image_form = NoteImageForm()
    pdf_form = NotePDFForm()
    if request.method == 'POST':
        if 'add_image' in request.POST:
            image_form = NoteImageForm(request.POST, request.FILES)
            if image_form.is_valid():
                image = image_form.save(commit=False)
                image.note = note
                image.save()
                return redirect('note_detail', pk=pk)
        elif 'add_pdf' in request.POST:
            pdf_form = NotePDFForm(request.POST, request.FILES)
            if pdf_form.is_valid():
                pdf = pdf_form.save(commit=False)
                pdf.note = note
                pdf.save()
                return redirect('note_detail', pk=pk)
    return render(request, 'anotacoes/note_detail.html', {
        'note': note,
        'image_form': image_form,
        'pdf_form': pdf_form,
    })

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
    note = get_object_or_404(Note, pk=pk, user=request.user)
    if request.method == 'POST':
        note.delete()
        return redirect('note_list')
    return render(request, 'anotacoes/note_confirm_delete.html', {'note': note})
