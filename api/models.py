import uuid
from django.db import models


class Team(models.Model):
    FIX = ['fix_weapon', 'fix_left', 'fix_right']
    JOB = [
        'PLD', 'WAR', 'DRK',
        'WHM', 'SCH', 'AST',
        'BRD', 'MCH',
        'MNK', 'NIN', 'DRG', 'SAM',
        'BLM', 'SMN', 'RDM'
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=512)

    # Fix Field
    # Comma separated string
    # ex) PLD,WAR,NIN
    fix_weapon = models.CharField(max_length=128, default="")
    fix_left = models.CharField(max_length=128, default="")
    fix_right = models.CharField(max_length=128, default="")

    # Character Field Meaning
    # 0: not selected
    # 1: normal
    # 2: crafted
    # 3: slate
    # 4: augmented
    # 5: savage

    # 2^ 0: Exist Flag (0=not_exist, 1=exist)
    # 2^ 1~3: Weapon
    # 2^ 4~6: SubWeapon
    # 2^ 7~9: Head
    # 2^ 10~12: Chest
    # 2^ 13~15: Hands
    # 2^ 16~18: Waist
    # 2^ 19~21: Legs
    # 2^ 22~24: Feet
    # 2^ 25~27: Earrings
    # 2^ 28~30: Necklace
    # 2^ 31~33: Bracelet
    # 2^ 34~36: Ring Left
    # 2^ 37~39: Ring Right
    PLD_CURRENT = models.BigIntegerField(default=0)
    WAR_CURRENT = models.BigIntegerField(default=0)
    DRK_CURRENT = models.BigIntegerField(default=0)

    WHM_CURRENT = models.BigIntegerField(default=0)
    SCH_CURRENT = models.BigIntegerField(default=0)
    AST_CURRENT = models.BigIntegerField(default=0)

    BRD_CURRENT = models.BigIntegerField(default=0)
    MCH_CURRENT = models.BigIntegerField(default=0)

    MNK_CURRENT = models.BigIntegerField(default=0)
    NIN_CURRENT = models.BigIntegerField(default=0)
    DRG_CURRENT = models.BigIntegerField(default=0)
    SAM_CURRENT = models.BigIntegerField(default=0)

    BLM_CURRENT = models.BigIntegerField(default=0)
    SMN_CURRENT = models.BigIntegerField(default=0)
    RDM_CURRENT = models.BigIntegerField(default=0)


    PLD_BIS = models.BigIntegerField(default=0)
    WAR_BIS = models.BigIntegerField(default=0)
    DRK_BIS = models.BigIntegerField(default=0)

    WHM_BIS = models.BigIntegerField(default=0)
    SCH_BIS = models.BigIntegerField(default=0)
    AST_BIS = models.BigIntegerField(default=0)

    BRD_BIS = models.BigIntegerField(default=0)
    MCH_BIS = models.BigIntegerField(default=0)

    MNK_BIS = models.BigIntegerField(default=0)
    NIN_BIS = models.BigIntegerField(default=0)
    DRG_BIS = models.BigIntegerField(default=0)
    SAM_BIS = models.BigIntegerField(default=0)

    BLM_BIS = models.BigIntegerField(default=0)
    SMN_BIS = models.BigIntegerField(default=0)
    RDM_BIS = models.BigIntegerField(default=0)

    def __str__(self):
        return "%s (%s)" % (self.name, self.id)
