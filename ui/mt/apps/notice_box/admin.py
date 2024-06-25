from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from apps.notice_box.models import Notices


class NoticeAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'regarding', 'id']
    search_fields = ['full_name', 'regarding']


admin.site.register(Notices, NoticeAdmin)
