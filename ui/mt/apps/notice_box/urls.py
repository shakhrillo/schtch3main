from django.urls import path
from apps.notice_box import views

urlpatterns = [
    path('', views.NoticeListView.as_view()),
    path('/<int:pk>/', views.NoticeDetailView.as_view()),
]
