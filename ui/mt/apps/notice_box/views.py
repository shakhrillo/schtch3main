import datetime

from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView

from apps.notice_box.models import Notices
from apps.notice_box.serializers import (
    NoticeCreateListSerializers
)
from utils.send_email import Util
from utils.responses import (
    bad_request_response,
    success_response,
    success_created_response,
    success_deleted_response,
)

from utils.expected_fields import check_required_key
from drf_yasg.utils import swagger_auto_schema


class NoticeListView(APIView):
    permission_classes = [AllowAny]

    """ Notice Get View """
    @swagger_auto_schema(operation_description="Retrieve a list of notices",
                         tags=['Notice'],
                         responses={200: NoticeCreateListSerializers(many=True)})
    def get(self, request):
        queryset = Notices.objects.all().order_by('-id')
        serializers = NoticeCreateListSerializers(queryset, many=True,
                                              context={'request': request})
        return success_response(serializers.data)

    """ Notice Post View """
    @swagger_auto_schema(request_body=NoticeCreateListSerializers,
                         operation_description="Notice create",
                         tags=['Notice'],
                         responses={201: NoticeCreateListSerializers(many=False)})
    def post(self, request):
        valid_fields = {'regarding', 'full_name', 'notice'}
        unexpected_fields = check_required_key(request, valid_fields)
        if unexpected_fields:
            return bad_request_response(f"Unexpected fields: {', '.join(unexpected_fields)}")

        serializers = NoticeCreateListSerializers(data=request.data, context={'request': request})
        if serializers.is_valid(raise_exception=True):
            instance = serializers.save()
            email_body = (f"Data:\n"
                          f"Betreff: {instance.regarding} \n"
                          f"Namen angeben: {instance.full_name} \n"
                          f"Mitteilung: {instance.notice} \n")
            email_data = {
                "email_body": email_body,
                "to_email": "amirbekazimov7@gmail.com",
                "email_subject": "Data",
            }
            Util.send(email_data)
            return success_created_response(serializers.data)
        return bad_request_response(serializers.errors)


class NoticeDetailView(APIView):
    permission_classes = [AllowAny]

    """ Notice Get View """
    @swagger_auto_schema(operation_description="Retrieve a notice",
                         tags=['Notice'],
                         responses={200: NoticeCreateListSerializers(many=True)})
    def get(self, request, pk):
        queryset = get_object_or_404(Notices, pk=pk)
        serializers = NoticeCreateListSerializers(queryset, context={'request': request})
        return success_response(serializers.data)

    """ Notice Put View """
    @swagger_auto_schema(request_body=NoticeCreateListSerializers,
                         operation_description="Notice update",
                         tags=['Notice'],
                         responses={200: NoticeCreateListSerializers(many=False)})
    def put(self, request, pk):
        valid_fields = {'regarding', 'full_name', 'notice'}
        unexpected_fields = check_required_key(request, valid_fields)
        if unexpected_fields:
            return bad_request_response(f"Unexpected fields: {', '.join(unexpected_fields)}")

        queryset = get_object_or_404(Notices, pk=pk)
        serializers = NoticeCreateListSerializers(instance=queryset, data=request.data,
                                              context={'request': request})
        if serializers.is_valid(raise_exception=True):
            serializers.save()
            return success_response(serializers.data)
        return bad_request_response(serializers.errors)

    """ Notice Delete View """
    @swagger_auto_schema(operation_description="Delete a notice",
                         tags=['Notice'],
                         responses={204: 'Delete notice'})
    def delete(self, request, pk):
        queryset = get_object_or_404(Notices, pk=pk)
        queryset.delete()
        return success_deleted_response("Successfully deleted")
