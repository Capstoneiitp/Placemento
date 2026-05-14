from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

import json


# ====================================
# CHATBOT API
# ====================================
@csrf_exempt
@require_http_methods(["POST"])
def chat(request):

    try:

        data = json.loads(request.body)

        user_message = data.get("message", "")

        return JsonResponse({
            "reply": f"You said: {user_message}"
        })

    except Exception as e:

        return JsonResponse({
            "error": str(e)
        }, status=500)


# ====================================
# REGISTER API
# ====================================
@csrf_exempt
@require_http_methods(["POST"])
def register(request):

    try:

        data = json.loads(request.body)

        name = data.get("name", "")
        email = data.get("email", "")

        return JsonResponse({
            "message": "Registration successful",
            "name": name,
            "email": email
        })

    except Exception as e:

        return JsonResponse({
            "error": str(e)
        }, status=500)


# ====================================
# LOGIN API
# ====================================
@csrf_exempt
@require_http_methods(["POST"])
def login_view(request):

    try:

        data = json.loads(request.body)

        email = data.get("email", "")

        return JsonResponse({
            "message": "Login successful",
            "email": email
        })

    except Exception as e:

        return JsonResponse({
            "error": str(e)
        }, status=500)


# ====================================
# PREDICTION API
# ====================================
@csrf_exempt
def predict(request):

    try:

        cgpa = float(request.GET.get("cgpa", 0))
        dsa = float(request.GET.get("dsa", 0))
        communication = float(request.GET.get("communication", 0))
        aptitude = float(request.GET.get("aptitude", 0))

        placement_probability = (
            cgpa * 10 +
            dsa * 0.2 +
            communication * 0.15 +
            aptitude * 0.15
        )

        placement_probability = min(100, round(placement_probability, 2))

        prediction = (
            "Placed"
            if placement_probability >= 60
            else "Not Placed"
        )

        return JsonResponse({

            "placement_probability": placement_probability,

            "prediction": prediction,

            "expected_job_level":
                "High Paying Job Opportunity"
                if placement_probability >= 80
                else "Medium Paying Job Opportunity",

            "final_verdict":
                "Placement Ready - Keep Improving",

            "skill_scores": {
                "coding": dsa,
                "aptitude": aptitude,
                "communication": communication,
                "core_subjects": 70,
                "projects": 75,
                "tech_stack": 80
            },

            "skill_gap_analysis": {
                "dsa": "Improve problem solving consistency.",
                "projects": "Build more real-world projects.",
                "communication": "Practice interview communication."
            }
        })

    except Exception as e:

        return JsonResponse({
            "error": str(e)
        }, status=500)