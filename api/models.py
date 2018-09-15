import uuid
from django.db import models

# Create your models here.
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
    # Comma seperated string
    # ex) PLD,WAR,NIN
    fix_weapon = models.CharField(max_length=128, default="")
    fix_left = models.CharField(max_length=128, default="")
    fix_right = models.CharField(max_length=128, default="")

    # Character Field Meaning
    # 2^0: Exist Flag
    # 2^1: Weapon
    # 2^2: SubWeapon
    # 2^3: Head
    # 2^4: Body
    # 2^5: Hands
    # 2^6: Waist
    # 2^7: Legs
    # 2^8: Feet
    # 2^9: Earrings
    # 2^10: Necklace
    # 2^11: Bracelet
    # 2^12: Ring Left
    # 2^13: Ring Right
    # 2^14:
    # 2^15:
    # 2^16:
    PLD = models.PositiveSmallIntegerField(default=0)
    WAR = models.PositiveSmallIntegerField(default=0)
    DRK = models.PositiveSmallIntegerField(default=0)

    WHM = models.PositiveSmallIntegerField(default=0)
    SCH = models.PositiveSmallIntegerField(default=0)
    AST = models.PositiveSmallIntegerField(default=0)

    BRD = models.PositiveSmallIntegerField(default=0)
    MCH = models.PositiveSmallIntegerField(default=0)

    MNK = models.PositiveSmallIntegerField(default=0)
    NIN = models.PositiveSmallIntegerField(default=0)
    DRG = models.PositiveSmallIntegerField(default=0)
    SAM = models.PositiveSmallIntegerField(default=0)

    BLM = models.PositiveSmallIntegerField(default=0)
    SMN = models.PositiveSmallIntegerField(default=0)
    RDM = models.PositiveSmallIntegerField(default=0)
