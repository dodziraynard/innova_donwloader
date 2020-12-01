from django.shortcuts import render


def index(request):
    return render(request, "face_counter.html")
