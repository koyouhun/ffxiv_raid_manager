import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.forms.models import model_to_dict
from api.models import Team


@csrf_exempt
def make_team(request):
    data = json.loads(request.body)
    name = data.get('name')

    if not name:
        return JsonResponse({
            'success': False,
            'message': 'Invalid name.'
        })

    try:
        team = Team.objects.create(name=name)
    except:
        return JsonResponse({
            'success': False,
            'message': 'Invalid name.'
        })

    return JsonResponse({
        'success': True,
        'unique_id': team.id
    })


@csrf_exempt
def search_team(request):
    data = json.loads(request.body)
    id = data.get('id')
    if not id:
        return JsonResponse({'success': False})
    if not Team.objects.filter(id=id).exists():
        return JsonResponse({
            'success': False,
            'message': 'Invalid unique_id.'
        })
    return JsonResponse({'success': True})


@csrf_exempt
def load_team(request):
    id = request.GET.get('unique_id')
    if id is None:
        return JsonResponse({
            'success': False,
            'message': 'Unique_id is not provided.'
        })

    try:
        team = Team.objects.get(id=id)
    except Team.DoesNotExist:
        return JsonResponse({
            'success': False,
            'message': 'Invalid unique_id.'
        })

    team.fix_weapon = team.fix_weapon.split(',') if team.fix_weapon else []
    team.fix_left = team.fix_left.split(',') if team.fix_left else []
    team.fix_right = team.fix_right.split(',') if team.fix_right else []
    return JsonResponse(model_to_dict(team))


@csrf_exempt
def save_fix(request):
    data = json.loads(request.body)
    id = data.get('unique_id')
    fix_type = data.get('fix_type')
    job_list = data.get('job_list')

    if fix_type not in Team.FIX:
        return JsonResponse({
            'success': False,
            'message': 'Invalid fix_type.'
        })
    if not job_list:
        return JsonResponse({
            'success': False,
            'message': 'Invalid job.'
        })
    for job in job_list:
        if job not in Team.JOB:
            return JsonResponse({
                'success': False,
                'message': 'Invalid job.'
            })
    if not Team.objects.filter(id=id).exists():
        return JsonResponse({
            'success': False,
            'message': 'Invalid unique_id.'
        })

    Team.objects.filter(id=id).update(**{fix_type: ",".join(job_list)})
    return JsonResponse({'success': True})


@csrf_exempt
def save_job(request):
    data = json.loads(request.body)
    id = data.get('unique_id')
    job = data.get('job')
    data_type = data.get('data_type')
    item_status = data.get('item_status')

    if job not in Team.JOB:
        return JsonResponse({
            'success': False,
            'message': 'Invalid job.'
        })
    if data_type == 'bis':
        column = job + '_BIS'
    elif data_type == 'current':
        column = job + '_CURRENT'
    else:
        return JsonResponse({
            'success': False,
            'message': 'Invalid data_type.'
        })
    if not Team.objects.filter(id=id).exists():
        return JsonResponse({
            'success': False,
            'message': 'Invalid unique_id.'
        })

    print(column)
    print(item_status)
    Team.objects.filter(id=id).update(**{column: item_status})
    try:
        Team.objects.filter(id=id).update(**{column: item_status})
    except:
        return JsonResponse({
            'success': False,
            'message': 'Invalid item_status.'
        })
    return JsonResponse({'success': True})
