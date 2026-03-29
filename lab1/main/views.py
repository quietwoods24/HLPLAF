from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse

from django.contrib.auth.decorators import login_required
from django.contrib.auth import login
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import redirect, render

from django.urls import reverse

from .models import Article
from .forms import ArticleForm

def index(request):
    articles = Article.objects.all()
    return render(request, 'main/index.html', {'articles': articles})

# https://docs.djangoproject.com/en/6.0/topics/auth/default/#the-login-required-decorator
@login_required
def add(request):
    error = None
    if (request.method == "POST"):
        form=ArticleForm(request.POST)
        if form.is_valid():
            article = form.save(commit=False)                        
            article.author = request.user
            article.save()
            return redirect('/')
        else:
            error="ERROR"
    else:
        form=ArticleForm()
    
    context = {
        "form": form,
        "error": error
    }
    return render(request, 'main/add.html', context)

@login_required
def delete(request, el_id):
    article = get_object_or_404(Article, pk=el_id)
    error = None
    
    if article.author == request.user:
        article.delete()
    
    return redirect('/')

@login_required
def update(request, el_id):
    article = get_object_or_404(Article, pk=el_id)
    error = None
    if article.author == request.user:
        if (request.method == "POST"):
            form=ArticleForm(request.POST, instance=article)
            if form.is_valid():
                form.save()
                return redirect('/')
            else:
                error="ERROR"
        else:
            form=ArticleForm(instance=article)
        return render(request, 'main/update.html', {'form': form})
    else:
        return redirect('/')



# =-=-=-=-=-=-=-=-=-=- USER =-=-=-=-=-=-=-=-=-=- 
# https://realpython.com/django-user-management/


def signup(request):
    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('/')
    else:
        form = UserCreationForm()
    return render(request, "registration/signup.html", {"form": form})