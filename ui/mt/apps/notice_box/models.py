from django.db import models
from django.utils.translation import gettext_lazy as _


class Notices(models.Model):
    regarding = models.CharField(_("Betreff"), max_length=255, null=True, blank=True)
    full_name = models.CharField(_("Namen angeben"), max_length=255, null=True, blank=True, default="Unknown")
    notice = models.TextField(_("Metteilung"), null=True, blank=True)

    def __str__(self):
        return self.regarding

    class Meta:
        db_table = "user_notice"
        verbose_name = "Notice"
        verbose_name_plural = "Notices"
