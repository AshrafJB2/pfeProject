from django.db import models
from django.contrib.auth.models import User

class Content(models.Model):
    SUMMARY_LENGTH_CHOICES = [
        ('short', 'Short'),
        ('medium', 'Medium'),
        ('long', 'Long'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    original_file = models.FileField(upload_to='documents/', null=True, blank=True)
    original_text = models.TextField(null=True, blank=True)
    summary_length = models.CharField(
        max_length=10,
        choices=SUMMARY_LENGTH_CHOICES,
        default='medium'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Processed content
    extracted_text = models.TextField(blank=True)
    summary = models.TextField(blank=True)
    keywords = models.TextField(blank=True)
    auto_title = models.CharField(max_length=255, blank=True)
    
    def __str__(self):
        return self.auto_title or "Content Summary"