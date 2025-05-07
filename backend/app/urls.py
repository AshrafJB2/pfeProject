from django.urls import path
from .views import ContentCreateView, ContentDetailView, DownloadContentView, RegisterView, CurrentUserView

urlpatterns = [
    path('content/', ContentCreateView.as_view(), name='content-list'),
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('content/<int:pk>/', ContentDetailView.as_view(), name='content-detail'),
    path('content/<int:pk>/download/<str:file_format>', DownloadContentView.as_view(), name='content-download'),
    path('user/', CurrentUserView.as_view(), name='current-user')
]