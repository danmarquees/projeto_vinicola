from django.db import migrations, models
import uuid

def gen_uuid(apps, schema_editor):
    AvaliacaoCliente = apps.get_model('tracker', 'AvaliacaoCliente')
    for obj in AvaliacaoCliente.objects.all():
        obj.uuid = uuid.uuid4()
        obj.save()

class Migration(migrations.Migration):

    dependencies = [
        ('tracker', '0007_alter_avaliacaocliente_id'),
    ]

    operations = [
        # 1. Adiciona nova coluna UUID temporária
        migrations.AddField(
            model_name='avaliacaocliente',
            name='uuid',
            field=models.UUIDField(default=uuid.uuid4, editable=False, null=True),
        ),
        # 2. Preenche a coluna uuid
        migrations.RunPython(gen_uuid, reverse_code=migrations.RunPython.noop),
        # 3. Remove o campo id antigo e define uuid como PK
        migrations.AlterField(
            model_name='avaliacaocliente',
            name='uuid',
            field=models.UUIDField(primary_key=True, default=uuid.uuid4, serialize=False, editable=False),
        ),
        migrations.RemoveField(
            model_name='avaliacaocliente',
            name='id',
        ),
        migrations.RenameField(
            model_name='avaliacaocliente',
            old_name='uuid',
            new_name='id',
        ),
    ]