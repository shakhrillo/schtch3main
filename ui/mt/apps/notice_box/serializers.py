from rest_framework import serializers
from apps.notice_box.models import Notices


class NoticeCreateListSerializers(serializers.ModelSerializer):

    class Meta:
        model = Notices
        fields = [
            'id', 'regarding', 'full_name', 'notice'
        ]
        extra_kwargs = {
            "regarding": {"required": True},
            'notice': {'required': True},
        }

    def validate(self, attrs):
        regarding = attrs.get('regarding')
        notice = attrs.get('notice')
        if regarding == None or notice == None:
            raise serializers.ValidationError(False)
        return attrs

    def create(self, validated_data):
        return super().create(validated_data)

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)
