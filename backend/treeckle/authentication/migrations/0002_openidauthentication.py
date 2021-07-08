# Generated by Django 3.2.3 on 2021-07-08 16:46

from django.db import migrations, models
import django.db.models.deletion
import django_update_from_dict


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0010_auto_20210708_1620'),
        ('authentication', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='OpenIdAuthentication',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('auth_id', models.CharField(max_length=100, unique=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='users.user')),
            ],
            options={
                'abstract': False,
            },
            bases=(django_update_from_dict.UpdateFromDictMixin, models.Model),
        ),
    ]
