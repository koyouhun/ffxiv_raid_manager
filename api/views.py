from django.http import JsonResponse
from django.core.serializers import serialize
from django.views.decorators.csrf import csrf_exempt
from models import Team

@csrf_exempt
def make_team(request):
	name = request.POST.get('name')

	if not Name:
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
def seach_team(request):
	id = request.POST.get('id')
	if not id:
		return JsonResponse({'success': False})
	try:
		team = Team.objects.get(id=id)
	except Team.DoesNotExist:
		return JsonResponse({
			'success': False,
			'message': 'Invalid unique_id.'
		})
	return JsonResponse({'success': True})


@csrf_exempt
def load_team(request):
	id = request.POST.get('unique_id')
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

	return JsonResponse(serialize(
		"json",
		list(team)
	)[0])


@csrf_exempt
def save_fix(request):
	id = request.POST.get('unique_id')
	fix_type = request.POST.get('fix_type')
	job_list = request.POST.get('job_list')

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
	for job in job_list.split(','):
		if job not in Team.JOB:
			return JsonResponse({
				'success': False,
				'message': 'Invalid job.'
			})
	try:
		team = Team.objects.get(id=id)
	except Team.DoesNotExist:
		return JsonResponse({
			'success': False,
			'message': 'Invalid unique_id.'
		})

	Team.objects.filter(id=id).update(**{fix_type: job_list})
	return JsonResponse({'success': True})


@csrf_exempt
def save_item(request):
	id = request.POST.get('unique_id')
	job = request.POST.get('job')
	item_status = request.POST.get('item_status')

	if job not in Team.JOB:
		return JsonResponse({
			'success': False,
			'message': 'Invalid job.'
		})
	try:
		team = Team.objects.get(id=id)
	except Team.DoesNotExist:
		return JsonResponse({
			'success': False,
			'message': 'Invalid unique_id.'
		})

	try:
		Team.objects.filter(id=id).update(**{job: item_status})
	except:
		return JsonResponse({
			'success': False,
			'message': 'Invalid item_status.'
		})
	return JsonResponse({'success': True})
