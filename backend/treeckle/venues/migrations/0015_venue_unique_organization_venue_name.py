# Generated by Django 3.2.3 on 2021-06-22 17:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('venues', '0014_auto_20210622_1710'),
    ]

    operations = [
        migrations.AddConstraint(
            model_name='venue',
            constraint=models.UniqueConstraint(fields=('organization_id', 'name'), name='unique_organization_venue_name'),
        ),
    ]
