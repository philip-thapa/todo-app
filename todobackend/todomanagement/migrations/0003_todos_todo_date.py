# Generated by Django 2.2.4 on 2023-10-17 07:50

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('todomanagement', '0002_auto_20231013_0532'),
    ]

    operations = [
        migrations.AddField(
            model_name='todos',
            name='todo_date',
            field=models.DateField(auto_now_add=True, db_column='todoDate', default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
