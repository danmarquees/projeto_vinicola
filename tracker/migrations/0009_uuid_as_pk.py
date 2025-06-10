from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('tracker', '0008_auto_20250610_0310'),
    ]

    operations = [
        # Remove a PK antiga
        migrations.RemoveField(
            model_name='avaliacaocliente',
            name='id',
        ),
        # Torna uuid a nova PK
        migrations.AlterField(
            model_name='avaliacaocliente',
            name='uuid',
            field=models.UUIDField(primary_key=True, default=None, serialize=False, editable=False),
        ),
        # Renomeia uuid para id
        migrations.RenameField(
            model_name='avaliacaocliente',
            old_name='uuid',
            new_name='id',
        ),
    ]