# Generated by Django 2.2.4 on 2023-10-13 05:32

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('todomanagement', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelTable(
            name='category',
            table='Category',
        ),
        migrations.AlterModelTable(
            name='myday',
            table='MyDay',
        ),
        migrations.AlterModelTable(
            name='todoimages',
            table='TodoImages',
        ),
    ]