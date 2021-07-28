# Generated by Django 3.2.5 on 2021-07-28 07:56

from django.db import migrations, models
import django_update_from_dict


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('image_url', models.URLField(max_length=500)),
                ('image_id', models.CharField(blank=True, max_length=255)),
            ],
            options={
                'abstract': False,
            },
            bases=(django_update_from_dict.UpdateFromDictMixin, models.Model),
        ),
    ]
