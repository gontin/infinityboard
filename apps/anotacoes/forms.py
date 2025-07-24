from django import forms
from .models import Note, NoteImage, NotePDF

class NoteForm(forms.ModelForm):
    class Meta:
        model = Note
        fields = ['title', 'content']  # Adapte se tiver mais campos

class NoteImageForm(forms.ModelForm):
    class Meta:
        model = NoteImage
        fields = ['image']

class NotePDFForm(forms.ModelForm):
    class Meta:
        model = NotePDF
        fields = ['pdf']
