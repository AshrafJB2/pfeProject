from rest_framework import serializers
from .models import Content
from django.contrib.auth.models import User

class ContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Content
        fields = [
            'id',
            'original_file',
            'original_text',
            'summary_length',
            'created_at',
            'extracted_text',
            'summary',
            'keywords',
            'auto_title'
        ]
        read_only_fields = [
            'created_at',
            'extracted_text',
            'summary',
            'keywords',
            'auto_title'
        ]
    
    def validate(self, data):
        if not data.get('original_file') and not data.get('original_text'):
            raise serializers.ValidationError("Either file or text must be provided")
        return data


class GetUser(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')
        read_only_fields = ('id', 'username', 'email')


class UserSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'password2', 'email')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        if validated_data['password'] != validated_data['password2']:
            raise serializers.ValidationError({'password': 'Passwords must match.'})
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user