import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tracker', '0006_rename_nome_lote_avaliacaocliente_lote_vinho_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='avaliacaocliente',
            name='id',
            field=models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False),
        ),
    ]
