from rest_framework import serializers
from .models import Content

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