from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Article(models.Model):
    heading=models.CharField('Heading', max_length=150)
    # https://www.geeksforgeeks.org/python/textfield-django-models/
    body=models.TextField('Body', default = "Article body")
    theme = models.CharField('Genre', max_length=100)
    # https://www.geeksforgeeks.org/python/datetimefield-django-models/
    creation_date = models.DateTimeField(auto_now_add=True)

    author = models.ForeignKey(User, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.heading
    
# https://www.youtube.com/watch?v=EjIoERmeVE8